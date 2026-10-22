import { deviceCategories } from '@/data/booking'
import { getIssuePages } from '@/data/issueCatalog'
import { isGenericModel, slugify } from '@/lib/slugify'

export type RepairSearchHit = {
  kind: 'repair' | 'model'
  title: string
  subtitle: string
  priceText?: string
  path: string
  score: number
  categoryId: string
  brandId: string
  model: string
  issueLabel?: string
}

type IndexedItem = {
  kind: 'repair' | 'model'
  title: string
  subtitle: string
  priceText?: string
  path: string
  categoryId: string
  brandId: string
  model: string
  issueLabel?: string
  /** Lowercase haystack for matching */
  haystack: string
  modelKey: string
  issueKey: string
}

const ISSUE_HINTS: { pattern: RegExp; tokens: string[] }[] = [
  { pattern: /back\s*(cover|glass)|rear\s*glass/i, tokens: ['back', 'cover'] },
  { pattern: /\b(screen|display|cracked|lcd|oled)\b/i, tokens: ['screen', 'display', 'oled', 'lcd'] },
  { pattern: /battery|drain|swelling/i, tokens: ['battery'] },
  { pattern: /charg(e|ing)|won'?t\s*charge|dock/i, tokens: ['charging', 'charge', 'dock'] },
  { pattern: /camera|lens|blurry/i, tokens: ['camera', 'lens'] },
  { pattern: /hdmi/i, tokens: ['hdmi'] },
  { pattern: /water|liquid|spill/i, tokens: ['liquid', 'water'] },
  { pattern: /speaker|audio|mic(rophone)?/i, tokens: ['speaker', 'audio', 'mic'] },
  { pattern: /keyboard|keys/i, tokens: ['keyboard'] },
  { pattern: /joystick|stick\s*drift|drift/i, tokens: ['joystick', 'drift'] },
  { pattern: /hinge/i, tokens: ['hinge'] },
  { pattern: /virus|malware/i, tokens: ['virus', 'malware'] },
]

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function modelAliases(name: string): string[] {
  const full = normalize(name)
  const stripped = full.replace(/^(samsung|google|apple|huawei|oneplus)\s+/, '').trim()
  return stripped && stripped !== full ? [full, stripped] : [full]
}

let cachedIndex: IndexedItem[] | null = null

function buildIndex(): IndexedItem[] {
  const items: IndexedItem[] = []
  const modelKeys = new Set<string>()

  for (const page of getIssuePages()) {
    const modelKey = normalize(page.model)
    // Do not use shortJobName here — it collapses many faults to “Screen replacement”.
    const issueKey = normalize(`${page.displayLabel} ${page.issueLabel}`)
    const haystack = normalize(
      `${page.brandLabel} ${page.model} ${page.displayLabel} ${page.issueLabel} ${page.categoryLabel}`,
    )
    items.push({
      kind: 'repair',
      title: `${page.model} — ${page.displayLabel}`,
      subtitle: `${page.brandLabel} · ${page.categoryLabel}`,
      priceText: page.priceText,
      path: page.bookingPath || `${page.path}#book`,
      categoryId: page.categoryId,
      brandId: page.brandId,
      model: page.model,
      issueLabel: page.issueLabel,
      haystack,
      modelKey,
      issueKey,
    })
    modelKeys.add(`${page.categoryId}/${page.brandId}/${page.modelSlug}`)
  }

  for (const category of deviceCategories) {
    for (const brand of category.brands) {
      for (const model of brand.models) {
        if (isGenericModel(model)) continue
        const modelSlug = slugify(model)
        const key = `${category.id}/${brand.id}/${modelSlug}`
        if (modelKeys.has(key)) {
          // Still add a model hub hit so bare model searches can jump to the issue list.
        }
        const modelKey = normalize(model)
        items.push({
          kind: 'model',
          title: model,
          subtitle: `${brand.label} · ${category.label} · view repairs`,
          path: `/book-repair?category=${encodeURIComponent(category.id)}&brand=${encodeURIComponent(brand.id)}&model=${encodeURIComponent(modelSlug)}`,
          categoryId: category.id,
          brandId: brand.id,
          model,
          haystack: normalize(`${brand.label} ${model} ${category.label}`),
          modelKey,
          issueKey: '',
        })
      }
    }
  }

  return items
}

function getIndex(): IndexedItem[] {
  if (!cachedIndex) cachedIndex = buildIndex()
  return cachedIndex
}

function issueHintBonus(query: string, issueKey: string): number {
  let bonus = 0
  const wantsScreen = /\b(screen|display|cracked|lcd|oled)\b/i.test(query) && !/\bback\b/i.test(query)
  const wantsBack = /\bback\b/i.test(query)

  for (const hint of ISSUE_HINTS) {
    if (!hint.pattern.test(query)) continue
    if (hint.tokens.some((token) => issueKey.includes(token))) bonus += 40
  }

  if (wantsScreen) {
    if (/\bscreen\b/.test(issueKey) || /\bdisplay\b/.test(issueKey) || /\boled\b/.test(issueKey)) {
      bonus += 100
    }
    // Pure back-glass jobs are a poor match for “cracked screen”.
    if (/\bback\b/.test(issueKey) && !/\bscreen\b/.test(issueKey)) bonus -= 120
  }
  if (wantsBack && /\bback\b/.test(issueKey)) bonus += 50

  return bonus
}

function nearbyModelTokens(token: string): string[] {
  const match = token.match(/^([a-z]*)(\d{2,3})$/i)
  if (!match) return []
  const prefix = match[1].toLowerCase()
  const num = Number(match[2])
  if (!Number.isFinite(num)) return []
  return [`${prefix}${num - 1}`, `${prefix}${num + 1}`]
}

/** Significant model tokens such as s24, iphone, 14, macbook — must mostly match. */
function modelTokenCoverage(
  modelKey: string,
  tokens: string[],
): { hit: number; need: number; near: boolean } {
  const significant = tokens.filter(
    (token) => token.length >= 3 || /^\d{1,2}$/.test(token) || /^[a-z]?\d{1,3}$/i.test(token),
  )
  if (!significant.length) return { hit: 0, need: 0, near: false }

  // Series / generation tokens (s24, 14, s23) must match exactly or a neighbour.
  const seriesTokens = significant.filter(
    (token) => /^(?:[a-z]{0,3}\d{2,3})$/i.test(token) && !/^20\d{2}$/.test(token),
  )
  if (seriesTokens.length) {
    const seriesOk = seriesTokens.some(
      (token) =>
        modelKey.includes(token) ||
        nearbyModelTokens(token).some((candidate) => modelKey.includes(candidate)),
    )
    if (!seriesOk) return { hit: 0, need: significant.length, near: false }
  }

  let hit = 0
  let near = false
  for (const token of significant) {
    if (modelKey.includes(token)) {
      hit += 1
      continue
    }
    if (nearbyModelTokens(token).some((candidate) => modelKey.includes(candidate))) {
      hit += 0.55
      near = true
    }
  }
  return { hit, need: significant.length, near }
}

function scoreItem(item: IndexedItem, query: string, tokens: string[]): number {
  if (!query) return 0
  let score = 0
  const aliases = modelAliases(item.model)
  let modelMatched = false

  for (const alias of aliases) {
    if (!alias || alias.length < 2) continue
    if (query === alias) {
      score += 220
      modelMatched = true
    } else if (query.includes(alias) && alias.length >= 4) {
      score += 140 + Math.min(alias.length, 24)
      modelMatched = true
    } else if (alias.startsWith(query) && query.length >= 3) {
      score += 100
      modelMatched = true
    }
  }

  const coverage = modelTokenCoverage(item.modelKey, tokens)
  if (coverage.need > 0) {
    const ratio = coverage.hit / coverage.need
    if (ratio === 0) {
      // Query names a specific model family/number that this item lacks.
      if (tokens.some((t) => /^[a-z]?\d{2,}$/i.test(t) || /^s\d/i.test(t))) return 0
    } else {
      score += Math.round(ratio * (coverage.near ? 95 : 120))
      if (ratio >= 0.5) modelMatched = true
      if (coverage.near) score -= 8
    }
  }

  for (const token of tokens) {
    if (token.length < 2) continue
    if (item.modelKey.includes(token)) score += token.length >= 4 ? 35 : 18
    if (item.issueKey && item.issueKey.includes(token)) score += 28
    else if (!item.modelKey.includes(token) && item.haystack.includes(token)) score += 6
  }

  if (!modelMatched && item.kind === 'repair') {
    // Weak brand-only hits without a model match stay low.
    score = Math.min(score, 40)
  }

  if (item.kind === 'repair') {
    score += issueHintBonus(query, item.issueKey)
    score += 6
  } else if (!ISSUE_HINTS.some((hint) => hint.pattern.test(query))) {
    score += 12
  }

  return score
}

/** Find closest repair pages and model hubs for a free-text device + issue query. */
export function searchRepairs(rawQuery: string, limit = 8): RepairSearchHit[] {
  const query = normalize(rawQuery)
  if (query.length < 2) return []

  const tokens = query.split(' ').filter((token) => token.length > 1)
  const ranked: RepairSearchHit[] = []

  const wantsScreen = /\b(screen|display|cracked|lcd|oled)\b/i.test(query) && !/\bback\b/i.test(query)
  const wantsBattery = /\bbattery\b/i.test(query)
  const wantsCharging = /\bcharg/i.test(query)
  const wantsHdmi = /\bhdmi\b/i.test(query)
  const hasIssueIntent = ISSUE_HINTS.some((hint) => hint.pattern.test(query))

  for (const item of getIndex()) {
    let score = scoreItem(item, query, tokens)
    if (score < 30) continue

    // Model-only searches should suggest the model hub, not a random fault list.
    if (item.kind === 'repair' && !hasIssueIntent) continue

    // Keep issue-intent results focused (avoid equal-score noise from add-ons / other faults).
    if (item.kind === 'repair' && item.issueKey) {
      if (wantsScreen && !/\b(screen|display|oled|lcd)\b/.test(item.issueKey)) continue
      if (wantsBattery && !/\bbattery\b/.test(item.issueKey)) continue
      if (wantsCharging && !/\bcharg/.test(item.issueKey)) continue
      if (wantsHdmi && !/\bhdmi\b/.test(item.issueKey)) continue
      if (wantsScreen && /\btempered glass screen protection\b/.test(item.issueKey)) score -= 40
    }

    const coverage = modelTokenCoverage(item.modelKey, tokens)
    ranked.push({
      kind: item.kind,
      title: item.title,
      subtitle: coverage.near ? `${item.subtitle} · closest listed model` : item.subtitle,
      priceText: item.priceText,
      path: item.path,
      score,
      categoryId: item.categoryId,
      brandId: item.brandId,
      model: item.model,
      issueLabel: item.issueLabel,
    })
  }

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (wantsScreen) {
      const aScreen = /\bscreen\b/i.test(a.title) ? 1 : 0
      const bScreen = /\bscreen\b/i.test(b.title) ? 1 : 0
      if (bScreen !== aScreen) return bScreen - aScreen
    }
    return a.title.localeCompare(b.title)
  })

  // Prefer a mix: keep top model hit + unique repairs (dedupe same repair path).
  const seen = new Set<string>()
  const results: RepairSearchHit[] = []
  for (const hit of ranked) {
    const key = `${hit.kind}:${hit.path}`
    if (seen.has(key)) continue
    // Skip model hub if we already have a stronger repair for the same model and query has issue hints.
    if (
      hit.kind === 'model' &&
      ISSUE_HINTS.some((hint) => hint.pattern.test(query)) &&
      results.some((r) => r.kind === 'repair' && r.model === hit.model)
    ) {
      continue
    }
    seen.add(key)
    results.push(hit)
    if (results.length >= limit) break
  }

  return results
}

export function repairSearchPlaceholder(): string {
  return 'e.g. iPhone 14 cracked screen, MacBook battery, PS5 HDMI'
}
