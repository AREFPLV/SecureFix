import './loadEnv.ts'
import { generateInquiryReference, type CustomerLead } from '../shared/customerLead.ts'
import type { ChatTurn } from '../shared/fallbackChat.ts'

/** Chat booking / callback leads use the same repair inbox as website bookings. */
const REPAIR_INBOX = 'repair@securefix.uk'
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${REPAIR_INBOX}`

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

  try {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _captcha: 'false',
        _subject: `Chat Enquiry ${reference} — ${lead.name}`,
        booking_reference: reference,
        customer_name: lead.name,
        customer_email: lead.email,
        customer_phone: lead.phone,
        device: lead.device,
        issue: lead.issue,
        intent: lead.intent,
        message,
        _replyto: lead.email,
      }),
    })

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean | string
      message?: string
    }
    const accepted = res.ok && String(data.success) === 'true'
    if (!accepted) {
      return {
        ok: false as const,
        reference,
        error: data.message ?? 'Send failed',
      }
    }
    return { ok: true as const, reference }
  } catch (err) {
    return {
      ok: false as const,
      reference,
      error: err instanceof Error ? err.message : 'Network error',
    }
  }
}
