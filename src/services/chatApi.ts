import type { AgentAction } from '@shared/agentKnowledge'
import { fallbackChat, trimConversation, type ChatTurn } from '@shared/fallbackChat'
import { apiUrl } from '@/services/apiBase'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  actions?: AgentAction[]
  reference?: string
  leadSubmitted?: boolean
}

export type ChatApiResponse = {
  reply: string
  actions?: AgentAction[]
  mode?: 'ai' | 'local'
  reference?: string
  leadSubmitted?: boolean
  warning?: string
}

export async function fetchChatHealth() {
  try {
    const res = await fetch(apiUrl('/api/health'))
    if (!res.ok) return null
    return (await res.json()) as { ok: boolean; ai: boolean; model: string | null }
  } catch {
    return null
  }
}

export async function sendChatMessage(messages: ChatTurn[]): Promise<ChatApiResponse> {
  const history = trimConversation(messages)

  try {
    const res = await fetch(apiUrl('/api/chat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    })
    if (res.ok) return (await res.json()) as ChatApiResponse
  } catch {
    /* use local fallback */
  }

  return { ...fallbackChat(history), warning: 'Chat API offline — using local assistant.' }
}
