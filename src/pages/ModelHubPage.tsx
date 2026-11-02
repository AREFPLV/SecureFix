import { Link } from 'react-router-dom'
import { deviceCategories } from '@/data/booking'
import { site } from '@/data/content'
import {
  CANONICAL_ORIGIN,
  categoryHubLabel,
  categoryHubPath,
  bookingIssues,
  displayIssueLabel,
  isIssuableModel,
  issuePriceShown,
  issueSlug,
  SHOP_ADDRESS,
  smartphonePickerIssues,
} from '@/data/issueCatalog'
import { getBatteryGradeOptions, getPremiumBatteryOption } from '@/data/batteryGrades'
import { getPremiumScreenOption, getScreenGradeOptions } from '@/data/screenGrades'
import type { SeoPageEntry } from '@/data/seoCatalog'
import { usePageSeo } from '@/hooks/usePageSeo'
import { localBusinessJsonLd } from '@/data/seo'
import './ServiceLanding.css'

type Props = {
  page: SeoPageEntry
  categoryId: string
  brandId: string
  model: string
  brandLabel: string
}

type HubOffer = {
  key: string
  label: string
  path: string
  priceText: string
  time: string
}

function smartphoneHubOffers(
  brandId: string,
  model: string,
  modelPath: string,
): HubOffer[] {
  const picker = smartphonePickerIssues(brandId, model)
  const isApple = brandId === 'apple-phone'
  const offers: HubOffer[] = []

  for (const item of picker) {
    if (item.cardTitle === 'Front Screen' && typeof item.price === 'number') {
      const grades = isApple ? getScreenGradeOptions(item) : getPremiumScreenOption(item)
      for (const grade of grades) {
        offers.push({
          key: grade.label,
          label: `${item.cardTitle} · ${grade.title}`,
          path: `${modelPath}/${issueSlug(grade.label)}`,
          priceText: issuePriceShown(grade),
          time: item.time,
        })
      }
      continue
    }
    if (item.cardTitle === 'Battery Replacement' && typeof item.price === 'number') {
      const grades = isApple ? getBatteryGradeOptions(item) : getPremiumBatteryOption(item)
      for (const grade of grades) {
        offers.push({
          key: grade.label,
          label: `${item.cardTitle} · ${grade.title}`,
          path: `${modelPath}/${issueSlug(grade.label)}`,
          priceText: issuePriceShown(grade),
          time: item.time,
        })
      }
      continue
    }
    offers.push({
      key: item.label,
      label: item.cardTitle,
      path: `${modelPath}/${issueSlug(item.label)}`,
      priceText: issuePriceShown(item),
      time: item.time,
    })
  }

  return offers
}

export default function ModelHubPage({ page, categoryId, brandId, model, brandLabel }: Props) {
  const issuable = isIssuableModel(model)
  const modelPath = page.path
  const brandPath = `/repair/${categoryId}/${brandId}`
  const catPath = categoryHubPath(categoryId)
  const categoryLabel = deviceCategories.find((item) => item.id === categoryId)?.label ?? 'Repair'
  const offers: HubOffer[] = !issuable
    ? []
    : categoryId === 'smartphone'
      ? smartphoneHubOffers(brandId, model, modelPath)
      : bookingIssues(categoryId, brandId, model).map((issue) => ({
          key: issue.label,
          label: displayIssueLabel(issue.label),
          path: `${modelPath}/${issueSlug(issue.label)}`,
          priceText: issuePriceShown(issue),
          time: issue.time,
        }))

  usePageSeo({
    title: page.title,
    description: page.description,
    path: page.path,
    jsonLd: [
      localBusinessJsonLd(),
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${CANONICAL_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: categoryLabel, item: `${CANONICAL_ORIGIN}${catPath}` },
          { '@type': 'ListItem', position: 3, name: brandLabel, item: `${CANONICAL_ORIGIN}${brandPath}` },
          { '@type': 'ListItem', position: 4, name: `${model} Repair`, item: `${CANONICAL_ORIGIN}${modelPath}` },
        ],
      },
    ],
  })

  return (
    <div className="service-landing-page site-page">
      <main className="service-landing-main">
        <div className="container">
          <nav className="issue-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link to={catPath}>{categoryHubLabel(categoryId)}</Link>
            <span aria-hidden="true"> / </span>
            <Link to={brandPath}>{brandLabel}</Link>
            <span aria-hidden="true"> / </span>
            <span>{model} Repair</span>
          </nav>
          <h1>{model} Repair</h1>
          {issuable ? (
            <>
              <p className="service-landing-lead">
                {model} repairs at {SHOP_ADDRESS}. Choose a fault below.
              </p>
              <ul className="issue-offer-list">
                {offers.map((offer) => (
                  <li key={offer.key}>
                    <Link to={offer.path}>
                      <span>{offer.label}</span>
                      <span>{offer.priceText}</span>
                      <span>{offer.time}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="service-landing-lead">
              Parts for the {model} are not priced yet, so fault pages are not published for this
              model. Call the shop before booking.
            </p>
          )}
          <div className="service-landing-actions">
            {issuable ? (
              <Link
                to={`/book-repair?category=${categoryId}&brand=${brandId}&model=${modelPath.split('/').pop()}`}
                className="btn btn-primary btn-shiny"
              >
                Book {model} repair
              </Link>
            ) : (
              <a href={`${site.phoneHref}`} className="btn btn-primary btn-shiny">
                Call {site.phone}
              </a>
            )}
            <Link to={brandPath} className="btn btn-secondary">
              {brandLabel} repairs
            </Link>
            <Link to={catPath} className="btn btn-secondary">
              {categoryHubLabel(categoryId)}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
