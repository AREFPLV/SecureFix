import { site } from '@/data/content'

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

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined

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

export async function createLifecycleQuote(
  input: LifecycleQuoteInput,
): Promise<LifecycleQuoteResult> {
  const reference = generateLifecycleReference()

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
        subject: `Lifecycle Quote ${reference} — ${input.name}`,
        from_name: 'SecureFix Lifecycle',
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
