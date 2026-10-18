import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUICK_PROMPTS } from '@shared/agentKnowledge'
import { site } from '@/data/content'
import { fetchChatHealth, sendChatMessage, type ChatMessage } from '@/services/chatApi'
import './ChatAgent.css'

const AI_STORAGE_KEY = 'securefix-chat'
const MODE_STORAGE_KEY = 'securefix-chat-mode'

type Mode = 'ai' | 'whatsapp'
type ContactDraft = {
  customerName: string
  customerPhone: string
  customerEmail: string
  deviceIssue: string
}

const emptyContact: ContactDraft = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  deviceIssue: '',
}

const CONNECT_ACTION = { label: 'Chat on WhatsApp', route: 'chat:whatsapp' }

const GREETING: ChatMessage = {
  id: 'hi',
  role: 'assistant',
  content:
    "Hey! I'm Alex from SecureFix. Ask me anything about repairs, prices, booking, or trade-in. Prefer a real technician? Tap Chat on WhatsApp — leave your details and we'll open WhatsApp with your message ready (technicians available Monday to Saturday, 09:00–19:00).",
  actions: [
    { label: 'Book a repair', route: '/book-repair' },
    CONNECT_ACTION,
  ],
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function withConnectAction(msg: ChatMessage): ChatMessage {
  const actions = msg.actions ?? []
  if (actions.some((a) => a.route === 'chat:whatsapp' || a.route === 'chat:live-agent')) {
    return {
      ...msg,
      actions: actions.map((a) =>
        a.route === 'chat:live-agent' ? CONNECT_ACTION : a,
      ),
    }
  }
  return { ...msg, actions: [...actions, CONNECT_ACTION] }
}

function loadAiMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(AI_STORAGE_KEY)
    if (!raw) return [GREETING]
    const parsed = JSON.parse(raw) as ChatMessage[]
    return parsed.length ? parsed.map(withConnectAction) : [GREETING]
  } catch {
    return [GREETING]
  }
}

function loadMode(): Mode {
  try {
    const raw = sessionStorage.getItem(MODE_STORAGE_KEY)
    return raw === 'whatsapp' || raw === 'live' ? 'whatsapp' : 'ai'
  } catch {
    return 'ai'
  }
}

function conversationSummary(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .slice(-8)
    .map((m) => `${m.role === 'user' ? 'Customer' : 'Alex'}: ${m.content}`)
    .join('\n')
}

function buildWhatsAppUrl(contact: ContactDraft, summary: string) {
  const phone = site.whatsapp.replace(/\D/g, '') || '447438083630'
  const lines = [
    'Hi SecureFix, I need help from a technician.',
    '',
    `Name: ${contact.customerName.trim()}`,
    `Phone: ${contact.customerPhone.trim()}`,
  ]
  if (contact.customerEmail.trim()) {
    lines.push(`Email: ${contact.customerEmail.trim()}`)
  }
  if (contact.deviceIssue.trim()) {
    lines.push(`Device / issue: ${contact.deviceIssue.trim()}`)
  }
  if (summary) {
    lines.push('', 'Chat with Alex:', summary)
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`
}

export default function ChatAgent() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>(loadMode)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiOn, setAiOn] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>(loadAiMessages)
  const [contact, setContact] = useState<ContactDraft>(emptyContact)
  const messagesRef = useRef(aiMessages)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  messagesRef.current = aiMessages

  useEffect(() => {
    sessionStorage.setItem(AI_STORAGE_KEY, JSON.stringify(aiMessages))
  }, [aiMessages])

  useEffect(() => {
    sessionStorage.setItem(MODE_STORAGE_KEY, mode)
  }, [mode])

  useEffect(() => {
    void fetchChatHealth().then((h) => setAiOn(Boolean(h?.ai)))
  }, [])

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [aiMessages, open, loading, mode])

  useEffect(() => {
    if (open && mode === 'ai') inputRef.current?.focus()
  }, [open, mode])

  const replyAi = useCallback(async (history: ChatMessage[]) => {
    const turns = history.map(({ role, content }) => ({ role, content }))
    const res = await sendChatMessage(turns)
    setAiMessages((prev) => [
      ...prev,
      withConnectAction({
        id: uid(),
        role: 'assistant',
        content: res.reply,
        actions: res.actions,
        reference: res.reference,
        leadSubmitted: res.leadSubmitted,
      }),
    ])
  }, [])

  const sendAi = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return
      const userMsg: ChatMessage = { id: uid(), role: 'user', content: trimmed }
      const next = [...messagesRef.current, userMsg]
      setAiMessages(next)
      setInput('')
      setLoading(true)
      try {
        await replyAi(next)
      } finally {
        setLoading(false)
      }
    },
    [loading, replyAi],
  )

  const switchToWhatsApp = useCallback(() => {
    setMode('whatsapp')
    setError('')
    setSent(false)
    setInput('')
  }, [])

  const openWhatsApp = useCallback(() => {
    setError('')
    if (!contact.customerName.trim() || !contact.customerPhone.trim()) {
      setError('Please enter your name and phone number.')
      return
    }
    const url = buildWhatsAppUrl(contact, conversationSummary(messagesRef.current))
    window.open(url, '_blank', 'noopener,noreferrer')
    setSent(true)
  }, [contact])

  const runAction = useCallback(
    (route: string) => {
      if (route === 'chat:whatsapp' || route === 'chat:live-agent') {
        switchToWhatsApp()
        return
      }
      if (route === 'chat:collect') {
        void sendAi('Yes please, I would like you to pass my details to the team')
        return
      }
      if (route.startsWith('/') && !route.startsWith('//')) {
        navigate(route)
        setOpen(false)
        return
      }
      window.open(route, route.startsWith('tel:') ? '_self' : '_blank', 'noopener,noreferrer')
    },
    [navigate, sendAi, switchToWhatsApp],
  )

  const resetAi = () => {
    setAiMessages([GREETING])
    sessionStorage.removeItem(AI_STORAGE_KEY)
  }

  const backToAi = () => {
    setMode('ai')
    setError('')
    setSent(false)
  }

  return (
    <div className="chat-agent">
      {open && (
        <div className="chat-panel" role="dialog" aria-label="SecureFix chat">
          <header className="chat-header">
            <div>
              <strong>{mode === 'ai' ? 'Alex · SecureFix' : 'WhatsApp · SecureFix'}</strong>
              <span>
                {mode === 'ai'
                  ? aiOn
                    ? 'AI assistant · ask anything'
                    : 'Assistant · ask anything'
                  : 'Technicians available Monday to Saturday, 09:00–19:00'}
              </span>
            </div>
            <div className="chat-header-actions">
              {mode === 'ai' ? (
                <button type="button" className="chat-reset" onClick={resetAi} aria-label="New chat">
                  ↺
                </button>
              ) : (
                <button
                  type="button"
                  className="chat-reset"
                  onClick={backToAi}
                  aria-label="Back to Alex"
                  title="Back to Alex"
                >
                  ←
                </button>
              )}
              <button
                type="button"
                className="chat-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </header>

          {mode === 'ai' ? (
            <>
              <div className="chat-messages" ref={listRef}>
                {aiMessages.map((msg) => (
                  <div key={msg.id} className={`chat-bubble chat-bubble-${msg.role}`}>
                    <p>{msg.content}</p>
                    {msg.leadSubmitted && msg.reference ? (
                      <p className="chat-reference">Ref: {msg.reference}</p>
                    ) : null}
                    {msg.actions && msg.actions.length > 0 ? (
                      <div className="chat-actions">
                        {msg.actions.map((a) => (
                          <button
                            key={`${msg.id}-${a.route}`}
                            type="button"
                            className={`chat-action-btn ${
                              a.route === 'chat:whatsapp' || a.route === 'chat:live-agent'
                                ? 'chat-action-btn-live'
                                : ''
                            }`}
                            onClick={() => runAction(a.route)}
                          >
                            {a.label === 'Connect to agent' ? 'Chat on WhatsApp' : a.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                {loading ? (
                  <div className="chat-bubble chat-bubble-assistant chat-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : null}
              </div>

              <div className="chat-quick">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className="chat-quick-btn"
                    onClick={() => void sendAi(p.prompt)}
                    disabled={loading}
                  >
                    {p.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="chat-quick-btn chat-quick-btn-live"
                  onClick={switchToWhatsApp}
                  disabled={loading}
                >
                  Chat on WhatsApp
                </button>
              </div>

              <form
                className="chat-input-row"
                onSubmit={(e) => {
                  e.preventDefault()
                  void sendAi(input)
                }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Alex a question…"
                  disabled={loading}
                />
                <button type="submit" className="chat-send" disabled={loading || !input.trim()}>
                  ↑
                </button>
              </form>
            </>
          ) : (
            <div className="chat-start">
              {sent ? (
                <>
                  <p>
                    WhatsApp should have opened with your details. If it didn&apos;t, tap below to try
                    again. Our technicians reply Monday to Saturday, 09:00–19:00. Closed Sunday.
                  </p>
                  <button type="button" className="btn btn-primary chat-start-btn" onClick={openWhatsApp}>
                    Open WhatsApp again
                  </button>
                  <button type="button" className="chat-back-ai" onClick={backToAi}>
                    ← Keep chatting with Alex
                  </button>
                </>
              ) : (
                <>
                  <p>
                    Leave your details and we&apos;ll open WhatsApp with a ready message for our
                    team. Technicians are available Monday to Saturday, 09:00–19:00. Closed Sunday.
                  </p>
                  <label>
                    Name
                    <input
                      value={contact.customerName}
                      onChange={(e) => setContact((c) => ({ ...c, customerName: e.target.value }))}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      value={contact.customerPhone}
                      onChange={(e) => setContact((c) => ({ ...c, customerPhone: e.target.value }))}
                      placeholder="Your phone"
                      autoComplete="tel"
                    />
                  </label>
                  <label>
                    Email (optional)
                    <input
                      type="email"
                      value={contact.customerEmail}
                      onChange={(e) => setContact((c) => ({ ...c, customerEmail: e.target.value }))}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </label>
                  <label>
                    Device / issue (optional)
                    <input
                      value={contact.deviceIssue}
                      onChange={(e) => setContact((c) => ({ ...c, deviceIssue: e.target.value }))}
                      placeholder="e.g. iPhone 15 cracked screen"
                    />
                  </label>
                  {error ? <p className="chat-error">{error}</p> : null}
                  <button type="button" className="btn btn-primary chat-start-btn" onClick={openWhatsApp}>
                    Continue on WhatsApp
                  </button>
                  <button type="button" className="chat-back-ai" onClick={backToAi}>
                    ← Keep chatting with Alex
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="chat-toggle btn-shiny"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  )
}
