import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/data/content'
import { deviceCategories, type DeviceCategory, type Brand } from '@/data/booking'
import { isLondonPostcode } from '@/data/repairIssues'
import {
  storageOptions,
  conditionLabels,
  estimateTradeInQuote,
  howItWorks,
  tradeInCategories,
  type DeviceCondition,
} from '@/data/tradeIn'
import { createTradeIn } from '@/actions/createTradeIn'
import FormPrivacyNote from '@/components/FormPrivacyNote'
import { usePageSeo } from '@/hooks/usePageSeo'
import { tradeInSeo } from '@/data/seo'
import './TradeIn.css'

type Step = 'category' | 'brand' | 'model' | 'storage' | 'condition' | 'quote' | 'details' | 'done'
type SellMethod = 'drop-off' | 'mail-in' | 'collection'

const STEPS: { key: Step; label: string }[] = [
  { key: 'category', label: 'Category' },
  { key: 'brand', label: 'Brand' },
  { key: 'model', label: 'Model' },
  { key: 'storage', label: 'Storage' },
  { key: 'condition', label: 'Condition' },
  { key: 'quote', label: 'Next' },
  { key: 'details', label: 'Details' },
]

const defaultCondition: DeviceCondition = {
  powersOn: true,
  screen: 'flawless',
  body: 'flawless',
  fullyWorking: true,
  icloudLocked: false,
}

export default function TradeIn() {
  usePageSeo(tradeInSeo)
  const [step, setStep] = useState<Step>('category')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<DeviceCategory | null>(null)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [model, setModel] = useState<string | null>(null)
  const [storage, setStorage] = useState<string | null>(null)
  const [condition, setCondition] = useState<DeviceCondition>(defaultCondition)
  const [sellMethod, setSellMethod] = useState<SellMethod | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [postcode, setPostcode] = useState('')
  const [address, setAddress] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [postcodeError, setPostcodeError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reference, setReference] = useState('')
  const [submitError, setSubmitError] = useState('')

  const categories = deviceCategories.filter((c) =>
    tradeInCategories.includes(c.id as (typeof tradeInCategories)[number]),
  )

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories
    const q = search.toLowerCase()
    return categories.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.brands.some((b) =>
          b.models.some((m) => m.toLowerCase().includes(q) || b.label.toLowerCase().includes(q)),
        ),
    )
  }, [search, categories])

  const filteredModels = useMemo(() => {
    if (!brand) return []
    if (!search.trim()) return brand.models
    const q = search.toLowerCase()
    return brand.models.filter((m) => m.toLowerCase().includes(q))
  }, [brand, search])

  const quote =
    category && model ? estimateTradeInQuote(category.id, model, condition) : 0

  const needsStorage = category?.id === 'smartphone' || category?.id === 'tablet-ipad'
  const stepIndex = STEPS.findIndex((s) => s.key === step)

  function goBack() {
    const flow: Step[] = needsStorage
      ? ['category', 'brand', 'model', 'storage', 'condition', 'quote', 'details']
      : ['category', 'brand', 'model', 'condition', 'quote', 'details']
    const idx = flow.indexOf(step)
    if (idx > 0) {
      if (step === 'details' && sellMethod === 'collection') setSellMethod(null)
      setStep(flow[idx - 1])
    }
  }

  function afterModel(m: string) {
    setModel(m)
    setStep(needsStorage ? 'storage' : 'condition')
  }

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (sellMethod === 'collection' && !isLondonPostcode(postcode)) {
      setPostcodeError('Sorry, collection is only available within the London area.')
      return
    }
    if (submitting || !sellMethod || !category || !brand || !model) return

    setPostcodeError('')
    setSubmitError('')
    setSubmitting(true)

    const result = await createTradeIn({
      category: category.label,
      categoryId: category.id,
      brand: brand.label,
      model,
      storage: storage ?? undefined,
      quote,
      condition,
      sellMethod,
      name,
      email,
      phone,
      postcode: sellMethod === 'collection' ? postcode : undefined,
      address: sellMethod === 'collection' ? address : undefined,
      trackingNumber: sellMethod === 'mail-in' ? trackingNumber : undefined,
    })

    setReference(result.reference)
    if (!result.ok) {
      setSubmitError(result.error ?? 'We could not send your request. Please call us to confirm.')
    }
    setSubmitting(false)
    setStep('done')
  }

  return (
    <div className="trade-page site-page">
      <div className="trade-hero site-hero-bg">
        <div className="container">
          <h1>
            Sell Your <span className="accent">Device</span>
          </h1>
          <p>Sell phones, tablets, laptops, consoles &amp; more. Our technician will get in touch with you.</p>
        </div>
      </div>

      <div className="trade-how">
        <div className="container trade-how-grid">
          {howItWorks.map((item) => (
            <div key={item.step} className="trade-how-item">
              <span className="trade-how-num">{item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="trade-main">
        <div className="container">
          {step !== 'done' && (
            <>
              <div className="trade-search-wrap">
                <input
                  type="search"
                  className="trade-search"
                  placeholder="Search for your device..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {stepIndex >= 0 && step !== 'category' && (
                <div className="trade-progress">
                  {STEPS.filter((s) => s.key !== 'storage' || needsStorage).map((s, i) => (
                    <div
                      key={s.key}
                      className={`trade-progress-step ${stepIndex >= i ? 'active' : ''}`}
                    >
                      <span>{i + 1}</span>
                      <small>{s.label}</small>
                    </div>
                  ))}
                </div>
              )}

              {step !== 'category' && (
                <button type="button" className="trade-back-btn" onClick={goBack}>
                  ← Back
                </button>
              )}
            </>
          )}

          {step === 'category' && (
            <section className="trade-step">
              <h2>What are you <span className="accent">selling?</span></h2>
              <div className="trade-grid">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="trade-card"
                    onClick={() => {
                      setCategory(cat)
                      setBrand(null)
                      setModel(null)
                      setStorage(null)
                      setCondition(defaultCondition)
                      setSearch('')
                      setStep('brand')
                    }}
                  >
                    <span className="trade-card-icon">{cat.icon}</span>
                    <h3>{cat.label}</h3>
                    <p>{cat.description}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 'brand' && category && (
            <section className="trade-step">
              <h2>Select <span className="accent">{category.label}</span> brand</h2>
              <div className="trade-grid trade-grid-brands">
                {category.brands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className="trade-card trade-card-compact"
                    onClick={() => {
                      setBrand(b)
                      setModel(null)
                      setStep('model')
                    }}
                  >
                    <h3>{b.label}</h3>
                    <span>{b.models.length} models</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 'model' && brand && (
            <section className="trade-step">
              <h2>Select <span className="accent">{brand.label}</span> model</h2>
              <div className="trade-grid trade-grid-models">
                {filteredModels.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="trade-card trade-card-model"
                    onClick={() => afterModel(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 'storage' && (
            <section className="trade-step">
              <h2>Select <span className="accent">storage</span> capacity</h2>
              <div className="trade-grid trade-grid-models">
                {storageOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="trade-card trade-card-model"
                    onClick={() => {
                      setStorage(s)
                      setStep('condition')
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 'condition' && (
            <section className="trade-step">
              <h2>Device <span className="accent">condition</span></h2>
              <form
                className="trade-condition-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  setStep('quote')
                }}
              >
                <fieldset className="trade-fieldset">
                  <legend>Does it power on?</legend>
                  <div className="trade-toggle-group">
                    <label className={condition.powersOn ? 'active' : ''}>
                      <input
                        type="radio"
                        checked={condition.powersOn}
                        onChange={() => setCondition({ ...condition, powersOn: true })}
                      />
                      Yes
                    </label>
                    <label className={!condition.powersOn ? 'active' : ''}>
                      <input
                        type="radio"
                        checked={!condition.powersOn}
                        onChange={() => setCondition({ ...condition, powersOn: false })}
                      />
                      No
                    </label>
                  </div>
                </fieldset>

                <fieldset className="trade-fieldset">
                  <legend>Is it fully working?</legend>
                  <div className="trade-toggle-group">
                    <label className={condition.fullyWorking ? 'active' : ''}>
                      <input
                        type="radio"
                        checked={condition.fullyWorking}
                        onChange={() => setCondition({ ...condition, fullyWorking: true })}
                      />
                      Yes
                    </label>
                    <label className={!condition.fullyWorking ? 'active' : ''}>
                      <input
                        type="radio"
                        checked={!condition.fullyWorking}
                        onChange={() => setCondition({ ...condition, fullyWorking: false })}
                      />
                      No
                    </label>
                  </div>
                </fieldset>

                {(category?.id === 'smartphone' || category?.id === 'tablet-ipad') && (
                  <fieldset className="trade-fieldset">
                    <legend>iCloud / Google account removed?</legend>
                    <div className="trade-toggle-group">
                      <label className={!condition.icloudLocked ? 'active' : ''}>
                        <input
                          type="radio"
                          checked={!condition.icloudLocked}
                          onChange={() => setCondition({ ...condition, icloudLocked: false })}
                        />
                        Yes, removed
                      </label>
                      <label className={condition.icloudLocked ? 'active warn' : ''}>
                        <input
                          type="radio"
                          checked={condition.icloudLocked}
                          onChange={() => setCondition({ ...condition, icloudLocked: true })}
                        />
                        Still locked
                      </label>
                    </div>
                  </fieldset>
                )}

                <fieldset className="trade-fieldset">
                  <legend>Screen condition</legend>
                  <div className="trade-options">
                    {(Object.keys(conditionLabels.screen) as DeviceCondition['screen'][]).map(
                      (key) => (
                        <label key={key} className={condition.screen === key ? 'active' : ''}>
                          <input
                            type="radio"
                            name="screen"
                            checked={condition.screen === key}
                            onChange={() => setCondition({ ...condition, screen: key })}
                          />
                          {conditionLabels.screen[key]}
                        </label>
                      ),
                    )}
                  </div>
                </fieldset>

                <fieldset className="trade-fieldset">
                  <legend>Body / casing condition</legend>
                  <div className="trade-options">
                    {(Object.keys(conditionLabels.body) as DeviceCondition['body'][]).map(
                      (key) => (
                        <label key={key} className={condition.body === key ? 'active' : ''}>
                          <input
                            type="radio"
                            name="body"
                            checked={condition.body === key}
                            onChange={() => setCondition({ ...condition, body: key })}
                          />
                          {conditionLabels.body[key]}
                        </label>
                      ),
                    )}
                  </div>
                </fieldset>

                <button type="submit" className="btn btn-primary btn-shiny trade-submit">
                  Continue →
                </button>
              </form>
            </section>
          )}

          {step === 'quote' && (
            <section className="trade-step trade-quote-step">
              <div className="trade-quote-box">
                <p className="trade-quote-label">Next step</p>
                <p className="trade-quote-amount trade-quote-message">
                  Our technician will get in touch with you
                </p>
                <p className="trade-quote-device">
                  {category?.label} · {brand?.label} · {model}
                  {storage ? ` · ${storage}` : ''}
                </p>
                <p className="trade-quote-note">
                  Submit your details and a SecureFix technician will contact you with your offer.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-shiny"
                  onClick={() => setStep('details')}
                >
                  Continue →
                </button>
              </div>
            </section>
          )}

          {step === 'details' && (
            <section className="trade-step">
              <h2>How would you like to <span className="accent">sell?</span></h2>

              {!sellMethod && (
                <div className="trade-sell-options">
                  <button
                    type="button"
                    className="trade-card"
                    onClick={() => setSellMethod('drop-off')}
                  >
                    <span className="trade-card-icon">🏪</span>
                    <h3>Drop Off at Store</h3>
                    <p>Visit our London store and get paid on the spot</p>
                  </button>
                  <button
                    type="button"
                    className="trade-card"
                    onClick={() => setSellMethod('collection')}
                  >
                    <span className="trade-card-icon">🚚</span>
                    <h3>Collection</h3>
                    <p>We collect from your London address</p>
                  </button>
                  <button
                    type="button"
                    className="trade-card"
                    onClick={() => setSellMethod('mail-in')}
                  >
                    <span className="trade-card-icon">📦</span>
                    <h3>Mail-In</h3>
                    <p>Post your device to us securely</p>
                  </button>
                </div>
              )}

              {sellMethod && (
                <form className="trade-details-form" onSubmit={handleDetailsSubmit}>
                  <div className="trade-quote-summary">
                    Our technician will get in touch with you
                  </div>
                  <div className="form-row">
                    <label>
                      Full Name
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </label>
                    <label>
                      Phone
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Your phone number"
                      />
                    </label>
                  </div>
                  <label>
                    Email
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                    />
                  </label>
                  {sellMethod === 'collection' && (
                    <>
                      <label>
                        Postcode
                        <input
                          type="text"
                          required
                          value={postcode}
                          onChange={(e) => {
                            setPostcode(e.target.value)
                            setPostcodeError('')
                          }}
                          placeholder="e.g. SW1A 1AA"
                        />
                      </label>
                      {postcodeError && <p className="trade-error">{postcodeError}</p>}
                      <label>
                        Full Address
                        <textarea
                          rows={3}
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="House number, street, city..."
                        />
                      </label>
                    </>
                  )}
                  {sellMethod === 'mail-in' && (
                    <>
                      <div className="trade-mail-address">
                        <strong>Mail your device to</strong>
                        <p>{site.location}</p>
                      </div>
                      <label>
                        Tracking Number (optional)
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="e.g. Royal Mail / courier tracking number"
                        />
                      </label>
                    </>
                  )}
                  <div className="trade-form-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSellMethod(null)}
                    >
                      ← Change method
                    </button>
                    <button type="submit" className="btn btn-primary btn-shiny" disabled={submitting}>
                      {submitting ? 'Submitting…' : 'Submit Trade-In'}
                    </button>
                    <FormPrivacyNote />
                  </div>
                </form>
              )}
            </section>
          )}

          {step === 'done' && (
            <section className="trade-step trade-done">
              <span className="trade-done-icon">✅</span>
              <h2>Trade-In <span className="accent">Submitted!</span></h2>
              <p>
                Thanks {name}! Our technician will get in touch with you shortly.
              </p>

              <div className="trade-reference">
                <span className="trade-reference-label">Your reference number</span>
                <span className="trade-reference-value">{reference}</span>
              </div>

              {submitError && (
                <p className="trade-submit-error">
                  {submitError} Please quote your reference number when you contact us.
                </p>
              )}

              <div className="trade-done-summary">
                <p><strong>Device:</strong> {category?.label} · {brand?.label} · {model}</p>
                <p><strong>Method:</strong> {sellMethod?.replace('-', ' ')}</p>
                <p><strong>Contact:</strong> {email} / {phone}</p>
              </div>
              <div className="trade-done-actions">
                <Link to="/" className="btn btn-primary btn-shiny">Back to Home</Link>
                <a href={`${site.phoneHref}`} className="btn btn-secondary btn-shiny">
                  Call Us
                </a>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
