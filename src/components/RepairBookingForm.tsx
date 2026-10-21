import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/data/content'
import { isLondonPostcode } from '@/data/repairIssues'
import { displayIssueLabel, issuePriceShown } from '@/data/issueCatalog'
import { createBooking, type BookingServiceType } from '@/actions/createBooking'
import FormPrivacyNote from '@/components/FormPrivacyNote'
import '@/pages/BookRepair.css'

type Props = {
  categoryLabel: string
  brandLabel: string
  model: string
  issueLabel: string
  price: number | null
  priceText?: string
}

const SERVICE_COPY: { id: BookingServiceType; icon: string; title: string; text: string }[] = [
  {
    id: 'drop-off',
    icon: '🏪',
    title: 'Drop off at the shop',
    text: 'Bring the device to 218 City Road, London EC1V 2PN. Open Monday to Saturday, 09:00–19:00.',
  },
  {
    id: 'collection',
    icon: '🚚',
    title: 'Collection and return',
    text: 'We collect from a London address, repair the device, and bring it back.',
  },
  {
    id: 'mail-in',
    icon: '📦',
    title: 'Mail-in repair',
    text: 'Post the device to the shop. We repair it and send it back.',
  },
]

export default function RepairBookingForm({
  categoryLabel,
  brandLabel,
  model,
  issueLabel,
  price,
  priceText,
}: Props) {
  const [diagnosticNote, setDiagnosticNote] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [serviceType, setServiceType] = useState<BookingServiceType | null>(null)
  const [postcode, setPostcode] = useState('')
  const [address, setAddress] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [postcodeError, setPostcodeError] = useState('')
  const [serviceError, setServiceError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reference, setReference] = useState('')
  const [submitError, setSubmitError] = useState('')

  const shown = issuePriceShown({ price, priceText })

  async function submitBooking(resolvedService: BookingServiceType) {
    if (submitting) return
    setSubmitting(true)
    setSubmitError('')

    const result = await createBooking({
      category: categoryLabel,
      brand: brandLabel,
      model,
      issue: issueLabel,
      price: price ?? 0,
      diagnosticNote,
      name,
      email,
      phone,
      serviceType: resolvedService,
      postcode: resolvedService === 'collection' ? postcode : undefined,
      address: resolvedService === 'collection' ? address : undefined,
      trackingNumber: resolvedService === 'mail-in' ? trackingNumber : undefined,
      paymentMethod: 'Pay In Store',
    })

    setReference(result.reference)
    if (!result.ok) {
      setSubmitError(result.error ?? 'We could not send your booking. Call the shop to confirm.')
    }
    setSubmitting(false)
    setSubmitted(true)
  }

  function handleBookSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!serviceType) {
      setServiceError('Choose drop-off, collection, or mail-in.')
      return
    }
    if (serviceType === 'collection' && !isLondonPostcode(postcode)) {
      setPostcodeError(
        'Collection covers London postcodes. Choose drop-off or mail-in for an address outside London.',
      )
      return
    }
    setPostcodeError('')
    setServiceError('')
    void submitBooking(serviceType)
  }

  if (submitted) {
    return (
      <section className="book-step book-success" id="book">
        <span className="success-icon">✅</span>
        <h2>
          Repair request <span className="accent">submitted</span>
        </h2>
        <p>Thank you, {name}. A technician will get in touch with you shortly.</p>

        <div className="success-reference">
          <span className="success-reference-label">Your reference number</span>
          <span className="success-reference-value">{reference}</span>
        </div>

        {submitError && (
          <p className="success-error">
            {submitError} Quote your reference number when you contact us.
          </p>
        )}

        <div className="success-summary">
          <div className="success-row">
            <strong>Device:</strong>
            <span>
              {categoryLabel} · {brandLabel} · {model}
            </span>
          </div>
          <div className="success-row">
            <strong>Issue:</strong>
            <span>{displayIssueLabel(issueLabel)}</span>
          </div>
          <div className="success-row">
            <strong>Price:</strong>
            <span>{shown}</span>
          </div>
          <div className="success-row">
            <strong>Service:</strong>
            <span>
              {serviceType === 'drop-off' && 'Drop off at the shop'}
              {serviceType === 'collection' && 'Collection and return'}
              {serviceType === 'mail-in' && 'Mail-in repair'}
            </span>
          </div>
          {serviceType === 'collection' && (
            <div className="success-row">
              <strong>Collection:</strong>
              <span>
                {address}, {postcode}
              </span>
            </div>
          )}
          {serviceType === 'mail-in' && (
            <>
              <div className="success-row">
                <strong>Mail to:</strong>
                <span>{site.location}</span>
              </div>
              {trackingNumber.trim() ? (
                <div className="success-row">
                  <strong>Tracking:</strong>
                  <span>{trackingNumber.trim()}</span>
                </div>
              ) : null}
            </>
          )}
          <div className="success-row">
            <strong>Contact:</strong>
            <span>
              {email} / {phone}
            </span>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
          <a href={site.phoneHref} className="btn btn-secondary">
            Call Us Now
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="book-step" id="book">
      <h2>
        How should we take the <span className="accent">device</span>?
      </h2>
      <form className="book-final" onSubmit={handleBookSubmit}>
        <div className="service-options book-service-pick">
          {SERVICE_COPY.map((service) => (
            <button
              key={service.id}
              type="button"
              className={`book-card service-card${serviceType === service.id ? ' is-selected' : ''}`}
              aria-pressed={serviceType === service.id}
              onClick={() => {
                setServiceType(service.id)
                setServiceError('')
                setPostcodeError('')
              }}
            >
              <span className="book-card-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              {serviceType === service.id && <span className="book-selected-label">Selected</span>}
            </button>
          ))}
        </div>
        <p className="collection-note book-price-note">
          For a technician visit, <Link to="/call-out">book a call-out</Link>.
        </p>
        {serviceError && <div className="postcode-error">{serviceError}</div>}

        <div className="book-form">
          {serviceType === 'mail-in' && (
            <>
              <h3>Mail the device to</h3>
              <div className="mail-in-address">
                <strong>{site.name}</strong>
                <p>{site.location}</p>
                <p className="collection-note">
                  Pack the device safely and include your name inside the parcel.
                </p>
              </div>
              <label>
                Tracking number <span className="optional-label">(optional)</span>
                <input
                  type="text"
                  placeholder="Royal Mail or courier tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  disabled={submitting}
                />
              </label>
            </>
          )}

          {serviceType === 'collection' && (
            <>
              <h3>Collection address</h3>
              <p className="collection-note">Collection covers London addresses.</p>
              <label>
                Postcode
                <input
                  type="text"
                  required
                  placeholder="EC1V 2PN"
                  value={postcode}
                  onChange={(e) => {
                    setPostcode(e.target.value)
                    setPostcodeError('')
                  }}
                />
              </label>
              {postcodeError && <div className="postcode-error">{postcodeError}</div>}
              <label>
                Street address
                <textarea
                  rows={3}
                  required
                  placeholder="House number, street, city"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </label>
            </>
          )}

          <h3>Your details</h3>
          <div className="form-row">
            <label>
              Full name
              <input
                type="text"
                required
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Phone number
              <input
                type="tel"
                required
                placeholder="Your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>
          <label>
            Email address
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            What happened <span className="optional-label">(optional)</span>
            <textarea
              rows={4}
              placeholder="When it started, and anything else we should know"
              value={diagnosticNote}
              onChange={(e) => setDiagnosticNote(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-primary book-submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Book Your Repair Now'}
          </button>
          <FormPrivacyNote />
        </div>
      </form>
    </section>
  )
}
