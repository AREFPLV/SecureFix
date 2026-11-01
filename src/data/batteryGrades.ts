/** iPhone battery quality tiers shown under the Battery Replacement tile. */

export type BatteryGradeId = 'premium' | 'genuine'

export type BatteryGrade = {
  id: BatteryGradeId
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
 * Build Premium + Genuine Apple battery options from the listed
 * Apple Original / OEM battery price. Premium keeps the list price.
 */
export function getBatteryGradeOptions(base: {
  price: number | null
  priceText?: string
}): BatteryGrade[] {
  const premiumBase = typeof base.price === 'number' ? base.price : null
  const premium = priced(premiumBase, base.priceText)
  const genuine = priced(premiumBase == null ? null : toNinetyNine(premiumBase * 1.35))

  return [
    {
      id: 'premium',
      title: 'Premium',
      tag: 'Premium',
      description: 'High-quality OEM-grade cell. Strong battery health and everyday performance.',
      label: 'Premium Battery Replacement',
      ...premium,
    },
    {
      id: 'genuine',
      title: 'Genuine Apple',
      tag: 'Genuine',
      description: 'Genuine Apple battery. Closest match to the original cell and health reporting.',
      label: 'Genuine Apple Battery Replacement',
      ...genuine,
    },
  ]
}

export function isBatteryReplacementIssue(issue: { cardTitle?: string; label: string }): boolean {
  if (issue.cardTitle === 'Battery Replacement') return true
  const lower = issue.label.toLowerCase()
  return lower.includes('battery') && !lower.includes('screen') && !lower.includes('deal')
}
