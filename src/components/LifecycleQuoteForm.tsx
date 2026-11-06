import { useState } from 'react'
import type { FormEvent } from 'react'
import { createLifecycleQuote } from '@/actions/createLifecycleQuote'
import FormPrivacyNote from '@/components/FormPrivacyNote'

const SERVICE_OPTIONS = [
  'Laptop sourcing',
  'Device deployment',
  'Configuration & imaging',
  'Full lifecycle management',
  'Mixed / other',
] as const

type Props = {
  /** Prefills the Service Needed select when known from the page. */
  defaultService?: string
}

export default function LifecycleQuoteForm({ defaultService = 'Laptop sourcing' }: Props) {
  const initialService = SERVICE_OPTIONS.includes(defaultService as (typeof SERVICE_OPTIONS)[number])
    ? defaultService
    : 'Mixed / other'

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: initialService,
    quantity: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await createLifecycleQuote(form)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error || 'Something went wrong.')
      return
    }
    setReference(result.reference)
    setForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      service: initialService,
      quantity: '',
      notes: '',
    })
  }

  if (reference) {
    return (
      <div className="lifecycle-quote-success">
        <strong>Quote request sent</strong>
        <p>
          Thanks. Your reference is <span>{reference}</span>. We will contact you shortly.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => setReference('')}>
          Send Another Request
        </button>
      </div>
    )
  }

  return (
    <form className="lifecycle-quote-form" onSubmit={handleSubmit}>
      <label>
        Full Name
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>
      <label>
        Company Name
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </label>
      <label>
        Email
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </label>
      <label>
        Telephone
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </label>
      <label>
        Service Needed
        <select
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        >
          {SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label>
        Approximate Quantity
        <input
          placeholder="e.g. 25 laptops"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
      </label>
      <label className="lifecycle-quote-full">
        Additional Information
        <textarea
          rows={4}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </label>
      {error ? <p className="lifecycle-quote-error">{error}</p> : null}
      <button type="submit" className="btn btn-primary btn-shiny" disabled={submitting}>
        {submitting ? 'Sending…' : 'Request a Quote'}
      </button>
      <FormPrivacyNote />
    </form>
  )
}
