import { site } from '@/data/content'

/** All website bookings and shop request forms go here. */
export const REPAIR_INBOX = 'repair@securefix.uk' as const

if (site.bookingEmail !== REPAIR_INBOX) {
  console.warn(
    `[SecureFix] site.bookingEmail is "${site.bookingEmail}" but forms send to ${REPAIR_INBOX}`,
  )
}

const HOST_BOOKING_ENDPOINTS = ['/api/booking', '/api/booking.php'] as const

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

function friendlyNetworkError(err: unknown): string {
  const raw = err instanceof Error ? err.message : ''
  if (!raw || /failed to fetch|networkerror|load failed|network request failed/i.test(raw)) {
    return 'Could not reach the SecureFix booking server. Check your connection and try again.'
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

/**
 * Hostinger PHP is the only reliable browser channel:
 * Web3Forms/FormSubmit are blocked by CORS/Cloudflare from the live origin.
 */
async function sendViaHostPhp(payload: Record<string, string>): Promise<SendResult> {
  const body = {
    ...payload,
    shop_inbox: REPAIR_INBOX,
    _captcha: 'false',
    _honey: '',
  }

  let lastError =
    'Could not reach the SecureFix booking server. Check your connection and try again.'

  for (const endpoint of HOST_BOOKING_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      })

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
      lastError = friendlyNetworkError(err)
    }
  }

  return { ok: false, channel: 'host-php', error: lastError }
}

/** Sends a booking-style message to repair@securefix.uk via Hostinger /api/booking.php. */
export async function sendShopEmail(payload: ShopEmailPayload): Promise<SendResult> {
  return sendViaHostPhp(cleanPayload(payload))
}
