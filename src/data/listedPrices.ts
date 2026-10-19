import { listedDevices, type ListedRepair } from '@/data/priceLists'

function norm(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

const modelsByBrand = new Map<string, Map<string, ListedRepair[]>>()

for (const device of listedDevices) {
  const models = new Map<string, ListedRepair[]>()
  for (const model of device.models) models.set(norm(model.name), model.repairs)
  modelsByBrand.set(`${device.categoryId}/${device.brandId}`, models)
}

export function listedModelNames(categoryId: string, brandId: string): string[] | null {
  const device = listedDevices.find(
    (item) => item.categoryId === categoryId && item.brandId === brandId,
  )
  return device?.models.map((model) => model.name) ?? null
}

/** Repairs for a model on a listed brand. Null when that brand/model has no price list. */
export function listedRepairs(
  categoryId: string,
  brandId: string,
  model: string,
): ListedRepair[] | null {
  const models = modelsByBrand.get(`${categoryId}/${brandId}`)
  if (!models) return null
  const repairs = models.get(norm(model))
  return repairs && repairs.length > 0 ? repairs : null
}

export function shortJobName(label: string): string {
  const lower = label.toLowerCase()
  if (lower.includes('screen') && lower.includes('battery')) return 'Screen and battery'
  if (lower.includes('back') && lower.includes('screen') && !lower.includes('outer')) return 'Screen and back'
  if (lower.includes('inner screen')) return 'Inner screen'
  if (lower.includes('outer screen')) return 'Outer screen'
  if (lower.includes('screen') || lower.includes('lcd') || (lower.includes('glass') && !lower.includes('lens'))) {
    return 'Screen replacement'
  }
  if (lower.includes('battery')) return 'Battery replacement'
  if (lower.includes('charg') || lower.includes('dock')) return 'Charging port repair'
  if (lower.includes('lens')) return 'Camera lens'
  if (lower.includes('rear') && lower.includes('camera')) return 'Rear camera'
  if (lower.includes('front') && lower.includes('camera')) return 'Front camera'
  if (lower.includes('camera')) return 'Camera repair'
  if (lower.includes('speaker') || lower.includes('audio') || lower.includes('loud')) return 'Speaker repair'
  if (lower.includes('microphone') || lower.includes('mic')) return 'Microphone repair'
  if (lower.includes('liquid') || lower.includes('water')) return 'Liquid damage diagnostics'
  if (lower.includes('button')) return 'Button repair'
  if (lower.includes('software')) return 'Software fix'
  if (lower.includes('diagnostic') || lower.includes("won't turn") || lower.includes('frozen')) return 'Diagnostics'
  if (lower.includes('keyboard')) return 'Keyboard repair'
  if (lower.includes('replacement watch')) return 'Replacement watch'
  return label.length > 42 ? `${label.slice(0, 42).trim()}…` : label
}
