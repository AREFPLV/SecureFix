import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/data/content'
import { isLondonPostcode } from '@/data/repairIssues'
import { createCallOut } from '@/actions/createCallOut'
import { callOutContent, callOutSeo } from '@/data/callOut'
import FormPrivacyNote from '@/components/FormPrivacyNote'
import { usePageSeo } from '@/hooks/usePageSeo'
import './About.css'
import './BookRepair.css'
import './CallOut.css'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  postcode: '',
  preferredTime: '',
  notes: '',
}

export default function CallOut() {
  usePageSeo(callOutSeo)

  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')
  const [postcodeError, setPostcodeError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  function update<K extends keyof typeof emptyForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === 'postcode') setPostcodeError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setPostcodeError('')

    if (!isLondonPostcode(form.postcode)) {
      setPostcodeError(
        'Call-out is available within the London area only. Please enter a London postcode.',
      )
      return
    }

    setSubmitting(true)
    const result = await createCallOut(form)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error || 'Something went wrong. Please try again.')
      return
    }

    setReference(result.reference)
    setSubmitted(true)
  }

  return (
    <div className="about-page callout-page site-page">
      <div className="about-hero site-hero-bg">
        <div className="container">
          <h1>
            {callOutContent.heroTitle}{' '}
            <span className="accent">{callOutContent.heroAccent}</span>
          </h1>
          <p>{callOutContent.heroSubtitle}</p>
          <div className="callout-hero-actions">
            <a href="#book-call-out" className="btn btn-primary btn-shiny">
              Book Call-Out
            </a>
            <a href={`${site.phoneHref}`} className="btn btn-secondary btn-shiny">
              Call {site.phone}
            </a>
          </div>
        </div>
      </div>

      <main className="about-main">
        <div className="container">
          <section className="about-section" aria-labelledby="callout-overview">
            <h2 id="callout-overview">
              We Come To <span className="accent">You</span>
            </h2>
            {callOutContent.intro.map((p) => (
              <p key={p.slice(0, 48)} className="about-text">
                {p}
              </p>
            ))}
          </section>

          <section className="about-section" aria-labelledby="callout-services">
            <h2 id="callout-services">
              What We <span className="accent">Offer</span>
            </h2>
            <div className="about-services-grid">
              {callOutContent.services.map((item) => (
                <article key={item.title} className="about-service-card">
                  <span className="about-service-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="about-section callout-visual" aria-label="SecureFix on-site service">
            <img
              src="/images/onsite-banner.png"
              alt="SecureFix on-site repair and IT support van with collection and same-day service in London"
              className="callout-banner"
              width={1200}
              height={675}
              loading="lazy"
            />
          </section>

          <section className="about-section" aria-labelledby="callout-steps">
            <h2 id="callout-steps">
              How Call-Out <span className="accent">Works</span>
            </h2>
            <div className="callout-steps">
              {callOutContent.howItWorks.map((item) => (
                <article key={item.step} className="callout-step">
                  <span className="callout-step-num">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="about-section" aria-labelledby="callout-coverage">
            <h2 id="callout-coverage">
              London <span className="accent">Coverage</span>
            </h2>
            <p className="about-text">{callOutContent.coverage}</p>
          </section>

          <section
            id="book-call-out"
            className="about-section callout-book-section"
            aria-labelledby="callout-book"
          >
            <h2 id="callout-book">
              Book Your <span className="accent">Call-Out</span>
            </h2>
            <p className="about-text">
              Enter your details below. We only accept London postcodes for call-out visits.
            </p>

            {submitted ? (
              <div className="book-step book-success callout-success">
                <span className="success-icon">✅</span>
                <h3>
                  Call-Out Request <span className="accent">Sent!</span>
                </h3>
                <p>Thank you, {form.name}! We&apos;ll contact you shortly to confirm your visit.</p>
                <div className="success-reference">
                  <span className="success-reference-label">Your reference number</span>
                  <span className="success-reference-value">{reference}</span>
                </div>
                <div className="success-summary">
                  <div className="success-row">
                    <strong>Phone:</strong>
                    <span>{form.phone}</span>
                  </div>
                  <div className="success-row">
                    <strong>Email:</strong>
                    <span>{form.email}</span>
                  </div>
                  <div className="success-row">
                    <strong>Address:</strong>
                    <span>
                      {form.address}, {form.postcode}
                    </span>
                  </div>
                </div>
                <div className="success-actions">
                  <Link to="/" className="btn btn-primary">
                    Back to Home
                  </Link>
                  <a href={`${site.phoneHref}`} className="btn btn-secondary">
                    Call {site.phone}
                  </a>
                </div>
              </div>
            ) : (
              <form className="book-form callout-form" onSubmit={handleSubmit}>
                <h3>Your Information</h3>
                <p className="collection-note">Call-out is available within the London area only.</p>

                <div className="form-row">
                  <label>
                    Full Name
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                    />
                  </label>
                  <label>
                    Phone Number
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="Your phone number"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                    />
                  </label>
                </div>

                <label>
                  Email Address
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                </label>

                <label>
                  Address
                  <input
                    type="text"
                    required
                    autoComplete="street-address"
                    placeholder="Street address"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                  />
                </label>

                <div className="form-row">
                  <label>
                    London Postcode
                    <input
                      type="text"
                      required
                      autoComplete="postal-code"
                      placeholder="e.g. EC1V 2PN"
                      value={form.postcode}
                      onChange={(e) => update('postcode', e.target.value)}
                    />
                  </label>
                  <label>
                    Preferred Time
                    <input
                      type="text"
                      placeholder="e.g. Tomorrow morning"
                      value={form.preferredTime}
                      onChange={(e) => update('preferredTime', e.target.value)}
                    />
                  </label>
                </div>

                {postcodeError ? <div className="postcode-error">{postcodeError}</div> : null}

                <label>
                  Notes (optional)
                  <textarea
                    rows={3}
                    placeholder="Device type, issue, or anything else we should know"
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                  />
                </label>

                {error ? <p className="success-error">{error}</p> : null}

                <button type="submit" className="btn btn-primary book-submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Request Call-Out'}
                </button>
                <FormPrivacyNote />
              </form>
            )}
          </section>

          <section id="faq" className="about-section about-faq-section" aria-labelledby="callout-faq">
            <h2 id="callout-faq">
              Call-Out <span className="accent">FAQ</span>
            </h2>
            <div className="faq-list">
              {callOutContent.faqs.map((item, index) => (
                <div
                  key={item.question}
                  className={`faq-item ${openFaq === index ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                  >
                    <span>{item.question}</span>
                    <span className="faq-chevron">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  {openFaq === index ? (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="about-cta">
            <h2>Need help right now?</h2>
            <p>Call or WhatsApp SecureFix and we will arrange your London visit.</p>
            <div className="about-cta-actions">
              <a href={`${site.phoneHref}`} className="btn btn-primary btn-shiny">
                Call {site.phone}
              </a>
              <a
                href={site.whatsapp}
                className="btn btn-secondary btn-shiny"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
