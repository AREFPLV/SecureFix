import { REPAIR_INBOX, sendShopEmail } from '@/lib/sendShopEmail'

export interface RecyclingQuoteInput {
  name: string
  company: string
  email: string
  phone: string
  equipment: string
  quantity: string
  notes: string
}

export interface RecyclingQuoteResult {
  ok: boolean
  reference: string
  error?: string
}

export function generateRecyclingReference(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `RC-${y}${m}${d}-${rand}`
}

function buildMessage(input: RecyclingQuoteInput, reference: string): string {
  return [
    'New recycling quote request from SecureFix.uk',
    `Sent to:     ${REPAIR_INBOX}`,
    '',
    `Reference:  ${reference}`,
    `Name:       ${input.name}`,
    `Company:    ${input.company || 'N/A'}`,
    `Email:      ${input.email}`,
    `Phone:      ${input.phone}`,
    `Equipment:  ${input.equipment}`,
    `Quantity:   ${input.quantity || 'Not specified'}`,
    '',
    'Additional information:',
    input.notes || 'None',
  ].join('\n')
}

/** Sends a recycling quote request to repair@securefix.uk. */
export async function createRecyclingQuote(
  input: RecyclingQuoteInput,
): Promise<RecyclingQuoteResult> {
  const reference = generateRecyclingReference()

  const sent = await sendShopEmail({
    _subject: `Recycling Quote ${reference} — ${input.name}`,
    quote_reference: reference,
    customer_name: input.name,
    company: input.company,
    customer_email: input.email,
    customer_phone: input.phone,
    equipment: input.equipment,
    quantity: input.quantity,
    message: buildMessage(input, reference),
    _replyto: input.email,
  })

  if (!sent.ok) {
    return { ok: false, reference, error: sent.error }
  }

  return { ok: true, reference }
}
