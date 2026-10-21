import { site } from '@/data/content'
import { REPAIR_INBOX, sendShopEmail } from '@/lib/sendShopEmail'

export type BookingServiceType = 'mail-in' | 'drop-off' | 'collection'

export interface BookingInput {
  category: string
  brand: string
  model: string
  issue: string
  price: number | null
  diagnosticNote: string
  name: string
  email: string
  phone: string
  serviceType: BookingServiceType
  postcode?: string
  address?: string
  trackingNumber?: string
  paymentMethod: string
}

export interface BookingResult {
  ok: boolean
  reference: string
  error?: string
}

const SERVICE_LABELS: Record<BookingServiceType, string> = {
  'drop-off': 'Drop Off at Store',
  collection: 'Collection & Return',
  'mail-in': 'Mail-In Repair',
}

/** Generates a booking reference like SF-20260707-4821 */
export function generateReference(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `SF-${y}${m}${d}-${rand}`
}

function buildMessage(input: BookingInput, reference: string): string {
  const lines = [
    `New repair booking received on ${site.website}`,
    `Sent to:     ${REPAIR_INBOX}`,
    '',
    `Reference:   ${reference}`,
    `Submitted:   ${new Date().toLocaleString('en-GB')}`,
    '',
    '--- Device ---',
    `Category:    ${input.category}`,
    `Brand:       ${input.brand}`,
    `Model:       ${input.model}`,
    `Issue:       ${input.issue}`,
    `Price:       ${input.price != null ? `£${input.price.toFixed(2)}` : 'quote required'}`,
    '',
    '--- Diagnostic Notes ---',
    input.diagnosticNote || '(none provided)',
    '',
    '--- Service ---',
    `Method:      ${SERVICE_LABELS[input.serviceType]}`,
  ]

  if (input.serviceType === 'collection') {
    lines.push(`Address:     ${input.address ?? ''}`)
    lines.push(`Postcode:    ${input.postcode ?? ''}`)
  }

  if (input.serviceType === 'mail-in') {
    lines.push(`Mail to:     ${site.location}`)
    lines.push(`Tracking:    ${input.trackingNumber?.trim() || '(not provided)'}`)
  }

  lines.push(
    '',
    '--- Payment ---',
    `Method:      ${input.paymentMethod}`,
    '',
    '--- Customer ---',
    `Name:        ${input.name}`,
    `Email:       ${input.email}`,
    `Phone:       ${input.phone}`,
  )

  return lines.join('\n')
}

/** Creates a booking and emails the details to repair@securefix.uk. */
export async function createBooking(input: BookingInput): Promise<BookingResult> {
  const reference = generateReference()

  const sent = await sendShopEmail({
    _subject: `New Repair Booking ${reference} — ${input.name}`,
    booking_reference: reference,
    customer_name: input.name,
    customer_email: input.email,
    customer_phone: input.phone,
    device: `${input.category} · ${input.brand} · ${input.model}`,
    issue: input.issue,
    price: input.price != null ? `£${input.price.toFixed(2)}` : 'quote required',
    service: SERVICE_LABELS[input.serviceType],
    payment: input.paymentMethod,
    tracking_number: input.trackingNumber?.trim() || undefined,
    address: input.address,
    postcode: input.postcode,
    message: buildMessage(input, reference),
    _replyto: input.email,
  })

  if (!sent.ok) {
    return { ok: false, reference, error: sent.error }
  }

  return { ok: true, reference }
}
