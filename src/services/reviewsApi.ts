import { customerReviews, googleReviews, type CustomerReview } from '@/data/content'
import { apiUrl } from '@/services/apiBase'

export type LiveReview = CustomerReview & { time?: number }

export type ReviewsResponse = {
  ok: boolean
  source: 'google' | 'fallback'
  rating: number
  totalReviews: number
  googleUrl: string
  reviews: LiveReview[]
}

export async function fetchSiteReviews(): Promise<ReviewsResponse> {
  try {
    const res = await fetch(apiUrl('/api/reviews'))
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as ReviewsResponse & { error?: string }

    if (data.source === 'google' && data.ok) {
      return {
        ...data,
        reviews: data.reviews?.length ? data.reviews : customerReviews,
      }
    }
  } catch {
    // Fall through to local reviews when API is offline or not configured.
  }

  return {
    ok: false,
    source: 'fallback',
    rating: googleReviews.rating,
    totalReviews: googleReviews.totalReviews,
    googleUrl: googleReviews.reviewsUrl,
    reviews: customerReviews,
  }
}
