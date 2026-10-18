import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { site } from '@/data/content'
import { deviceCategories, type DeviceCategory, type Brand } from '@/data/booking'
import { isLondonPostcode, type RepairIssue } from '@/data/repairIssues'
import {
  bookingSelectionFromQuery,
  displayIssueLabel,
  isIssuableModel,
  pricedIssues,
} from '@/data/issueCatalog'
import { createBooking } from '@/actions/createBooking'
import FormPrivacyNote from '@/components/FormPrivacyNote'
import { usePageSeo } from '@/hooks/usePageSeo'
import { bookRepairSeo } from '@/data/seo'
import './BookRepair.css'

type Step = 'category' | 'brand' | 'model' | 'issue' | 'details' | 'service'
type ServiceType = 'mail-in' | 'drop-off' | 'collection'

const STEP_LABELS: { key: Step; num: number; label: string }[] = [
  { key: 'category', num: 1, label: 'Device' },
  { key: 'brand', num: 2, label: 'Brand' },
  { key: 'model', num: 3, label: 'Model' },
  { key: 'issue', num: 4, label: 'Issue' },
  { key: 'details', num: 5, label: 'Details' },
  { key: 'service', num: 6, label: 'Service' },
]

function stepIndex(step: Step) {
  return STEP_LABELS.findIndex((s) => s.key === step)
}

export default function BookRepair() {
  usePageSeo(bookRepairSeo)
  const [searchParams] = useSearchParams()
  const seed = bookingSelectionFromQuery(searchParams)

  const [step, setStep] = useState<Step>(seed.step)
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | null>(seed.category)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(seed.brand)
  const [selectedModel, setSelectedModel] = useState<string | null>(seed.model)
  const [selectedIssue, setSelectedIssue] = useState<RepairIssue | null>(seed.issue)
  const [diagnosticNote, setDiagnosticNote] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [serviceType, setServiceType] = useState<ServiceType | null>(null)
  const [postcode, setPostcode] = useState('')
  const [address, setAddress] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [postcodeError, setPostcodeError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reference, setReference] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const next = bookingSelectionFromQuery(searchParams)
    setSelectedCategory(next.category)
    setSelectedBrand(next.brand)
    setSelectedModel(next.model)
    setSelectedIssue(next.issue)
    setStep(next.step)
  }, [searchParams])

  function handleCategorySelect(cat: DeviceCategory) {
    setSelectedCategory(cat)
    setSelectedBrand(null)
    setSelectedModel(null)
    setSelectedIssue(null)
    setStep('brand')
  }

  function handleBrandSelect(brand: Brand) {
    setSelectedBrand(brand)
    setSelectedModel(null)
    setSelectedIssue(null)
    setStep('model')
  }

  function handleModelSelect(model: string) {
    setSelectedModel(model)
    setSelectedIssue(null)
    setStep('issue')
  }

  function handleIssueSelect(issue: RepairIssue) {
    setSelectedIssue(issue)
    setStep('details')
  }

  function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep('service')
  }

  function handleServiceSelect(svc: ServiceType) {
    setServiceType(svc)
    if (svc === 'collection') {
      setPostcodeError('')
    } else if (svc === 'mail-in') {
      setTrackingNumber('')
    } else {
      void submitBooking('drop-off')
    }
  }

  function handleCollectionSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLondonPostcode(postcode)) {
      setPostcodeError('Sorry, collection is only available within the London area. Please choose another service option.')
      return
    }
    setPostcodeError('')
    void submitBooking('collection')
  }

  function handleMailInSubmit(e: React.FormEvent) {
    e.preventDefault()
    void submitBooking('mail-in')
  }

  function handleBack() {
    const steps: Step[] = ['category', 'brand', 'model', 'issue', 'details', 'service']
    const idx = steps.indexOf(step)
    if (idx > 0) {
      if (step === 'service' && (serviceType === 'collection' || serviceType === 'mail-in')) {
        setServiceType(null)
        return
      }
      setStep(steps[idx - 1])
    }
  }

  async function submitBooking(forcedService?: ServiceType) {
    if (submitting) return
    const resolvedService = forcedService ?? serviceType
    if (!resolvedService) return

    setSubmitting(true)
    setSubmitError('')

    const result = await createBooking({
      category: selectedCategory?.label ?? '',
      brand: selectedBrand?.label ?? '',
      model: selectedModel ?? '',
      issue: selectedIssue?.label ?? '',
      price: selectedIssue?.price ?? null,
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
      setSubmitError(result.error ?? 'We could not send your booking. Please call us to confirm.')
    }
    setSubmitting(false)
    setSubmitted(true)
  }

  const currentStepIndex = stepIndex(step)
  const issues =
    selectedCategory && selectedModel && isIssuableModel(selectedModel)
      ? pricedIssues(selectedCategory.id)
      : []

  return (
    <div className="book-page site-page">
      <div className="book-hero site-hero-bg">
        <div className="container">
          <h1>
            <span className="accent">Book</span> Your Repair
          </h1>
          <p>Choose your device below to get started with your repair booking</p>
        </div>
      </div>

      <main className="book-main">
        <div className="container">
          {!submitted && (
            <div className="book-progress">
              {STEP_LABELS.map((s, i) => (
                <div key={s.key} className="book-progress-item">
                  <div className={`progress-step ${currentStepIndex >= i ? 'active' : ''}`}>
                    <span className="progress-num">{s.num}</span>
                    <span className="progress-label">{s.label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && <div className="progress-line" />}
                </div>
              ))}
            </div>
          )}

          {step !== 'category' && !submitted && (
            <button className="book-back-btn" onClick={handleBack} type="button">
              ← Back
            </button>
          )}

          {/* Step 1: Device Category */}
          {step === 'category' && (
            <section className="book-step">
              <h2>Select Your <span className="accent">Device Type</span></h2>
              <div className="book-grid">
                {deviceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className="book-card"
                    onClick={() => handleCategorySelect(cat)}
                    type="button"
                  >
                    <span className="book-card-icon">{cat.icon}</span>
                    <h3>{cat.label}</h3>
                    <p>{cat.description}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Step 2: Brand */}
          {step === 'brand' && selectedCategory && (
            <section className="book-step">
              <h2>Select <span className="accent">{selectedCategory.label}</span> Brand</h2>
              <div className="book-grid book-grid-brands">
                {selectedCategory.brands.map((brand) => (
                  <button
                    key={brand.id}
                    className="book-card book-card-brand"
                    onClick={() => handleBrandSelect(brand)}
                    type="button"
                  >
                    <h3>{brand.label}</h3>
                    <span className="book-card-count">{brand.models.length} models</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Step 3: Model */}
          {step === 'model' && selectedBrand && (
            <section className="book-step">
              <h2>Select <span className="accent">{selectedBrand.label}</span> Model</h2>
              <div className="book-grid book-grid-models">
                {selectedBrand.models.map((model) => (
                  <button
                    key={model}
                    className="book-card book-card-model"
                    onClick={() => handleModelSelect(model)}
                    type="button"
                  >
                    {model}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Step 4: Issue Selection */}
          {step === 'issue' && (
            <section className="book-step">
              <h2>Select the <span className="accent">Issue</span></h2>
              {selectedModel && !isIssuableModel(selectedModel) ? (
                <p className="collection-note">
                  Parts for the {selectedModel} are not priced yet. Call the shop before booking this model.
                </p>
              ) : (
                <div className="book-grid book-grid-issues">
                  {issues.map((issue) => (
                    <button
                      key={issue.label}
                      className="book-card book-card-issue"
                      onClick={() => handleIssueSelect(issue)}
                      type="button"
                    >
                      <span className="issue-icon">🔧</span>
                      <h3>{displayIssueLabel(issue.label)}</h3>
                      <span className="issue-time">Avg repair time: {issue.time}</span>
                      <span className="issue-price">from £{issue.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Step 5: Diagnostic Notes + Contact Info */}
          {step === 'details' && (
            <section className="book-step">
              <div className="book-summary-bar">
                <span className="chip">{selectedCategory?.icon} {selectedCategory?.label}</span>
                <span className="chip">{selectedBrand?.label}</span>
                <span className="chip">{selectedModel}</span>
                <span className="chip chip-accent">
                  {selectedIssue ? displayIssueLabel(selectedIssue.label) : ''}
                </span>
              </div>

              <form className="book-form" onSubmit={handleDetailsSubmit}>
                <h3>Describe the Issue</h3>
                <label>
                  Diagnostic Notes
                  <textarea
                    rows={4}
                    required
                    placeholder="Please describe the problem in detail. What happened, when did it start, any other info..."
                    value={diagnosticNote}
                    onChange={(e) => setDiagnosticNote(e.target.value)}
                  />
                </label>
                <h3>Your Details</h3>
                <div className="form-row">
                  <label>
                    Full Name
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <label>
                    Phone Number
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
                  Email Address
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <button type="submit" className="btn btn-primary book-submit">
                  Continue →
                </button>
              </form>
            </section>
          )}

          {/* Step 6: Service Type */}
          {step === 'service' && (
            <section className="book-step">
              <h2>Preferred <span className="accent">Service</span></h2>

              {!serviceType && (
                <>
                <FormPrivacyNote />
                <div className="service-options">
                  <button
                    className="book-card service-card"
                    onClick={() => handleServiceSelect('drop-off')}
                    type="button"
                    disabled={submitting}
                  >
                    <span className="book-card-icon">🏪</span>
                    <h3>Drop Off at Store</h3>
                    <p>Bring your device to our London store for fast same-day repair</p>
                  </button>
                  <button
                    className="book-card service-card"
                    onClick={() => handleServiceSelect('collection')}
                    type="button"
                    disabled={submitting}
                  >
                    <span className="book-card-icon">🚚</span>
                    <h3>Collection &amp; Return</h3>
                    <p>We collect from your London address, repair and return the same day</p>
                  </button>
                  <button
                    className="book-card service-card"
                    onClick={() => handleServiceSelect('mail-in')}
                    type="button"
                    disabled={submitting}
                  >
                    <span className="book-card-icon">📦</span>
                    <h3>Mail-In Repair</h3>
                    <p>Post your device to us and we&apos;ll repair and send it back</p>
                  </button>
                </div>
                </>
              )}

              {serviceType === 'collection' && step === 'service' && (
                <form className="book-form collection-form" onSubmit={handleCollectionSubmit}>
                  <h3>Collection Address</h3>
                  <p className="collection-note">Collection is available within the London area only.</p>
                  <label>
                    Postcode
                    <input
                      type="text"
                      required
                      placeholder="e.g. SW1A 1AA"
                      value={postcode}
                      onChange={(e) => {
                        setPostcode(e.target.value)
                        setPostcodeError('')
                      }}
                    />
                  </label>
                  {postcodeError && (
                    <div className="postcode-error">{postcodeError}</div>
                  )}
                  <label>
                    Full Address
                    <textarea
                      rows={3}
                      required
                      placeholder="House number, street, city..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </label>
                  <div className="collection-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setServiceType(null)
                        setPostcodeError('')
                      }}
                      disabled={submitting}
                    >
                      ← Choose Different Service
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'Submitting…' : 'Submit Booking'}
                    </button>
                  </div>
                  <FormPrivacyNote />
                </form>
              )}

              {serviceType === 'mail-in' && step === 'service' && (
                <form className="book-form collection-form" onSubmit={handleMailInSubmit}>
                  <h3>Mail Your Device To</h3>
                  <div className="mail-in-address">
                    <strong>{site.name}</strong>
                    <p>{site.location}</p>
                    <p className="collection-note">
                      Please pack your device safely and include your name and booking details inside the parcel.
                    </p>
                  </div>
                  <label>
                    Tracking Number <span className="optional-label">(optional)</span>
                    <input
                      type="text"
                      placeholder="e.g. Royal Mail / courier tracking number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      disabled={submitting}
                    />
                  </label>
                  <p className="collection-note">
                    You can leave this blank now and share the tracking number with us later.
                  </p>
                  <div className="collection-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setServiceType(null)
                        setTrackingNumber('')
                      }}
                      disabled={submitting}
                    >
                      ← Choose Different Service
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'Submitting…' : 'Submit Booking'}
                    </button>
                  </div>
                  <FormPrivacyNote />
                </form>
              )}
            </section>
          )}

          {step === 'service' && !submitted && submitting ? (
            <p className="book-submitting">Submitting your booking…</p>
          ) : null}

          {/* Confirmation */}
          {submitted && (
            <section className="book-step book-success">
              <span className="success-icon">✅</span>
              <h2>Repair Request <span className="accent">Submitted!</span></h2>
              <p>
                Thank you, {name}! Our technician will get in touch with you shortly.
              </p>

              <div className="success-reference">
                <span className="success-reference-label">Your reference number</span>
                <span className="success-reference-value">{reference}</span>
              </div>

              {submitError && (
                <p className="success-error">
                  {submitError} Please quote your reference number when you contact us.
                </p>
              )}

              <div className="success-summary">
                <div className="success-row">
                  <strong>Device:</strong>
                  <span>{selectedCategory?.label} · {selectedBrand?.label} · {selectedModel}</span>
                </div>
                <div className="success-row">
                  <strong>Issue:</strong>
                  <span>{selectedIssue?.label}</span>
                </div>
                <div className="success-row">
                  <strong>Next step:</strong>
                  <span>Our technician will get in touch with you</span>
                </div>
                <div className="success-row">
                  <strong>Service:</strong>
                  <span>
                    {serviceType === 'drop-off' && 'Drop Off at Store'}
                    {serviceType === 'collection' && 'Collection & Return'}
                    {serviceType === 'mail-in' && 'Mail-In Repair'}
                  </span>
                </div>
                {serviceType === 'collection' && (
                  <div className="success-row">
                    <strong>Collection:</strong>
                    <span>{address}, {postcode}</span>
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
                  <span>{email} / {phone}</span>
                </div>
              </div>

              <div className="success-actions">
                <Link to="/" className="btn btn-primary">Back to Home</Link>
                <a href={`${site.phoneHref}`} className="btn btn-secondary">
                  Call Us Now
                </a>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
