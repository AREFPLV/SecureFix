import { Link } from 'react-router-dom'
import { CALL_OUT_ROUTE, site } from '@/data/content'
import './OnSiteBooking.css'

const features = [
  {
    icon: '📍',
    title: 'We Come To You',
    text: 'On-site repair and IT support at your home or workplace across London.',
  },
  {
    icon: '🚚',
    title: 'Collect & Return',
    text: 'We collect your device, repair it, and bring it back the same day.',
  },
  {
    icon: '🏠',
    title: 'Home & Call-Out',
    text: 'Book a home visit or business call-out, Monday to Saturday, 09:00–19:00.',
  },
]

export default function OnSiteBooking() {
  return (
    <section id="onsite" className="section onsite-section">
      <div className="container onsite-layout">
        <div className="onsite-content">
          <h2 className="onsite-title">
            <span className="onsite-title-line">On-Site Repair &amp;</span>
            <span className="onsite-title-line accent">IT Support</span>
          </h2>
          <p className="onsite-lead">
            <strong>We come to you:</strong> homes, offices, and businesses. Or we collect
            your device, fix it, and return it the same day.
          </p>

          <div className="onsite-features">
            {features.map((item) => (
              <article key={item.title} className="onsite-feature">
                <span className="onsite-feature-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="onsite-cta-actions">
            <Link to={CALL_OUT_ROUTE} className="btn btn-primary btn-shiny">
              Book Now
            </Link>
            <a
              href={`${site.phoneHref}`}
              className="btn btn-secondary btn-shiny"
            >
              Call {site.phone}
            </a>
          </div>
        </div>

        <div className="onsite-banner-wrap">
          <img
            src="/images/onsite-banner.png"
            alt="SecureFix on-site repair and IT support — collection and return, same day service for homes and businesses"
            className="onsite-banner"
          />
        </div>
      </div>
    </section>
  )
}
