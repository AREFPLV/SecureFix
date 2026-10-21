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

function usesInlineBooking(categoryId: string | null | undefined, model: string | null) {
  if (!model) return false
  // Other Devices has quote-only jobs and no crawlable repair pages for most models.
  if (categoryId === 'other') return true
  return !isIssuableModel(model)
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
      !usesInlineBooking(next.category.id, next.model)
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

  function categoryId() {
    return selectedCategory?.id ?? searchParams.get('category')
  }

  function handleCategorySelect(cat: DeviceCategory) {
    if (cat.brands.length === 1) {
      const brand = cat.brands[0]
      if (brand.models.length === 1) {
        setSearchParams({
          category: cat.id,
          brand: brand.id,
          model: slugify(brand.models[0]),
        })
        return
      }
      setSearchParams({ category: cat.id, brand: brand.id })
      return
    }
    setSearchParams({ category: cat.id })
  }

  function handleBrandSelect(brand: Brand) {
    const catId = categoryId()
    if (!catId) return
    if (brand.models.length === 1) {
      setSearchParams({
        category: catId,
        brand: brand.id,
        model: slugify(brand.models[0]),
        entry: 'list',
      })
      return
    }
    setSearchParams({ category: catId, brand: brand.id, entry: 'list' })
  }

  function handleModelSelect(model: string) {
    const catId = categoryId()
    const brandId = selectedBrand?.id ?? searchParams.get('brand')
    if (!catId || !brandId) return
    setSearchParams(
      withEntry({
        category: catId,
        brand: brandId,
        model: slugify(model),
      }),
    )
  }

  function handleIssueSelect(issue: RepairIssue) {
    const catId = categoryId()
    const brandId = selectedBrand?.id ?? searchParams.get('brand')
    if (!catId || !brandId || !selectedModel) return
    if (usesInlineBooking(catId, selectedModel)) {
      setSearchParams(
        withEntry({
          category: catId,
          brand: brandId,
          model: slugify(selectedModel),
          issue: issueSlug(issue.label),
        }),
      )
      return
    }
    setSelectedIssue(issue)
    navigate(repairBookPath(catId, brandId, selectedModel, issue.label))
  }

  function handleBack() {
    const next = new URLSearchParams(searchParams)
    if (step === 'book') {
      next.delete('issue')
      setSearchParams(next, { replace: true })
      return
    }
    if (step === 'issue') {
      const brandId = next.get('brand')
      const cat = deviceCategories.find((item) => item.id === next.get('category'))
      const brand = cat?.brands.find((item) => item.id === brandId)
      next.delete('model')
      next.delete('issue')
      next.delete('view')
      // Single-model brands (e.g. Other Brand) skip the model step on the way forward,
      // so back from issues should return to the brand list.
      if (brand && brand.models.length === 1) {
        next.delete('brand')
      }
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
  const genericBooking = usesInlineBooking(selectedCategory?.id ?? categoryId(), selectedModel)

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
            selectedIssue && (
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
                  priceText={
                    selectedIssue.priceText ??
                    (selectedIssue.price == null ? 'Quote on inspection' : undefined)
                  }
                />
              </section>
            )}
        </div>
      </main>
    </div>
  )
}
