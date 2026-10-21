import { ROUTES, type AgentAction } from './agentKnowledge'
import { isLeadComplete, sanitizeLead, type CustomerLead } from './customerLead'
import { detectDeviceCategory, lookupRepairEstimate } from './repairCatalog'

export type ChatTurn = { role: 'user' | 'assistant'; content: string }

export type ChatResponse = {
  reply: string
  actions?: AgentAction[]
  mode?: 'ai' | 'local'
  reference?: string
  leadSubmitted?: boolean
  warning?: string
}

export type ParsedAgentResponse = ChatResponse & {
  submitLead?: boolean
  lead?: Partial<CustomerLead>
}

type LeadDraft = Partial<CustomerLead>
type CollectStep = 'none' | 'name' | 'phone' | 'email' | 'confirm'

function bookingActions(): AgentAction[] {
  return [
    { label: 'Book online', route: ROUTES.bookRepair },
    { label: 'Call us', route: 'tel:02033367147' },
  ]
}

function ctx(messages: ChatTurn[]) {
  return messages.map((m) => m.content).join(' ')
}

function lastUser(messages: ChatTurn[]) {
  return [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''
}

function extractEmail(text: string) {
  const m = text.match(/[\w.+-]+@[\w.-]+\.\w+/)
  return m?.[0]
}

function extractPhone(text: string) {
  const m = text.match(/(\+44|0)\d[\d\s]{8,14}\d/)
  return m?.[0]?.replace(/\s/g, ' ')
}

function inferCollectStep(messages: ChatTurn[]): { step: CollectStep; draft: LeadDraft } {
  const full = ctx(messages)
  const draft: LeadDraft = {
    device: detectDeviceCategory(full)?.label,
    intent: /sell|trade/i.test(full) ? 'trade-in' : 'repair',
  }

  const assistantLines = messages.filter((m) => m.role === 'assistant').map((m) => m.content.toLowerCase())
  const collecting = assistantLines.some((l) => /your name|best number|email address|pass this to our team|send this to our team/i.test(l))

  if (!collecting) return { step: 'none', draft }

  const users = messages.filter((m) => m.role === 'user').map((m) => m.content)
  let name = draft.name
  let phone = draft.phone
  let email = draft.email

  for (const line of users) {
    const e = extractEmail(line)
    const p = extractPhone(line)
    if (e) email = e
    if (p) phone = p
    if (!e && !p && line.trim().split(/\s+/).length <= 4 && !/^(yes|no|ok|please|hi|hello)/i.test(line.trim())) {
      if (!name && line.trim().length > 1) name = line.trim()
    }
  }

  draft.name = name
  draft.phone = phone
  draft.email = email

  if (assistantLines.some((l) => l.includes('shall i send') || l.includes('send this to our team'))) {
    return { step: 'confirm', draft }
  }
  if (!name) return { step: 'name', draft }
  if (!phone) return { step: 'phone', draft }
  if (!email) return { step: 'email', draft }
  return { step: 'confirm', draft }
}

export function fallbackChat(messages: ChatTurn[]): ChatResponse {
  const user = lastUser(messages)
  const q = user.toLowerCase()
  const full = ctx(messages)
  const estimate = lookupRepairEstimate(user, full)
  const { step, draft } = inferCollectStep(messages)

  if (/^(yes|yeah|yep|sure|ok|okay|please|go ahead|do it)\.?$/i.test(user.trim()) && step === 'confirm') {
    if (isLeadComplete(draft)) {
      return {
        reply: `Perfect, ${draft.name}! I'll send your details to our team now. They'll contact you on ${draft.phone} or ${draft.email} shortly.`,
        submitLead: true,
        lead: draft,
        mode: 'local',
      } as ParsedAgentResponse
    }
  }

  if (step === 'name') {
    return {
      reply: "Great, I can pass this to our team. What's your name?",
      mode: 'local',
    }
  }
  if (step === 'phone') {
    return {
      reply: `Thanks ${draft.name}! What's the best number to reach you on?`,
      mode: 'local',
    }
  }
  if (step === 'email') {
    return {
      reply: 'And your email address?',
      mode: 'local',
    }
  }
  if (step === 'confirm' && isLeadComplete(draft)) {
    return {
      reply: `I've got ${draft.name}, ${draft.phone}, and ${draft.email}. Shall I send this to our team?`,
      mode: 'local',
    }
  }

  if (/call me back|callback|contact me|get back to me/i.test(q)) {
    return {
      reply: "Of course! I can ask our team to call you back. Want me to take your name and number?",
      actions: [{ label: 'Yes please', route: 'chat:collect' }],
      mode: 'local',
    }
  }

  if (estimate) {
    const offer = /book|repair|fix|cracked|broken|sell|trade/i.test(full)
    return {
      reply: `${estimate.summary}${offer ? " Want me to pass your details to our team, or you can book online?" : ''}`,
      actions: [
        { label: 'Send my details', route: 'chat:collect' },
        { label: 'Book online', route: ROUTES.bookRepair },
      ],
      mode: 'local',
    }
  }

  if (/book|repair|fix|appointment/i.test(q)) {
    return {
      reply: "Happy to help! You can book online in a few minutes, or I can take your details and our team will follow up. What works best?",
      actions: [
        { label: 'Book online', route: ROUTES.bookRepair },
        { label: 'Send my details', route: 'chat:collect' },
      ],
      mode: 'local',
    }
  }

  if (/sell|trade/i.test(q)) {
    return {
      reply: 'We buy phones, tablets, laptops and consoles. You can get an instant quote on our trade-in page, or I can pass your details to the team.',
      actions: [
        { label: 'Get a quote', route: ROUTES.tradeIn },
        { label: 'Send my details', route: 'chat:collect' },
      ],
      mode: 'local',
    }
  }

  if (/^(hi|hello|hey)/i.test(q)) {
    return {
      reply: "Hey! I'm Alex from SecureFix. What device are you having trouble with, or how can I help today?",
      actions: bookingActions(),
      mode: 'local',
    }
  }

  if (q.includes('chat:collect') || q === 'yes please') {
    return {
      reply: "Sure thing. What's your name?",
      mode: 'local',
    }
  }

  return {
    reply: "I'm here to help with repairs, trade-ins, or getting you booked in. Tell me your device and what's wrong, or ask for a callback.",
    actions: bookingActions(),
    mode: 'local',
  }
}

export function parseAgentJson(raw: string): ParsedAgentResponse | null {
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
    const data = JSON.parse(cleaned) as ParsedAgentResponse
    if (!data.reply || typeof data.reply !== 'string') return null
    return {
      reply: data.reply,
      actions: data.actions,
      submitLead: data.submitLead === true,
      lead: sanitizeLead(data.lead),
      mode: 'ai',
    }
  } catch {
    return null
  }
}

export function trimConversation(messages: ChatTurn[], max = 20): ChatTurn[] {
  return messages.length <= max ? messages : messages.slice(-max)
}
