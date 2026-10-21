import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRIVACY_ROUTE } from '@/data/privacy'
import './CookieConsent.css'

const STORAGE_KEY = 'securefix-cookie-consent'

type ConsentChoice = 'accepted' | 'essential'

function readStoredChoice(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'accepted' || value === 'essential') return value
  } catch {
    /* private mode / blocked storage */
  }
  return null
}

function storeChoice(choice: ConsentChoice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    /* ignore */
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(readStoredChoice() == null)
  }, [])

  function choose(choice: ConsentChoice) {
    storeChoice(choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className="cookie-consent-inner">
        <div className="cookie-consent-copy">
          <strong>We use cookies</strong>
          <p>
            We use cookies and similar storage to run the site, remember preferences, and improve
            your experience. See our{' '}
            <Link to={PRIVACY_ROUTE}>privacy policy</Link> for details.
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button type="button" className="btn btn-secondary btn-shiny" onClick={() => choose('essential')}>
            Essential only
          </button>
          <button type="button" className="btn btn-primary btn-shiny" onClick={() => choose('accepted')}>
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  )
}
