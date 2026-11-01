import type { ReactNode } from 'react'

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" className="book-issue-svg" aria-hidden="true">
      {children}
    </svg>
  )
}

/** Minimalist repair icons for booking issue cards (smartphone-focused set). */
export function repairIssueIcon(label: string): ReactNode {
  const key = label.toLowerCase()

  if (key.includes('premium screen') || (key.includes('screen') && !key.includes('switch'))) {
    return (
      <Icon>
        <rect x="14" y="6" width="20" height="36" rx="3" {...stroke} />
        <path d="M18 14l12 8M20 28l10-6M17 22l14 4" {...stroke} />
      </Icon>
    )
  }

  if (key.includes('backglass') || key.includes('back glass') || key.includes('housing')) {
    return (
      <Icon>
        <rect x="14" y="6" width="20" height="36" rx="3" {...stroke} />
        <circle cx="24" cy="14" r="3" {...stroke} />
        <path d="M17 22l14 8M18 32l10-5" {...stroke} />
      </Icon>
    )
  }

  if (key.includes('charg')) {
    return (
      <Icon>
        <rect x="15" y="6" width="18" height="30" rx="3" {...stroke} />
        <path d="M21 40v4h6v-4M24 44v3" {...stroke} />
        <path d="M22 16h4v8h-4z" fill="currentColor" stroke="none" />
      </Icon>
    )
  }

  if (key.includes('battery')) {
    return (
      <Icon>
        <rect x="16" y="10" width="16" height="28" rx="3" {...stroke} />
        <path d="M20 10V7h8v3" {...stroke} />
        <path d="M24 18v8M21 22h6" {...stroke} />
      </Icon>
    )
  }

  if (key.includes('lens')) {
    return (
      <Icon>
        <circle cx="24" cy="24" r="12" {...stroke} />
        <circle cx="24" cy="24" r="5" {...stroke} />
        <circle cx="24" cy="24" r="1.5" fill="currentColor" stroke="none" />
      </Icon>
    )
  }

  if (key.includes('front camera')) {
    return (
      <Icon>
        <rect x="10" y="14" width="28" height="20" rx="3" {...stroke} />
        <path d="M18 14c2-4 10-4 12 0" {...stroke} />
        <circle cx="24" cy="24" r="3" {...stroke} />
      </Icon>
    )
  }

  if (key.includes('rear camera') || key.includes('back camera')) {
    return (
      <Icon>
        <rect x="12" y="14" width="24" height="20" rx="4" {...stroke} />
        <circle cx="20" cy="24" r="4" {...stroke} />
        <circle cx="30" cy="22" r="3" {...stroke} />
      </Icon>
    )
  }

  if (key.includes('audio') || key.includes('speaker') || key.includes('ear')) {
    return (
      <Icon>
        <rect x="16" y="12" width="16" height="24" rx="2" {...stroke} />
        <path d="M20 16h8M18 22h12M18 28h12M20 34h8" {...stroke} />
        <path d="M34 20c2 1.5 2 6.5 0 8M38 18c3 2.5 3 9.5 0 12" {...stroke} />
      </Icon>
    )
  }

  if (key.includes('mic')) {
    return (
      <Icon>
        <rect x="20" y="8" width="8" height="16" rx="4" {...stroke} />
        <path d="M16 22a8 8 0 0 0 16 0M24 30v6M18 36h12" {...stroke} />
      </Icon>
    )
  }

  if (key.includes('power') || key.includes('volume') || key.includes('dead')) {
    return (
      <Icon>
        <circle cx="24" cy="24" r="12" {...stroke} />
        <path d="M24 16v10" {...stroke} />
      </Icon>
    )
  }

  if (key.includes('liquid') || key.includes('water')) {
    return (
      <Icon>
        <path d="M24 8c6 10 12 16 12 22a12 12 0 0 1-24 0c0-6 6-12 12-22z" {...stroke} />
      </Icon>
    )
  }

  if (key.includes('signal')) {
    return (
      <Icon>
        <path d="M12 30c6-6 18-6 24 0M16 34c4-4 12-4 16 0" {...stroke} />
        <circle cx="24" cy="38" r="2" fill="currentColor" stroke="none" />
      </Icon>
    )
  }

  if (key.includes('software') || key.includes('restore') || key.includes('ic replacement') || key.includes('board')) {
    return (
      <Icon>
        <rect x="14" y="14" width="20" height="20" rx="2" {...stroke} />
        <path d="M18 14V10M24 14V10M30 14V10M18 34v4M24 34v4M30 34v4M14 18H10M14 24H10M14 30H10M34 18h4M34 24h4M34 30h4" {...stroke} />
      </Icon>
    )
  }

  if (key.includes('diagnostic') || key.includes('other')) {
    return (
      <Icon>
        <circle cx="24" cy="16" r="6" {...stroke} />
        <path d="M14 38c2-8 6-12 10-12s8 4 10 12M18 28l-4 4M30 28l4 4" {...stroke} />
      </Icon>
    )
  }

  return (
    <Icon>
      <path d="M28 12l4 4-12 12H16v-4L28 12z" {...stroke} />
      <path d="M14 34h20" {...stroke} />
    </Icon>
  )
}
