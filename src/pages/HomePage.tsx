import Hero from '@/components/Hero'
import ServiceCards from '@/components/ServiceCards'
import BookDeviceSection from '@/components/BookDeviceSection'
import Products from '@/components/Products'
import WhyUs from '@/components/WhyUs'
import OnSiteBooking from '@/components/OnSiteBooking'
import Contact from '@/components/Contact'
import { usePageSeo } from '@/hooks/usePageSeo'
import { homeSeo } from '@/data/seo'

export default function HomePage() {
  usePageSeo(homeSeo)

  return (
    <main>
      <Hero />
      <ServiceCards />
      <BookDeviceSection />
      <Products />
      <WhyUs />
      <OnSiteBooking />
      <Contact />
    </main>
  )
}
