export type RepairIssue = {
  label: string
  price: number | null
  time: string
}

export const phoneIssues: RepairIssue[] = [
  { label: 'Audio Repair', price: 99.99, time: '2h' },
  { label: 'BackGlass Replacement', price: 149.99, time: '1h 30m' },
  { label: 'Battery Replacement', price: 79.99, time: '30m' },
  { label: 'Camera Lens Glass Repair', price: 59.99, time: '30m' },
  { label: 'Charging Unit Repair', price: 149.99, time: '1h' },
  { label: 'Diagnostics', price: null, time: '2h' },
  { label: 'Front Camera Replacement', price: 99.99, time: '30m' },
  { label: 'IC Replacement', price: null, time: '2h' },
  { label: 'Liquid Diagnostics', price: null, time: '2h' },
  { label: 'Mic Replacement', price: 149.99, time: '1h' },
  { label: 'Power/Volume Button', price: 129.99, time: '1h' },
  { label: 'Premium Screen Replacement', price: 199.99, time: '30m' },
  { label: 'Rear Camera Replacement', price: 149.99, time: '1h' },
  { label: 'Signal Repair', price: null, time: '1h' },
  { label: 'Software Restore', price: 49.99, time: '1h' },
]

export const laptopIssues: RepairIssue[] = [
  { label: 'Screen Replacement', price: 199.99, time: '2h' },
  { label: 'Battery Replacement', price: 129.99, time: '1h' },
  { label: 'Keyboard Replacement', price: 119.99, time: '1h 30m' },
  { label: 'Charging Port Repair', price: 99.99, time: '1h' },
  { label: 'SSD / HDD Upgrade', price: 79.99, time: '1h' },
  { label: 'RAM Upgrade', price: 59.99, time: '30m' },
  { label: 'Fan / Overheating Fix', price: 89.99, time: '1h 30m' },
  { label: 'Motherboard Repair', price: null, time: '3h' },
  { label: 'Hinge Repair', price: 109.99, time: '2h' },
  { label: 'Touchpad Replacement', price: 89.99, time: '1h' },
  { label: 'Speaker Replacement', price: 79.99, time: '1h' },
  { label: 'Wi-Fi / Bluetooth Fix', price: 69.99, time: '1h' },
  { label: 'Virus / Malware Removal', price: 49.99, time: '1h' },
  { label: 'Windows / macOS Reinstall', price: 49.99, time: '1h 30m' },
  { label: 'Data Recovery', price: null, time: '2h+' },
  { label: 'Diagnostics', price: null, time: '1h' },
  { label: 'Liquid Damage Repair', price: null, time: '3h' },
]

export const consoleIssues: RepairIssue[] = [
  { label: 'HDMI Port Replacement', price: 99.99, time: '1h 30m' },
  { label: 'Disc Drive Repair', price: 89.99, time: '1h' },
  { label: 'Power Supply Repair', price: 79.99, time: '1h' },
  { label: 'Overheating / Fan Fix', price: 69.99, time: '1h' },
  { label: 'Controller Repair', price: 49.99, time: '30m' },
  { label: 'Joystick / Drift Fix', price: 39.99, time: '30m' },
  { label: 'Charging Port Repair', price: 59.99, time: '1h' },
  { label: 'Screen Replacement (Switch)', price: 129.99, time: '1h 30m' },
  { label: 'SSD Upgrade', price: 89.99, time: '1h' },
  { label: 'Motherboard Repair', price: null, time: '3h' },
  { label: 'Software / System Restore', price: 49.99, time: '1h' },
  { label: 'Diagnostics', price: null, time: '1h' },
]

export const tabletIssues: RepairIssue[] = [
  { label: 'Screen Replacement', price: 169.99, time: '1h' },
  { label: 'Battery Replacement', price: 99.99, time: '1h' },
  { label: 'Charging Port Repair', price: 89.99, time: '1h' },
  { label: 'BackGlass Replacement', price: 129.99, time: '1h 30m' },
  { label: 'Front Camera Replacement', price: 79.99, time: '30m' },
  { label: 'Rear Camera Replacement', price: 99.99, time: '1h' },
  { label: 'Speaker Replacement', price: 69.99, time: '1h' },
  { label: 'Home Button / Touch ID', price: 89.99, time: '1h' },
  { label: 'Software Restore', price: 49.99, time: '1h' },
  { label: 'Liquid Diagnostics', price: null, time: '2h' },
  { label: 'Diagnostics', price: null, time: '1h' },
]

export const ipodIssues: RepairIssue[] = [
  { label: 'Screen Replacement', price: 79.99, time: '1h' },
  { label: 'Battery Replacement', price: 59.99, time: '1h' },
  { label: 'Charging Port Repair', price: 49.99, time: '30m' },
  { label: 'Home Button Repair', price: 39.99, time: '30m' },
  { label: 'Audio / Headphone Jack', price: 39.99, time: '30m' },
  { label: 'Software Restore', price: 29.99, time: '30m' },
  { label: 'Diagnostics', price: null, time: '1h' },
]

export const watchIssues: RepairIssue[] = [
  { label: 'Screen Replacement', price: 149.99, time: '1h 30m' },
  { label: 'Battery Replacement', price: 99.99, time: '1h' },
  { label: 'Crown / Button Repair', price: 69.99, time: '1h' },
  { label: 'Speaker / Mic Repair', price: 79.99, time: '1h' },
  { label: 'Sensor Repair', price: null, time: '1h 30m' },
  { label: 'Band / Strap Connector', price: 39.99, time: '30m' },
  { label: 'Water Damage Repair', price: null, time: '2h' },
  { label: 'Software / Reset', price: 29.99, time: '30m' },
  { label: 'Diagnostics', price: null, time: '1h' },
]

export const otherIssues: RepairIssue[] = [
  { label: 'Printer Repair', price: 69.99, time: '1h' },
  { label: 'Printer Head Cleaning', price: 39.99, time: '30m' },
  { label: 'Data Recovery, HDD', price: null, time: '2h+' },
  { label: 'Data Recovery, SSD', price: null, time: '2h+' },
  { label: 'Data Recovery, USB / SD', price: null, time: '1h+' },
  { label: 'Drone Repair', price: null, time: '2h' },
  { label: 'Speaker / Audio Repair', price: 59.99, time: '1h' },
  { label: 'Other Device Repair', price: null, time: 'TBD' },
  { label: 'Diagnostics', price: null, time: '1h' },
]

export const issuesByCategory: Record<string, RepairIssue[]> = {
  'smartphone': phoneIssues,
  'pc-laptop': laptopIssues,
  'gaming-console': consoleIssues,
  'tablet-ipad': tabletIssues,
  'ipod': ipodIssues,
  'smart-watch': watchIssues,
  'other': otherIssues,
}

const londonPrefixes = [
  'E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC',
  'BR', 'CR', 'DA', 'EN', 'HA', 'IG', 'KT',
  'RM', 'SM', 'TW', 'UB', 'WD',
]

export function isLondonPostcode(postcode: string): boolean {
  const cleaned = postcode.trim().toUpperCase().replace(/\s+/g, '')
  return londonPrefixes.some((prefix) => cleaned.startsWith(prefix))
}
