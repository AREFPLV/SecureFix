import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { site, RECYCLING_ROUTE } from '@/data/content'
import { lifecycleContent } from '@/data/lifecycle'
import { industrySolutions, industrySolutionRoute } from '@/data/industrySolutions'
import { businessHubSeo } from '@/data/businessSeoExtras'
import { createLifecycleQuote } from '@/actions/createLifecycleQuote'
import FormPrivacyNote from '@/components/FormPrivacyNote'
import BusinessHeroPromo from '@/components/BusinessHeroPromo'
import { usePageSeo } from '@/hooks/usePageSeo'
import { lifecycleSeo, localBusinessJsonLd } from '@/data/seo'
import './Lifecycle.css'
import './IndustrySolution.css'
import './BusinessItHero.css'
import '@/components/Hero.css'

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
  usePageSeo({
    ...lifecycleSeo,
    description: businessHubSeo.executiveSummary,
    jsonLd: [
      localBusinessJsonLd(),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'SecureFix for Business',
        serviceType: 'Business IT lifecycle',
        description: businessHubSeo.executiveSummary,
        provider: {
          '@type': 'LocalBusiness',
          name: site.name,
          url: `https://${site.website}`,
        },
        areaServed: 'London',
        url: `https://${site.website}${lifecycleSeo.path}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: businessHubSeo.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  })
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
      <section className="hero page-hero" aria-label="SecureFix for Business">
        <div className="hero-bg" />
        <div className="container hero-layout">
          <div className="hero-content">
            <p className="hero-eyebrow">Business IT · London EC1V</p>
            <h1>
              <span className="hero-line">{lifecycleContent.hero.title}</span>
              <span className="hero-line accent">{lifecycleContent.hero.accent}</span>
            </h1>
            <p className="hero-subtitle">{lifecycleContent.hero.subtitle}</p>
            <div className="hero-actions">
              <a href="#quote" className="btn btn-primary btn-shiny">
                Request a Quote
              </a>
              <a href={`${site.phoneHref}`} className="btn btn-secondary btn-shiny">
                Book a Consultation
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>Buy · Deploy</strong>
                <span>Source to desk-ready</span>
              </div>
              <div className="hero-stat">
                <strong>Fix · Recycle</strong>
                <span>Support to secure wipe</span>
              </div>
            </div>
            <div className="business-it-hero-partners" aria-label="Trusted partners">
              {lifecycleContent.partners.map((partner) => (
                <span key={partner}>{partner}</span>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <BusinessHeroPromo
              variant="business"
              label="SecureFix Business IT"
              slides={[
                {
                  tag: 'Business IT',
                  title: 'Source To Support',
                  subtitle: 'One partner for the full device lifecycle',
                },
                {
                  tag: 'London Based',
                  title: 'Workshop Speed',
                  subtitle: 'Configure, deploy and repair from EC1V',
                },
                {
                  tag: 'Trusted Brands',
                  title: 'Dell · HP · Lenovo · Apple',
                  subtitle: 'Role-based fleets for growing teams',
                },
              ]}
            />
          </div>
        </div>
      </section>

      <main className="lifecycle-main">
        <div className="container">
          <section className="lifecycle-section business-seo-block" aria-label="Executive summary">
            <h2>
              Executive <span className="accent">summary</span>
            </h2>
            <p className="lifecycle-lead">{businessHubSeo.executiveSummary}</p>
            <div className="business-seo-grid">
              {businessHubSeo.ceoOutcomes.map((item) => (
                <article key={item.title} className="business-seo-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

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

          <section className="lifecycle-section business-seo-block" aria-label="Frequently asked questions">
            <h2>
              Frequently asked <span className="accent">questions</span>
            </h2>
            <div className="business-faq-list">
              {businessHubSeo.faqs.map((faq) => (
                <article key={faq.question} className="business-faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
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
