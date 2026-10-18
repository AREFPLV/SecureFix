import { deviceCategories } from '../src/data/booking.ts'
import { issuesByCategory, type RepairIssue } from '../src/data/repairIssues.ts'

const CATEGORY_HINTS: { id: string; patterns: RegExp[] }[] = [
  { id: 'smartphone', patterns: [/iphone|smartphone|galaxy s|pixel|mobile phone|phone(?!s)/i] },
  { id: 'tablet-ipad', patterns: [/ipad|tablet|galaxy tab/i] },
  { id: 'pc-laptop', patterns: [/macbook|laptop|notebook|imac|thinkpad|xps/i] },
  { id: 'gaming-console', patterns: [/ps5|ps4|playstation|xbox|nintendo|switch|console/i] },
  { id: 'smart-watch', patterns: [/apple watch|galaxy watch|smartwatch|fitbit/i] },
]

const ISSUE_HINTS: { pattern: RegExp; matchers: string[] }[] = [
  { pattern: /screen|display|cracked|glass/i, matchers: ['screen', 'glass'] },
  { pattern: /battery|drain|charge/i, matchers: ['battery'] },
  { pattern: /charging port|won'?t charge|charge port/i, matchers: ['charging', 'charge'] },
  { pattern: /camera|lens/i, matchers: ['camera', 'lens'] },
  { pattern: /hdmi/i, matchers: ['hdmi'] },
  { pattern: /water|liquid/i, matchers: ['liquid', 'water'] },
]

function formatPrice(price: number | null): string {
  return price !== null ? `£${price.toFixed(2)}` : 'quote required'
}

export function detectDeviceCategory(text: string) {
  for (const hint of CATEGORY_HINTS) {
    if (hint.patterns.some((p) => p.test(text))) {
      const cat = deviceCategories.find((c) => c.id === hint.id)
      if (cat) return { id: cat.id, label: cat.label }
    }
  }
  return null
}

export function findIssues(text: string, categoryId?: string): RepairIssue[] {
  const pool = categoryId ? (issuesByCategory[categoryId] ?? []) : []
  const matched: RepairIssue[] = []
  for (const hint of ISSUE_HINTS) {
    if (!hint.pattern.test(text)) continue
    for (const issue of pool) {
      const label = issue.label.toLowerCase()
      if (
        issue.price !== null &&
        hint.matchers.some((m) => label.includes(m)) &&
        !matched.some((x) => x.label === issue.label)
      ) {
        matched.push(issue)
      }
    }
  }
  return matched.slice(0, 3)
}

export function lookupRepairEstimate(text: string, context = '') {
  const combined = `${context} ${text}`.trim()
  const category = detectDeviceCategory(combined)
  const issues = findIssues(combined, category?.id)
  if (!issues.length || !category) return null

  const lines = issues.map((i) => `${i.label}: ${formatPrice(i.price)}, avg ${i.time}`)
  return {
    category: category.label,
    summary:
      issues.length === 1
        ? `For ${category.label}, ${issues[0].label} is ${formatPrice(issues[0].price)} and usually takes ${issues[0].time}.`
        : `For ${category.label}: ${lines.join('; ')}.`,
  }
}

export function buildRepairPricingReference(): string {
  return deviceCategories
    .filter((c) => issuesByCategory[c.id]?.length)
    .map((c) => {
      const lines = (issuesByCategory[c.id] ?? [])
        .filter((i) => i.price !== null)
        .map((i) => `  - ${i.label}: ${formatPrice(i.price)}, ${i.time}`)
        .join('\n')
      return `${c.label}:\n${lines}`
    })
    .join('\n\n')
}
