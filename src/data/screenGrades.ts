/** Front-screen quality tiers shown under the Front Screen booking tile. */

export type ScreenGradeId = 'standard' | 'premium' | 'genuine'

export type ScreenGrade = {
  id: ScreenGradeId
  title: string
  tag: string
  description: string
  /** Label passed into the booking form / URL issue slug. */
  label: string
  price: number | null
  priceText: string
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

/** Keep the shop's .99 price style when deriving tier prices. */
function toNinetyNine(value: number): number {
  if (value <= 0) return 0.99
  const floored = Math.floor(value)
  if (floored < 1) return 0.99
  return floored + 0.99
}

function priced(
  price: number | null,
  fallbackText?: string,
): { price: number | null; priceText: string } {
  if (price == null) return { price: null, priceText: 'Quote on inspection' }
  const next = roundMoney(price)
  return {
    price: next,
    priceText: fallbackText && fallbackText.startsWith('£') ? fallbackText : `£${next.toFixed(2)}`,
  }
}

/**
 * Build the three screen options from the model's listed Soft OLED / Premium
 * screen price. Premium keeps the list price. INCELL uses an exact standardPrice
 * when provided (matched from competitor Standard), otherwise a derived tier.
 */
export function getScreenGradeOptions(base: {
  price: number | null
  priceText?: string
  /** Exact INCELL / Standard price when known; otherwise derived from Premium. */
  standardPrice?: number | null
}): ScreenGrade[] {
  const premiumBase = typeof base.price === 'number' ? base.price : null
  const standard = priced(
    typeof base.standardPrice === 'number'
      ? base.standardPrice
      : premiumBase == null
        ? null
        : toNinetyNine(premiumBase * 0.75),
  )
  const premium = priced(premiumBase, base.priceText)
  const genuine = priced(premiumBase == null ? null : toNinetyNine(premiumBase * 1.4))

  return [
    {
      id: 'standard',
      title: 'INCELL',
      tag: '',
      description:
        'Affordable screen replacement with reliable performance, clear display quality, and responsive touch.',
      label: 'Standard Screen Replacement (INCELL)',
      ...standard,
    },
    {
      id: 'premium',
      title: 'SOFT OLED',
      tag: '',
      description:
        'Premium display with vibrant colours, deep blacks, and a viewing experience close to the original screen.',
      label: 'Premium Screen Replacement (Soft OLED)',
      ...premium,
    },
    {
      id: 'genuine',
      title: 'GENUINE APPLE',
      tag: '',
      description:
        'Original-quality display offering the best colour accuracy, brightness, and overall performance.',
      label: 'Genuine Apple Screen Replacement',
      ...genuine,
    },
  ]
}

/** Non-Apple phones: one Premium screen option at the listed price. */
export function getPremiumScreenOption(base: {
  price: number | null
  priceText?: string
}): ScreenGrade[] {
  const price = typeof base.price === 'number' ? base.price : null
  return [
    {
      id: 'premium',
      title: 'Premium',
      tag: 'Premium',
      description:
        'Premium display with reliable picture quality, clear colours, and responsive touch.',
      label: 'Premium Screen Replacement',
      price,
      priceText:
        price == null
          ? 'Quote on inspection'
          : base.priceText && base.priceText.startsWith('£')
            ? base.priceText
            : `£${price.toFixed(2)}`,
    },
  ]
}

export function isFrontScreenIssue(issue: { cardTitle?: string; label: string }): boolean {
  if (issue.cardTitle === 'Front Screen') return true
  const lower = issue.label.toLowerCase()
  return (
    (lower.includes('screen') || lower.includes('lcd') || lower.includes('oled')) &&
    !lower.includes('battery') &&
    !lower.includes('back glass') &&
    !lower.includes('inner') &&
    !lower.includes('outer') &&
    !lower.includes('tempered') &&
    !lower.includes('protection') &&
    !lower.includes('add-on')
  )
}

export function findScreenGradeBySlug(
  slug: string,
  base: { price: number | null; priceText?: string; standardPrice?: number | null },
): ScreenGrade | null {
  return getScreenGradeOptions(base).find((grade) => screenGradeSlug(grade.label) === slug) ?? null
}

export function screenGradeSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
