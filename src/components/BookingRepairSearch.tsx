import { useDeferredValue, useId, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  repairSearchPlaceholder,
  searchRepairs,
  type RepairSearchHit,
} from '@/lib/repairSearch'

type Props = {
  /** Called after a suggestion is chosen (optional). */
  onPick?: (hit: RepairSearchHit) => void
}

export default function BookingRepairSearch({ onPick }: Props) {
  const navigate = useNavigate()
  const inputId = useId()
  const listId = useId()
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(() => searchRepairs(deferredQuery, 8), [deferredQuery])
  const showResults = deferredQuery.trim().length >= 2

  function choose(hit: RepairSearchHit) {
    onPick?.(hit)
    setQuery('')
    navigate(hit.path)
  }

  return (
    <section className="book-search" aria-label="Search device model and repair">
      <label className="book-search-label" htmlFor={inputId}>
        Search your device and issue
      </label>
      <p className="book-search-hint">
        Type a model and fault — we will suggest the closest repair pages and services.
      </p>
      <div className="book-search-wrap">
        <input
          id={inputId}
          type="search"
          className="book-search-input"
          placeholder={repairSearchPlaceholder()}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-controls={listId}
          aria-expanded={showResults && results.length > 0}
          aria-autocomplete="list"
        />
      </div>

      {showResults && (
        <div className="book-search-panel" id={listId} role="listbox" aria-label="Suggested repairs">
          {results.length === 0 ? (
            <p className="book-search-empty">
              No close match yet. Try a model name plus the fault (for example “iPhone 13 battery”),
              or pick a device type below.
            </p>
          ) : (
            <ul className="book-search-results">
              {results.map((hit) => (
                <li key={`${hit.kind}-${hit.path}`}>
                  <button
                    type="button"
                    className="book-search-result"
                    role="option"
                    onClick={() => choose(hit)}
                  >
                    <span className="book-search-result-main">
                      <strong>{hit.title}</strong>
                      <span className="book-search-result-sub">{hit.subtitle}</span>
                    </span>
                    <span className="book-search-result-meta">
                      {hit.priceText ? <span className="book-search-price">{hit.priceText}</span> : null}
                      <span className="book-search-kind">
                        {hit.kind === 'repair' ? 'Book repair' : 'Choose issue'}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="book-search-browse">
            Or browse by device below ·{' '}
            <Link to="/phone-repair">Phone repair</Link>
            {' · '}
            <Link to="/computer-repair">Computer repair</Link>
            {' · '}
            <Link to="/console-repair">Console repair</Link>
          </p>
        </div>
      )}
    </section>
  )
}
