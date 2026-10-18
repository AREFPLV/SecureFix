import { apiUrl, readApiJson } from '@/services/apiBase'

export type LiveChatRole = 'customer' | 'technician' | 'system'

export type LiveChatMessage = {
  id: string
  role: LiveChatRole
  content: string
  createdAt: string
}

export type LiveChatPublicSession = {
  id: string
  customerName: string
  status: 'waiting' | 'active' | 'closed'
  updatedAt: string
  messages: LiveChatMessage[]
}

export type LiveChatInboxItem = {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: 'waiting' | 'active' | 'closed'
  createdAt: string
  updatedAt: string
  lastCustomerAt: string
  lastTechnicianAt: string | null
  unreadForTeam: number
  messageCount: number
  preview: string
}

export type LiveChatFullSession = LiveChatInboxItem & {
  messages: LiveChatMessage[]
}

const SESSION_KEY = 'securefix-live-chat-session'

export function loadStoredSessionId() {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export function storeSessionId(id: string) {
  try {
    localStorage.setItem(SESSION_KEY, id)
  } catch {
    /* ignore */
  }
}

export function clearStoredSessionId() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export async function startLiveChat(input: {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  message?: string
}) {
  const res = await fetch(apiUrl('/api/live-chat/sessions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    try {
      await readApiJson(res)
    } catch (err) {
      throw err instanceof Error ? err : new Error('Could not start live chat')
    }
    throw new Error('Could not start live chat')
  }
  return readApiJson<LiveChatPublicSession>(res)
}

export async function fetchLiveChat(sessionId: string) {
  const res = await fetch(apiUrl(`/api/live-chat/sessions/${encodeURIComponent(sessionId)}`))
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Could not load chat')
  return readApiJson<LiveChatPublicSession>(res)
}

export async function sendLiveChatMessage(
  sessionId: string,
  input: {
    content: string
    customerName?: string
    customerEmail?: string
    customerPhone?: string
  },
) {
  const res = await fetch(apiUrl(`/api/live-chat/sessions/${encodeURIComponent(sessionId)}/messages`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('Could not send message')
  return readApiJson<LiveChatPublicSession>(res)
}

export async function fetchTeamInbox(teamKey: string) {
  const res = await fetch(apiUrl('/api/live-chat/inbox'), {
    headers: { 'X-Team-Key': teamKey },
  })
  if (res.status === 401) throw new Error('Invalid team key')
  if (res.status === 503) throw new Error('Team chat is not configured on the server')
  if (!res.ok) {
    try {
      await readApiJson(res)
    } catch (err) {
      throw err instanceof Error ? err : new Error('Could not load inbox')
    }
    throw new Error('Could not load inbox')
  }
  return readApiJson<{ sessions: LiveChatInboxItem[] }>(res)
}

export async function fetchTeamSession(teamKey: string, sessionId: string) {
  const res = await fetch(apiUrl(`/api/live-chat/inbox/${encodeURIComponent(sessionId)}`), {
    headers: { 'X-Team-Key': teamKey },
  })
  if (res.status === 401) throw new Error('Invalid team key')
  if (!res.ok) throw new Error('Could not load conversation')
  return readApiJson<LiveChatFullSession>(res)
}

export async function sendTeamReply(teamKey: string, sessionId: string, content: string) {
  const res = await fetch(apiUrl(`/api/live-chat/inbox/${encodeURIComponent(sessionId)}/messages`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Team-Key': teamKey },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) {
    try {
      await readApiJson(res)
    } catch (err) {
      throw err instanceof Error ? err : new Error('Could not send reply')
    }
    throw new Error('Could not send reply')
  }
  return readApiJson<LiveChatFullSession>(res)
}

export async function closeTeamSession(teamKey: string, sessionId: string) {
  const res = await fetch(apiUrl(`/api/live-chat/inbox/${encodeURIComponent(sessionId)}/close`), {
    method: 'POST',
    headers: { 'X-Team-Key': teamKey },
  })
  if (!res.ok) throw new Error('Could not close chat')
  return readApiJson<LiveChatFullSession>(res)
}
