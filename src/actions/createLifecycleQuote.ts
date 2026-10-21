import { REPAIR_INBOX, sendShopEmail } from '@/lib/sendShopEmail'

export interface LifecycleQuoteInput {
  name: string
  company: string
  email: string
  phone: string
  service: string
  quantity: string
  notes: string
}

export interface LifecycleQuoteResult {
  ok: boolean
  reference: string
  error?: string
}

export function generateLifecycleReference(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `LC-${y}${m}${d}-${rand}`
}

function buildMessage(input: LifecycleQuoteInput, reference: string): string {
  return [
    'New lifecycle / procurement quote from SecureFix.uk',
    `Sent to:     ${REPAIR_INBOX}`,
    '',
    `Reference:  ${reference}`,
    `Name:       ${input.name}`,
    `Company:    ${input.company || 'N/A'}`,
    `Email:      ${input.email}`,
    `Phone:      ${input.phone}`,
    `Service:    ${input.service}`,
    `Quantity:   ${input.quantity || 'Not specified'}`,
    '',
    'Additional information:',
    input.notes || 'None',
  ].join('\n')
}

/** Sends a lifecycle / business IT quote request to repair@securefix.uk. */
export async function createLifecycleQuote(
  input: LifecycleQuoteInput,
): Promise<LifecycleQuoteResult> {
  const reference = generateLifecycleReference()

  const sent = await sendShopEmail({
    _subject: `Lifecycle Quote ${reference} — ${input.name}`,
    quote_reference: reference,
    customer_name: input.name,
    company: input.company,
    customer_email: input.email,
    customer_phone: input.phone,
    service: input.service,
    quantity: input.quantity,
    message: buildMessage(input, reference),
    _replyto: input.email,
  })

  if (!sent.ok) {
    return { ok: false, reference, error: sent.error }
  }

  return { ok: true, reference }
}
