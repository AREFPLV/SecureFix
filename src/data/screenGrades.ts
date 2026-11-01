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
 * screen price. Standard and Genuine are derived; Premium keeps the list price.
 */
export function getScreenGradeOptions(base: {
  price: number | null
  priceText?: string
}): ScreenGrade[] {
  const premiumBase = typeof base.price === 'number' ? base.price : null
  const standard = priced(premiumBase == null ? null : toNinetyNine(premiumBase * 0.75))
  const premium = priced(premiumBase, base.priceText)
  const genuine = priced(premiumBase == null ? null : toNinetyNine(premiumBase * 1.4))

  return [
    {
      id: 'standard',
      title: 'Standard (INCELL)',
      tag: 'INCELL',
      description: 'Value LCD-style display. Clear picture and reliable touch for everyday use.',
      label: 'Standard Screen Replacement (INCELL)',
      ...standard,
    },
    {
      id: 'premium',
      title: 'Premium (OLED)',
      tag: 'OLED',
      description: 'Soft OLED — our most popular screen. Closest look and colour to the original.',
      label: 'Premium Screen Replacement (OLED)',
      ...premium,
    },
    {
      id: 'genuine',
      title: 'Genuine Apple',
      tag: 'Genuine',
      description: 'Genuine Apple display part. Best colour accuracy and Face ID compatibility.',
      label: 'Genuine Apple Screen Replacement',
      ...genuine,
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
    !lower.includes('tempered')
  )
}

export function findScreenGradeBySlug(
  slug: string,
  base: { price: number | null; priceText?: string },
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
