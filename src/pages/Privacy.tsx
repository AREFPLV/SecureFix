import { Link } from 'react-router-dom'
import { site, TERMS_ROUTE } from '@/data/content'
import { privacySeo } from '@/data/privacy'
import { usePageSeo } from '@/hooks/usePageSeo'
import './About.css'

export default function Privacy() {
  usePageSeo(privacySeo)

  return (
    <div className="about-page site-page">
      <div className="about-hero site-hero-bg">
        <div className="container">
          <h1>
            Privacy <span className="accent">policy</span>
          </h1>
          <p>SECUREFIX LTD, company number 17175693</p>
        </div>
      </div>
      <main className="about-main">
        <div className="container">
          <section className="about-section">
            <h2>Who we are</h2>
            <p className="about-text">
              SECUREFIX LTD (company number 17175693) trades as SecureFix. The company is registered
              in England and Wales and was incorporated on 23 April 2026. The registered office and
              shop is 218 City Road, London EC1V 2PN. Email {site.email}. Phone {site.phone}.
            </p>
          </section>
          <section className="about-section">
            <h2>What the forms collect</h2>
            <p className="about-text">
              The repair booking, call-out, trade-in, recycling quote, lifecycle quote and Protect
              consultation forms collect your name, email, phone, device and fault. The call-out
              form also collects your address and postcode. You may add notes about the job.
            </p>
          </section>
          <section className="about-section">
            <h2>Why we use it</h2>
            <p className="about-text">
              We use those details to reply to you and to carry out the booking, quote, trade-in or
              recycling request you sent. We do not sell personal data.
            </p>
          </section>
          <section className="about-section">
            <h2>How the form is sent</h2>
            <p className="about-text">
              Repair booking, call-out, trade-in, recycling, business IT quote and Protect
              consultation forms are sent through FormSubmit to {site.bookingEmail}. FormSubmit
              receives the fields you submit so the message can be delivered to SecureFix.
            </p>
          </section>
          <section className="about-section">
            <h2>Cookies</h2>
            <p className="about-text">
              When you visit the site we ask you to accept cookies. Essential cookies and similar
              storage keep the site working (for example remembering your cookie choice and chat
              preferences). If you accept cookies, we may also use them to improve how the site
              works for you. You can change your mind by clearing site data in your browser.
            </p>
          </section>
          <section className="about-section">
            <h2>Access, correction and deletion</h2>
            <p className="about-text">
              To ask for access, correction or deletion of your details, email {site.email}. You can
              also complain to the Information Commissioner&apos;s Office (ICO) if you are unhappy
              with how your information is used.
            </p>
          </section>
          <section className="about-cta">
            <p>
              See also our <Link to={TERMS_ROUTE}>Terms &amp; Conditions</Link>.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
