import { listedModelNames } from '@/data/listedPrices'

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
      { id: 'samsung-phone', label: 'Samsung', models: ['Galaxy S25 Ultra', 'Galaxy S25+', 'Galaxy S25', 'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22', 'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21', 'Galaxy Z Fold 6', 'Galaxy Z Fold 5', 'Galaxy Z Flip 6', 'Galaxy Z Flip 5', 'Galaxy A55', 'Galaxy A54', 'Galaxy A35', 'Galaxy A34', 'Galaxy A25', 'Galaxy A15', 'Other Samsung'] },
      { id: 'google', label: 'Google Pixel', models: ['Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 8 Pro', 'Pixel 8', 'Pixel 8a', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a', 'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a', 'Other Pixel'] },
      { id: 'oneplus', label: 'OnePlus', models: ['OnePlus 13', 'OnePlus 12', 'OnePlus 11', 'OnePlus Nord 4', 'OnePlus Nord 3', 'OnePlus Nord CE', 'Other OnePlus'] },
      { id: 'huawei', label: 'Huawei', models: ['P60 Pro', 'P50 Pro', 'Mate 60 Pro', 'Mate 50 Pro', 'Nova 12', 'Nova 11', 'Other Huawei'] },
      { id: 'xiaomi', label: 'Xiaomi', models: ['Xiaomi 14 Ultra', 'Xiaomi 14', 'Xiaomi 13 Pro', 'Xiaomi 13', 'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi Note 12 Pro', 'POCO F6 Pro', 'POCO F5', 'POCO X6 Pro', 'Other Xiaomi'] },
      { id: 'sony-phone', label: 'Sony', models: ['Xperia 1 VI', 'Xperia 1 V', 'Xperia 5 V', 'Xperia 10 VI', 'Other Sony'] },
      { id: 'nokia', label: 'Nokia', models: ['Nokia G42', 'Nokia G22', 'Nokia X30', 'Nokia XR21', 'Other Nokia'] },
      { id: 'motorola', label: 'Motorola', models: ['Edge 50 Pro', 'Edge 40 Pro', 'Moto G84', 'Moto G54', 'Razr 50', 'Razr 40', 'Other Motorola'] },
      { id: 'oppo', label: 'OPPO', models: ['Find X7 Ultra', 'Find X6 Pro', 'Reno 12 Pro', 'Reno 11', 'A98', 'Other OPPO'] },
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

for (const category of deviceCategories) {
  for (const brand of category.brands) {
    const names = listedModelNames(category.id, brand.id)
    if (names?.length) brand.models = names
  }
}
