import { site } from '@/data/content'
import HeroPromo from '@/components/HeroPromo'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="container hero-layout">
        <div className="hero-content">
          <p className="hero-eyebrow">Expert device repair service and IT support in London</p>
          <h1>
            <span className="hero-line">Your&nbsp;Device, Your Data.</span>
            <span className="hero-line accent">Secured &amp; Fixed</span>
          </h1>
          <p className="hero-subtitle">
            Same-day phone repair, laptop &amp; computer repair, and PS5 / PlayStation console
            repair in London — cracked screens, batteries, HDMI ports, stick drift and more.
          </p>
          <div className="hero-actions">
            <a href="/book-repair" className="btn btn-primary btn-shiny">
              Book Repair Now
            </a>
            <a
              href={`${site.phoneHref}`}
              className="btn btn-secondary btn-shiny"
            >
              Call {site.phone}
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>Same Day</strong>
              <span>Repair service</span>
            </div>
            <div className="hero-stat">
              <strong>Premium</strong>
              <span>Quality parts</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <HeroPromo />
        </div>
      </div>
    </section>
  )
}
