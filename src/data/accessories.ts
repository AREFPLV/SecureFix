export type AccessoryCategory =
  | 'all'
  | 'cases'
  | 'screen-protectors'
  | 'chargers'
  | 'cables'
  | 'headphones'
  | 'other'

export type Accessory = {
  id: string
  name: string
  brand: string
  compatibility: string
  category: Exclude<AccessoryCategory, 'all'>
  price: number
}

export const accessoryCategories: { id: AccessoryCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'cases', label: 'Cases' },
  { id: 'screen-protectors', label: 'Screen Protectors' },
  { id: 'chargers', label: 'Chargers' },
  { id: 'cables', label: 'Cables' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'other', label: 'Other' },
]

export const accessories: Accessory[] = [
  { id: '1', name: 'iPhone Anti-Shock MagSafe Case', brand: 'Apple', compatibility: '16/15/14/13 series', category: 'cases', price: 19.99 },
  { id: '2', name: 'Grey Carbon Fiber Case', brand: 'Apple', compatibility: '16/15/14/13 series', category: 'cases', price: 19.99 },
  { id: '3', name: 'Black Carbon Fiber Case', brand: 'Apple', compatibility: '16/15/14/13 series', category: 'cases', price: 19.99 },
  { id: '4', name: 'Case with Built-In Stand', brand: 'Apple', compatibility: '17 Pro Max / 17 Pro / 17 Air', category: 'cases', price: 19.99 },
  { id: '5', name: 'iPhone 17 Pro Max Silicone Case', brand: 'Apple', compatibility: '17 Pro Max', category: 'cases', price: 19.99 },
  { id: '6', name: 'Samsung Z Fold 6 Hard Case', brand: 'Samsung', compatibility: 'Z Fold 6', category: 'cases', price: 19.99 },
  { id: '7', name: 'Samsung Z Flip 5 Ring Cover', brand: 'Samsung', compatibility: 'Z Flip 5', category: 'cases', price: 19.99 },
  { id: '8', name: 'iPhone Glitter Case', brand: 'Apple', compatibility: '11 Pro Max / 11 Pro / 11', category: 'cases', price: 12.99 },
  { id: '9', name: 'Tempered Glass Screen Protector', brand: 'Apple', compatibility: 'All iPhone models', category: 'screen-protectors', price: 10.0 },
  { id: '10', name: 'Privacy Matte Screen Protector', brand: 'Apple, Samsung, Google', compatibility: 'Most smartphones', category: 'screen-protectors', price: 20.0 },
  { id: '11', name: 'Hydrogel Screen Protector 0.18mm', brand: 'Universal', compatibility: 'Apple, Samsung, Google, Xiaomi', category: 'screen-protectors', price: 20.0 },
  { id: '12', name: 'Hydrogel Screen Protector 0.22mm', brand: 'Universal', compatibility: 'Apple, Samsung, Google, Oppo', category: 'screen-protectors', price: 25.0 },
  { id: '13', name: 'iPad Tempered Glass Screen Protector', brand: 'Apple, Galaxy Tab', compatibility: 'All iPad models', category: 'screen-protectors', price: 19.99 },
  { id: '14', name: 'Camera Lens Protector', brand: 'Apple, Samsung', compatibility: '12 Pro to 17 Pro Max / S23 to S25 Ultra', category: 'screen-protectors', price: 9.99 },
  { id: '15', name: 'Apple Watch Tempered Glass Protector', brand: 'Apple', compatibility: '44mm, 45mm, 46mm, 49mm', category: 'screen-protectors', price: 9.99 },
  { id: '16', name: 'Apple 20W USB-C Adapter', brand: 'Apple', compatibility: 'All Apple devices', category: 'chargers', price: 19.99 },
  { id: '17', name: 'Apple 60W USB-C to USB-C Cable', brand: 'Apple', compatibility: 'iPhone 15/16/17', category: 'chargers', price: 18.99 },
  { id: '18', name: 'Samsung 45W PD Adapter USB-C', brand: 'Samsung', compatibility: 'All Samsung devices', category: 'chargers', price: 24.99 },
  { id: '19', name: 'Samsung 25W PD Adapter USB-C', brand: 'Samsung', compatibility: 'All Samsung devices', category: 'chargers', price: 19.99 },
  { id: '20', name: 'SecureFix 65W Super Fast Charger', brand: 'SecureFix', compatibility: 'All USB-C devices', category: 'chargers', price: 24.99 },
  { id: '21', name: 'Magnetic 15W Wireless Charger', brand: 'SecureFix', compatibility: 'MagSafe / Qi devices', category: 'chargers', price: 29.99 },
  { id: '22', name: 'HP 65W USB-C Laptop Charger', brand: 'HP', compatibility: 'All HP models', category: 'chargers', price: 34.99 },
  { id: '23', name: 'Dell 65W USB-C Laptop Charger', brand: 'Dell', compatibility: 'All Dell models', category: 'chargers', price: 34.99 },
  { id: '24', name: 'Apple USB-C to Lightning Cable 1M', brand: 'Apple', compatibility: 'iPhone 14 and below', category: 'cables', price: 18.99 },
  { id: '25', name: 'Apple 240W USB-C to USB-C Cable 2M', brand: 'Apple', compatibility: 'iPhone 15/16/17', category: 'cables', price: 29.99 },
  { id: '26', name: 'SecureFix USB-C to USB-C 2M Cable', brand: 'SecureFix', compatibility: 'All USB-C devices', category: 'cables', price: 11.99 },
  { id: '27', name: 'SecureFix USB-C to Lightning 2M Cable', brand: 'SecureFix', compatibility: 'iPhone 14 series and below', category: 'cables', price: 11.99 },
  { id: '28', name: 'USB-C to HDMI Cable 1.8m', brand: 'SecureFix', compatibility: 'Laptops, tablets, phones', category: 'cables', price: 27.99 },
  { id: '29', name: 'Type-C to HDTV 8-in-1 Adapter', brand: 'Universal', compatibility: 'All-in-one hub', category: 'cables', price: 29.99 },
  { id: '30', name: 'Apple USB-C EarPods', brand: 'Apple', compatibility: 'USB-C devices', category: 'headphones', price: 18.99 },
  { id: '31', name: 'Apple Lightning EarPods', brand: 'Apple', compatibility: 'Lightning devices', category: 'headphones', price: 18.99 },
  { id: '32', name: 'SecureFix USB-C EarPods', brand: 'SecureFix', compatibility: 'USB-C devices', category: 'headphones', price: 11.99 },
  { id: '33', name: 'Wireless Noise Cancelling Earbuds', brand: 'SecureFix', compatibility: 'Bluetooth 5.3', category: 'headphones', price: 59.99 },
  { id: '34', name: 'Pro Sound Wireless Earbuds', brand: 'SecureFix', compatibility: 'Bluetooth 5.3', category: 'headphones', price: 69.99 },
  { id: '35', name: '10K Magnetic Wireless Power Bank', brand: 'SecureFix', compatibility: 'MagSafe / Qi', category: 'other', price: 49.99 },
  { id: '36', name: '20K Fast Charging Power Bank', brand: 'SecureFix', compatibility: 'All devices', category: 'other', price: 49.99 },
  { id: '37', name: 'UK 3-Pin to EU 2-Pin Travel Adapter', brand: 'SecureFix', compatibility: 'Travel', category: 'other', price: 9.99 },
  { id: '38', name: 'Fast Car Charger 49W', brand: 'SecureFix', compatibility: 'USB-C / USB-A', category: 'other', price: 19.99 },
  { id: '39', name: '2.4G Wireless Keyboard & Mouse Set', brand: 'SecureFix', compatibility: 'PC / Laptop', category: 'other', price: 39.99 },
  { id: '40', name: 'USB-C Card Reader', brand: 'SecureFix', compatibility: 'USB-C / USB-A / Lightning', category: 'other', price: 14.99 },
]
