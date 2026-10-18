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

/** Live Google listing. Returns null when the feed cannot be read. */
export async function fetchSiteReviews(): Promise<ReviewsResponse | null> {
  try {
    const res = await fetch(apiUrl('/api/reviews'), { cache: 'no-store' })
    if (!res.ok) return null
    const data = (await res.json()) as ReviewsResponse
    if (data.source === 'google' && data.ok) {
      return {
        ...data,
        reviews: Array.isArray(data.reviews) ? data.reviews : [],
      }
    }
  } catch {
    return null
  }
  return null
}
