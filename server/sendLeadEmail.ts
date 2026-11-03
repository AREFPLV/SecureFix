import './loadEnv.ts'
import { generateInquiryReference, type CustomerLead } from '../shared/customerLead.ts'
import type { ChatTurn } from '../shared/fallbackChat.ts'

const ENDPOINT = 'https://api.web3forms.com/submit'

function web3Key() {
  return process.env.WEB3FORMS_ACCESS_KEY ?? process.env.VITE_WEB3FORMS_ACCESS_KEY
}

export async function sendLeadEmail(lead: CustomerLead, transcript: ChatTurn[]) {
  const reference = generateInquiryReference()
  const key = web3Key()

  if (!key) {
    return { ok: false as const, reference, error: 'Email not configured' }
  }

  const transcriptText = transcript
    .map((m) => `${m.role === 'user' ? 'Customer' : 'Alex'}: ${m.content}`)
    .join('\n')

  const body = [
    'New chat enquiry from SecureFix website',
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

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: key,
      subject: `Chat Enquiry ${reference} — ${lead.name}`,
      from_name: 'SecureFix Chat',
      replyto: lead.email,
      message: body,
    }),
  })

  const data = (await res.json()) as { success?: boolean; message?: string }
  if (!res.ok || !data.success) {
    return { ok: false as const, reference, error: data.message ?? 'Send failed' }
  }
  return { ok: true as const, reference }
}
