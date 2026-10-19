import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { site } from '@/data/content'
import { deviceCategories, type DeviceCategory, type Brand } from '@/data/booking'
import { type RepairIssue } from '@/data/repairIssues'
import {
  bookingIssues,
  bookingSelectionFromQuery,
  displayIssueLabel,
  isIssuableModel,
  issuePriceShown,
  issueSlug,
} from '@/data/issueCatalog'
import { slugify } from '@/lib/slugify'
import { usePageSeo } from '@/hooks/usePageSeo'
import { bookRepairSeo } from '@/data/seo'
import RepairBookingForm from '@/components/RepairBookingForm'
import './BookRepair.css'

type Step = 'device' | 'brand' | 'model' | 'issue' | 'book'

const FLOW: { key: Step; num: number; label: string }[] = [
  { key: 'model', num: 1, label: 'Model' },
  { key: 'issue', num: 2, label: 'Issue' },
  { key: 'book', num: 3, label: 'Book' },
]

function repairBookPath(categoryId: string, brandId: string, model: string, issueLabel: string) {
  return `/repair/${categoryId}/${brandId}/${slugify(model)}/${issueSlug(issueLabel)}#book`
}

export default function BookRepair() {
  usePageSeo(bookRepairSeo)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const seed = bookingSelectionFromQuery(searchParams)

  const [step, setStep] = useState<Step>(seed.step)
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | null>(seed.category)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(seed.brand)
  const [selectedModel, setSelectedModel] = useState<string | null>(seed.model)
  const [selectedIssue, setSelectedIssue] = useState<RepairIssue | null>(seed.issue)

  useEffect(() => {
    const next = bookingSelectionFromQuery(searchParams)
    if (
      next.step === 'book' &&
      next.category &&
      next.brand &&
      next.model &&
      next.issue &&
      isIssuableModel(next.model)
    ) {
      navigate(
        repairBookPath(next.category.id, next.brand.id, next.model, next.issue.label),
        { replace: true },
      )
      return
    }
    setSelectedCategory(next.category)
    setSelectedBrand(next.brand)
    setSelectedModel(next.model)
    setSelectedIssue(next.issue)
    setStep(next.step)
  }, [searchParams, navigate])

  useEffect(() => {
    document.querySelector('.book-main')?.scrollIntoView({ block: 'start' })
  }, [location.hash, step])

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
    setSearchParams(
      withEntry({
        category: selectedCategory.id,
        brand: selectedBrand.id,
        model: slugify(model),
      }),
    )
  }

  function handleIssueSelect(issue: RepairIssue) {
    if (!selectedCategory || !selectedBrand || !selectedModel) return
    if (!isIssuableModel(selectedModel)) {
      setSearchParams(
        withEntry({
          category: selectedCategory.id,
          brand: selectedBrand.id,
          model: slugify(selectedModel),
          issue: issueSlug(issue.label),
        }),
      )
      return
    }
    setSelectedIssue(issue)
    navigate(repairBookPath(selectedCategory.id, selectedBrand.id, selectedModel, issue.label))
  }

  function handleBack() {
    const next = new URLSearchParams(searchParams)
    if (step === 'book') {
      next.delete('issue')
      setSearchParams(next, { replace: true })
      return
    }
    if (step === 'issue') {
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

  const issues =
    selectedCategory && selectedModel
      ? bookingIssues(selectedCategory.id, selectedBrand?.id, selectedModel)
      : []

  const flowIndex = FLOW.findIndex((item) => item.key === step)
  const showFlow = flowIndex >= 0
  const genericBooking = Boolean(selectedModel && !isIssuableModel(selectedModel))

  return (
    <div className="book-page site-page">
      <div className="book-hero site-hero-bg">
        <div className="container">
          <h1>
            <span className="accent">Book</span> Your Repair
          </h1>
          <p>Select your device, the model, and the repair. Each repair opens its own booking page.</p>
        </div>
      </div>

      <main className="book-main">
        <div className="container">
          {showFlow && (
            <div className="book-progress" aria-label="Booking steps">
              {FLOW.filter((item) => item.key !== 'book' || genericBooking).map((item, index, list) => (
                <div key={item.key} className="book-progress-item">
                  <div className={`progress-step ${flowIndex >= FLOW.indexOf(item) ? 'active' : ''}`}>
                    <span className="progress-num">{item.num}</span>
                    <span className="progress-label">{item.label}</span>
                  </div>
                  {index < list.length - 1 && <div className="progress-line" />}
                </div>
              ))}
            </div>
          )}

          {step !== 'device' && (
            <button className="book-back-btn" onClick={handleBack} type="button">
              ← Back
            </button>
          )}

          {step === 'device' && (
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

          {step === 'brand' && selectedCategory && (
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

          {step === 'model' && selectedBrand && (
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

          {step === 'issue' && (
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
                    Prices are the workshop list for this model. Each repair includes a 1-year
                    warranty. Liquid damage is excluded.
                    {genericBooking
                      ? ' Choosing a repair opens the booking form on this page.'
                      : " Choosing a repair opens that repair's booking page."}
                  </p>
                  <div className="book-issue-grid">
                    {issues.map((issue) => {
                      const selected = selectedIssue?.label === issue.label
                      return (
                        <button
                          key={issue.label}
                          type="button"
                          className={`book-card book-issue-card${selected ? ' is-selected' : ''}`}
                          aria-pressed={selected}
                          onClick={() => handleIssueSelect(issue)}
                        >
                          <span className="book-card-icon" aria-hidden="true">
                            🔧
                          </span>
                          <h3>{displayIssueLabel(issue.label)}</h3>
                          <p className="issue-time">Workshop time {issue.time}</p>
                          <p className="issue-price">{issuePriceShown(issue)}</p>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </section>
          )}

          {step === 'book' &&
            selectedCategory &&
            selectedBrand &&
            selectedModel &&
            selectedIssue &&
            selectedIssue.price != null && (
              <section className="book-step">
                <h2>
                  Book this <span className="accent">repair</span>
                </h2>
                <div className="book-summary-bar">
                  <span className="chip">{selectedBrand.label}</span>
                  <span className="chip chip-accent">{selectedModel}</span>
                  <span className="chip">{displayIssueLabel(selectedIssue.label)}</span>
                </div>
                <RepairBookingForm
                  categoryLabel={selectedCategory.label}
                  brandLabel={selectedBrand.label}
                  model={selectedModel}
                  issueLabel={selectedIssue.label}
                  price={selectedIssue.price}
                  priceText={selectedIssue.priceText}
                />
              </section>
            )}
        </div>
      </main>
    </div>
  )
}
