import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { site, RECYCLING_ROUTE } from '@/data/content'
import { lifecycleContent } from '@/data/lifecycle'
import { industrySolutions, industrySolutionRoute } from '@/data/industrySolutions'
import { createLifecycleQuote } from '@/actions/createLifecycleQuote'
import FormPrivacyNote from '@/components/FormPrivacyNote'
import BusinessHeroArt from '@/components/BusinessHeroArt'
import { usePageSeo } from '@/hooks/usePageSeo'
import { lifecycleSeo } from '@/data/seo'
import './Lifecycle.css'
import './IndustrySolution.css'
import './BusinessHeroLayout.css'

const emptyForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: 'Laptop sourcing',
  quantity: '',
  notes: '',
}

export default function Lifecycle() {
  usePageSeo(lifecycleSeo)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await createLifecycleQuote(form)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error || 'Something went wrong.')
      return
    }
    setReference(result.reference)
    setForm(emptyForm)
  }

  return (
    <div className="lifecycle-page site-page">
      <section className="lifecycle-hero" aria-label="SecureFix for Business">
        <div className="lifecycle-hero-media" aria-hidden="true">
          <img
            src="/images/business-it-hero.png"
            alt=""
            className="lifecycle-hero-img"
          />
          <div className="lifecycle-hero-blur" />
          <div className="lifecycle-hero-shade" />
        </div>
        <div className="container lifecycle-hero-inner lifecycle-hero-inner-widget">
          <aside className="lifecycle-hero-widget business-hero-widget" aria-label="Business IT animation">
            <BusinessHeroArt variant="business" />
          </aside>
          <div className="lifecycle-hero-copy">
            <h1>
              {lifecycleContent.hero.title}{' '}
              <span className="accent">{lifecycleContent.hero.accent}</span>
            </h1>
            <p>{lifecycleContent.hero.subtitle}</p>
            <div className="lifecycle-hero-actions">
              <a href="#quote" className="btn btn-primary btn-shiny">
                Request a Quote
              </a>
              <a href={`${site.phoneHref}`} className="btn btn-secondary">
                Book a Consultation
              </a>
            </div>
            <div className="lifecycle-partners">
              <span className="lifecycle-partners-label">Trusted Partners</span>
              <div className="lifecycle-partners-row">
                {lifecycleContent.partners.map((partner) => (
                  <span key={partner}>{partner}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="lifecycle-main">
        <div className="container">
          <section className="lifecycle-section" aria-label="Solutions we provide">
            <h2>
              Solutions we <span className="accent">provide</span>
            </h2>
            <p className="lifecycle-solutions-intro">
              SecureFix supports different workplaces with IT sourcing, setup, repair and lifecycle
              management matched to how each sector actually works.
            </p>
            <div className="lifecycle-overview">
              {industrySolutions.map((item) => (
                <Link
                  key={item.slug}
                  to={industrySolutionRoute(item.slug)}
                  className="lifecycle-overview-card lifecycle-overview-card-link"
                >
                  <span>{item.icon}</span>
                  <h3>{item.label}</h3>
                  <p>{item.cardDescription}</p>
                  <small className="lifecycle-overview-cta">Learn more →</small>
                </Link>
              ))}
            </div>
          </section>

          <section className="lifecycle-section">
            <h2>
              What We <span className="accent">Deliver</span>
            </h2>
            <div className="lifecycle-overview">
              {lifecycleContent.overview.map((item) => (
                <Link
                  key={item.title}
                  to={item.route}
                  className="lifecycle-overview-card lifecycle-overview-card-link"
                >
                  <span>{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <small className="lifecycle-overview-cta">Learn more →</small>
                </Link>
              ))}
            </div>
          </section>

          <section className="lifecycle-section lifecycle-panel">
            <div className="lifecycle-panel-copy">
              <h2>
                Device <span className="accent">Configuration</span>
              </h2>
              <p>{lifecycleContent.configuration.text}</p>
            </div>
            <div className="lifecycle-icon-grid">
              {lifecycleContent.configuration.items.map((item) => (
                <div key={item.label} className="lifecycle-icon-item">
                  <span>{item.icon}</span>
                  <small>{item.label}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="lifecycle-section lifecycle-panel">
            <div className="lifecycle-panel-copy">
              <h2>
                Deployment <span className="accent">Services</span>
              </h2>
              <p>{lifecycleContent.deployment.text}</p>
            </div>
            <div className="lifecycle-icon-grid">
              {lifecycleContent.deployment.items.map((item) => (
                <div key={item.label} className="lifecycle-icon-item">
                  <span>{item.icon}</span>
                  <small>{item.label}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="lifecycle-section lifecycle-split">
            <div>
              <h2>
                Device Lifecycle <span className="accent">Management</span>
              </h2>
              <p className="lifecycle-lead">{lifecycleContent.lifecycle.text}</p>
              <ul className="lifecycle-checklist">
                {lifecycleContent.lifecycle.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>

            <div id="quote" className="lifecycle-quote">
              <h2>
                Request a <span className="accent">Quote</span>
              </h2>
              {reference ? (
                <div className="lifecycle-quote-success">
                  <strong>Quote request sent</strong>
                  <p>
                    Thanks. Your reference is <span>{reference}</span>. We will contact you shortly.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setReference('')}
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form className="lifecycle-quote-form" onSubmit={handleSubmit}>
                  <label>
                    Full Name
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </label>
                  <label>
                    Company Name
                    <input
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </label>
                  <label>
                    Telephone
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </label>
                  <label>
                    Service Needed
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                    >
                      <option>Laptop sourcing</option>
                      <option>Device deployment</option>
                      <option>Configuration &amp; imaging</option>
                      <option>Full lifecycle management</option>
                      <option>Mixed / other</option>
                    </select>
                  </label>
                  <label>
                    Approximate Quantity
                    <input
                      placeholder="e.g. 25 laptops"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    />
                  </label>
                  <label className="lifecycle-quote-full">
                    Additional Information
                    <textarea
                      rows={4}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </label>
                  {error && <p className="lifecycle-quote-error">{error}</p>}
                  <button type="submit" className="btn btn-primary btn-shiny" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Request a Quote'}
                  </button>
                  <FormPrivacyNote />
                </form>
              )}
            </div>
          </section>

          <section className="lifecycle-section lifecycle-why-grid">
            <div>
              <h2>
                Why Choose <span className="accent">SecureFix?</span>
              </h2>
              <ul className="lifecycle-checklist">
                {lifecycleContent.whyUs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>
                Industries We <span className="accent">Support</span>
              </h2>
              <div className="lifecycle-industries">
                {lifecycleContent.industries.map((item) => (
                  <div key={item.label} className="lifecycle-industry">
                    <span>{item.icon}</span>
                    <small>{item.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="lifecycle-section">
            <h2>
              Additional Managed <span className="accent">IT Services</span>
            </h2>
            <div className="lifecycle-additional">
              {lifecycleContent.additional.map((item) =>
                item.label === 'Secure Recycling' ? (
                  <Link key={item.label} to={RECYCLING_ROUTE} className="lifecycle-additional-item">
                    <span>{item.icon}</span>
                    <small>{item.label}</small>
                  </Link>
                ) : (
                  <div key={item.label} className="lifecycle-additional-item">
                    <span>{item.icon}</span>
                    <small>{item.label}</small>
                  </div>
                ),
              )}
            </div>
          </section>

          <section className="lifecycle-cta">
            <div>
              <span className="lifecycle-cta-icon">💻</span>
              <h2>Ready to Streamline Your Device Fleet?</h2>
              <p>Talk to SecureFix about procurement, deployment and ongoing lifecycle support.</p>
            </div>
            <div className="lifecycle-cta-actions">
              <a href="#quote" className="btn btn-primary btn-shiny">
                Request a Quote
              </a>
              <a href={`${site.phoneHref}`} className="btn btn-secondary">
                Call {site.phone}
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
