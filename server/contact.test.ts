import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { test } from 'node:test'
import type { TestContext } from 'node:test'
import { createContactHandler } from './contact.ts'

const config = {
  RESEND_API_KEY: 'test-server-only-key',
  CONTACT_FROM_EMAIL: 'contact@example.com',
  CONTACT_TO_EMAIL: 'team@example.com',
}
const valid = {
  name: ' Visitor ',
  email: 'visitor@example.com',
  message: ' Hello from the contact form. ',
  submissionId: '00000000-0000-4000-8000-000000000001',
}

async function setup(t: TestContext, options: { providerStatus?: number; fail?: boolean; missingConfig?: boolean } = {}) {
  const sent: { url: string; headers: Headers; body: Record<string, unknown> }[] = []
  const handler = createContactHandler(options.missingConfig ? {} : config, async (url, init) => {
    sent.push({ url: String(url), headers: new Headers(init?.headers), body: JSON.parse(String(init?.body)) })
    if (options.fail) throw new DOMException('Provider timeout', 'TimeoutError')
    return new Response(JSON.stringify(options.providerStatus ? { message: 'Private provider details' } : { id: 'email-123' }), {
      status: options.providerStatus ?? 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })
  const server = createServer((req, res) => { void handler(req, res) })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise<void>((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve())
    server.closeAllConnections()
  }))
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/contact`
  const post = (body: unknown = valid, headers: Record<string, string> = {}) => fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
  return { url, post, sent }
}

test('sends trimmed content to the configured recipient with reply-to and server-only credentials', async t => {
  const { post, sent } = await setup(t)
  const response = await post({ ...valid, to: 'attacker@example.com', from: 'attacker@example.com' })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true })
  assert.equal(sent.length, 1)
  assert.equal(sent[0].url, 'https://api.resend.com/emails')
  assert.equal(sent[0].headers.get('Authorization'), `Bearer ${config.RESEND_API_KEY}`)
  assert.equal(sent[0].body.from, config.CONTACT_FROM_EMAIL)
  assert.deepEqual(sent[0].body.to, [config.CONTACT_TO_EMAIL])
  assert.equal(sent[0].body.reply_to, valid.email)
  assert.equal(sent[0].body.text, 'Name: Visitor\nEmail: visitor@example.com\n\nHello from the contact form.')
})

test('retries use the same provider idempotency key, while changed content gets a different key', async t => {
  const { post, sent } = await setup(t)
  await post()
  await post()
  await post({ ...valid, message: 'A different message' })
  assert.equal(sent[0].headers.get('Idempotency-Key'), sent[1].headers.get('Idempotency-Key'))
  assert.notEqual(sent[0].headers.get('Idempotency-Key'), sent[2].headers.get('Idempotency-Key'))
})

for (const [label, body] of [
  ['blank name', { ...valid, name: '   ' }],
  ['invalid email', { ...valid, email: 'invalid' }],
  ['header injection', { ...valid, email: 'visitor@example.com\r\nBcc: other@example.com' }],
  ['blank message', { ...valid, message: '   ' }],
  ['overlong message', { ...valid, message: 'x'.repeat(5001) }],
  ['non-string field', { ...valid, name: { value: 'Visitor' } }],
  ['missing submission ID', { ...valid, submissionId: '' }],
  ['null body', null],
] as const) {
  test(`rejects ${label} before contacting Resend`, async t => {
    const { post, sent } = await setup(t)
    assert.equal((await post(body)).status, 400)
    assert.equal(sent.length, 0)
  })
}

test('rejects malformed JSON and oversized request bodies', async t => {
  const { url, post, sent } = await setup(t)
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })
  assert.equal(response.status, 400)
  assert.equal((await post({ ...valid, message: 'x'.repeat(25_000) })).status, 413)
  assert.equal(sent.length, 0)
})

test('rejects wrong methods, content types, and cross-origin requests', async t => {
  const { url, post, sent } = await setup(t)
  assert.equal((await fetch(url)).status, 405)
  assert.equal((await post(valid, { 'Content-Type': 'text/plain' })).status, 415)
  assert.equal((await post(valid, { Origin: 'https://another-site.example' })).status, 403)
  assert.equal(sent.length, 0)
  assert.equal((await post(valid, { Origin: new URL(url).origin })).status, 200)
})

test('rate limits submissions and ignores spoofed forwarding headers', async t => {
  const { post, sent } = await setup(t)
  for (let i = 0; i < 5; i += 1) assert.equal((await post()).status, 200)
  const limited = await post(valid, { 'X-Forwarded-For': '1.2.3.4' })
  assert.equal(limited.status, 429)
  assert.ok(Number(limited.headers.get('Retry-After')) > 0)
  assert.equal(sent.length, 5)
})

test('missing configuration fails without contacting Resend', async t => {
  const { post, sent } = await setup(t, { missingConfig: true })
  assert.equal((await post()).status, 503)
  assert.equal(sent.length, 0)
})

test('provider rejection returns a safe error instead of reporting success', async t => {
  const { post } = await setup(t, { providerStatus: 403 })
  const response = await post()
  assert.equal(response.status, 502)
  const body = await response.text()
  assert.ok(!body.includes('Private provider details'))
  assert.ok(!body.includes(config.RESEND_API_KEY))
})

test('provider network failure returns a retryable error', async t => {
  const { post } = await setup(t, { fail: true })
  assert.equal((await post()).status, 502)
})
