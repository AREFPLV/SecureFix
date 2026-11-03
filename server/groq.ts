import './loadEnv.ts'
import { buildSystemPrompt } from '../shared/agentKnowledge.ts'
import { lookupRepairEstimate } from '../shared/repairCatalog.ts'
import { isLeadComplete } from '../shared/customerLead.ts'
import {
  parseAgentJson,
  trimConversation,
  type ChatResponse,
  type ChatTurn,
} from '../shared/fallbackChat.ts'
import { sendLeadEmail } from './sendLeadEmail.ts'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'

function apiKey() {
  return process.env.GROQ_API_KEY?.trim()
}

function model() {
  return process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL
}

export function groqReady() {
  const key = apiKey()
  return Boolean(key && key.startsWith('gsk_'))
}

export function groqModel() {
  return model()
}

async function maybeSubmitLead(
  parsed: NonNullable<ReturnType<typeof parseAgentJson>>,
  history: ChatTurn[],
): Promise<ChatResponse> {
  const base: ChatResponse = { reply: parsed.reply, actions: parsed.actions, mode: 'ai' }

  if (!parsed.submitLead || !isLeadComplete(parsed.lead)) return base

  const result = await sendLeadEmail(parsed.lead, history)
  if (result.ok) {
    return {
      ...base,
      reference: result.reference,
      leadSubmitted: true,
      reply: `${parsed.reply}\n\nReference: ${result.reference}. Our team will be in touch soon.`,
    }
  }

  return {
    ...base,
    reply: `${parsed.reply}\n\n(I couldn't email your details just now — please call 020 3336 7147.)`,
  }
}

export async function chatWithGroq(messages: ChatTurn[]): Promise<ChatResponse> {
  const key = apiKey()
  if (!key) throw new Error('No GROQ_API_KEY')

  const history = trimConversation(messages)
  const full = history.map((m) => m.content).join(' ')
  const lastUser = [...history].reverse().find((m) => m.role === 'user')?.content ?? ''
  const hint = lookupRepairEstimate(lastUser, full)
  const extra = hint ? `\nLIVE LOOKUP: ${hint.summary}` : ''
  const prompt = buildSystemPrompt(extra)

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: model(),
      temperature: 0.85,
      max_tokens: 800,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompt },
        ...history.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ],
    }),
  })

  if (!res.ok) {
    throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const text = data.choices?.[0]?.message?.content ?? ''
  const parsed = parseAgentJson(text)
  if (parsed) return maybeSubmitLead(parsed, history)

  return { reply: text || 'Sorry, could you say that again?', mode: 'ai' }
}
