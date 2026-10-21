import { useState } from 'react'
import type { FormEvent } from 'react'
import { site } from '@/data/content'
import { protectContent } from '@/data/protect'
import { createProtectConsultation } from '@/actions/createProtectConsultation'
import FormPrivacyNote from '@/components/FormPrivacyNote'
import { usePageSeo } from '@/hooks/usePageSeo'
import { protectSeo } from '@/data/seo'
import './Lifecycle.css'

const emptyForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  employees: '',
  interest: '24/7 cybersecurity package',
  notes: '',
}

export default function Protect() {
  usePageSeo(protectSeo)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await createProtectConsultation(form)
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
      <section className="lifecycle-hero" aria-label="SecureFix Protect">
        <div className="lifecycle-hero-media" aria-hidden="true">
          <img
            src="/images/protect-cybersecurity-hero.jpg"
            alt=""
            className="lifecycle-hero-img"
          />
          <div className="lifecycle-hero-blur" />
          <div className="lifecycle-hero-shade" />
        </div>
        <div className="container lifecycle-hero-inner">
          <div className="lifecycle-hero-copy">
            <h1>
              {protectContent.hero.title}{' '}
              <span className="accent">{protectContent.hero.accent}</span>
            </h1>
            <p>{protectContent.hero.subtitle}</p>
            <div className="lifecycle-hero-actions">
              <a href="#consultation" className="btn btn-primary btn-shiny">
                Book a Consultation
              </a>
              <a href={`${site.phoneHref}`} className="btn btn-secondary">
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="lifecycle-main">
        <div className="container">
          <section className="lifecycle-section" aria-label="Why businesses need Protect">
            <h2>
              {protectContent.whyBusiness.title}{' '}
              <span className="accent">{protectContent.whyBusiness.accent}</span>
            </h2>
            <p className="lifecycle-solutions-intro">{protectContent.whyBusiness.intro}</p>
            <div className="lifecycle-overview">
              {protectContent.whyBusiness.points.map((item) => (
                <article key={item.title} className="lifecycle-overview-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="lifecycle-section" aria-label="Cybersecurity services">
            <h2>
              What Protect <span className="accent">covers</span>
            </h2>
            <div className="lifecycle-overview">
              {protectContent.services.map((item) => (
                <article key={item.title} className="lifecycle-overview-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="lifecycle-section lifecycle-why-grid">
            <div>
              <h2>
                Included in your <span className="accent">plan</span>
              </h2>
              <ul className="lifecycle-checklist">
                {protectContent.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>
                Talk to <span className="accent">SecureFix</span>
              </h2>
              <p className="lifecycle-solutions-intro">
                Tell us how many devices you run and we will recommend the right Protect cover —
                from a small office to a multi-site team across London.
              </p>
              <a href="#consultation" className="btn btn-primary btn-shiny">
                Book a Consultation
              </a>
            </div>
          </section>

          <section className="lifecycle-section" id="consultation" aria-label="Book a consultation">
            <div className="lifecycle-quote">
              <h2>
                Book a <span className="accent">consultation</span>
              </h2>
              <p>
                Share a few details and we will get back to you about 24/7 cybersecurity, antivirus
                and anti-malware for your business.
              </p>
              {reference ? (
                <div className="lifecycle-quote-success" role="status">
                  <p>
                    Thanks — your consultation request has been sent. Reference{' '}
                    <strong>{reference}</strong>. We will contact you shortly.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setReference('')}
                  >
                    Send another request
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
                    Approximate team / device count
                    <input
                      placeholder="e.g. 12 laptops"
                      value={form.employees}
                      onChange={(e) => setForm({ ...form, employees: e.target.value })}
                    />
                  </label>
                  <label>
                    I am interested in
                    <select
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                    >
                      <option>24/7 cybersecurity package</option>
                      <option>Antivirus for business devices</option>
                      <option>Anti-malware protection</option>
                      <option>Full Protect consultation</option>
                      <option>Not sure — need advice</option>
                    </select>
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
                    {submitting ? 'Sending…' : 'Book a Consultation'}
                  </button>
                  <FormPrivacyNote />
                </form>
              )}
            </div>
          </section>

          <section className="lifecycle-cta">
            <div>
              <span className="lifecycle-cta-icon">🛡️</span>
              <h2>Ready to Protect your business?</h2>
              <p>
                Get 24/7 cybersecurity with antivirus and anti-malware from SecureFix London.
              </p>
            </div>
            <div className="lifecycle-cta-actions">
              <a href="#consultation" className="btn btn-primary btn-shiny">
                Book a Consultation
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
