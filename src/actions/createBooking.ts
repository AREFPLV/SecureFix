import { site } from '@/data/content'

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

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined

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

function formatPrice(_price: number | null): string {
  return 'Our technician will get in touch with you'
}

function buildMessage(input: BookingInput, reference: string): string {
  const lines = [
    `New repair booking received on ${site.website}`,
    '',
    `Reference:   ${reference}`,
    `Submitted:   ${new Date().toLocaleString('en-GB')}`,
    '',
    '--- Device ---',
    `Category:    ${input.category}`,
    `Brand:       ${input.brand}`,
    `Model:       ${input.model}`,
    `Issue:       ${input.issue}`,
    `Price:       Our technician will get in touch with you`,
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

/**
 * Creates a booking: generates a reference number and emails the full booking
 * details to the shop inbox via Web3Forms.
 *
 * Note: this runs in the browser (static SPA, no backend). The Web3Forms access
 * key is a public key intended for client-side use.
 */
export async function createBooking(input: BookingInput): Promise<BookingResult> {
  const reference = generateReference()

  if (!ACCESS_KEY) {
    return {
      ok: false,
      reference,
      error: 'Email is not configured. Set VITE_WEB3FORMS_ACCESS_KEY in your .env file.',
    }
  }

  const payload = {
    access_key: ACCESS_KEY,
    subject: `New Repair Booking ${reference} — ${input.name}`,
    from_name: `${site.name} Website`,
    replyto: input.email,
    booking_reference: reference,
    customer_name: input.name,
    customer_email: input.email,
    customer_phone: input.phone,
    device: `${input.category} · ${input.brand} · ${input.model}`,
    issue: input.issue,
    price: formatPrice(input.price),
    service: SERVICE_LABELS[input.serviceType],
    payment: input.paymentMethod,
    tracking_number: input.trackingNumber?.trim() || undefined,
    message: buildMessage(input, reference),
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = (await res.json()) as { success?: boolean; message?: string }

    if (!res.ok || !data.success) {
      return {
        ok: false,
        reference,
        error: data.message ?? 'Failed to send booking email.',
      }
    }

    return { ok: true, reference }
  } catch (err) {
    return {
      ok: false,
      reference,
      error: err instanceof Error ? err.message : 'Network error while sending booking.',
    }
  }
}
