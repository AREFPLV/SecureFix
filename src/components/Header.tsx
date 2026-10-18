import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks, site, BOOKING_ROUTE, LIFECYCLE_ROUTE, RECYCLING_ROUTE } from '@/data/content'
import Logo from '@/components/Logo'
import './Header.css'

function isActivePath(pathname: string, route?: string) {
  if (!route) return false
  if (route === '/') return pathname === '/'
  return pathname === route || pathname.startsWith(`${route}/`)
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const hideBookRepairCta =
    isActivePath(pathname, LIFECYCLE_ROUTE) || isActivePath(pathname, RECYCLING_ROUTE)

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
          <Logo />
        </Link>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main">
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.route)
            return link.route ? (
              <Link
                key={link.label}
                to={link.route}
                className={active ? 'nav-link-active' : undefined}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            )
          })}
        </nav>

        <div className="header-actions">
          <a
            href={`${site.phoneHref}`}
            className="btn btn-secondary btn-shiny header-phone-btn"
          >
            {site.phone}
          </a>
          {!hideBookRepairCta ? (
            <Link
              to={BOOKING_ROUTE}
              className={`btn btn-primary header-cta header-cta-heartbeat${
                isActivePath(pathname, BOOKING_ROUTE) ? ' nav-link-active-btn' : ''
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Book Repair
            </Link>
          ) : null}
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
