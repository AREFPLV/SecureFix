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
  // Always stamp the shop destination so every channel / saved copy is explicit.
  body.shop_inbox = REPAIR_INBOX
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
        shop_inbox: REPAIR_INBOX,
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

/**
 * Web3Forms delivers to the email tied to the access key.
 * Also CC repair@ so bookings still reach the shop inbox if the key
 * was registered under a different SecureFix address.
 */
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
        shop_inbox: REPAIR_INBOX,
        // PRO plans honour ccemail; free plans ignore it safely.
        ccemail: REPAIR_INBOX,
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

/** FormSubmit endpoint path IS repair@securefix.uk — guaranteed destination. */
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
        shop_inbox: REPAIR_INBOX,
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
 * Sends a booking-style message to repair@securefix.uk.
 * Fires Hostinger PHP (hardcoded repair@) + FormSubmit (URL = repair@) +
 * Web3Forms together so a single channel failure cannot drop the request.
 */
export async function sendShopEmail(payload: ShopEmailPayload): Promise<SendResult> {
  const body = cleanPayload(payload)

  const [web3, host, formSubmit] = await Promise.all([
    sendViaWeb3Forms(body),
    sendViaHostPhp(body),
    sendViaFormSubmit(body),
  ])

  if (host?.ok || formSubmit.ok || web3?.ok) {
    return {
      ok: true,
      channel: host?.ok
        ? host.channel
        : formSubmit.ok
          ? formSubmit.channel
          : web3?.channel,
    }
  }

  return {
    ok: false,
    error:
      host?.error ||
      formSubmit.error ||
      web3?.error ||
      'We could not send your booking. Call the shop to confirm.',
  }
}
