import { site } from '@/data/content'
import { generateReference } from '@/actions/createBooking'

export interface CallOutInput {
  name: string
  email: string
  phone: string
  address: string
  postcode: string
  preferredTime: string
  notes: string
}

export interface CallOutResult {
  ok: boolean
  reference: string
  error?: string
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined

function buildMessage(input: CallOutInput, reference: string): string {
  return [
    `New call-out booking received on ${site.website}`,
    '',
    `Reference:   ${reference}`,
    `Submitted:   ${new Date().toLocaleString('en-GB')}`,
    '',
    '--- Customer ---',
    `Name:        ${input.name}`,
    `Email:       ${input.email}`,
    `Phone:       ${input.phone}`,
    '',
    '--- Call-Out Location ---',
    `Address:     ${input.address}`,
    `Postcode:    ${input.postcode}`,
    `Preferred:   ${input.preferredTime || '(not specified)'}`,
    '',
    '--- Notes ---',
    input.notes || '(none provided)',
  ].join('\n')
}

/**
 * Sends a call-out booking email to the shop inbox via Web3Forms.
 * Subject is fixed to "Call Out" so requests are easy to spot.
 */
export async function createCallOut(input: CallOutInput): Promise<CallOutResult> {
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
    subject: 'Call Out',
    from_name: `${site.name} Website`,
    replyto: input.email,
    booking_reference: reference,
    customer_name: input.name,
    customer_email: input.email,
    customer_phone: input.phone,
    address: input.address,
    postcode: input.postcode,
    preferred_time: input.preferredTime,
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
        error: data.message ?? 'Failed to send call-out request.',
      }
    }

    return { ok: true, reference }
  } catch (err) {
    return {
      ok: false,
      reference,
      error: err instanceof Error ? err.message : 'Network error while sending call-out request.',
    }
  }
}
