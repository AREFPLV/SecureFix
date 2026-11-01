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
  issueBlurb,
  issuePriceShown,
  issueSlug,
  smartphonePickerIssues,
} from '@/data/issueCatalog'
import {
  getScreenGradeOptions,
  isFrontScreenIssue,
  type ScreenGrade,
} from '@/data/screenGrades'
import {
  getBatteryGradeOptions,
  isBatteryReplacementIssue,
  type BatteryGrade,
} from '@/data/batteryGrades'
import { slugify } from '@/lib/slugify'
import { usePageSeo } from '@/hooks/usePageSeo'
import { bookRepairSeo } from '@/data/seo'
import RepairBookingForm from '@/components/RepairBookingForm'
import BookingRepairSearch from '@/components/BookingRepairSearch'
import { repairIssueIcon } from '@/components/RepairIssueIcons'
import './BookRepair.css'

type Step = 'device' | 'brand' | 'model' | 'issue' | 'book'
type SelectableIssue = RepairIssue & { cardTitle?: string }
type PartGrade = ScreenGrade | BatteryGrade

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

function isPartGradeLabel(label: string) {
  const lower = label.toLowerCase()
  return (
    lower.includes('incell') ||
    lower.includes('genuine apple screen') ||
    lower.includes('genuine apple battery') ||
    lower === 'premium battery replacement' ||
    (lower.includes('premium screen replacement') && lower.includes('oled'))
  )
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
  const [selectedIssue, setSelectedIssue] = useState<SelectableIssue | null>(seed.issue)
  const [selectedPartGrade, setSelectedPartGrade] = useState<PartGrade | null>(null)

  useEffect(() => {
    const next = bookingSelectionFromQuery(searchParams)
    if (
      next.step === 'book' &&
      next.category &&
      next.brand &&
      next.model &&
      next.issue &&
      !usesInlineBooking(next.category.id, next.model) &&
      !isPartGradeLabel(next.issue.label)
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
    setSelectedPartGrade(null)
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

  function handleIssueSelect(issue: SelectableIssue) {
    // First click selects the card and reveals the description panel below.
    setSelectedIssue(issue)
    setSelectedPartGrade(null)
    requestAnimationFrame(() => {
      document.getElementById('issue-detail')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    })
  }

  function handlePartGradeSelect(grade: PartGrade) {
    setSelectedPartGrade(grade)
  }

  function handleIssueContinue() {
    if (!selectedIssue) return
    const catId = categoryId()
    const brandId = selectedBrand?.id ?? searchParams.get('brand')
    if (!catId || !brandId || !selectedModel) return

    const needsGrade = showPartGrades && !selectedPartGrade
    if (needsGrade) return

    const bookingIssue = selectedPartGrade
      ? {
          label: selectedPartGrade.label,
          price: selectedPartGrade.price,
          priceText: selectedPartGrade.priceText,
          time: selectedIssue.time,
          cardTitle: selectedIssue.cardTitle,
        }
      : selectedIssue

    // Dedicated SEO fault pages for each repair (including screen/battery grades).
    if (usesInlineBooking(catId, selectedModel)) {
      setSearchParams(
        withEntry({
          category: catId,
          brand: brandId,
          model: slugify(selectedModel),
          issue: issueSlug(bookingIssue.label),
        }),
      )
      return
    }
    navigate(repairBookPath(catId, brandId, selectedModel, bookingIssue.label))
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

  const issues: SelectableIssue[] =
    selectedCategory && selectedModel
      ? selectedCategory.id === 'smartphone'
        ? smartphonePickerIssues(selectedBrand?.id, selectedModel)
        : bookingIssues(selectedCategory.id, selectedBrand?.id, selectedModel)
      : []

  const showScreenGrades = Boolean(
    selectedCategory?.id === 'smartphone' && selectedIssue && isFrontScreenIssue(selectedIssue),
  )
  const showBatteryGrades = Boolean(
    selectedCategory?.id === 'smartphone' &&
      selectedBrand?.id === 'apple-phone' &&
      selectedIssue &&
      isBatteryReplacementIssue(selectedIssue),
  )
  const showPartGrades = showScreenGrades || showBatteryGrades
  const partGrades: PartGrade[] = selectedIssue
    ? showScreenGrades
      ? getScreenGradeOptions(selectedIssue)
      : showBatteryGrades
        ? getBatteryGradeOptions(selectedIssue)
        : []
    : []
  const detailIssue = selectedPartGrade
    ? {
        label: selectedPartGrade.label,
        price: selectedPartGrade.price,
        priceText: selectedPartGrade.priceText,
        time: selectedIssue?.time ?? '30m',
      }
    : selectedIssue
  const partGradePrompt = showBatteryGrades
    ? 'Choose a battery below'
    : showScreenGrades
      ? 'Choose a screen below'
      : null
  const partGradeBlurb = selectedModel
    ? showBatteryGrades
      ? `Choose the ${selectedModel} battery quality that suits you. All options include fitting and a 1-year warranty (liquid damage excluded).`
      : showScreenGrades
        ? `Choose the ${selectedModel} screen quality that suits you. All options include fitting and a 1-year warranty (liquid damage excluded).`
        : null
    : null

  const flowIndex = FLOW.findIndex((item) => item.key === step)
  const showFlow = flowIndex >= 0
  const genericBooking =
    usesInlineBooking(selectedCategory?.id ?? categoryId(), selectedModel) ||
    Boolean(selectedPartGrade) ||
    (step === 'book' && selectedIssue != null && isPartGradeLabel(selectedIssue.label))

  return (
    <div className="book-page site-page">
      <div className="book-hero site-hero-bg">
        <div className="container">
          <h1>
            <span className="accent">Book</span> Your Repair
          </h1>
          <p>
            Search your device and issue, or select the type below. Matching repairs open their own
            booking page.
          </p>
        </div>
      </div>

      <main className="book-main">
        <div className="container">
          <BookingRepairSearch />

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
                    Choose a repair to see what is included. Each repair includes a 1-year warranty.
                    Liquid damage is excluded.
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
                            {repairIssueIcon(issue.cardTitle ?? issue.label)}
                          </span>
                          <h3>{issue.cardTitle ?? displayIssueLabel(issue.label)}</h3>
                        </button>
                      )
                    })}
                  </div>

                  {selectedIssue && selectedModel && detailIssue ? (
                    <div className="book-issue-detail" id="issue-detail">
                      <div className="book-issue-detail-head">
                        <h3>{selectedIssue.cardTitle ?? displayIssueLabel(selectedIssue.label)}</h3>
                        <p className="book-issue-detail-meta">
                          <span>
                            {showPartGrades && !selectedPartGrade
                              ? partGradePrompt
                              : issuePriceShown(detailIssue)}
                          </span>
                          <span>Workshop time {detailIssue.time}</span>
                        </p>
                      </div>
                      <p className="book-issue-detail-copy">
                        {partGradeBlurb ?? issueBlurb(selectedIssue.label, selectedModel)}
                      </p>

                      {showPartGrades ? (
                        <div
                          className={`book-screen-grades${partGrades.length === 2 ? ' book-screen-grades-two' : ''}`}
                          role="radiogroup"
                          aria-label={
                            showBatteryGrades ? 'Battery quality options' : 'Screen quality options'
                          }
                        >
                          {partGrades.map((grade) => {
                            const selected = selectedPartGrade?.id === grade.id
                            return (
                              <button
                                key={grade.id}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                className={`book-screen-grade${selected ? ' is-selected' : ''}`}
                                onClick={() => handlePartGradeSelect(grade)}
                              >
                                {grade.tag ? (
                                  <span className="book-screen-grade-tag">{grade.tag}</span>
                                ) : null}
                                <span className="book-screen-grade-title">{grade.title}</span>
                                <span className="book-screen-grade-price">
                                  {issuePriceShown(grade)}
                                </span>
                                <span className="book-screen-grade-copy">{grade.description}</span>
                              </button>
                            )
                          })}
                        </div>
                      ) : null}

                      <div className="book-issue-detail-actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-shiny"
                          onClick={handleIssueContinue}
                          disabled={showPartGrades && !selectedPartGrade}
                        >
                          Continue to book
                        </button>
                      </div>
                    </div>
                  ) : null}
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
