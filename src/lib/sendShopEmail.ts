import { site } from '@/data/content'

/** All website bookings and shop request forms go here. */
export const REPAIR_INBOX = 'repair@securefix.uk' as const

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

type SendResult = { ok: boolean; error?: string; channel?: string }

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

/** Hostinger PHP: saves a booking copy + attempts mail() to repair@. */
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

    if (res.status === 404 || res.status === 405) return null

    const data = await readJson(res)
    if (res.ok && isJsonSuccess(data)) {
      return { ok: true, channel: 'host-php' }
    }

    if (!Object.keys(data).length && !res.ok) return null

    return {
      ok: false,
      channel: 'host-php',
      error:
        typeof data.message === 'string'
          ? data.message
          : 'Host booking endpoint failed to send the email.',
    }
  } catch {
    return null
  }
}

/** Reliable browser delivery (Web3Forms accepts the live securefix.uk origin). */
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
        name: payload.customer_name ?? payload.name ?? 'SecureFix customer',
        email: payload.customer_email ?? payload.email ?? site.email,
        message: payload.message ?? JSON.stringify(payload),
        ...payload,
        replyto: payload._replyto ?? payload.customer_email ?? payload.email,
      }),
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
      error: err instanceof Error ? err.message : 'Network error while sending the booking.',
    }
  }
}

/**
 * Sends a booking-style message to the shop inbox.
 * Fires Web3Forms + Hostinger PHP together so a false PHP mail() success
 * cannot hide a real delivery failure.
 */
export async function sendShopEmail(payload: ShopEmailPayload): Promise<SendResult> {
  const body = cleanPayload(payload)

  const [web3, host] = await Promise.all([sendViaWeb3Forms(body), sendViaHostPhp(body)])

  if (web3?.ok || host?.ok) {
    return { ok: true, channel: web3?.ok ? web3.channel : host?.channel }
  }

  // If PHP route is missing (local Vite), try FormSubmit last.
  if (!host) {
    return sendViaFormSubmit(body)
  }

  return {
    ok: false,
    error:
      web3?.error ||
      host.error ||
      'We could not send your booking. Call the shop to confirm.',
  }
}
