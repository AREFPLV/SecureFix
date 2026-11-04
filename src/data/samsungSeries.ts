/** Samsung Galaxy phone series used on the booking model picker. */

import { isGenericModel } from '@/lib/slugify'

export type SamsungSeriesId =
  | 'galaxy-s'
  | 'galaxy-z'
  | 'galaxy-a'
  | 'galaxy-note'
  | 'galaxy-j'
  | 'other'

export type SamsungSeries = {
  id: SamsungSeriesId
  label: string
  description: string
}

export const SAMSUNG_SERIES: SamsungSeries[] = [
  {
    id: 'galaxy-s',
    label: 'Galaxy S Series',
    description: 'Flagship S line — S25, S24, S23 and earlier',
  },
  {
    id: 'galaxy-z',
    label: 'Galaxy Z Series (Foldable)',
    description: 'Z Fold and Z Flip foldable phones',
  },
  {
    id: 'galaxy-a',
    label: 'Galaxy A Series',
    description: 'A-series everyday and mid-range phones',
  },
  {
    id: 'galaxy-note',
    label: 'Galaxy Note Series',
    description: 'Note phablets and Note Ultra models',
  },
  {
    id: 'galaxy-j',
    label: 'Galaxy J Series',
    description: 'J-series phones',
  },
  {
    id: 'other',
    label: 'Other Samsung',
    description: 'Other Samsung phones and not listed models',
  },
]

const SERIES_BY_ID = new Map(SAMSUNG_SERIES.map((series) => [series.id, series]))

export function usesSamsungSeriesPicker(brandId: string | null | undefined): boolean {
  return brandId === 'samsung-phone'
}

export function getSamsungSeries(id: string | null | undefined): SamsungSeries | null {
  if (!id) return null
  return SERIES_BY_ID.get(id as SamsungSeriesId) ?? null
}

/** Classify a Samsung phone model into a booking series. */
export function samsungSeriesIdForModel(model: string): SamsungSeriesId {
  const lower = model.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()

  if (!lower || lower.includes('template of all')) return 'other'
  if (/\bother\b/.test(lower) && /samsung/.test(lower)) return 'other'
  if (/\btab\b/.test(lower)) return 'other'

  if (/\bz\s*fold\b|\bz\s*flip\b|\bfold\b|\bflip\b/.test(lower)) return 'galaxy-z'
  if (/\bnote\b/.test(lower)) return 'galaxy-note'
  if (/\bj\s?\d/.test(lower) || /\bgalaxy\s*j\b/.test(lower)) return 'galaxy-j'
  // S before A so names like "Galaxy S3 … SM A310F" stay in S Series.
  if (
    /\bgalaxy\s*s\s?\d/.test(lower) ||
    /\bsamsung\s*galaxy\s*s/.test(lower) ||
    /\bsamsung\s*s\s?\d/.test(lower) ||
    /\bs\s?\d{1,2}\b/.test(lower.replace(/^samsung\s+/, ''))
  ) {
    return 'galaxy-s'
  }
  if (
    /\bgalaxy\s*a\s?\d/.test(lower) ||
    /\bsamsung\s*a\s?\d/.test(lower) ||
    /\ba\s?\d{1,2}\b/.test(lower.replace(/^samsung\s+/, ''))
  ) {
    return 'galaxy-a'
  }

  return 'other'
}

function isBookableSamsungModel(model: string): boolean {
  const lower = model.toLowerCase()
  return Boolean(lower.trim()) && !lower.includes('template of all')
}

/**
 * Newest first within / across Samsung phone lines.
 * Generation (S25 > S24…), then Ultra → +/Plus → FE → Edge → base → Mini.
 * Z Fold before Z Flip at the same generation.
 */
function samsungModelSortKey(name: string): [number, number, number, string] {
  const lower = name.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()

  if (isGenericModel(name)) return [0, 0, 0, lower]

  // Tablets / misc sink to the bottom of "other"
  if (/\btab\b/.test(lower)) return [1, 0, 0, lower]

  let family = 0
  let generation = 0

  const zFold = lower.match(/\bz\s*fold\s*(\d{1,2})?/)
  const zFlip = lower.match(/\bz\s*flip\s*(\d{1,2})?/)
  if (zFold) {
    family = 500
    generation = zFold[1] ? Number(zFold[1]) : 1
  } else if (zFlip) {
    family = 490
    generation = zFlip[1] ? Number(zFlip[1]) : 1
  } else if (/\bnote\b/.test(lower)) {
    family = 400
    const note = lower.match(/\bnote\s*(\d{1,2})/)
    generation = note ? Number(note[1]) : 1
    if (/edge/.test(lower) && !note) generation = 0.5
  } else {
    const s = lower.match(/\b(?:galaxy\s*)?s\s*(\d{1,2})\b/)
    const a = lower.match(/\b(?:galaxy\s*)?a\s*(\d{1,2})\b/)
    const j = lower.match(/\b(?:galaxy\s*)?j\s*(\d{1,2})\b/)
    if (s) {
      family = 600
      generation = Number(s[1])
    } else if (a) {
      family = 300
      generation = Number(a[1])
      // A15–A59 are newer than legacy A70/A80/A90 — boost the modern band.
      if (generation >= 10 && generation <= 59) generation += 100
    } else if (j) {
      family = 200
      generation = Number(j[1])
    } else {
      const nums = [...lower.matchAll(/(\d{1,2})/g)].map((m) => Number(m[1]))
      family = 100
      generation = nums.length ? Math.max(...nums) : 0
    }
  }

  let tier = 20
  if (/ultra/.test(lower)) tier = 50
  else if (/\+|plus/.test(lower)) tier = 40
  else if (/\bfe\b/.test(lower)) tier = 25
  else if (/edge/.test(lower)) tier = 30
  else if (/mini/.test(lower)) tier = 10
  else if (/prime/.test(lower)) tier = 15
  else if (/pro/.test(lower)) tier = 35

  // Higher family/generation/tier first
  return [family * 100 + generation, tier, 0, lower]
}

/** Sort Samsung models newest-first (S25 → older, Ultra before base). */
export function sortSamsungModels(models: string[]): string[] {
  return [...models].sort((a, b) => {
    const [a0, a1, a2, aName] = samsungModelSortKey(a)
    const [b0, b1, b2, bName] = samsungModelSortKey(b)
    if (a0 !== b0) return b0 - a0
    if (a1 !== b1) return b1 - a1
    if (a2 !== b2) return b2 - a2
    return aName.localeCompare(bName)
  })
}

export function modelsInSamsungSeries(models: string[], seriesId: SamsungSeriesId): string[] {
  return sortSamsungModels(
    models.filter(
      (model) => isBookableSamsungModel(model) && samsungSeriesIdForModel(model) === seriesId,
    ),
  )
}

/** Series that actually have models in the current Samsung list, in display order. */
export function samsungSeriesWithModels(models: string[]): { series: SamsungSeries; models: string[] }[] {
  return SAMSUNG_SERIES.map((series) => ({
    series,
    models: modelsInSamsungSeries(models, series.id),
  })).filter((entry) => entry.models.length > 0)
}
