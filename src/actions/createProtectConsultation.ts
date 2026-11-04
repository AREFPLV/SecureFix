import { REPAIR_INBOX, sendShopEmail } from '@/lib/sendShopEmail'

export interface ProtectConsultationInput {
  name: string
  company: string
  email: string
  phone: string
  employees: string
  interest: string
  notes: string
}

export interface ProtectConsultationResult {
  ok: boolean
  reference: string
  error?: string
}

export function generateProtectReference(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `PX-${y}${m}${d}-${rand}`
}

function buildMessage(input: ProtectConsultationInput, reference: string): string {
  return [
    'New Protect / cybersecurity consultation from SecureFix.uk',
    `Sent to:     ${REPAIR_INBOX}`,
    '',
    `Reference:  ${reference}`,
    `Name:       ${input.name}`,
    `Company:    ${input.company || 'N/A'}`,
    `Email:      ${input.email}`,
    `Phone:      ${input.phone}`,
    `Team size:  ${input.employees || 'Not specified'}`,
    `Interest:   ${input.interest}`,
    '',
    'Additional information:',
    input.notes || 'None',
  ].join('\n')
}

/** Sends a Protect cybersecurity consultation request to repair@securefix.uk. */
export async function createProtectConsultation(
  input: ProtectConsultationInput,
): Promise<ProtectConsultationResult> {
  const reference = generateProtectReference()

  const sent = await sendShopEmail({
    _subject: `Protect Consultation ${reference} — ${input.name}`,
    quote_reference: reference,
    customer_name: input.name,
    company: input.company,
    customer_email: input.email,
    customer_phone: input.phone,
    employees: input.employees,
    interest: input.interest,
    message: buildMessage(input, reference),
    _replyto: input.email,
  })

  if (!sent.ok) {
    return { ok: false, reference, error: sent.error }
  }

  return { ok: true, reference }
}
