import { Link } from 'react-router-dom'
import { deviceCategories } from '@/data/booking'
import { site } from '@/data/content'
import {
  CANONICAL_ORIGIN,
  categoryHubLabel,
  categoryHubPath,
  SHOP_ADDRESS,
} from '@/data/issueCatalog'
import type { SeoPageEntry } from '@/data/seoCatalog'
import { isGenericModel, slugify } from '@/lib/slugify'
import { usePageSeo } from '@/hooks/usePageSeo'
import { localBusinessJsonLd } from '@/data/seo'
import './ServiceLanding.css'
import './BrandModelsPage.css'

type Props = {
  page: SeoPageEntry
  categoryId: string
  brandId: string
  brandLabel: string
  models: string[]
}

/** iRepairZone-style brand hub: pick your phone model, then see services. */
export default function BrandModelsPage({
  page,
  categoryId,
  brandId,
  brandLabel,
  models,
}: Props) {
  const brandPath = page.path
  const catPath = categoryHubPath(categoryId)
  const categoryLabel = deviceCategories.find((item) => item.id === categoryId)?.label ?? 'Repair'
  const listed = models.filter((model) => !isGenericModel(model))
  const other = models.find((model) => isGenericModel(model))

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
            <span>{brandLabel}</span>
          </nav>

          <h1>{brandLabel} Repair</h1>
          <p className="phone-brand-hub-lead">
            Specialists in {brandLabel} repairs at {SHOP_ADDRESS}. Select your exact model to see
            the services we provide — screen, battery, charging port, camera and more — with clear
            prices.
          </p>

          <section className="phone-services" aria-labelledby="select-model-heading">
            <div className="phone-services-intro">
              <p className="phone-services-eyebrow">Book a repair</p>
              <h2 id="select-model-heading">Select your device model</h2>
              <p className="phone-services-lead">
                Choosing a model opens the repair services and prices for that phone.
              </p>
            </div>

            <div className="phone-model-grid">
              {listed.map((model) => (
                <Link
                  key={model}
                  to={`${brandPath}/${slugify(model)}`}
                  className="phone-model-card"
                >
                  {model}
                </Link>
              ))}
              {other ? (
                <Link
                  to={`/book-repair?category=${categoryId}&brand=${brandId}&model=${slugify(other)}&entry=list`}
                  className="phone-model-card"
                >
                  {other}
                </Link>
              ) : null}
            </div>
          </section>

          <div className="service-landing-actions">
            <Link
              to={`/book-repair?category=${categoryId}&brand=${brandId}&entry=list`}
              className="btn btn-primary btn-shiny"
            >
              Book {brandLabel} repair
            </Link>
            <a href={site.phoneHref} className="btn btn-secondary">
              Call {site.phone}
            </a>
            <Link to={catPath} className="btn btn-secondary">
              {categoryHubLabel(categoryId)}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
