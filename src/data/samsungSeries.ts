/** Samsung Galaxy phone series used on the booking model picker. */

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
    label: 'Galaxy Z Series',
    description: 'Foldable Z Fold and Z Flip phones',
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

export function modelsInSamsungSeries(models: string[], seriesId: SamsungSeriesId): string[] {
  return models.filter(
    (model) => isBookableSamsungModel(model) && samsungSeriesIdForModel(model) === seriesId,
  )
}

/** Series that actually have models in the current Samsung list, in display order. */
export function samsungSeriesWithModels(models: string[]): { series: SamsungSeries; models: string[] }[] {
  return SAMSUNG_SERIES.map((series) => ({
    series,
    models: modelsInSamsungSeries(models, series.id),
  })).filter((entry) => entry.models.length > 0)
}
