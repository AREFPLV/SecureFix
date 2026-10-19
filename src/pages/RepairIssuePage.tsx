import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '@/data/content'
import type { IssuePage } from '@/data/issueCatalog'
import RepairBookingForm from '@/components/RepairBookingForm'
import { usePageSeo } from '@/hooks/usePageSeo'
import './ServiceLanding.css'

export default function RepairIssuePage({ page }: { page: IssuePage }) {
  const location = useLocation()

  usePageSeo({
    title: page.title,
    description: page.description,
    path: page.path,
    jsonLd: page.jsonLd,
  })

  useEffect(() => {
    if (location.hash !== '#book') return
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.hash, page.path])

  return (
    <div className="service-landing-page site-page issue-page">
      <main className="service-landing-main">
        <div className="container">
          <nav className="issue-breadcrumbs" aria-label="Breadcrumb">
            {page.breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.name}-${index}`}>
                {index > 0 ? <span aria-hidden="true"> / </span> : null}
                {crumb.path ? <Link to={crumb.path}>{crumb.name}</Link> : <span>{crumb.name}</span>}
              </span>
            ))}
          </nav>
          <h1>{page.h1}</h1>
          <div className="book-summary-bar">
            <span className="chip">{page.brandLabel}</span>
            <span className="chip">{page.model}</span>
            <span className="chip chip-accent">{page.displayLabel}</span>
            <span className="chip chip-price">{page.priceText}</span>
          </div>
          <p className="service-landing-lead">{page.lead}</p>
          <p className="issue-price-line">
            {page.priceText} · {page.time}
          </p>
          <p className="service-landing-lead">{page.outlook}</p>
          <p className="service-landing-lead">{page.blurb}</p>
          <p className="service-landing-lead">Collection is available across London.</p>
          <div className="service-landing-actions">
            <a href="#book" className="btn btn-primary btn-shiny">
              Choose drop-off, collection, or mail-in
            </a>
            <a href={`${site.phoneHref}`} className="btn btn-secondary">
              Call {site.phone}
            </a>
          </div>

          <RepairBookingForm
            categoryLabel={page.categoryLabel}
            brandLabel={page.brandLabel}
            model={page.model}
            issueLabel={page.issueLabel}
            price={page.price}
            priceText={page.priceText}
          />

          <section className="service-landing-section">
            <h2>
              What&apos;s <span className="accent">included</span>
            </h2>
            <ul className="service-landing-checklist">
              {page.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="service-landing-section">
            <h2>
              Frequently asked <span className="accent">questions</span>
            </h2>
            <dl className="issue-faq">
              {page.faqs.map((faq) => (
                <div key={faq.question}>
                  <dt>{faq.question}</dt>
                  <dd>{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
          <nav className="service-landing-related" aria-label="Related repairs">
            <h2>
              Related <span className="accent">repairs</span>
            </h2>
            <div className="service-landing-related-links">
              {page.related.map((link) => (
                <Link key={link.path} to={link.path}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </main>
    </div>
  )
}
