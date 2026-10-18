import { site } from '@/data/content'

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

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined

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

export async function createRecyclingQuote(
  input: RecyclingQuoteInput,
): Promise<RecyclingQuoteResult> {
  const reference = generateRecyclingReference()

  if (!ACCESS_KEY) {
    return {
      ok: false,
      reference,
      error: 'Email service is not configured. Please call or email us directly.',
    }
  }

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `Recycling Quote ${reference} — ${input.name}`,
        from_name: 'SecureFix Recycling',
        replyto: input.email,
        to: site.email,
        message: buildMessage(input, reference),
      }),
    })

    const data = (await response.json()) as { success?: boolean; message?: string }
    if (!response.ok || !data.success) {
      return {
        ok: false,
        reference,
        error: data.message || 'Could not send your quote request. Please try again.',
      }
    }

    return { ok: true, reference }
  } catch {
    return {
      ok: false,
      reference,
      error: 'Network error. Please check your connection and try again.',
    }
  }
}
