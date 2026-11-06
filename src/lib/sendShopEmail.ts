import { site } from '@/data/content'

/** All website bookings and shop request forms go here. */
export const REPAIR_INBOX = 'repair@securefix.uk' as const

if (site.bookingEmail !== REPAIR_INBOX) {
  console.warn(
    `[SecureFix] site.bookingEmail is "${site.bookingEmail}" but forms send to ${REPAIR_INBOX}`,
  )
}

const HOST_BOOKING_ENDPOINTS = ['/api/booking', '/api/booking.php'] as const
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${REPAIR_INBOX}`
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined

export type ShopEmailPayload = Record<string, string | undefined>

type SendResult = { ok: boolean; error?: string; channel?: string }

function cleanPayload(payload: ShopEmailPayload): Record<string, string> {
  const body: Record<string, string> = {}
  for (const [key, value] of Object.entries(payload)) {
    if (value != null && value !== '') body[key] = value
  }
  body.shop_inbox = REPAIR_INBOX
  return body
}

function isJsonSuccess(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const success = (data as { success?: boolean | string }).success
  return success === true || String(success) === 'true'
}

function friendlyNetworkError(err: unknown, fallback: string): string {
  const raw = err instanceof Error ? err.message : ''
  if (!raw || /failed to fetch|networkerror|load failed|network request failed/i.test(raw)) {
    return fallback
  }
  return raw
}

async function readJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text()
  const trimmed = text.trim()
  if (!trimmed || trimmed.startsWith('<')) return {}
  try {
    return JSON.parse(trimmed) as Record<string, unknown>
  } catch {
    return {}
  }
}

async function postJson(url: string, body: Record<string, unknown>): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })
}

/** Hostinger PHP: saves a booking copy + attempts mail() to repair@. */
async function sendViaHostPhp(payload: Record<string, string>): Promise<SendResult | null> {
  const body = {
    ...payload,
    shop_inbox: REPAIR_INBOX,
    _captcha: 'false',
    _honey: '',
  }

  let lastError: string | undefined

  for (const endpoint of HOST_BOOKING_ENDPOINTS) {
    try {
      const res = await postJson(endpoint, body)
      if (res.status === 404 || res.status === 405) continue

      const data = await readJson(res)
      if (res.ok && isJsonSuccess(data)) {
        return { ok: true, channel: 'host-php' }
      }

      if (!Object.keys(data).length && !res.ok) continue

      lastError =
        typeof data.message === 'string'
          ? data.message
          : 'Host booking endpoint failed to send the email.'
    } catch (err) {
      lastError = friendlyNetworkError(
        err,
        'Could not reach the SecureFix booking server. Check your connection and try again.',
      )
    }
  }

  if (lastError) {
    return { ok: false, channel: 'host-php', error: lastError }
  }
  return null
}

/**
 * Web3Forms delivers to the email tied to the access key.
 * Also CC repair@ when the plan supports it.
 */
async function sendViaWeb3Forms(payload: Record<string, string>): Promise<SendResult | null> {
  if (!WEB3FORMS_KEY) return null
  try {
    const res = await postJson(WEB3FORMS_ENDPOINT, {
      access_key: WEB3FORMS_KEY,
      subject: payload._subject ?? `SecureFix booking — ${payload.customer_name ?? 'customer'}`,
      from_name: 'SecureFix Bookings',
      name: payload.customer_name ?? payload.name ?? 'SecureFix customer',
      email: payload.customer_email ?? payload.email ?? site.email,
      message: payload.message ?? JSON.stringify(payload),
      ...payload,
      shop_inbox: REPAIR_INBOX,
      ccemail: REPAIR_INBOX,
      replyto: payload._replyto ?? payload.customer_email ?? payload.email,
    })
    const data = await readJson(res)
    if (res.ok && isJsonSuccess(data)) return { ok: true, channel: 'web3forms' }
    return {
      ok: false,
      channel: 'web3forms',
      error:
        typeof data.message === 'string'
          ? data.message
          : 'Web3Forms failed to send the booking email.',
    }
  } catch (err) {
    return {
      ok: false,
      channel: 'web3forms',
      error: friendlyNetworkError(
        err,
        'Could not reach the booking email service. Please try again or call the shop.',
      ),
    }
  }
}

/** FormSubmit endpoint path IS repair@securefix.uk — guaranteed destination. */
async function sendViaFormSubmit(payload: Record<string, string>): Promise<SendResult> {
  try {
    const res = await postJson(FORMSUBMIT_ENDPOINT, {
      _captcha: 'false',
      ...payload,
      shop_inbox: REPAIR_INBOX,
    })
    const data = await readJson(res)
    if (res.ok && isJsonSuccess(data)) return { ok: true, channel: 'formsubmit' }
    if (!Object.keys(data).length) {
      return {
        ok: false,
        channel: 'formsubmit',
        error: 'Booking email provider blocked the request. Please call the shop to confirm.',
      }
    }
    return {
      ok: false,
      channel: 'formsubmit',
      error:
        typeof data.message === 'string'
          ? data.message
          : 'Failed to send the booking email.',
    }
  } catch (err) {
    return {
      ok: false,
      channel: 'formsubmit',
      error: friendlyNetworkError(
        err,
        'Could not reach the booking email service. Please try again or call the shop.',
      ),
    }
  }
}

/**
 * Sends a booking-style message to repair@securefix.uk.
 * Tries Hostinger PHP first (hardcoded repair@), then Web3Forms, then FormSubmit.
 * Never treats `{ ok: false }` as a successful short-circuit.
 */
export async function sendShopEmail(payload: ShopEmailPayload): Promise<SendResult> {
  const body = cleanPayload(payload)

  const host = await sendViaHostPhp(body)
  if (host?.ok) return host

  const web3 = await sendViaWeb3Forms(body)
  if (web3?.ok) return web3

  const formSubmit = await sendViaFormSubmit(body)
  if (formSubmit.ok) return formSubmit

  return {
    ok: false,
    error:
      host?.error ||
      web3?.error ||
      formSubmit.error ||
      'We could not send your booking. Call the shop to confirm.',
  }
}
