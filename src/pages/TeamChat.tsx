import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Logo from '@/components/Logo'
import {
  closeTeamSession,
  fetchTeamInbox,
  fetchTeamSession,
  sendTeamReply,
  type LiveChatFullSession,
  type LiveChatInboxItem,
} from '@/services/liveChatApi'
import { usePageSeo } from '@/hooks/usePageSeo'
import './TeamChat.css'

const KEY_STORAGE = 'securefix-team-chat-key'

export default function TeamChat() {
  usePageSeo({
    title: 'Team chat | SecureFix',
    description: 'SecureFix team inbox.',
    path: '/team-chat',
    robots: 'noindex, nofollow',
  })
  const [params] = useSearchParams()
  const [teamKey, setTeamKey] = useState(() => {
    try {
      return localStorage.getItem(KEY_STORAGE) || ''
    } catch {
      return ''
    }
  })
  const [keyInput, setKeyInput] = useState(teamKey)
  const [sessions, setSessions] = useState<LiveChatInboxItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(params.get('session'))
  const [active, setActive] = useState<LiveChatFullSession | null>(null)
  const [reply, setReply] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const unreadTotal = useMemo(
    () => sessions.reduce((sum, s) => sum + (s.unreadForTeam || 0), 0),
    [sessions],
  )

  useEffect(() => {
    if (!teamKey) return
    let cancelled = false

    async function refresh() {
      try {
        const inbox = await fetchTeamInbox(teamKey)
        if (cancelled) return
        setSessions(inbox.sessions)
        setError('')
        if (activeId) {
          const full = await fetchTeamSession(teamKey, activeId)
          if (!cancelled) setActive(full)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load inbox')
        }
      }
    }

    void refresh()
    const id = window.setInterval(() => void refresh(), 2500)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [teamKey, activeId])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [active?.messages])

  function unlock(e: FormEvent) {
    e.preventDefault()
    const value = keyInput.trim()
    if (!value) return
    try {
      localStorage.setItem(KEY_STORAGE, value)
    } catch {
      /* ignore */
    }
    setTeamKey(value)
    setError('')
  }

  async function openSession(id: string) {
    setActiveId(id)
    setLoading(true)
    try {
      const full = await fetchTeamSession(teamKey, id)
      setActive(full)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open chat')
    } finally {
      setLoading(false)
    }
  }

  async function sendReply(e: FormEvent) {
    e.preventDefault()
    if (!activeId || !reply.trim()) return
    setLoading(true)
    try {
      const full = await sendTeamReply(teamKey, activeId, reply.trim())
      setActive(full)
      setReply('')
      const inbox = await fetchTeamInbox(teamKey)
      setSessions(inbox.sessions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send reply')
    } finally {
      setLoading(false)
    }
  }

  async function endChat() {
    if (!activeId) return
    setLoading(true)
    try {
      const full = await closeTeamSession(teamKey, activeId)
      setActive(full)
      const inbox = await fetchTeamInbox(teamKey)
      setSessions(inbox.sessions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not close chat')
    } finally {
      setLoading(false)
    }
  }

  if (!teamKey) {
    return (
      <div className="team-chat-page">
        <header className="team-chat-header">
          <div className="container team-chat-header-inner">
            <Link to="/" className="logo-link">
              <Logo />
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to site
            </Link>
          </div>
        </header>
        <main className="container team-chat-login">
          <h1>
            Team <span className="accent">Live Chat</span>
          </h1>
          <p>Enter your SecureFix team key to answer customer messages in real time.</p>
          <form className="team-chat-login-form" onSubmit={unlock}>
            <label>
              Team key
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="LIVE_CHAT_TEAM_KEY"
                autoComplete="current-password"
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Open Inbox
            </button>
          </form>
        </main>
      </div>
    )
  }

  return (
    <div className="team-chat-page">
      <header className="team-chat-header">
        <div className="container team-chat-header-inner">
          <Link to="/" className="logo-link">
            <Logo />
          </Link>
          <div className="team-chat-header-meta">
            <span>{unreadTotal > 0 ? `${unreadTotal} unread` : 'Inbox up to date'}</span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                localStorage.removeItem(KEY_STORAGE)
                setTeamKey('')
                setActive(null)
                setActiveId(null)
              }}
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <main className="container team-chat-layout">
        <aside className="team-chat-list">
          <h2>Conversations</h2>
          {sessions.length === 0 ? (
            <p className="team-chat-empty">No live chats yet. Waiting for customers…</p>
          ) : (
            sessions.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`team-chat-item ${activeId === item.id ? 'active' : ''}`}
                onClick={() => void openSession(item.id)}
              >
                <div className="team-chat-item-top">
                  <strong>{item.customerName}</strong>
                  {item.unreadForTeam > 0 ? (
                    <span className="team-chat-badge">{item.unreadForTeam}</span>
                  ) : null}
                </div>
                <span className="team-chat-item-status">{item.status}</span>
                <p>{item.preview || 'No messages yet'}</p>
              </button>
            ))
          )}
        </aside>

        <section className="team-chat-thread">
          {!active ? (
            <div className="team-chat-placeholder">
              <h2>Select a conversation</h2>
              <p>Reply here and the customer will see it instantly in the website chat box.</p>
              {error ? <p className="team-chat-error">{error}</p> : null}
            </div>
          ) : (
            <>
              <div className="team-chat-thread-head">
                <div>
                  <h2>{active.customerName}</h2>
                  <p>
                    {active.customerPhone || 'No phone'} · {active.customerEmail || 'No email'} ·{' '}
                    {active.status}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => void endChat()}
                  disabled={loading || active.status === 'closed'}
                >
                  Close chat
                </button>
              </div>

              <div className="team-chat-messages" ref={listRef}>
                {active.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`team-bubble team-bubble-${msg.role}`}
                  >
                    <span>
                      {msg.role === 'customer'
                        ? 'Customer'
                        : msg.role === 'technician'
                          ? 'You'
                          : 'System'}
                    </span>
                    <p>{msg.content}</p>
                  </div>
                ))}
              </div>

              {error ? <p className="team-chat-error">{error}</p> : null}

              <form className="team-chat-compose" onSubmit={(e) => void sendReply(e)}>
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply to the customer…"
                  disabled={loading || active.status === 'closed'}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !reply.trim() || active.status === 'closed'}
                >
                  Send
                </button>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
