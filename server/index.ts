import './loadEnv.ts'
import { createServer, type IncomingMessage } from 'node:http'
import { ROUTES, type AgentAction } from '../shared/agentKnowledge.ts'
import { isLeadComplete } from '../shared/customerLead.ts'
import { fallbackChat, trimConversation, type ChatResponse, type ChatTurn } from '../shared/fallbackChat.ts'
import { lookupRepairEstimate } from '../shared/repairCatalog.ts'
import { chatWithGroq, groqModel, groqReady } from './groq.ts'
import { sendLeadEmail } from './sendLeadEmail.ts'

const PORT = Number(process.env.CHAT_API_PORT ?? 3001)

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function lastUser(messages: ChatTurn[]) {
  return [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''
}

/** Ensure price answers always carry a booking deep-link from the catalogue search. */
function withBookingActions(result: ChatResponse, messages: ChatTurn[]): ChatResponse {
  const user = lastUser(messages)
  const estimate = lookupRepairEstimate(user, messages.map((m) => m.content).join(' '))
  if (!estimate?.bookingPath) return result

  const bookAction: AgentAction = { label: 'Book this repair', route: estimate.bookingPath }
  const existing = result.actions ?? []
  const withoutBook = existing.filter(
    (action) => action.route !== bookAction.route && action.route !== ROUTES.bookRepair,
  )
  return {
    ...result,
    actions: [bookAction, ...withoutBook].slice(0, 4),
  }
}

async function handleChat(messages: ChatTurn[]) {
  if (groqReady()) {
    try {
      return withBookingActions(await chatWithGroq(messages), messages)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Groq error'
      const local = fallbackChat(messages) as ReturnType<typeof fallbackChat> & {
        submitLead?: boolean
        lead?: Parameters<typeof sendLeadEmail>[0]
      }

      if (local.submitLead && isLeadComplete(local.lead)) {
        const sent = await sendLeadEmail(local.lead, messages)
        if (sent.ok) {
          return withBookingActions(
            {
              reply: `${local.reply}\n\nReference: ${sent.reference}.`,
              reference: sent.reference,
              leadSubmitted: true,
              mode: 'local' as const,
              warning: msg.slice(0, 120),
            },
            messages,
          )
        }
      }

      return withBookingActions({ ...local, warning: msg.slice(0, 120) }, messages)
    }
  }

  const local = fallbackChat(messages) as ReturnType<typeof fallbackChat> & {
    submitLead?: boolean
    lead?: Parameters<typeof sendLeadEmail>[0]
  }

  if (local.submitLead && isLeadComplete(local.lead)) {
    const sent = await sendLeadEmail(local.lead, messages)
    if (sent.ok) {
      return withBookingActions(
        {
          reply: `${local.reply}\n\nReference: ${sent.reference}.`,
          reference: sent.reference,
          leadSubmitted: true,
          mode: 'local' as const,
        },
        messages,
      )
    }
  }

  return withBookingActions(local, messages)
}

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        ok: true,
        ai: groqReady(),
        model: groqReady() ? groqModel() : null,
      }),
    )
    return
  }

  if (req.method !== 'POST' || req.url !== '/api/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

  try {
    const body = JSON.parse(await readBody(req)) as { messages?: ChatTurn[] }
    const messages = trimConversation(
      (body.messages ?? []).filter(
        (m): m is ChatTurn =>
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim().length > 0,
      ),
    )

    if (!messages.length) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'messages required' }))
      return
    }

    const result = await handleChat(messages)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  } catch (err) {
    console.error('[chat-api]', err)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Chat failed' }))
  }
}).listen(PORT, () => {
  console.log(`Chat API on http://localhost:${PORT}`)
  console.log(
    groqReady()
      ? `Groq: ${groqModel()}`
      : 'Groq off — using local assistant (add gsk_... key to .env to enable AI)',
  )
})
