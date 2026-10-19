export type BookingDeviceCard = {
  id: string
  label: string
  icon: string
  categoryId: string
  brandId: string
}

/** Device cards that open the model step, in the same order as a shop booking desk. */
export const bookingDeviceCards: BookingDeviceCard[] = [
  { id: 'iphone', label: 'iPhone', icon: '📱', categoryId: 'smartphone', brandId: 'apple-phone' },
  { id: 'ipad', label: 'Apple iPad', icon: '📲', categoryId: 'tablet-ipad', brandId: 'apple-ipad' },
  { id: 'samsung', label: 'Samsung', icon: '📱', categoryId: 'smartphone', brandId: 'samsung-phone' },
  { id: 'macbook', label: 'MacBook', icon: '💻', categoryId: 'pc-laptop', brandId: 'apple-mac' },
  { id: 'apple-watch', label: 'Apple Watch', icon: '⌚', categoryId: 'smart-watch', brandId: 'apple-watch' },
  { id: 'oneplus', label: 'OnePlus', icon: '📱', categoryId: 'smartphone', brandId: 'oneplus' },
  { id: 'huawei', label: 'Huawei', icon: '📱', categoryId: 'smartphone', brandId: 'huawei' },
  { id: 'pixel', label: 'Pixel', icon: '📱', categoryId: 'smartphone', brandId: 'google' },
]

export function bookingDevicePath(card: BookingDeviceCard): string {
  return `/book-repair?category=${card.categoryId}&brand=${card.brandId}`
}
