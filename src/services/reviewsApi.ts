import { customerReviews, googleReviews, type CustomerReview } from '@/data/content'
import { apiUrl } from '@/services/apiBase'

export type LiveReview = CustomerReview & {
  time?: number
  authorUrl?: string
  photoUrl?: string
}

export type ReviewsResponse = {
  ok: boolean
  source: 'google' | 'fallback'
  rating: number
  totalReviews: number
  googleUrl: string
  reviews: LiveReview[]
  fetchedAt?: string
}

export function fallbackReviews(): ReviewsResponse {
  return {
    ok: false,
    source: 'fallback',
    rating: googleReviews.rating,
    totalReviews: googleReviews.totalReviews,
    googleUrl: googleReviews.reviewsUrl,
    reviews: customerReviews,
  }
}

function isLiveGoogleFeed(data: unknown): data is ReviewsResponse {
  if (!data || typeof data !== 'object') return false
  const payload = data as ReviewsResponse
  return (
    payload.ok === true &&
    payload.source === 'google' &&
    Array.isArray(payload.reviews) &&
    payload.reviews.length > 0 &&
    typeof payload.rating === 'number'
  )
}

async function readReviewsEndpoint(path: string): Promise<ReviewsResponse | null> {
  const res = await fetch(apiUrl(path), { cache: 'no-store' })
  if (!res.ok) return null
  const contentType = res.headers.get('content-type') || ''
  const text = await res.text()
  const trimmed = text.trim()
  if (!trimmed || trimmed.startsWith('<')) return null
  if (contentType && !contentType.includes('json') && !trimmed.startsWith('{')) return null
  try {
    const data = JSON.parse(trimmed) as unknown
    return isLiveGoogleFeed(data) ? data : null
  } catch {
    return null
  }
}

/**
 * Live Google listing for the homepage.
 * Prefers /api/reviews (PHP on Hostinger / serve.py locally), then the
 * committed /api/reviews.json seed so real reviews still show if PHP is missing.
 */
export async function fetchSiteReviews(): Promise<ReviewsResponse | null> {
  for (const path of ['/api/reviews', '/api/reviews.json']) {
    try {
      const data = await readReviewsEndpoint(path)
      if (data) {
        return {
          ...data,
          reviews: data.reviews,
          totalReviews: data.totalReviews || data.reviews.length,
          googleUrl: data.googleUrl || googleReviews.reviewsUrl,
        }
      }
    } catch {
      // try next endpoint
    }
  }
  return null
}
