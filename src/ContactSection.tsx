import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import FloatingTitle from './FloatingTitle'

function ContactSection() {
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState('')
  const [hasError, setHasError] = useState(false)
  const inFlight = useRef(false)
  const submission = useRef<{ content: string; id: string } | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current) return
    const form = event.currentTarget
    const fields = new FormData(form)
    const values = {
      name: String(fields.get('name') ?? '').trim(),
      email: String(fields.get('email') ?? '').trim(),
      message: String(fields.get('message') ?? '').trim(),
    }
    if (!values.name || !values.email || !values.message) {
      setHasError(true)
      setStatus('Please fill in your name, email, and message.')
      return
    }
    const content = JSON.stringify(values)
    if (submission.current?.content !== content) {
      submission.current = { content, id: crypto.randomUUID() }
    }
    inFlight.current = true
    setSending(true)
    setHasError(false)
    setStatus('Sending your message…')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, submissionId: submission.current.id }),
        signal: AbortSignal.timeout(20_000),
      })
      const result = await response.json() as { success?: boolean; error?: string }
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Your message could not be sent. Please try again.')
      }
      form.reset()
      submission.current = null
      setStatus('Thank you! Your message has been sent.')
    } catch (error) {
      setHasError(true)
      setStatus(error instanceof Error && error.name === 'Error'
        ? error.message
        : 'We could not confirm your message was sent. Please check your connection and try again.')
    } finally {
      inFlight.current = false
      setSending(false)
    }
  }

  return (
    <section className="contact-section" id="contact-us" aria-labelledby="contact-us-title">
      <div className="contact-section__content">
        <FloatingTitle id="contact-us-title" text="contact us" />
        <p className="contact-section__intro">Have a question or want to get involved? Get in touch.</p>
        <form className="contact-form" onSubmit={handleSubmit} aria-describedby="contact-form-note" aria-busy={sending}>
          <div className="contact-form__row">
            <div className="contact-form__field">
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" autoComplete="name" required maxLength={120} disabled={sending} />
            </div>
            <div className="contact-form__field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} disabled={sending} />
            </div>
          </div>
          <div className="contact-form__field">
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows={5} required maxLength={5000} disabled={sending} />
          </div>
          <button className="contact-form__submit" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
          <p className="contact-form__status" id="contact-form-note" role="status" aria-live="polite" data-error={hasError}>{status}</p>
        </form>
      </div>
    </section>
  )
}

export default ContactSection
