import { isGenericModel } from '@/lib/slugify'

/**
 * Newest generation first; within a generation:
 * Pro Max → Pro → Plus → Air → e → base → Mini.
 * Then SE → X / XS / XR → older numbered (8–5) → Other.
 */
function iphoneSortKey(name: string): [number, number, number, string] {
  const lower = name.toLowerCase().trim()

  if (isGenericModel(name) || lower.includes('duo')) {
    return [9000, 0, 0, lower]
  }

  if (/\bse\b/.test(lower)) {
    let gen = 1
    if (/3rd|2022/.test(lower)) gen = 3
    else if (/2nd|2020|2021/.test(lower)) gen = 2
    else if (/1st|2015|2016/.test(lower)) gen = 1
    // After modern numbered lines (11+), newest SE first
    return [100, -gen, 0, lower]
  }

  if (/\bxr\b/.test(lower)) return [200, 2, 0, lower]
  if (/\bxs\s*max\b/.test(lower)) return [200, 0, 0, lower]
  if (/\bxs\b/.test(lower)) return [200, 1, 0, lower]
  if (/\bx\b/.test(lower) && !/\d/.test(lower.replace(/^iphone\s*/, ''))) {
    return [200, 3, 0, lower]
  }

  const num = lower.match(/iphone\s*(\d{1,2})(s|c)?/)
  if (!num) return [8000, 0, 0, lower]

  let generation = Number(num[1])
  if (num[2] === 's') generation += 0.5
  else if (num[2] === 'c') generation += 0.25

  // Modern line (11+) first by newest; older 5–8 after X-series.
  const genRank = generation >= 11 ? -generation : 300 - generation

  let variant = 5
  if (/pro\s*max/.test(lower)) variant = 0
  else if (/\bpro\b/.test(lower)) variant = 1
  else if (/\bplus\b/.test(lower)) variant = 2
  else if (/\bair\b/.test(lower)) variant = 3
  else if (/iphone\s*\d{1,2}e\b/.test(lower) || /\be\b/.test(lower)) variant = 4
  else if (/\bmini\b/.test(lower)) variant = 6
  else variant = 5

  return [genRank, variant, 0, lower]
}

/** Sort iPhone model labels for booking / repair pickers. */
export function sortIphoneModels(models: string[]): string[] {
  return [...models].sort((a, b) => {
    const [a0, a1, a2, aName] = iphoneSortKey(a)
    const [b0, b1, b2, bName] = iphoneSortKey(b)
    if (a0 !== b0) return a0 - b0
    if (a1 !== b1) return a1 - b1
    if (a2 !== b2) return a2 - b2
    return aName.localeCompare(bName)
  })
}
