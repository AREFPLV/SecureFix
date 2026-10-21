import { Link } from 'react-router-dom'
import {
  navLinks,
  site,
  socialLinks,
  TERMS_ROUTE,
  CALL_OUT_ROUTE,
} from '@/data/content'
import { PRIVACY_ROUTE } from '@/data/privacy'
import { serviceLandingLinks } from '@/data/serviceLandings'
import Logo from '@/components/Logo'
import './Footer.css'

function SocialIcon({ id }: { id: string }) {
  switch (id) {
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M14 8.2h2.2V5h-2.3C11.4 5 10 6.5 10 8.8V10H8v3.2h2V19h3.2v-5.8h2.3L16 10h-2.8V8.9c0-.4.3-.7.8-.7z"
          />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm5.1-8.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 4.5c-2 0-2.3 0-3.1.1-.8 0-1.4.2-1.9.4a3.9 3.9 0 0 0-1.4 1.4c-.2.5-.3 1.1-.4 1.9-.1.8-.1 1.1-.1 3.1s0 2.3.1 3.1c0 .8.2 1.4.4 1.9.3.6.8 1.1 1.4 1.4.5.2 1.1.3 1.9.4.8.1 1.1.1 3.1.1s2.3 0 3.1-.1c.8 0 1.4-.2 1.9-.4a3.9 3.9 0 0 0 1.4-1.4c.2-.5.3-1.1.4-1.9.1-.8.1-1.1.1-3.1s0-2.3-.1-3.1c0-.8-.2-1.4-.4-1.9a3.9 3.9 0 0 0-1.4-1.4c-.5-.2-1.1-.3-1.9-.4-.8-.1-1.1-.1-3.1-.1zm0 1.5c2 0 2.2 0 3 .1.7 0 1.1.2 1.4.3.4.1.7.3 1 .6.3.3.5.6.6 1 .1.3.2.7.3 1.4.1.8.1 1 .1 3s0 2.2-.1 3c0 .7-.2 1.1-.3 1.4-.1.4-.3.7-.6 1-.3.3-.6.5-1 .6-.3.1-.7.2-1.4.3-.8.1-1 .1-3 .1s-2.2 0-3-.1c-.7 0-1.1-.2-1.4-.3-.4-.1-.7-.3-1-.6-.3-.3-.5-.6-.6-1-.1-.3-.2-.7-.3-1.4-.1-.8-.1-1-.1-3s0-2.2.1-3c0-.7.2-1.1.3-1.4.1-.4.3-.7.6-1 .3-.3.6-.5 1-.6.3-.1.7-.2 1.4-.3.8-.1 1-.1 3-.1z"
          />
        </svg>
      )
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16.5 4c.4 1.6 1.5 2.9 3.1 3.3v2.2a5.9 5.9 0 0 1-3.1-1v5.5a5.2 5.2 0 1 1-5.2-5.2c.3 0 .6 0 .9.1v2.4a2.8 2.8 0 1 0 2 2.7V4h2.3z"
          />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.2V8.8L15.5 12 10 15.2z"
          />
        </svg>
      )
    default:
      return null
  }
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Logo />
          </Link>
          <p>
            Professional phone, laptop &amp; console repairs in London.
          </p>
          <p className="footer-legal">
            SECUREFIX LTD · Company number 17175693 · Registered in England and Wales
            <br />
            Registered office: 218 City Road, London EC1V 2PN
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.route ? (
                  <Link to={link.route}>{link.label}</Link>
                ) : (
                  <a href={link.href}>{link.label}</a>
                )}
              </li>
            ))}
            {serviceLandingLinks.slice(0, 3).map((link) => (
              <li key={link.route}>
                <Link to={link.route}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link to={CALL_OUT_ROUTE}>Call-Out Booking</Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>
            <a href={`${site.phoneHref}`}>{site.phone}</a>
          </p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p>{site.location}</p>
          <p>Monday to Saturday, 09:00–19:00. Closed Sunday.</p>
        </div>

        <div className="footer-social">
          <h4>Stay Connected</h4>
          <div className="footer-social-icons">
            {socialLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.label}
              >
                <SocialIcon id={item.id} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p className="footer-disclaimer">
            <Link to={PRIVACY_ROUTE}>Privacy policy</Link>
            {' · '}
            <Link to={TERMS_ROUTE}>Terms &amp; Conditions</Link>
            {' · '}
            <Link to="/sitemap">Sitemap</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
