import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { googleReviews, BOOKING_ROUTE } from '@/data/content'
import { contactMethods } from '@/data/content'
import { fetchSiteReviews, type LiveReview } from '@/services/reviewsApi'
import './Contact.css'

function Stars({ rating }: { rating: number }) {
  const safe = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <span className="review-stars" aria-label={`${safe} out of 5 stars`}>
      {'★'.repeat(safe)}
      {'☆'.repeat(5 - safe)}
    </span>
  )
}

export default function Contact() {
  const [reviews, setReviews] = useState<LiveReview[]>([])
  const [rating, setRating] = useState(googleReviews.rating)
  const [totalReviews, setTotalReviews] = useState(googleReviews.totalReviews)
  const [googleUrl, setGoogleUrl] = useState(googleReviews.reviewsUrl)
  const [source, setSource] = useState<'google' | 'fallback' | 'loading'>('loading')

  useEffect(() => {
    let cancelled = false
    fetchSiteReviews().then((data) => {
      if (cancelled) return
      setReviews(data.reviews)
      setRating(data.rating)
      setTotalReviews(data.totalReviews || data.reviews.length)
      setGoogleUrl(data.googleUrl || googleReviews.reviewsUrl)
      setSource(data.source)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="contact" className="section section-alt">
      <div className="container">
        <h2 className="section-title">
          Get In <span className="accent">Touch</span>
        </h2>
        <p className="section-subtitle">
          Need your device fixed today? Contact SecureFix and get it fixed the same day.
        </p>

        <div className="contact-grid">
          <div className="contact-methods">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.href}
                className="contact-method"
                {...(method.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <span className="contact-method-icon">{method.icon}</span>
                <div>
                  <strong>{method.title}</strong>
                  <span>{method.value}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="contact-right">
            <div className="contact-form contact-booking-cta">
              <h3>Book Your Repair</h3>
              <p>
                Start your repair booking online. Choose your device, select the issue, and
                we&apos;ll take care of the rest.
              </p>
              <Link to={BOOKING_ROUTE} className="btn btn-primary btn-shiny">
                Book Repair Now
              </Link>
            </div>

            <div className="contact-reviews">
              <div className="contact-reviews-header">
                <div>
                  <h3>Customer Reviews</h3>
                  <div className="contact-reviews-rating">
                    <Stars rating={Math.round(rating)} />
                    <strong>{rating.toFixed(1)}</strong>
                    <span>
                      Google Reviews
                      {totalReviews > 0 ? ` · ${totalReviews} reviews` : ''}
                      {source === 'google' ? ' · Live' : ''}
                    </span>
                  </div>
                </div>
                <a
                  href={googleUrl}
                  className="contact-reviews-google"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View SecureFix on Google Reviews"
                  title="View on Google"
                >
                  G
                </a>
              </div>

              {source === 'loading' ? (
                <p className="contact-reviews-note">Loading latest Google reviews…</p>
              ) : (
                <>
                  {source === 'google' ? (
                    <p className="contact-reviews-note">
                      Live rating from Google. Written reviews appear here as customers leave them.
                    </p>
                  ) : null}
                  <div className="contact-reviews-list">
                    {reviews.map((review) => (
                      <article
                        key={`${review.name}-${review.date}-${review.text.slice(0, 24)}`}
                        className="review-card"
                      >
                        <div className="review-card-top">
                          <div className="review-avatar">{review.name.charAt(0)}</div>
                          <div>
                            <strong>{review.name}</strong>
                            <Stars rating={review.rating} />
                          </div>
                          <span className="review-date">{review.date}</span>
                        </div>
                        <p className="review-text">&ldquo;{review.text}&rdquo;</p>
                        {review.device ? <span className="review-device">{review.device}</span> : null}
                      </article>
                    ))}
                  </div>
                </>
              )}

              <div className="contact-reviews-actions">
                <a
                  href={googleUrl}
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See All on Google
                </a>
                <a
                  href={googleReviews.writeReviewUrl}
                  className="btn btn-primary btn-shiny"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leave a Google Review
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
