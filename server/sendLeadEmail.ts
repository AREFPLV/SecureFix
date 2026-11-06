import './loadEnv.ts'
import { generateInquiryReference, type CustomerLead } from '../shared/customerLead.ts'
import type { ChatTurn } from '../shared/fallbackChat.ts'

/** Chat booking / callback leads use the same repair inbox as website bookings. */
const REPAIR_INBOX = 'repair@securefix.uk'
const HOST_BOOKING_ENDPOINT =
  process.env.SECUREFIX_BOOKING_URL?.trim() || 'https://securefix.uk/api/booking.php'

function isJsonSuccess(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const success = (data as { success?: boolean | string }).success
  return success === true || String(success) === 'true'
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
    _honey: '',
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
    const res = await fetch(HOST_BOOKING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (res.ok && isJsonSuccess(data)) {
      return { ok: true as const, reference }
    }
    return {
      ok: false as const,
      reference,
      error:
        (typeof data.message === 'string' && data.message) ||
        'Send failed',
    }
  } catch (err) {
    return {
      ok: false as const,
      reference,
      error: err instanceof Error ? err.message : 'Network error',
    }
  }
}
