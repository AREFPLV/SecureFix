export type DeviceCondition = {
  powersOn: boolean
  screen: 'flawless' | 'light-wear' | 'cracked' | 'broken'
  body: 'flawless' | 'light-wear' | 'damaged'
  fullyWorking: boolean
  icloudLocked: boolean
}

export const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB', 'Other']

export const conditionLabels = {
  screen: {
    flawless: 'Flawless, no scratches',
    'light-wear': 'Light wear, minor marks',
    cracked: 'Cracked or chipped',
    broken: 'Broken / not working',
  },
  body: {
    flawless: 'Flawless, like new',
    'light-wear': 'Light wear, minor scuffs',
    damaged: 'Damaged, dents or cracks',
  },
}

export const tradeInCategories = [
  'smartphone',
  'tablet-ipad',
  'pc-laptop',
  'gaming-console',
  'smart-watch',
] as const

const basePrices: Record<string, number> = {
  smartphone: 280,
  'tablet-ipad': 220,
  'pc-laptop': 350,
  'gaming-console': 200,
  'smart-watch': 120,
  ipod: 60,
  other: 80,
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export function estimateTradeInQuote(
  categoryId: string,
  model: string,
  condition: DeviceCondition,
): number {
  const base = basePrices[categoryId] ?? 100
  const modelFactor = 0.6 + (hashString(model) % 80) / 100
  let price = base * modelFactor

  if (!condition.powersOn) price *= 0.25
  if (!condition.fullyWorking) price *= 0.5
  if (condition.icloudLocked) price *= 0.1

  switch (condition.screen) {
    case 'light-wear':
      price *= 0.9
      break
    case 'cracked':
      price *= 0.65
      break
    case 'broken':
      price *= 0.35
      break
  }

  switch (condition.body) {
    case 'light-wear':
      price *= 0.92
      break
    case 'damaged':
      price *= 0.75
      break
  }

  return Math.max(Math.round(price / 5) * 5, 5)
}

export const howItWorks = [
  {
    step: 1,
    title: 'Find Your Device',
    description: 'Search or browse by category, brand and model',
  },
  {
    step: 2,
    title: 'Tell Us the Condition',
    description: 'Share device condition — our technician will get in touch with you',
  },
  {
    step: 3,
    title: 'Get Paid',
    description: 'Drop off in store, mail in, or free London collection',
  },
]
