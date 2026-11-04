import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { RepairIssue } from '@/data/repairIssues'
import {
  groupPhoneServices,
  phoneServiceOptionLabel,
  type PhoneServiceGroup,
} from '@/lib/phoneServices'
import { issuePriceShown } from '@/data/issueCatalog'
import './PhoneServiceGrid.css'

type PhoneServiceGridProps = {
  modelName: string
  issues: RepairIssue[]
  /** When set, clicking a service / option books via callback instead of navigating. */
  onSelectIssue?: (issue: RepairIssue) => void
  /** Build a book URL for a given issue (model hub / SEO pages). */
  bookHref?: (issue: RepairIssue) => string
  className?: string
}

function ServiceCard({
  group,
  onSelectIssue,
  bookHref,
}: {
  group: PhoneServiceGroup
  onSelectIssue?: (issue: RepairIssue) => void
  bookHref?: (issue: RepairIssue) => string
}) {
  const multi = group.options.length > 1
  const primaryHref = bookHref?.(group.primary)
  const canBookPrimary = Boolean(onSelectIssue || primaryHref)

  const PrimaryInner = (
    <>
      <div className="phone-service-card-top">
        <div>
          <p className="phone-service-card-title">{group.title}</p>
          <p className="phone-service-card-blurb">{group.blurb}</p>
        </div>
        <span className="phone-service-card-price">{group.fromPriceText}</span>
      </div>
      {!multi && canBookPrimary ? (
        <span className="phone-service-card-cta">Book this repair →</span>
      ) : null}
      {multi ? <p className="phone-service-card-hint">Choose an option below</p> : null}
    </>
  )

  let header: ReactNode
  if (!multi && onSelectIssue) {
    header = (
      <button type="button" className="phone-service-card-hit" onClick={() => onSelectIssue(group.primary)}>
        {PrimaryInner}
      </button>
    )
  } else if (!multi && primaryHref) {
    header = (
      <Link to={primaryHref} className="phone-service-card-hit">
        {PrimaryInner}
      </Link>
    )
  } else {
    header = <div>{PrimaryInner}</div>
  }

  return (
    <article className="phone-service-card">
      {header}

      {multi ? (
        <ul className="phone-service-options">
          {group.options.map((issue) => {
            const label = phoneServiceOptionLabel(issue)
            const price = issuePriceShown(issue)
            const href = bookHref?.(issue)
            const body = (
              <>
                <span className="phone-service-option-label">{label}</span>
                <span className="phone-service-option-price">{price}</span>
              </>
            )
            if (onSelectIssue) {
              return (
                <li key={issue.label}>
                  <button
                    type="button"
                    className="phone-service-option"
                    onClick={() => onSelectIssue(issue)}
                  >
                    {body}
                  </button>
                </li>
              )
            }
            if (href) {
              return (
                <li key={issue.label}>
                  <Link to={href} className="phone-service-option">
                    {body}
                  </Link>
                </li>
              )
            }
            return (
              <li key={issue.label}>
                <div className="phone-service-option">{body}</div>
              </li>
            )
          })}
        </ul>
      ) : null}
    </article>
  )
}

/** iRepairZone-style “services we provide for this phone” grid. */
export function PhoneServiceGrid({
  modelName,
  issues,
  onSelectIssue,
  bookHref,
  className,
}: PhoneServiceGridProps) {
  const groups = groupPhoneServices(issues)

  if (!groups.length) {
    return (
      <p className="phone-services-empty">
        No priced services listed for {modelName} yet — call us and we’ll quote on the spot.
      </p>
    )
  }

  return (
    <div className={className ? `phone-services ${className}` : 'phone-services'}>
      <div className="phone-services-intro">
        <p className="phone-services-eyebrow">Services we provide</p>
        <h2>{modelName} repairs</h2>
        <p className="phone-services-lead">
          Choose the fault that matches your phone. Screen prices include our current walk-in rate.
          Same-day slots when parts are in stock.
        </p>
      </div>
      <div className="phone-services-grid">
        {groups.map((group) => (
          <ServiceCard
            key={group.id}
            group={group}
            onSelectIssue={onSelectIssue}
            bookHref={bookHref}
          />
        ))}
      </div>
    </div>
  )
}
