import { site } from '@/data/content'
import { generateReference } from '@/actions/createBooking'
import { REPAIR_INBOX, sendShopEmail } from '@/lib/sendShopEmail'

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

function buildMessage(input: CallOutInput, reference: string): string {
  return [
    `New call-out booking received on ${site.website}`,
    `Sent to:     ${REPAIR_INBOX}`,
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

/** Sends a call-out booking email to repair@securefix.uk. */
export async function createCallOut(input: CallOutInput): Promise<CallOutResult> {
  const reference = generateReference()

  const sent = await sendShopEmail({
    _subject: `Call Out ${reference} — ${input.name}`,
    booking_reference: reference,
    customer_name: input.name,
    customer_email: input.email,
    customer_phone: input.phone,
    address: input.address,
    postcode: input.postcode,
    preferred_time: input.preferredTime,
    message: buildMessage(input, reference),
    _replyto: input.email,
  })

  if (!sent.ok) {
    return { ok: false, reference, error: sent.error }
  }

  return { ok: true, reference }
}
