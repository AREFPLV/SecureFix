import { site } from '@/data/content'

/** All website bookings and shop request forms go here. */
export const REPAIR_INBOX = 'repair@securefix.uk' as const

// Keep the public site config aligned with the FormSubmit destination.
if (site.bookingEmail !== REPAIR_INBOX) {
  console.warn(
    `[SecureFix] site.bookingEmail is "${site.bookingEmail}" but forms send to ${REPAIR_INBOX}`,
  )
}

const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${REPAIR_INBOX}`

export type ShopEmailPayload = Record<string, string | undefined>

/**
 * Sends a booking-style message to the repair inbox.
 * Destination is always repair@securefix.uk via FormSubmit.
 */
export async function sendShopEmail(
  payload: ShopEmailPayload,
): Promise<{ ok: boolean; error?: string }> {
  const body: Record<string, string> = {
    _captcha: 'false',
  }
  for (const [key, value] of Object.entries(payload)) {
    if (value != null && value !== '') body[key] = value
  }

  try {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean | string
      message?: string
    }
    const accepted = res.ok && String(data.success) === 'true'
    if (!accepted) {
      return {
        ok: false,
        error: data.message ?? 'Failed to send the booking email.',
      }
    }
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error while sending the booking.',
    }
  }
}
