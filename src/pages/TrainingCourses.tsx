import { useState } from 'react'
import { site } from '@/data/content'
import { trainingContent } from '@/data/training'
import { usePageSeo } from '@/hooks/usePageSeo'
import { trainingSeo } from '@/data/seo'
import './About.css'

export default function TrainingCourses() {
  usePageSeo(trainingSeo)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  function toggleFaq(index: number) {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="about-page site-page">
      <div className="about-hero site-hero-bg">
        <div className="container">
          <h1>
            {trainingContent.heroTitle}{' '}
            <span className="accent">{trainingContent.heroAccent}</span>
          </h1>
          <p>{trainingContent.heroSubtitle}</p>
        </div>
      </div>

      <main className="about-main">
        <div className="container">
          <section className="about-section">
            <h2>{trainingContent.intro.title}</h2>
            {trainingContent.intro.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="about-text">
                {p}
              </p>
            ))}
          </section>

          <section className="about-section">
            <h2>
              Our <span className="accent">Courses</span>
            </h2>
            <div className="about-services-grid">
              {trainingContent.courses.map((course) => (
                <article key={course.title} className="about-service-card">
                  <h3>{course.title}</h3>
                  <p>
                    <strong>{course.duration}</strong>
                    <br />
                    {course.mode}
                  </p>
                  <p>{course.description}</p>
                  <ul>
                    {course.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="about-section">
            <h2>{trainingContent.whoFor.title}</h2>
            <div className="about-services-grid">
              {trainingContent.whoFor.items.map((item) => (
                <article key={item.title} className="about-service-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="faq" className="about-section about-faq-section">
            <h2>
              Training <span className="accent">FAQs</span>
            </h2>
            <div className="faq-list">
              {trainingContent.faqs.map((item, index) => (
                <div
                  key={item.question}
                  className={`faq-item ${openFaq === index ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaq === index}
                  >
                    <span>{item.question}</span>
                    <span className="faq-chevron">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  {openFaq === index && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="about-cta">
            <h2>Ready to start training?</h2>
            <p>Enquire about dates and places — we will get back to you quickly.</p>
            <div className="about-cta-actions">
              <a href={`${site.phoneHref}`} className="btn btn-primary btn-shiny">
                Call {site.phone}
              </a>
              <a
                href={site.whatsapp}
                className="btn btn-secondary btn-shiny"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp {site.whatsappPhone}
              </a>
              <a href={`mailto:${site.email}`} className="btn btn-secondary btn-shiny">
                Email {site.email}
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
