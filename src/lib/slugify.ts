export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/["']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function isGenericModel(label: string): boolean {
  const lower = label.toLowerCase()
  return (
    lower.includes('other') ||
    lower.includes('not listed') ||
    lower.includes('describe below')
  )
}
