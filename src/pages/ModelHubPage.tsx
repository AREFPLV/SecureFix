import { Link } from 'react-router-dom'
import { deviceCategories } from '@/data/booking'
import { site } from '@/data/content'
import {
  CANONICAL_ORIGIN,
  categoryHubLabel,
  categoryHubPath,
  displayIssueLabel,
  isIssuableModel,
  issueSlug,
  pricedIssues,
  SHOP_ADDRESS,
} from '@/data/issueCatalog'
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

export default function ModelHubPage({ page, categoryId, brandId, model, brandLabel }: Props) {
  const issuable = isIssuableModel(model)
  const issues = issuable ? pricedIssues(categoryId) : []
  const modelPath = page.path
  const brandPath = `/repair/${categoryId}/${brandId}`
  const catPath = categoryHubPath(categoryId)
  const categoryLabel = deviceCategories.find((item) => item.id === categoryId)?.label ?? 'Repair'

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
                {model} repairs at {SHOP_ADDRESS}. Choose a priced fault below.
              </p>
              <ul className="issue-offer-list">
                {issues.map((issue) => (
                  <li key={issue.label}>
                    <Link to={`${modelPath}/${issueSlug(issue.label)}`}>
                      <span>{displayIssueLabel(issue.label)}</span>
                      <span>from £{issue.price!.toFixed(2)}</span>
                      <span>{issue.time}</span>
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
