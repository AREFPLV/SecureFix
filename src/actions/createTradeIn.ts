import { site } from '@/data/content'
import { conditionLabels, type DeviceCondition } from '@/data/tradeIn'

export type TradeInSellMethod = 'mail-in' | 'drop-off' | 'collection'

export interface TradeInInput {
  category: string
  categoryId: string
  brand: string
  model: string
  storage?: string
  quote: number
  condition: DeviceCondition
  sellMethod: TradeInSellMethod
  name: string
  email: string
  phone: string
  postcode?: string
  address?: string
  trackingNumber?: string
}

export interface TradeInResult {
  ok: boolean
  reference: string
  error?: string
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined

const SELL_METHOD_LABELS: Record<TradeInSellMethod, string> = {
  'drop-off': 'Drop Off at Store',
  collection: 'Collection',
  'mail-in': 'Mail-In',
}

/** Generates a trade-in reference like TI-20260709-4821 */
export function generateTradeInReference(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `TI-${y}${m}${d}-${rand}`
}

function yesNo(value: boolean): string {
  return value ? 'Yes' : 'No'
}

function buildMessage(input: TradeInInput, reference: string): string {
  const lines = [
    `New trade-in request received on ${site.website}`,
    '',
    `Reference:   ${reference}`,
    `Submitted:   ${new Date().toLocaleString('en-GB')}`,
    '',
    '--- Device ---',
    `Category:    ${input.category}`,
    `Brand:       ${input.brand}`,
    `Model:       ${input.model}`,
  ]

  if (input.storage) {
    lines.push(`Storage:     ${input.storage}`)
  }

  lines.push(
    `Quote:       Our technician will get in touch with you`,
    '',
    '--- Condition ---',
    `Powers on:   ${yesNo(input.condition.powersOn)}`,
    `Fully working: ${yesNo(input.condition.fullyWorking)}`,
  )

  if (input.categoryId === 'smartphone' || input.categoryId === 'tablet-ipad') {
    lines.push(`Account removed: ${yesNo(!input.condition.icloudLocked)}`)
  }

  lines.push(
    `Screen:      ${conditionLabels.screen[input.condition.screen]}`,
    `Body:        ${conditionLabels.body[input.condition.body]}`,
    '',
    '--- Sell Method ---',
    `Method:      ${SELL_METHOD_LABELS[input.sellMethod]}`,
  )

  if (input.sellMethod === 'collection') {
    lines.push(`Address:     ${input.address ?? ''}`)
    lines.push(`Postcode:    ${input.postcode ?? ''}`)
  }

  if (input.sellMethod === 'mail-in') {
    lines.push(`Mail to:     ${site.location}`)
    lines.push(`Tracking:    ${input.trackingNumber?.trim() || '(not provided)'}`)
  }

  lines.push(
    '',
    '--- Customer ---',
    `Name:        ${input.name}`,
    `Email:       ${input.email}`,
    `Phone:       ${input.phone}`,
  )

  return lines.join('\n')
}

/**
 * Creates a trade-in request: generates a reference number and emails the full
 * details to the shop inbox via Web3Forms.
 */
export async function createTradeIn(input: TradeInInput): Promise<TradeInResult> {
  const reference = generateTradeInReference()

  if (!ACCESS_KEY) {
    return {
      ok: false,
      reference,
      error: 'Email is not configured. Set VITE_WEB3FORMS_ACCESS_KEY in your .env file.',
    }
  }

  const payload = {
    access_key: ACCESS_KEY,
    subject: `New Trade-In Request ${reference} — ${input.name}`,
    from_name: `${site.name} Website`,
    replyto: input.email,
    trade_in_reference: reference,
    customer_name: input.name,
    customer_email: input.email,
    customer_phone: input.phone,
    device: `${input.category} · ${input.brand} · ${input.model}${input.storage ? ` · ${input.storage}` : ''}`,
    quote: 'Our technician will get in touch with you',
    sell_method: SELL_METHOD_LABELS[input.sellMethod],
    message: buildMessage(input, reference),
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = (await res.json()) as { success?: boolean; message?: string }

    if (!res.ok || !data.success) {
      return {
        ok: false,
        reference,
        error: data.message ?? 'Failed to send trade-in email.',
      }
    }

    return { ok: true, reference }
  } catch (err) {
    return {
      ok: false,
      reference,
      error: err instanceof Error ? err.message : 'Network error while sending trade-in request.',
    }
  }
}
