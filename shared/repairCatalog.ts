import { searchRepairs, type RepairSearchHit } from '../src/lib/repairSearch.ts'
import { deviceCategories } from '../src/data/booking.ts'
import { listedDevices } from '../src/data/priceLists.ts'
import { issuesByCategory, type RepairIssue } from '../src/data/repairIssues.ts'

const CATEGORY_HINTS: { id: string; patterns: RegExp[] }[] = [
  { id: 'smartphone', patterns: [/iphone|smartphone|galaxy s|pixel|mobile phone|phone(?!s)/i] },
  { id: 'tablet-ipad', patterns: [/ipad|tablet|galaxy tab/i] },
  { id: 'pc-laptop', patterns: [/macbook|laptop|notebook|imac|thinkpad|xps/i] },
  { id: 'gaming-console', patterns: [/ps5|ps4|playstation|xbox|nintendo|switch|console/i] },
  { id: 'smart-watch', patterns: [/apple watch|galaxy watch|smartwatch|fitbit/i] },
]

const ISSUE_HINTS: { pattern: RegExp; matchers: string[] }[] = [
  { pattern: /back cover|back glass/i, matchers: ['back cover', 'back glass'] },
  { pattern: /screen|display|cracked|glass/i, matchers: ['screen', 'glass'] },
  { pattern: /battery|drain/i, matchers: ['battery'] },
  { pattern: /charging port|won'?t charge|charge port|not charging/i, matchers: ['charging', 'charge', 'dock'] },
  { pattern: /camera|lens/i, matchers: ['camera', 'lens'] },
  { pattern: /hdmi/i, matchers: ['hdmi'] },
  { pattern: /water|liquid/i, matchers: ['liquid', 'water'] },
]

const listedBrandKeys = new Set(listedDevices.map((device) => `${device.categoryId}/${device.brandId}`))

export type RepairEstimate = {
  category: string
  summary: string
  /** Deep-link into booking / repair page when we found a match */
  bookingPath?: string
  hits?: RepairSearchHit[]
}

function formatPrice(price: number | null): string {
  return price !== null ? `£${price.toFixed(2)}` : 'quote required'
}

function shownPrice(repair: { price: number | null; priceText?: string }): string {
  if (repair.priceText) return repair.priceText
  return repair.price !== null ? `from £${repair.price.toFixed(2)}` : 'quote required'
}

function parseMoney(text?: string): number | null {
  if (!text) return null
  const match = text.replace(/,/g, '').match(/£\s*(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : null
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

function isAddonHit(hit: RepairSearchHit) {
  return /tempered glass screen protection/i.test(hit.title) || /add-on/i.test(hit.title)
}

function formatHitLine(hit: RepairSearchHit) {
  const price = hit.priceText ? ` — ${hit.priceText}` : ''
  return `${hit.title}${price}`
}

function normalizeLoose(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function queryNamesModel(query: string, model: string) {
  const q = normalizeLoose(query)
  const aliases = [
    normalizeLoose(model),
    normalizeLoose(model.replace(/^(samsung|google|apple|huawei|oneplus)\s+/i, '')),
  ]
  return aliases.some((alias) => alias.length >= 4 && q.includes(alias))
}

function summariseBookingHits(query: string, hits: RepairSearchHit[]): RepairEstimate | null {
  const repairs = hits.filter((hit) => hit.kind === 'repair' && !isAddonHit(hit))
  const models = hits.filter((hit) => hit.kind === 'model')
  const usable = repairs.length ? repairs : models
  if (!usable.length) return null

  const top = usable[0]
  const near = /closest listed model/i.test(top.subtitle)
  const namedTop = top.kind === 'repair' && queryNamesModel(query, top.model)
  const focusedRepairs =
    repairs.length && (namedTop || near)
      ? repairs.filter((hit) => hit.model === top.model)
      : repairs

  const quoteRepairs = focusedRepairs.length ? focusedRepairs : repairs
  const uniqueModels = [...new Set(quoteRepairs.map((hit) => hit.model))]
  const sameModel = uniqueModels.length === 1

  // Brand-level: one example per model, preferring a spread of generations.
  const showcase = sameModel
    ? quoteRepairs.slice(0, 3)
    : (() => {
        const picked: RepairSearchHit[] = []
        const seenGens = new Set<number>()
        for (const hit of quoteRepairs) {
          if (picked.some((item) => item.model === hit.model)) continue
          const genMatch = hit.model.match(/\b(\d{1,2})\b/)
          const gen = genMatch ? Number(genMatch[1]) : -1
          if (gen >= 0 && seenGens.has(gen)) continue
          if (gen >= 0) seenGens.add(gen)
          picked.push(hit)
          if (picked.length >= 4) break
        }
        return picked
      })()

  const prices = showcase
    .map((hit) => parseMoney(hit.priceText))
    .filter((n): n is number => n != null)
    .sort((a, b) => a - b)

  const lines = showcase.map(formatHitLine)

  let summary: string
  if (sameModel && quoteRepairs.length) {
    summary = near
      ? `I couldn't find that exact model in booking, so here's the closest listed match — ${lines.join('; ')}.`
      : `From our booking price list: ${lines.join('; ')}.`
  } else if (prices.length) {
    const from = `£${prices[0].toFixed(2)}`
    summary = `From our booking list, prices start from ${from}. Examples: ${lines.join('; ')}. Tell me your exact model for the precise workshop price.`
  } else if (models.length) {
    summary = `I found ${models[0].title} in booking — open it to see repair prices for that model.`
  } else {
    summary = `I found matching repairs in booking: ${lines.join('; ')}.`
  }

  let bookingPath =
    top.path.includes('book-repair') || top.path.includes('#book') ? top.path : `${top.path}#book`

  // Brand-level answers should land on the booking chooser for that brand, not one old model.
  if (!sameModel && top.kind === 'repair') {
    bookingPath = `/book-repair?category=${encodeURIComponent(top.categoryId)}&brand=${encodeURIComponent(top.brandId)}`
  }

  return {
    category: sameModel ? top.model : detectDeviceCategory(query)?.label ?? 'Repair',
    summary,
    bookingPath,
    hits: (quoteRepairs.length ? quoteRepairs : usable).slice(0, 6),
  }
}

/**
 * Search the same booking catalogue the website uses, then fall back to category
 * starting prices when nothing matches.
 */
export function lookupRepairEstimate(text: string, context = ''): RepairEstimate | null {
  const combined = `${context} ${text}`.trim()
  if (combined.length < 2) return null

  const hits = searchRepairs(text, 10)
  const fromBooking = summariseBookingHits(text, hits)
  if (fromBooking) return fromBooking

  // Broader pass using full conversation context (e.g. model said earlier).
  if (context.trim() && context.trim() !== text.trim()) {
    const contextual = searchRepairs(combined, 10)
    const fromContext = summariseBookingHits(combined, contextual)
    if (fromContext) return fromContext
  }

  const category = detectDeviceCategory(combined)
  const issues = findIssues(combined, category?.id)
  if (!issues.length || !category) return null

  const lines = issues.map((issue) => `${issue.label}: ${shownPrice(issue)}, avg ${issue.time}`)
  return {
    category: category.label,
    summary:
      issues.length === 1
        ? `For ${category.label}, ${issues[0].label} is ${shownPrice(issues[0])} and usually takes ${issues[0].time}.`
        : `For ${category.label}: ${lines.join('; ')}.`,
    bookingPath: `/book-repair?category=${encodeURIComponent(category.id)}`,
  }
}

export function buildRepairPricingReference(): string {
  const listed = listedDevices
    .map((device) => {
      const category = deviceCategories.find((item) => item.id === device.categoryId)
      const brand = category?.brands.find((item) => item.id === device.brandId)
      return `${brand?.label ?? device.id}: prices are per model in booking. Use LIVE LOOKUP / booking search results — never invent prices.`
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
