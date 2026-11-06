import './loadEnv.ts'
import { generateInquiryReference, type CustomerLead } from '../shared/customerLead.ts'
import type { ChatTurn } from '../shared/fallbackChat.ts'

/** Chat booking / callback leads use the same repair inbox as website bookings. */
const REPAIR_INBOX = 'repair@securefix.uk'
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${REPAIR_INBOX}`
const HOST_BOOKING_ENDPOINT =
  process.env.SECUREFIX_BOOKING_URL?.trim() || 'https://securefix.uk/api/booking.php'

function isJsonSuccess(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const success = (data as { success?: boolean | string }).success
  return success === true || String(success) === 'true'
}

async function postJson(url: string, body: Record<string, string>) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  return { res, data, ok: res.ok && isJsonSuccess(data) }
}

export async function sendLeadEmail(lead: CustomerLead, transcript: ChatTurn[]) {
  const reference = generateInquiryReference()

  const transcriptText = transcript
    .map((m) => `${m.role === 'user' ? 'Customer' : 'Alex'}: ${m.content}`)
    .join('\n')

  const message = [
    'New chat enquiry from SecureFix website',
    `Sent to:     ${REPAIR_INBOX}`,
    '',
    `Reference: ${reference}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Intent: ${lead.intent ?? 'general'}`,
    `Device: ${lead.device ?? '—'}`,
    `Issue: ${lead.issue ?? '—'}`,
    '',
    'Notes:',
    lead.notes ?? '—',
    '',
    'Chat transcript:',
    transcriptText,
  ].join('\n')

  const payload: Record<string, string> = {
    _captcha: 'false',
    _subject: `Chat Enquiry ${reference} — ${lead.name}`,
    booking_reference: reference,
    customer_name: lead.name,
    customer_email: lead.email,
    customer_phone: lead.phone,
    device: lead.device ?? '',
    issue: lead.issue ?? '',
    intent: lead.intent ?? '',
    message,
    shop_inbox: REPAIR_INBOX,
    _replyto: lead.email,
  }

  try {
    const [formSubmit, host] = await Promise.all([
      postJson(FORMSUBMIT_ENDPOINT, payload),
      postJson(HOST_BOOKING_ENDPOINT, { ...payload, _honey: '' }),
    ])

    if (formSubmit.ok || host.ok) {
      return { ok: true as const, reference }
    }

    const error =
      (typeof formSubmit.data.message === 'string' && formSubmit.data.message) ||
      (typeof host.data.message === 'string' && host.data.message) ||
      'Send failed'

    return {
      ok: false as const,
      reference,
      error,
    }
  } catch (err) {
    return {
      ok: false as const,
      reference,
      error: err instanceof Error ? err.message : 'Network error',
    }
  }
}
