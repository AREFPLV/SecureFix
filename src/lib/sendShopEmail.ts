import { site } from '@/data/content'

/** All website bookings and shop request forms go here. */
export const REPAIR_INBOX = 'repair@securefix.uk' as const

// Keep the public site config aligned with the FormSubmit destination.
if (site.bookingEmail !== REPAIR_INBOX) {
  console.warn(
    `[SecureFix] site.bookingEmail is "${site.bookingEmail}" but forms send to ${REPAIR_INBOX}`,
  )
}

const HOST_BOOKING_ENDPOINT = '/api/booking'
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${REPAIR_INBOX}`
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined

export type ShopEmailPayload = Record<string, string | undefined>

type SendResult = { ok: boolean; error?: string }

function cleanPayload(payload: ShopEmailPayload): Record<string, string> {
  const body: Record<string, string> = {}
  for (const [key, value] of Object.entries(payload)) {
    if (value != null && value !== '') body[key] = value
  }
  return body
}

function isJsonSuccess(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const success = (data as { success?: boolean | string }).success
  return success === true || String(success) === 'true'
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

/** Preferred on Hostinger: same-origin PHP mailer (avoids FormSubmit Cloudflare blocks). */
async function sendViaHostPhp(payload: Record<string, string>): Promise<SendResult | null> {
  try {
    const res = await fetch(HOST_BOOKING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        _captcha: 'false',
        _honey: '',
      }),
    })

    // Missing PHP route (local Vite / misconfigured host) → try next provider.
    if (res.status === 404 || res.status === 405) return null

    const data = await readJson(res)
    if (res.ok && isJsonSuccess(data)) return { ok: true }

    // Non-JSON HTML 404/index fallback
    if (!Object.keys(data).length && !res.ok) return null

    return {
      ok: false,
      error:
        typeof data.message === 'string'
          ? data.message
          : 'Host booking endpoint failed to send the email.',
    }
  } catch {
    return null
  }
}

async function sendViaWeb3Forms(payload: Record<string, string>): Promise<SendResult | null> {
  if (!WEB3FORMS_KEY) return null
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: payload._subject ?? `SecureFix booking — ${payload.customer_name ?? 'customer'}`,
        from_name: 'SecureFix Bookings',
        ...payload,
        // Keep reply-to for the shop inbox linked to this access key.
        replyto: payload._replyto ?? payload.customer_email ?? payload.email,
      }),
    })
    const data = await readJson(res)
    if (res.ok && isJsonSuccess(data)) return { ok: true }
    return {
      ok: false,
      error:
        typeof data.message === 'string'
          ? data.message
          : 'Web3Forms failed to send the booking email.',
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error while sending via Web3Forms.',
    }
  }
}

async function sendViaFormSubmit(payload: Record<string, string>): Promise<SendResult> {
  try {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _captcha: 'false',
        ...payload,
      }),
    })
    const data = await readJson(res)
    if (res.ok && isJsonSuccess(data)) return { ok: true }
    // Cloudflare challenge HTML comes back as empty JSON parse
    if (!Object.keys(data).length) {
      return {
        ok: false,
        error: 'Booking email provider blocked the request. Please call the shop to confirm.',
      }
    }
    return {
      ok: false,
      error:
        typeof data.message === 'string'
          ? data.message
          : 'Failed to send the booking email.',
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error while sending the booking.',
    }
  }
}

/**
 * Sends a booking-style message to the repair inbox.
 * Prefer Hostinger PHP (/api/booking), then Web3Forms, then FormSubmit.
 */
export async function sendShopEmail(payload: ShopEmailPayload): Promise<SendResult> {
  const body = cleanPayload(payload)

  const host = await sendViaHostPhp(body)
  if (host) return host

  const web3 = await sendViaWeb3Forms(body)
  if (web3) return web3

  return sendViaFormSubmit(body)
}
