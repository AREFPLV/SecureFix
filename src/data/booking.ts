import { listedModelNames } from '@/data/listedPrices'
import { isGenericModel } from '@/lib/slugify'

export type DeviceCategory = {
  id: string
  label: string
  icon: string
  description: string
  brands: Brand[]
}

export type Brand = {
  id: string
  label: string
  models: string[]
}

export const deviceCategories: DeviceCategory[] = [
  {
    id: 'smartphone',
    label: 'Smartphone',
    icon: '📱',
    description: 'iPhone, Samsung Galaxy, Google Pixel and all major brands',
    brands: [
      { id: 'apple-phone', label: 'Apple iPhone', models: ['iPhone Duo', 'iPhone 18 Pro Max', 'iPhone 18 Pro', 'iPhone 18 Air', 'iPhone 18', 'iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17 Air', 'iPhone 17e', 'iPhone 17', 'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16e', 'iPhone 16', 'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 Mini', 'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 Mini', 'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11', 'iPhone SE (3rd)', 'iPhone SE (2nd)', 'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X', 'Other iPhone'] },
      {
        id: 'samsung-phone',
        label: 'Samsung',
        models: [
          'Galaxy S25 Ultra',
          'Galaxy S25+',
          'Galaxy S25',
          'Galaxy S24 Ultra',
          'Galaxy S24+',
          'Galaxy S24 FE',
          'Galaxy S24',
          'Galaxy S23 Ultra',
          'Galaxy S23+',
          'Galaxy S23 FE',
          'Galaxy S23',
          'Galaxy S22 Ultra',
          'Galaxy S22+',
          'Galaxy S22',
          'Galaxy S21 Ultra',
          'Galaxy S21+',
          'Galaxy S21 FE',
          'Galaxy S21',
          'Galaxy S20 Ultra',
          'Galaxy S20+',
          'Galaxy S20 FE',
          'Galaxy S20',
          'Galaxy Z Fold 6',
          'Galaxy Z Fold 5',
          'Galaxy Z Fold 4',
          'Galaxy Z Flip 6',
          'Galaxy Z Flip 5',
          'Galaxy Z Flip 4',
          'Galaxy A55',
          'Galaxy A54',
          'Galaxy A53',
          'Galaxy A35',
          'Galaxy A34',
          'Galaxy A25',
          'Galaxy A15',
          'Galaxy Note 20 Ultra',
          'Galaxy Note 20',
          'Galaxy Note 10+',
          'Galaxy Note 10',
          'Other Samsung',
        ],
      },
      { id: 'google', label: 'Google Pixel', models: [
          'Pixel 11 Pro Fold',
          'Pixel 11 Pro XL',
          'Pixel 11 Pro',
          'Pixel 11',
          'Pixel 10 Pro Fold',
          'Pixel 10 Pro XL',
          'Pixel 10 Pro',
          'Pixel 10a',
          'Pixel 10',
          'Pixel 9 Pro Fold',
          'Pixel 9 Pro XL',
          'Pixel 9 Pro',
          'Pixel 9a',
          'Pixel 9',
          'Pixel 8 Pro',
          'Pixel 8a',
          'Pixel 8',
          'Pixel 7 Pro',
          'Pixel 7a',
          'Pixel 7',
          'Pixel 6 Pro',
          'Pixel 6a',
          'Pixel 6',
          'Pixel 5a',
          'Pixel 5',
          'Pixel 4a',
          'Pixel 4a 5G',
          'Pixel 4',
          'Pixel 4 XL',
          'Pixel 3a',
          'Pixel 3a XL',
          'Pixel 3',
          'Pixel 3 XL',
          'Pixel 2',
          'Pixel 2 XL',
          'Pixel Fold',
          'Pixel',
          'Pixel XL',
          'Other Pixel',
        ] },
      { id: 'oneplus', label: 'OnePlus', models: ['OnePlus 13', 'OnePlus 12', 'OnePlus 11', 'OnePlus Nord 4', 'OnePlus Nord 3', 'OnePlus Nord CE', 'Other OnePlus'] },
      { id: 'huawei', label: 'Huawei', models: [
          'P Smart 2021',
          'P Smart 2020',
          'P Smart 2019',
          'P Smart 2018',
          'Mate 60 Pro',
          'Mate 50 Pro',
          'Mate 40 Pro',
          'Mate 20 Pro',
          'Mate 20',
          'Mate 20 Lite',
          'Mate 10 Pro',
          'Mate 10 Lite',
          'Mate 9',
          'Mate 9 Lite',
          'P60 Pro',
          'P50 Pro',
          'P40 Pro',
          'P40',
          'P40 Lite',
          'P40 Lite E',
          'P30 Pro',
          'P30',
          'P30 Lite',
          'P20 Pro',
          'P20',
          'P20 Lite',
          'P10',
          'P10 Lite',
          'P9 Lite',
          'Nova 12',
          'Nova 11',
          'Nova 10',
          'Nova 9',
          'Honor 20 Pro',
          'Honor 20',
          'Honor 20 Lite',
          'Honor X 20',
          'Honor 10',
          'Honor 10 Lite',
          'Honor 8 X',
          'P Smart',
          'Y9 2018',
          'Y9 2019',
          'Y9 Prime',
          'Y7 2019',
          'Y6 2018',
          'Other Huawei',
        ] },
      { id: 'xiaomi', label: 'Xiaomi', models: [
          'Xiaomi 15 Ultra',
          'Xiaomi 15 Pro',
          'Xiaomi 15',
          'Xiaomi 14 Ultra',
          'Xiaomi 14T Pro',
          'Xiaomi 14T',
          'Xiaomi 14 Pro',
          'Xiaomi 14',
          'Xiaomi 13T Pro',
          'Xiaomi 13T',
          'Xiaomi 13 Ultra',
          'Xiaomi 13 Pro',
          'Xiaomi 13',
          'Xiaomi 13 Lite',
          'Xiaomi 12T Pro',
          'Xiaomi 12T',
          'Xiaomi 12 Pro',
          'Xiaomi 12',
          'Xiaomi 12 Lite',
          'Xiaomi 11T Pro',
          'Xiaomi 11T',
          'Xiaomi 11 Ultra',
          'Xiaomi 11 Pro',
          'Xiaomi 11',
          'Xiaomi 11 Lite 5G NE',
          'Xiaomi Mi 10T Pro',
          'Xiaomi Mi 10T',
          'Xiaomi Mi 10 Pro',
          'Xiaomi Mi 10',
          'Xiaomi Mi 9T Pro',
          'Xiaomi Mi 9T',
          'Xiaomi Mi 9',
          'Xiaomi Mix Fold 3',
          'Xiaomi Mix Fold 2',
          'Redmi Note 14 Pro+',
          'Redmi Note 14 Pro',
          'Redmi Note 14',
          'Redmi Note 13 Pro+',
          'Redmi Note 13 Pro',
          'Redmi Note 13',
          'Redmi Note 13 5G',
          'Redmi Note 12 Pro+',
          'Redmi Note 12 Pro',
          'Redmi Note 12',
          'Redmi Note 12 5G',
          'Redmi Note 11 Pro+',
          'Redmi Note 11 Pro',
          'Redmi Note 11',
          'Redmi Note 11S',
          'Redmi Note 10 Pro',
          'Redmi Note 10',
          'Redmi Note 10S',
          'Redmi Note 9 Pro',
          'Redmi Note 9',
          'Redmi Note 8 Pro',
          'Redmi Note 8',
          'Redmi 14C',
          'Redmi 13C',
          'Redmi 13',
          'Redmi 12',
          'Redmi 12C',
          'Redmi 11',
          'Redmi 10',
          'Redmi 9',
          'Redmi 9A',
          'Redmi A3',
          'Redmi A2',
          'POCO F6 Pro',
          'POCO F6',
          'POCO F5 Pro',
          'POCO F5',
          'POCO F4 GT',
          'POCO F4',
          'POCO F3',
          'POCO X6 Pro',
          'POCO X6',
          'POCO X5 Pro',
          'POCO X5',
          'POCO X4 Pro',
          'POCO X4 GT',
          'POCO X3 Pro',
          'POCO X3 NFC',
          'POCO M6 Pro',
          'POCO M6',
          'POCO M5',
          'POCO M4 Pro',
          'POCO M3',
          'POCO C65',
          'POCO C55',
          'Other Xiaomi',
        ] },
      { id: 'sony-phone', label: 'Sony', models: ['Xperia 1 VI', 'Xperia 1 V', 'Xperia 5 V', 'Xperia 10 VI', 'Other Sony'] },
      { id: 'nokia', label: 'Nokia', models: ['Nokia G42', 'Nokia G22', 'Nokia X30', 'Nokia XR21', 'Other Nokia'] },
      { id: 'motorola', label: 'Motorola', models: ['Edge 50 Pro', 'Edge 40 Pro', 'Moto G84', 'Moto G54', 'Razr 50', 'Razr 40', 'Other Motorola'] },
      { id: 'oppo', label: 'OPPO', models: [
          'Find X7 Ultra',
          'Find X7',
          'Find X6 Pro',
          'Find X6',
          'Find X5 Pro',
          'Find X5',
          'Find X5 Lite',
          'Find X3 Pro',
          'Find X3',
          'Find X3 Lite',
          'Find X3 Neo',
          'Find N2 Flip',
          'Find X2 Pro',
          'Find X2',
          'Find X2 Lite',
          'Find X2 Neo',
          'Reno 12 Pro',
          'Reno 12',
          'Reno 12 F 5G',
          'Reno 12 FS 5G',
          'Reno 11 Pro',
          'Reno 11',
          'Reno 11 F 5G',
          'Reno 10 Pro',
          'Reno 10',
          'Reno 10x Zoom',
          'Reno 9 Pro',
          'Reno 9',
          'Reno 8 Pro',
          'Reno 8 Pro 5G',
          'Reno 8',
          'Reno 8 Lite',
          'Reno 8 Lite 5G',
          'Reno 7 Pro',
          'Reno 7',
          'Reno 6 Pro Plus',
          'Reno 6 Pro',
          'Reno 6',
          'Reno 5 Pro Plus',
          'Reno 5 Pro',
          'Reno 5',
          'Reno 4 Pro',
          'Reno 4',
          'Reno 4 Z',
          'Reno 3 Pro',
          'Reno 3',
          'F27',
          'F23',
          'F21 Pro',
          'F19 Pro Plus',
          'F19 Pro',
          'F19',
          'F15',
          'K11',
          'K11X',
          'K10',
          'K10X',
          'K9 Pro',
          'K9',
          'K9X',
          'K7 5G',
          'K7X',
          'K5',
          'A98',
          'A96',
          'A94',
          'A92',
          'A92S',
          'A80 5G',
          'A78 5G',
          'A77S',
          'A74',
          'A74 5G',
          'A72',
          'A58',
          'A57',
          'A55',
          'A54',
          'A54 5G',
          'A54S',
          'A53',
          'A53S',
          'A52',
          'A40',
          'A38',
          'A31',
          'A17',
          'A17K',
          'A16',
          'A16S',
          'A15',
          'A12',
          'A9 2020',
          'A5 2020',
          'A3 5G',
          'Other OPPO',
        ] },
      { id: 'other-phone', label: 'Other Brand', models: ['Other / Not Listed'] },
    ],
  },
  {
    id: 'pc-laptop',
    label: 'PC & Laptop',
    icon: '💻',
    description: 'MacBooks, Windows laptops, desktops and all-in-ones',
    brands: [
      { id: 'apple-mac', label: 'Apple MacBook', models: ['MacBook Air M1', 'MacBook Air M2', 'MacBook Air M3', 'MacBook Pro 13"', 'MacBook Pro 14"', 'MacBook Pro 16"', 'iMac', 'Mac Mini', 'Mac Studio', 'Mac Pro'] },
      { id: 'dell', label: 'Dell', models: ['Inspiron', 'XPS 13', 'XPS 15', 'XPS 17', 'Latitude', 'Vostro', 'Precision', 'Alienware', 'G Series'] },
      { id: 'hp', label: 'HP', models: ['Pavilion', 'Envy', 'Spectre', 'EliteBook', 'ProBook', 'Omen', 'Victus', 'ZBook'] },
      { id: 'lenovo', label: 'Lenovo', models: ['ThinkPad', 'IdeaPad', 'Yoga', 'Legion', 'ThinkCentre', 'ThinkBook', 'LOQ'] },
      { id: 'asus', label: 'ASUS', models: ['ZenBook', 'VivoBook', 'ROG Strix', 'ROG Zephyrus', 'TUF Gaming', 'ProArt', 'Chromebook'] },
      { id: 'acer', label: 'Acer', models: ['Aspire', 'Swift', 'Nitro', 'Predator', 'TravelMate', 'Chromebook', 'Spin'] },
      { id: 'msi', label: 'MSI', models: ['Stealth', 'Raider', 'Titan', 'Katana', 'Thin', 'Creator', 'Prestige', 'Summit'] },
      { id: 'microsoft', label: 'Microsoft Surface', models: ['Surface Pro', 'Surface Laptop', 'Surface Go', 'Surface Book', 'Surface Studio'] },
      { id: 'samsung-laptop', label: 'Samsung', models: ['Galaxy Book', 'Galaxy Book Pro', 'Galaxy Book Flex', 'Galaxy Chromebook'] },
      { id: 'toshiba', label: 'Toshiba / Dynabook', models: ['Satellite', 'Tecra', 'Portege', 'Dynabook'] },
      { id: 'other-laptop', label: 'Other Brand', models: ['Other / Not Listed'] },
    ],
  },
  {
    id: 'gaming-console',
    label: 'Gaming Console',
    icon: '🎮',
    description: 'PlayStation, Xbox, Nintendo Switch and handheld consoles',
    brands: [
      { id: 'playstation', label: 'PlayStation', models: ['PS5', 'PS5 Slim', 'PS5 Digital', 'PS4 Pro', 'PS4 Slim', 'PS4', 'PS3', 'PS Vita', 'PSP'] },
      { id: 'xbox', label: 'Xbox', models: ['Xbox Series X', 'Xbox Series S', 'Xbox One X', 'Xbox One S', 'Xbox One', 'Xbox 360'] },
      { id: 'nintendo', label: 'Nintendo', models: ['Switch OLED', 'Switch', 'Switch Lite', 'Switch 2', 'Wii U', 'Wii', '3DS', '2DS'] },
      { id: 'steam', label: 'Steam / PC Handheld', models: ['Steam Deck', 'Steam Deck OLED', 'ROG Ally', 'Legion Go'] },
      { id: 'other-console', label: 'Other Console', models: ['Other / Not Listed'] },
    ],
  },
  {
    id: 'tablet-ipad',
    label: 'Tablet & iPad',
    icon: '📲',
    description: 'iPads, Samsung tablets, Android tablets and more',
    brands: [
      { id: 'apple-ipad', label: 'Apple iPad', models: ['iPad Pro 13" (M4)', 'iPad Pro 11" (M4)', 'iPad Pro 12.9" (M2)', 'iPad Pro 11" (M2)', 'iPad Air 13" (M2)', 'iPad Air 11" (M2)', 'iPad Air (5th)', 'iPad (10th)', 'iPad (9th)', 'iPad Mini (6th)', 'iPad Mini (5th)', 'Other iPad'] },
      { id: 'samsung-tab', label: 'Samsung', models: ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Galaxy Tab S9', 'Galaxy Tab S9 FE', 'Galaxy Tab S8 Ultra', 'Galaxy Tab S8+', 'Galaxy Tab S8', 'Galaxy Tab A9+', 'Galaxy Tab A9', 'Galaxy Tab A8', 'Other Samsung Tablet'] },
      { id: 'amazon', label: 'Amazon', models: ['Fire HD 10', 'Fire HD 8', 'Fire 7', 'Fire Max 11'] },
      { id: 'lenovo-tab', label: 'Lenovo', models: ['Tab P12 Pro', 'Tab P11 Pro', 'Tab P11', 'Tab M11', 'Tab M10', 'Other Lenovo Tablet'] },
      { id: 'microsoft-tab', label: 'Microsoft Surface', models: ['Surface Pro', 'Surface Go'] },
      { id: 'huawei-tab', label: 'Huawei', models: ['MatePad Pro', 'MatePad 11', 'MatePad SE', 'Other Huawei Tablet'] },
      { id: 'other-tablet', label: 'Other Brand', models: ['Other / Not Listed'] },
    ],
  },
  {
    id: 'ipod',
    label: 'iPod',
    icon: '🎵',
    description: 'iPod Touch, Classic, Nano and Shuffle repairs',
    brands: [
      { id: 'ipod-all', label: 'Apple iPod', models: ['iPod Touch (7th Gen)', 'iPod Touch (6th Gen)', 'iPod Touch (5th Gen)', 'iPod Classic', 'iPod Nano (7th Gen)', 'iPod Nano (6th Gen)', 'iPod Nano (5th Gen)', 'iPod Shuffle', 'Other iPod'] },
    ],
  },
  {
    id: 'smart-watch',
    label: 'Smart Watch',
    icon: '⌚',
    description: 'Apple Watch, Samsung Galaxy Watch, Garmin and more',
    brands: [
      { id: 'apple-watch', label: 'Apple Watch', models: ['Apple Watch Ultra 2', 'Apple Watch Ultra', 'Apple Watch Series 10', 'Apple Watch Series 9', 'Apple Watch Series 8', 'Apple Watch Series 7', 'Apple Watch Series 6', 'Apple Watch SE (2nd)', 'Apple Watch SE (1st)', 'Other Apple Watch'] },
      { id: 'samsung-watch', label: 'Samsung', models: ['Galaxy Watch 7', 'Galaxy Watch Ultra', 'Galaxy Watch 6 Classic', 'Galaxy Watch 6', 'Galaxy Watch 5 Pro', 'Galaxy Watch 5', 'Galaxy Watch 4 Classic', 'Galaxy Watch 4', 'Other Samsung Watch'] },
      { id: 'garmin', label: 'Garmin', models: ['Fenix 8', 'Fenix 7', 'Forerunner 965', 'Forerunner 265', 'Venu 3', 'Venu 2', 'Other Garmin'] },
      { id: 'fitbit', label: 'Fitbit', models: ['Sense 2', 'Versa 4', 'Charge 6', 'Charge 5', 'Inspire 3', 'Other Fitbit'] },
      { id: 'google-watch', label: 'Google', models: ['Pixel Watch 3', 'Pixel Watch 2', 'Pixel Watch'] },
      { id: 'huawei-watch', label: 'Huawei', models: ['Watch GT 4', 'Watch GT 3 Pro', 'Watch GT 3', 'Watch Fit 3', 'Other Huawei Watch'] },
      { id: 'other-watch', label: 'Other Brand', models: ['Other / Not Listed'] },
    ],
  },
  {
    id: 'other',
    label: 'Other Devices',
    icon: '🔧',
    description: 'Printers, data recovery, drones, speakers and more',
    brands: [
      { id: 'printer', label: 'Printer', models: ['HP Printer', 'Canon Printer', 'Epson Printer', 'Brother Printer', 'Other Printer'] },
      { id: 'drone', label: 'Drone', models: ['DJI', 'Other Drone'] },
      { id: 'speaker', label: 'Speaker / Audio', models: ['Bluetooth Speaker', 'Smart Speaker', 'Headphones', 'Earbuds', 'Other Audio'] },
      { id: 'data-recovery', label: 'Data Recovery', models: ['Hard Drive', 'SSD', 'USB Drive', 'Memory Card', 'Other Storage'] },
      { id: 'other-device', label: 'Other Device', models: ['Not Listed, describe below'] },
    ],
  },
]

/** Rank phone models so newer generations appear first in booking lists. */
function phoneModelSortKey(label: string): [number, number, number, string] {
  const name = label.trim()
  const lower = name.toLowerCase()

  // Catch-alls always last.
  if (isGenericModel(name) || lower.includes('other') || lower.includes('not listed')) {
    return [-1, 0, 0, name]
  }

  // iPhone numbered generations (18, 17, …, 5).
  const iphoneNum = lower.match(/\biphone\s*(\d{1,2})\b/)
  if (iphoneNum) {
    const gen = Number(iphoneNum[1])
    let tier = 0
    if (lower.includes('pro max')) tier = 50
    else if (lower.includes('pro')) tier = 40
    else if (lower.includes('plus') || lower.includes('max')) tier = 30
    else if (lower.includes('air')) tier = 25
    else if (/\be\b/.test(lower) || lower.includes(' mini') || lower.includes('mini')) tier = 10
    else tier = 20
    return [1000 + gen, tier, 0, name]
  }

  // iPhone X family.
  if (/\biphone\s*xs\s*max\b/.test(lower)) return [910, 50, 0, name]
  if (/\biphone\s*xs\b/.test(lower)) return [910, 40, 0, name]
  if (/\biphone\s*xr\b/.test(lower)) return [905, 20, 0, name]
  if (/\biphone\s*x\b/.test(lower)) return [900, 20, 0, name]

  // iPhone SE by generation / year.
  const seYear = lower.match(/\biphone\s*se[^0-9]*?(20\d{2}|\d(?:st|nd|rd|th)?)/)
  if (lower.includes('iphone se')) {
    if (lower.includes('3rd') || lower.includes('2022')) return [860, 30, 0, name]
    if (lower.includes('2nd') || lower.includes('2020')) return [860, 20, 0, name]
    if (lower.includes('2016') || lower.includes('1st') || lower.includes('2015')) return [860, 10, 0, name]
    if (seYear) {
      const token = seYear[1]
      const year = Number(token)
      if (year >= 2000) return [860, year - 2000, 0, name]
    }
    return [860, 0, 0, name]
  }

  // Galaxy Z foldables.
  const galaxyZ = lower.match(/\b(?:galaxy\s*)?z\s*(fold|flip)\s*(\d{1,2})?\b/)
  if (galaxyZ) {
    const kind = galaxyZ[1] === 'fold' ? 40 : 20
    const gen = Number(galaxyZ[2] || 0)
    return [760 + gen, kind, 0, name]
  }

  // Galaxy Note series (do not match Redmi Note).
  const galaxyNote = lower.includes('redmi')
    ? null
    : lower.match(/\b(?:galaxy|samsung)\s+note\s*(\d{1,2})?\b/) ||
      lower.match(/\bnote\s*(\d{1,2})\b/)
  if (galaxyNote) {
    const gen = Number(galaxyNote[1] || 0)
    let tier = 20
    if (lower.includes('ultra')) tier = 50
    else if (lower.includes('+') || lower.includes('plus')) tier = 30
    return [740 + gen, tier, 0, name]
  }

  // Galaxy S series.
  const galaxyS = lower.match(/\b(?:galaxy\s*)?s(\d{1,2})\b/)
  if (galaxyS) {
    const gen = Number(galaxyS[1])
    let tier = 20
    if (lower.includes('ultra')) tier = 50
    else if (lower.includes('+') || lower.includes('plus')) tier = 30
    else if (lower.includes('fe')) tier = 15
    return [800 + gen, tier, 0, name]
  }

  // Galaxy A series.
  const galaxyA = lower.match(/\b(?:galaxy\s*)?a(\d{1,2})\b/)
  if (galaxyA) {
    const gen = Number(galaxyA[1])
    return [650 + gen, 20, 0, name]
  }

  // Pixel numbered.
  const pixel = lower.match(/\bpixel\s*(\d{1,2})\b/)
  if (pixel) {
    const gen = Number(pixel[1])
    let tier = 20
    if (lower.includes('pro fold')) tier = 55
    else if (lower.includes('pro xl')) tier = 50
    else if (lower.includes('fold')) tier = 45
    else if (lower.includes('pro')) tier = 40
    else if (/\ba\b/.test(lower) || /pixel\s*\d+a\b/.test(lower)) tier = 10
    return [700 + gen, tier, 0, name]
  }
  if (/\bpixel\s*fold\b/.test(lower)) return [695, 45, 0, name]
  if (/\bpixel\b/.test(lower)) return [690, 20, 0, name]

  // Huawei.
  if (/\bp\s*smart\b/.test(lower)) {
    const year = Number(lower.match(/20\d{2}/)?.[0] || 0)
    return [520, year ? year - 2000 : 0, 0, name]
  }
  const huaweiMate = lower.match(/\bmate\s*(\d{1,2})\b/)
  if (huaweiMate) {
    const gen = Number(huaweiMate[1])
    let tier = 20
    if (lower.includes('pro')) tier = 40
    else if (lower.includes('lite')) tier = 10
    return [880 + gen, tier, 0, name]
  }
  const huaweiP = lower.match(/\bp(\d{1,2})\b/)
  if (huaweiP && !lower.includes('poco') && !lower.includes('pixel')) {
    const gen = Number(huaweiP[1])
    let tier = 20
    if (lower.includes('pro')) tier = 40
    else if (lower.includes('lite')) tier = 10
    return [840 + gen, tier, 0, name]
  }
  const huaweiNova = lower.match(/\bnova\s*(\d{1,2})\b/)
  if (huaweiNova) return [800 + Number(huaweiNova[1]), 20, 0, name]
  const huaweiHonor = lower.match(/\bhonor\s*([a-z]*\s*)?(\d{1,2})?\b/)
  if (/\bhonor\b/.test(lower)) {
    const gen = Number(huaweiHonor?.[2] || 0)
    return [760 + gen, 20, 0, name]
  }
  const huaweiY = lower.match(/\by(\d{1,2})\b/)
  if (huaweiY && lower.includes('y')) return [500 + Number(huaweiY[1]), 10, 0, name]

  // Xiaomi / Redmi / POCO before OPPO letter series (POCO F6 must not match OPPO F).
  if (/\bpoco\b/.test(lower)) {
    if (/\bc\d/.test(lower)) {
      const gen = Number(lower.match(/\bc(\d{1,2})\b/)?.[1] || 0)
      return [560, gen, 0, name]
    }
    const series = /\bf\d/.test(lower) ? 30 : /\bx\d/.test(lower) ? 20 : /\bm\d/.test(lower) ? 10 : 5
    const gen = Number(lower.match(/\b[fxm]\s?(\d{1,2})\b/)?.[1] || lower.match(/\b(\d{1,2})\b/)?.[1] || 0)
    return [640 + gen, series, 0, name]
  }
  if (/\bredmi\s*note\b/.test(lower)) {
    const gen = Number(lower.match(/\bnote\s*(\d{1,2})/)?.[1] || 0)
    let tier = 20
    if (lower.includes('pro+') || lower.includes('pro +') || lower.includes('proplus')) tier = 45
    else if (lower.includes('pro')) tier = 35
    return [620 + gen, tier, 0, name]
  }
  if (/\bredmi\b/.test(lower)) {
    const gen = Number(lower.match(/\bredmi\s*[a]?(\d{1,2})/)?.[1] || 0)
    return [600 + gen, 15, 0, name]
  }
  if (/\bxiaomi\b|\bmi\s*\d/.test(lower)) {
    const gen = Number(lower.match(/\b(?:xiaomi|mi)\s*(\d{1,2})/)?.[1] || 0)
    let tier = 20
    if (lower.includes('ultra')) tier = 55
    else if (lower.includes('pro')) tier = 40
    else if (lower.includes('fold')) tier = 50
    else if (/\bt\b/.test(lower)) tier = 30
    return [660 + gen, tier, 0, name]
  }

  // OPPO.
  if (/\bfind\b/.test(lower)) {
    const gen = Number(lower.match(/\bx\s*(\d{1,2})|\bn\s*(\d{1,2})/)?.[1] || lower.match(/\b(\d{1,2})\b/)?.[1] || 0)
    let tier = 20
    if (lower.includes('ultra')) tier = 55
    else if (lower.includes('pro')) tier = 40
    else if (lower.includes('flip')) tier = 45
    return [920 + gen, tier, 0, name]
  }
  if (/\breno\b/.test(lower)) {
    const gen = Number(lower.match(/\breno\s*(\d{1,2})/)?.[1] || 0)
    let tier = 20
    if (lower.includes('pro')) tier = 40
    return [860 + gen, tier, 0, name]
  }
  if (/\bf(\d{1,2})\b/.test(lower) && !lower.includes('fe') && !lower.includes('fold') && !lower.includes('poco')) {
    const gen = Number(lower.match(/\bf(\d{1,2})\b/)?.[1] || 0)
    return [820 + gen, 20, 0, name]
  }
  if (/\bk(\d{1,2})\b/.test(lower)) {
    const gen = Number(lower.match(/\bk(\d{1,2})\b/)?.[1] || 0)
    return [780 + gen, 20, 0, name]
  }
  if (/\ba(\d{1,2})\b/.test(lower) && (lower.includes('oppo') || /^a\d/i.test(name.trim()))) {
    const gen = Number(lower.match(/\ba(\d{1,2})\b/)?.[1] || 0)
    return [740 + gen, 20, 0, name]
  }

  // Fallback: prefer labels with higher numbers, keep stable alphabetical otherwise.
  const nums = [...lower.matchAll(/(\d{1,4})/g)].map((m) => Number(m[1]))
  const best = nums.length ? Math.max(...nums) : 0
  return [best, 0, 0, name]
}

function sortModelsNewestFirst(models: string[]): string[] {
  return [...models].sort((a, b) => {
    const [aGen, aTier, aExtra, aName] = phoneModelSortKey(a)
    const [bGen, bTier, bExtra, bName] = phoneModelSortKey(b)
    if (aGen !== bGen) return bGen - aGen
    if (aTier !== bTier) return bTier - aTier
    if (aExtra !== bExtra) return bExtra - aExtra
    return aName.localeCompare(bName)
  })
}

function normalizeModelKey(model: string): string {
  return model
    .toLowerCase()
    .replace(/^google\s+/, '')
    .replace(/^huawei\s+/, '')
    .replace(/^oppo\s+/, '')
    .replace(/^samsung\s+/, '')
    .replace(/^xiaomi\s+/, '')
    .replace(/\+/g, 'plus')
    // Drop screen-size suffixes from price-list labels (e.g. Pixel 9 Pro XL 6.8").
    .replace(/\b\d+\.\d+\s*(?:inch|["”])?/gi, '')
    .replace(/[^a-z0-9]+/g, '')
}

for (const category of deviceCategories) {
  for (const brand of category.brands) {
    const curated = [...brand.models]
    const fallbackOther =
      curated.find((model) => isGenericModel(model)) ?? 'Other / Not Listed'
    const names = listedModelNames(category.id, brand.id)
    if (names?.length) {
      // Prefer curated booking names, then add any price-list-only models.
      const merged = [...curated.filter((model) => !isGenericModel(model))]
      const seen = new Set(merged.map((model) => normalizeModelKey(model)))
      for (const model of names) {
        if (isGenericModel(model)) continue
        const key = normalizeModelKey(model)
        if (seen.has(key)) continue
        seen.add(key)
        merged.push(model)
      }
      brand.models = merged
    }
    if (!brand.models.some((model) => isGenericModel(model))) {
      brand.models.push(fallbackOther)
    }
    if (category.id === 'smartphone' || brand.id === 'apple-phone') {
      brand.models = sortModelsNewestFirst(brand.models)
    }
  }
}

// Keep the curated booking list order for Apple when price-list names are absent.
{
  const apple = deviceCategories
    .find((category) => category.id === 'smartphone')
    ?.brands.find((brand) => brand.id === 'apple-phone')
  if (apple) apple.models = sortModelsNewestFirst(apple.models)
}
