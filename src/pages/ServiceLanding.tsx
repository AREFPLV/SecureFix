import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { site, BOOKING_ROUTE, CALL_OUT_ROUTE } from '@/data/content'
import { deviceCategories } from '@/data/booking'
import { localCoverage } from '@/data/localCoverage'
import {
  getServiceLanding,
  serviceLandingLinks,
  type ServiceLandingPage,
} from '@/data/serviceLandings'
import { usePageSeo } from '@/hooks/usePageSeo'
import './ServiceLanding.css'

const CATEGORY_BY_SLUG: Record<ServiceLandingPage['slug'], string> = {
  'phone-repair': 'smartphone',
  'computer-repair': 'pc-laptop',
  'console-repair': 'gaming-console',
}

export function PhoneRepairPage() {
  return <ServiceLandingView slug="phone-repair" />
}

export function ComputerRepairPage() {
  return <ServiceLandingView slug="computer-repair" />
}

export function ConsoleRepairPage() {
  return <ServiceLandingView slug="console-repair" />
}

function ServiceLandingView({ slug }: { slug: ServiceLandingPage['slug'] }) {
  const page = getServiceLanding(slug)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const category = deviceCategories.find((c) => c.id === CATEGORY_BY_SLUG[slug])
  const brandLinks =
    category?.brands
      .filter((b) => !b.id.startsWith('other') && !b.label.toLowerCase().includes('other'))
      .map((b) => ({
        label: `${b.label} Repair`,
        path: `/repair/${category.id}/${b.id}`,
      })) ?? []

  usePageSeo(
    page?.seo ?? {
      title: 'SecureFix',
      description: 'SecureFix London device repair',
      path: '/',
    },
  )

  if (!page) return <Navigate to="/" replace />

  return (
    <div className="service-landing-page site-page">
      <section className="service-landing-hero site-hero-bg">
        <div className="container service-landing-hero-inner">
          <p className="service-landing-eyebrow">
            {page.icon} {page.heroEyebrow}
          </p>
          <h1>
            {page.heroTitle}{' '}
            <span className="accent">{page.heroAccent}</span>
          </h1>
          <p>{page.heroSubtitle}</p>
          <div className="service-landing-actions">
            <Link to={BOOKING_ROUTE} className="btn btn-primary btn-shiny">
              Book This Repair
            </Link>
            <a href={`${site.phoneHref}`} className="btn btn-secondary">
              Call {site.phone}
            </a>
          </div>
          <p className="service-landing-address">{localCoverage.addressLine}</p>
        </div>
      </section>

      <main className="service-landing-main">
        <div className="container">
          <section className="service-landing-section">
            <h2>
              Local <span className="accent">Repair Experts</span>
            </h2>
            {page.intro.map((para) => (
              <p key={para.slice(0, 48)} className="service-landing-lead">
                {para}
              </p>
            ))}
          </section>

          <section className="service-landing-section">
            <h2>
              What We <span className="accent">Fix</span>
            </h2>
            <div className="service-landing-grid">
              {page.services.map((item) => (
                <article key={item.title} className="service-landing-card">
                  <span>{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="service-landing-section service-landing-split">
            <div>
              <h2>
                Why Choose <span className="accent">SecureFix</span>
              </h2>
              <ul className="service-landing-checklist">
                {page.whyUs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>
                Areas We <span className="accent">Serve</span>
              </h2>
              <p className="service-landing-lead">
                Visit us at <strong>{localCoverage.addressLine}</strong> or book collection nearby.
              </p>
              <div className="service-landing-tags">
                {localCoverage.neighborhoods.map((place) => (
                  <span key={place}>{place}</span>
                ))}
              </div>
              <div className="service-landing-tags service-landing-tags-muted">
                {localCoverage.postcodes.map((code) => (
                  <span key={code}>{code}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="service-landing-section">
            <h2>
              Frequently Asked <span className="accent">Questions</span>
            </h2>
            <div className="service-landing-faq">
              {page.faqs.map((faq, index) => (
                <article key={faq.question} className="service-landing-faq-item">
                  <button
                    type="button"
                    className="service-landing-faq-q"
                    aria-expanded={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    {faq.question}
                    <span>{openFaq === index ? '−' : '+'}</span>
                  </button>
                  {openFaq === index ? <p className="service-landing-faq-a">{faq.answer}</p> : null}
                </article>
              ))}
            </div>
          </section>

          <section className="service-landing-cta">
            <div>
              <h2>{page.ctaTitle}</h2>
              <p>{page.ctaText}</p>
            </div>
            <div className="service-landing-cta-actions">
              <Link to={BOOKING_ROUTE} className="btn btn-primary btn-shiny">
                Book Repair
              </Link>
              <Link to={CALL_OUT_ROUTE} className="btn btn-secondary">
                Book Call-Out
              </Link>
            </div>
          </section>

          {brandLinks.length > 0 ? (
            <nav className="service-landing-related" aria-label="Repair by brand">
              <h2>
                Repair by <span className="accent">Brand</span>
              </h2>
              <div className="service-landing-related-links">
                {brandLinks.map((link) => (
                  <Link key={link.path} to={link.path}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          ) : null}

          <nav className="service-landing-related" aria-label="Related services">
            <h2>
              More <span className="accent">Services</span>
            </h2>
            <div className="service-landing-related-links">
              {serviceLandingLinks
                .filter((link) => link.route !== page.path)
                .map((link) => (
                  <Link key={link.route} to={link.route}>
                    {link.label}
                  </Link>
                ))}
              <Link to="/sitemap">Full sitemap</Link>
            </div>
          </nav>
        </div>
      </main>
    </div>
  )
}
