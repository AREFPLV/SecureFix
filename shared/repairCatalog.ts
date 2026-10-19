import { deviceCategories } from '../src/data/booking.ts'
import { listedDevices, type ListedRepair } from '../src/data/priceLists.ts'
import { listedRepairs } from '../src/data/listedPrices.ts'
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
  { pattern: /battery|drain/i, matchers: ['battery'] },
  { pattern: /charging port|won'?t charge|charge port|not charging/i, matchers: ['charging', 'charge', 'dock'] },
  { pattern: /camera|lens/i, matchers: ['camera', 'lens'] },
  { pattern: /hdmi/i, matchers: ['hdmi'] },
  { pattern: /water|liquid/i, matchers: ['liquid', 'water'] },
]

const UNLISTED_BRAND = /xiaomi|redmi|\bpoco\b|xperia|\bsony\b|\bnokia\b|motorola|\bmoto\b|\boppo\b|garmin|fitbit|galaxy watch|surface|fire hd|lenovo|dell|\bxps\b|\bhp\b|thinkpad|asus|acer|\bmsi\b/i

const listedBrandKeys = new Set(listedDevices.map((device) => `${device.categoryId}/${device.brandId}`))

function formatPrice(price: number | null): string {
  return price !== null ? `£${price.toFixed(2)}` : 'quote required'
}

function shownPrice(repair: { price: number | null; priceText?: string }): string {
  if (repair.priceText) return repair.priceText
  return repair.price !== null ? `from £${repair.price.toFixed(2)}` : 'quote required'
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

function modelAliases(name: string): string[] {
  const full = name.toLowerCase()
  const stripped = full.replace(/^(samsung|google|apple|huawei|oneplus)\s+/, '')
  return stripped === full ? [full] : [full, stripped]
}

function findListedModel(text: string) {
  const haystack = text.toLowerCase()
  let best: { categoryId: string; brandId: string; name: string; score: number } | null = null
  for (const device of listedDevices) {
    for (const model of device.models) {
      const score = modelAliases(model.name)
        .filter((alias) => alias.length > 3 && haystack.includes(alias))
        .reduce((longest, alias) => Math.max(longest, alias.length), 0)
      if (!score) continue
      if (!best || score > best.score) {
        best = { categoryId: device.categoryId, brandId: device.brandId, name: model.name, score }
      }
    }
  }
  return best
}

function matchLabels<T extends { label: string }>(items: T[], text: string): T[] {
  const matched: T[] = []
  for (const hint of ISSUE_HINTS) {
    if (!hint.pattern.test(text)) continue
    for (const item of items) {
      const label = item.label.toLowerCase()
      if (
        hint.matchers.some((m) => label.includes(m)) &&
        !matched.some((existing) => existing.label === item.label)
      ) {
        matched.push(item)
      }
    }
  }
  return matched.slice(0, 3)
}

export function findIssues(text: string, categoryId?: string): RepairIssue[] {
  const pool = categoryId ? (issuesByCategory[categoryId] ?? []) : []
  return matchLabels(
    pool.filter((issue) => issue.price !== null),
    text,
  )
}

function perModelReply(name: string) {
  return `${name} prices are listed per model. Tell me the exact model and the fault, and I can quote the workshop price.`
}

export function lookupRepairEstimate(text: string, context = '') {
  const combined = `${context} ${text}`.trim()
  const listed = findListedModel(combined)
  if (listed) {
    const repairs = listedRepairs(listed.categoryId, listed.brandId, listed.name) ?? []
    const matched = matchLabels(repairs, combined)
    const picks: ListedRepair[] = matched.length
      ? matched
      : repairs.filter((repair) => /screen/i.test(repair.label)).slice(0, 1)
    if (!picks.length) return null
    const lines = picks.map((repair) => `${repair.label}: ${repair.priceText}`)
    return {
      category: listed.name,
      summary: matched.length
        ? `${listed.name}: ${lines.join('; ')}.`
        : `${listed.name} prices are listed per repair. ${lines[0]}.`,
    }
  }

  const category = detectDeviceCategory(combined)
  const namedUnlisted = UNLISTED_BRAND.test(combined)
  if (
    !namedUnlisted &&
    category &&
    (category.id === 'smartphone' || /iphone|ipad|samsung|galaxy s|macbook|oneplus|one plus|huawei|pixel|apple watch/i.test(combined))
  ) {
    return { category: category.label, summary: perModelReply(category.label) }
  }

  const issues = findIssues(combined, category?.id)
  if (!issues.length || !category) return null

  const lines = issues.map((issue) => `${issue.label}: ${shownPrice(issue)}, avg ${issue.time}`)
  return {
    category: category.label,
    summary:
      issues.length === 1
        ? `For ${category.label}, ${issues[0].label} is ${shownPrice(issues[0])} and usually takes ${issues[0].time}.`
        : `For ${category.label}: ${lines.join('; ')}.`,
  }
}

export function buildRepairPricingReference(): string {
  const listed = listedDevices
    .map((device) => {
      const category = deviceCategories.find((item) => item.id === device.categoryId)
      const brand = category?.brands.find((item) => item.id === device.brandId)
      return `${brand?.label ?? device.id}: each model has its own price. Quote a price only after the customer names the model.`
    })
    .join('\n')

  const rest = deviceCategories
    .filter((category) => category.id !== 'smartphone' && issuesByCategory[category.id]?.length)
    .map((category) => {
      const lines = (issuesByCategory[category.id] ?? [])
        .filter((issue) => issue.price !== null)
        .map((issue) => `  - ${issue.label}: ${formatPrice(issue.price)}, ${issue.time}`)
        .join('\n')
      const listedHere = category.brands.some((brand) => listedBrandKeys.has(`${category.id}/${brand.id}`))
      const note = listedHere ? ' (use only for brands that are not in the per-model lists above)' : ''
      return `${category.label}${note}:\n${lines}`
    })
    .join('\n\n')

  return `${listed}\n\n${rest}`
}
