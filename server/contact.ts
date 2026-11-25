import { createHash } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'

type ContactConfig = {
  RESEND_API_KEY?: string
  CONTACT_FROM_EMAIL?: string
  CONTACT_TO_EMAIL?: string
}

const maxBodyBytes = 24_000
const windowMs = 10 * 60 * 1000
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/

function respond(response: ServerResponse, status: number, body: object) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  response.end(JSON.stringify(body))
}

export function createContactHandler(config: ContactConfig, sendRequest: typeof fetch = fetch) {
  // Per-process limit. Use a shared limiter when deploying multiple instances.
  const attempts = new Map<string, { count: number; expires: number }>()

  return async function contactHandler(request: IncomingMessage, response: ServerResponse) {
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST')
      respond(response, 405, { error: 'Please submit the contact form using POST.' })
      return
    }

    const origin = request.headers.origin
    if (origin) {
      try {
        if (new URL(origin).host !== request.headers.host) throw new Error('Origin mismatch')
      } catch {
        respond(response, 403, { error: 'Please send your message from this website.' })
        return
      }
    }

    if (request.headers['content-type']?.split(';')[0].trim() !== 'application/json') {
      respond(response, 415, { error: 'Please submit a JSON contact message.' })
      return
    }

    const now = Date.now()
    for (const [address, entry] of attempts) {
      if (entry.expires <= now) attempts.delete(address)
    }
    // Do not trust caller-supplied X-Forwarded-For headers.
    const address = request.socket.remoteAddress ?? 'unknown'
    const entry = attempts.get(address) ?? { count: 0, expires: now + windowMs }
    if (entry.count >= 5 || (!attempts.has(address) && attempts.size >= 10_000)) {
      response.setHeader('Retry-After', Math.ceil((entry.expires - now) / 1000))
      respond(response, 429, { error: 'Too many messages. Please try again in 10 minutes.' })
      return
    }
    entry.count += 1
    attempts.set(address, entry)

    let raw = ''
    let size = 0
    try {
      const chunks: Buffer[] = []
      for await (const chunk of request.iterator({ destroyOnReturn: false })) {
        size += chunk.length
        if (size > maxBodyBytes) {
          request.resume()
          respond(response, 413, { error: 'Your message is too long.' })
          return
        }
        chunks.push(Buffer.from(chunk))
      }
      raw = Buffer.concat(chunks).toString('utf8')
    } catch {
      respond(response, 400, { error: 'Your message could not be read. Please try again.' })
      return
    }

    let data: Record<string, unknown>
    try {
      const parsed: unknown = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid body')
      data = parsed as Record<string, unknown>
    } catch {
      respond(response, 400, { error: 'Please check the form and try again.' })
      return
    }

    const name = typeof data.name === 'string' ? data.name.trim() : ''
    const email = typeof data.email === 'string' ? data.email.trim() : ''
    const message = typeof data.message === 'string' ? data.message.trim() : ''
    const submissionId = typeof data.submissionId === 'string' ? data.submissionId : ''
    if (!name || name.length > 120 || /[\r\n\x00-\x1f\x7f]/.test(name)
      || email.length > 254 || !emailPattern.test(email)
      || !message || message.length > 5000
      || !/^[a-f0-9-]{36}$/i.test(submissionId)) {
      respond(response, 400, { error: 'Enter a name, a valid email address, and a message (up to 5,000 characters).' })
      return
    }

    const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } = config
    if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAIL) {
      respond(response, 503, { error: 'Message sending is temporarily unavailable. Please try again later.' })
      return
    }

    const payload = JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: email,
      subject: 'WUTT website contact message',
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    })
    const digest = createHash('sha256').update(payload).digest('hex')

    try {
      const result = await sendRequest('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `contact-${submissionId}-${digest}`,
        },
        body: payload,
        signal: AbortSignal.timeout(15_000),
      })
      if (!result.ok) {
        // Never return provider details, credentials, or submitted content to the client.
        console.error(`Contact email provider returned HTTP ${result.status}.`)
        respond(response, 502, { error: 'We could not send your message. Please try again later.' })
        return
      }
      const receipt = await result.json() as { id?: string }
      if (!receipt.id) throw new Error('Missing email receipt')
      respond(response, 200, { success: true })
    } catch {
      respond(response, 502, { error: 'We could not confirm your message was sent. Please try again.' })
    }
  }
}
