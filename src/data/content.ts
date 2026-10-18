export const BOOKING_ROUTE = '/book-repair'
export const TRADE_IN_ROUTE = '/trade-in'
export const ACCESSORIES_ROUTE = '/accessories'
export const ABOUT_ROUTE = '/about'
export const RECYCLING_ROUTE = '/recycling'
export const LIFECYCLE_ROUTE = '/lifecycle'
export const PROCUREMENT_ROUTE = '/lifecycle/procurement'
export const TERMS_ROUTE = '/terms'
export const CALL_OUT_ROUTE = '/call-out'
export const PHONE_REPAIR_ROUTE = '/phone-repair'
export const COMPUTER_REPAIR_ROUTE = '/computer-repair'
export const CONSOLE_REPAIR_ROUTE = '/console-repair'

export const site = {
  name: 'SecureFix',
  tagline: 'Same day repairs',
  phone: '020 3336 7147',
  phoneHref: 'tel:+442033367147',
  email: 'info@securefix.uk',
  website: 'securefix.uk',
  location: 'SecureFix, 218 City Road, London EC1V 2PN',
  whatsapp: 'https://wa.me/447438083630',
  whatsappPhone: '07438 083630',
}

export const socialLinks = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1F5oTbbWUE/?mibextid=wwXIfr',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/securefix_london?igsi=MWNrcjhiaGdhMXJ5eQ%3D%3D&utm_source=qr',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@securefixlondon',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@SecureFixLondon',
  },
] as const

export const navLinks = [
  { label: 'Book Repair', href: '#contact', route: BOOKING_ROUTE },
  { label: 'Business IT', href: '#contact', route: LIFECYCLE_ROUTE },
  { label: 'Device Recycling', href: '#contact', route: RECYCLING_ROUTE },
  { label: 'About Us', href: '#about', route: ABOUT_ROUTE },
]

export const serviceCards = [
  {
    icon: '🔧',
    title: 'Repair',
    description: 'Phones, tablets, laptops, computers, and gaming consoles with same-day service',
    cta: 'Book Now',
    route: BOOKING_ROUTE,
  },
  {
    icon: '💻',
    title: 'Business IT',
    description: 'Laptop procurement and full device lifecycle management for businesses',
    cta: 'More Info',
    route: LIFECYCLE_ROUTE,
  },
  {
    icon: '🔌',
    title: 'Accessories',
    description: 'Premium cases, screen protectors, and accessories',
    cta: 'Buy Now',
    route: ACCESSORIES_ROUTE,
  },
  {
    icon: '📱',
    title: 'Buy & Sell',
    description: 'New & refurbished phones, computers, tablets & electronics',
    cta: 'Trade-In',
    route: TRADE_IN_ROUTE,
  },
  {
    icon: '♻️',
    title: 'Recycle',
    description: 'Responsible recycling for phones, tablets, laptops and other electric devices',
    cta: 'More Info',
    route: RECYCLING_ROUTE,
  },
  {
    icon: '🛡️',
    title: 'Protect',
    description: 'Cases, screen protectors and chargers to look after a phone or laptop after repair',
    cta: 'More Info',
    route: ACCESSORIES_ROUTE,
  },
]

export const highlights = [
  {
    icon: '⚡',
    title: 'Same Day Service',
    description: 'Most repairs completed the same day in London',
    cta: 'Book Now',
    route: BOOKING_ROUTE,
  },
  {
    icon: '🛡️',
    title: 'Trusted Quality',
    description: 'Premium parts backed by quality you can trust',
    cta: 'Learn More',
    href: '#why-us',
  },
]

export const repairs = [
  {
    icon: '💻',
    title: 'MacBook & Laptop Repair',
    description: 'Screen replacement, battery, keyboard, charging port and more',
    features: ['Dell · HP · Lenovo · ASUS', 'Board-Level Repair', 'Same Day Available'],
    route: '/computer-repair',
  },
  {
    icon: '📱',
    title: 'Phone Repair',
    description: 'Cracked screens, battery replacement, charging port and water damage',
    features: ['iPhone · Samsung · Pixel', 'Same Day Screens', 'Back Glass Repair'],
    route: '/phone-repair',
  },
  {
    icon: '🎮',
    title: 'PS5 & Console Repair',
    description: 'PS5 HDMI port repair, stick drift, disc drive and overheating fixes',
    features: ['PS5 · PS4 · Xbox · Switch', 'DualSense Drift Fix', 'HDMI Port Repair'],
    route: '/console-repair',
  },
  {
    icon: '🖨️',
    title: 'Printer Repair',
    description: 'All brands including inkjet, laser and multifunction',
    features: ['All Brands', 'On-Site Service', 'Affordable Prices'],
  },
  {
    icon: '💾',
    title: 'Data Recovery',
    description: '100% confidential recovery from damaged devices',
    features: ['Confidential', 'Advanced Diagnostics', 'High Success Rate'],
  },
  {
    icon: '🦠',
    title: 'Virus Removal',
    description: 'Malware cleanup and system optimisation',
    features: ['Full Scan', 'System Cleanup', 'Protection Setup'],
  },
  {
    icon: '⬆️',
    title: 'RAM / SSD Upgrade',
    description: 'Speed up your PC or laptop with premium upgrades',
    features: ['Premium Parts', 'Setup Included', 'Performance Boost'],
  },
  {
    icon: '📲',
    title: 'Tablet Repair',
    description: 'iPad, Samsung and Android tablet repairs',
    features: ['Screen Replacement', 'Battery Swap', 'All Models'],
  },
]

export const whyUs = [
  {
    icon: '⚡',
    title: 'Same Day Service',
    description: 'Get your device fixed and back the same day',
  },
  {
    icon: '💰',
    title: 'Affordable Prices',
    description: 'Competitive rates with no hidden fees',
  },
  {
    icon: '🔩',
    title: 'High Quality Parts',
    description: 'Only genuine and premium compatible parts',
  },
  {
    icon: '✅',
    title: 'Expert Technicians',
    description: 'Qualified repairs you can trust for peace of mind',
  },
  {
    icon: '⏱️',
    title: 'Fast Turnaround',
    description: 'Most repairs completed within 45 minutes',
  },
  {
    icon: '🔒',
    title: '100% Confidential',
    description: 'Your data and privacy are always protected',
  },
  {
    icon: '👨‍🔧',
    title: 'Certified Technicians',
    description: 'Expert professionals you can rely on',
  },
]

export const contactMethods = [
  {
    icon: '📞',
    title: 'Call Us',
    value: site.phone,
    href: `${site.phoneHref}`,
  },
  {
    icon: '💬',
    title: 'WhatsApp',
    value: site.whatsappPhone,
    href: site.whatsapp,
  },
  {
    icon: '✉️',
    title: 'Email Us',
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: '📍',
    title: 'Location',
    value: site.location,
    href: '#contact',
  },
  {
    icon: '🌐',
    title: 'Website',
    value: site.website,
    href: 'https://securefix.uk/',
  },
]

export type CustomerReview = {
  name: string
  rating: number
  text: string
  device: string
  date: string
}

/** Template reviews — replace with Google Reviews API feed later */
export const customerReviews: CustomerReview[] = [
  {
    name: 'James M.',
    rating: 5,
    text: 'Cracked iPhone screen fixed in under an hour. Genuine parts and friendly service. Highly recommend SecureFix!',
    device: 'iPhone 14 Pro',
    date: '2 weeks ago',
  },
  {
    name: 'Sarah K.',
    rating: 5,
    text: 'My MacBook was not charging. They diagnosed and replaced the port same day. Very professional and fair price.',
    device: 'MacBook Pro',
    date: '1 month ago',
  },
  {
    name: 'Ahmed R.',
    rating: 5,
    text: 'Used the free collection service. They picked up my PS5, fixed the HDMI port, and returned it the same evening. Brilliant!',
    device: 'PlayStation 5',
    date: '3 weeks ago',
  },
  {
    name: 'Emma L.',
    rating: 5,
    text: 'Samsung battery replacement done while I waited. Phone feels brand new again. Will definitely come back.',
    device: 'Samsung Galaxy S24',
    date: '1 week ago',
  },
]

export const googleReviews = {
  rating: 5.0,
  totalReviews: 3,
  /** Stable Place ID link — opens the correct SecureFix Google Business profile */
  placeId: 'ChIJSVMnvdMddkgRfZBMxr6FMyU',
  googleUrl:
    'https://www.google.com/maps/search/?api=1&query=SecureFix%20LTD&query_place_id=ChIJSVMnvdMddkgRfZBMxr6FMyU',
  reviewsUrl:
    'https://search.google.com/local/reviews?placeid=ChIJSVMnvdMddkgRfZBMxr6FMyU',
  writeReviewUrl:
    'https://search.google.com/local/writereview?placeid=ChIJSVMnvdMddkgRfZBMxr6FMyU',
}
