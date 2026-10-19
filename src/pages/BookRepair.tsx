import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { site } from '@/data/content'
import { deviceCategories, type DeviceCategory, type Brand } from '@/data/booking'
import { isLondonPostcode, type RepairIssue } from '@/data/repairIssues'
import {
  bookingIssues,
  bookingSelectionFromQuery,
  displayIssueLabel,
  isIssuableModel,
  issuePriceShown,
  issueSlug,
} from '@/data/issueCatalog'
import { slugify } from '@/lib/slugify'
import { createBooking } from '@/actions/createBooking'
import FormPrivacyNote from '@/components/FormPrivacyNote'
import { usePageSeo } from '@/hooks/usePageSeo'
import { bookRepairSeo } from '@/data/seo'
import './BookRepair.css'

type Step = 'device' | 'brand' | 'model' | 'issue' | 'book'
type ServiceType = 'mail-in' | 'drop-off' | 'collection'

const FLOW: { key: Step; num: number; label: string }[] = [
  { key: 'model', num: 1, label: 'Model' },
  { key: 'issue', num: 2, label: 'Issue' },
  { key: 'book', num: 3, label: 'Book' },
]

const SERVICE_COPY: { id: ServiceType; icon: string; title: string; text: string }[] = [
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

export default function BookRepair() {
  usePageSeo(bookRepairSeo)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
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
  const [serviceError, setServiceError] = useState('')
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

  useEffect(() => {
    document.querySelector('.book-main')?.scrollIntoView({ block: 'start' })
  }, [location.hash, step])

  const modelKey = `${searchParams.get('category')}|${searchParams.get('brand')}|${searchParams.get('model')}`
  useEffect(() => {
    setServiceType(null)
    setServiceError('')
    setPostcodeError('')
  }, [modelKey])

  function withEntry(params: Record<string, string>) {
    if (searchParams.get('entry') === 'list') params.entry = 'list'
    return params
  }

  function handleCategorySelect(cat: DeviceCategory) {
    if (cat.brands.length === 1) {
      setSearchParams({ category: cat.id, brand: cat.brands[0].id })
      return
    }
    setSearchParams({ category: cat.id })
  }

  function handleBrandSelect(brand: Brand) {
    if (!selectedCategory) return
    setSearchParams({ category: selectedCategory.id, brand: brand.id, entry: 'list' })
  }

  function handleModelSelect(model: string) {
    if (!selectedCategory || !selectedBrand) return
    if (!isIssuableModel(model)) {
      setSelectedModel(model)
      setSelectedIssue(null)
      setStep('issue')
      return
    }
    setSearchParams(
      withEntry({
        category: selectedCategory.id,
        brand: selectedBrand.id,
        model: slugify(model),
      }),
    )
  }

  function handleBack() {
    const next = new URLSearchParams(searchParams)
    if (step === 'book') {
      next.set('view', 'issue')
      setSearchParams(next, { replace: true })
      return
    }
    if (step === 'issue') {
      if (!searchParams.get('model')) {
        setSelectedModel(null)
        setSelectedIssue(null)
        setStep('model')
        return
      }
      next.delete('model')
      next.delete('issue')
      next.delete('view')
      setSearchParams(next, { replace: true })
      return
    }
    if (step === 'model') {
      if (next.get('entry') === 'list') {
        next.delete('brand')
        next.delete('model')
        next.delete('issue')
        next.delete('view')
        setSearchParams(next, { replace: true })
        return
      }
      setSearchParams(new URLSearchParams(), { replace: true })
      return
    }
    if (step === 'brand') {
      setSearchParams(new URLSearchParams(), { replace: true })
    }
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

  async function submitBooking(resolvedService: ServiceType) {
    if (submitting) return
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
      setSubmitError(result.error ?? 'We could not send your booking. Call the shop to confirm.')
    }
    setSubmitting(false)
    setSubmitted(true)
  }

  const issues =
    selectedCategory && selectedModel && isIssuableModel(selectedModel)
      ? bookingIssues(selectedCategory.id, selectedBrand?.id, selectedModel)
      : []

  const flowIndex = FLOW.findIndex((item) => item.key === step)
  const showFlow = flowIndex >= 0 && !submitted

  return (
    <div className="book-page site-page">
      <div className="book-hero site-hero-bg">
        <div className="container">
          <h1>
            <span className="accent">Book</span> Your Repair
          </h1>
          <p>Select your device, the model, and the repair price, then tell us how to take the device.</p>
        </div>
      </div>

      <main className="book-main">
        <div className="container">
          {showFlow && (
            <div className="book-progress" aria-label="Booking steps">
              {FLOW.map((item, index) => (
                <div key={item.key} className="book-progress-item">
                  <div className={`progress-step ${flowIndex >= index ? 'active' : ''}`}>
                    <span className="progress-num">{item.num}</span>
                    <span className="progress-label">{item.label}</span>
                  </div>
                  {index < FLOW.length - 1 && <div className="progress-line" />}
                </div>
              ))}
            </div>
          )}

          {step !== 'device' && !submitted && (
            <button className="book-back-btn" onClick={handleBack} type="button">
              ← Back
            </button>
          )}

          {step === 'device' && !submitted && (
            <section className="book-step">
              <h2>
                Select your <span className="accent">device</span>
              </h2>
              <p className="book-price-note">
                Choose a device type to see brands, models, and repair prices.
              </p>
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

          {step === 'brand' && selectedCategory && !submitted && (
            <section className="book-step">
              <h2>
                Select the <span className="accent">{selectedCategory.label}</span> brand
              </h2>
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

          {step === 'model' && selectedBrand && !submitted && (
            <section className="book-step">
              <h2>
                Select the <span className="accent">{selectedBrand.label}</span> model
              </h2>
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

          {step === 'issue' && !submitted && (
            <section className="book-step">
              <h2>
                Select the <span className="accent">issue</span> to fix
              </h2>
              {selectedModel && (
                <div className="book-summary-bar">
                  <span className="chip">{selectedBrand?.label}</span>
                  <span className="chip chip-accent">{selectedModel}</span>
                </div>
              )}
              {issues.length === 0 ? (
                <p className="collection-note book-price-note">
                  Call the shop on <a href={site.phoneHref}>{site.phone}</a> and we will confirm the
                  price before booking the {selectedModel}.
                </p>
              ) : (
                <>
                  <p className="book-price-note">
                    Prices are the workshop list for this model. Each repair includes a 2-year
                    warranty. Liquid damage is excluded.
                  </p>
                  <div className="book-issue-list">
                    {issues.map((issue) => {
                      const selected = selectedIssue?.label === issue.label
                      return (
                        <button
                          key={issue.label}
                          type="button"
                          className={`book-issue-row${selected ? ' is-selected' : ''}`}
                          aria-pressed={selected}
                          onClick={() => setSelectedIssue(issue)}
                        >
                          <span className="book-issue-copy">
                            <strong>{displayIssueLabel(issue.label)}</strong>
                            <span className="issue-time">Workshop time {issue.time}</span>
                          </span>
                          <span className="issue-price">{issuePriceShown(issue)}</span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="book-step-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={!selectedIssue}
                      onClick={() => {
                        if (!selectedIssue || !selectedCategory || !selectedBrand || !selectedModel) return
                        setSearchParams(
                          withEntry({
                            category: selectedCategory.id,
                            brand: selectedBrand.id,
                            model: slugify(selectedModel),
                            issue: issueSlug(selectedIssue.label),
                            view: 'book',
                          }),
                        )
                      }}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </section>
          )}

          {step === 'book' && !submitted && (
            <section className="book-step">
              <h2>
                Book your <span className="accent">repair</span>
              </h2>
              <div className="book-summary-bar">
                <span className="chip">{selectedBrand?.label}</span>
                <span className="chip">{selectedModel}</span>
                {selectedIssue && (
                  <span className="chip chip-accent">
                    {displayIssueLabel(selectedIssue.label)}
                  </span>
                )}
                {selectedIssue?.price != null && (
                  <span className="chip chip-price">
                    {issuePriceShown({ price: selectedIssue.price, priceText: selectedIssue.priceText })}
                  </span>
                )}
              </div>

              <form className="book-final" onSubmit={handleBookSubmit}>
                <h3 className="book-service-heading">How should we take the device?</h3>
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
          )}

          {submitted && (
            <section className="book-step book-success">
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
                    {selectedCategory?.label} · {selectedBrand?.label} · {selectedModel}
                  </span>
                </div>
                <div className="success-row">
                  <strong>Issue:</strong>
                  <span>{selectedIssue ? displayIssueLabel(selectedIssue.label) : ''}</span>
                </div>
                {selectedIssue?.price != null && (
                  <div className="success-row">
                    <strong>Price:</strong>
                    <span>
                      {issuePriceShown({ price: selectedIssue.price, priceText: selectedIssue.priceText })}
                    </span>
                  </div>
                )}
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
          )}
        </div>
      </main>
    </div>
  )
}
