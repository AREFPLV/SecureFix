import { useState } from 'react'
import type { FormEvent } from 'react'
import { createRecyclingQuote } from '@/actions/createRecyclingQuote'
import FormPrivacyNote from '@/components/FormPrivacyNote'

type Props = {
  defaultEquipment?: string
  topicLabel?: string
}

const emptyForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  equipment: 'Mixed IT equipment',
  quantity: '',
  notes: '',
}

export default function RecyclingQuoteForm({
  defaultEquipment = 'Mixed IT equipment',
  topicLabel,
}: Props) {
  const [form, setForm] = useState({ ...emptyForm, equipment: defaultEquipment })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const notes = topicLabel
      ? [`Topic page: ${topicLabel}`, form.notes].filter(Boolean).join('\n')
      : form.notes
    const result = await createRecyclingQuote({ ...form, notes })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error || 'Something went wrong.')
      return
    }
    setReference(result.reference)
    setForm({ ...emptyForm, equipment: defaultEquipment })
  }

  if (reference) {
    return (
      <div className="recycle-quote-success">
        <strong>Quote request sent</strong>
        <p>
          Thanks. Your reference is <span>{reference}</span>. We will contact you shortly at the
          details you provided.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => setReference('')}>
          Send Another Request
        </button>
      </div>
    )
  }

  return (
    <form className="recycle-quote-form" onSubmit={handleSubmit}>
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
        Type of Equipment
        <select
          value={form.equipment}
          onChange={(e) => setForm({ ...form, equipment: e.target.value })}
        >
          <option>Mixed IT equipment</option>
          <option>Laptops &amp; desktops</option>
          <option>Phones &amp; tablets</option>
          <option>Servers &amp; networking</option>
          <option>Monitors &amp; peripherals</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Approximate Quantity
        <input
          placeholder="e.g. 20 laptops"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
      </label>
      <label className="recycle-quote-full">
        Additional Information
        <textarea
          rows={4}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </label>
      {error && <p className="recycle-quote-error">{error}</p>}
      <button type="submit" className="btn btn-primary btn-shiny" disabled={submitting}>
        {submitting ? 'Sending…' : 'Request a Quote'}
      </button>
      <FormPrivacyNote />
    </form>
  )
}
