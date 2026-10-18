import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ScrollToTop from '@/components/ScrollToTop'
import Header from '@/components/Header'
import ChatAgent from '@/components/ChatAgent'
import Footer from '@/components/Footer'
import HomePage from '@/pages/HomePage'
import BookRepair from '@/pages/BookRepair'
import CallOut from '@/pages/CallOut'
import TradeIn from '@/pages/TradeIn'
import AccessoriesShop from '@/pages/AccessoriesShop'
import About from '@/pages/About'
import Terms from '@/pages/Terms'
import Privacy from '@/pages/Privacy'
import NotFound from '@/pages/NotFound'
import Recycling from '@/pages/Recycling'
import Lifecycle from '@/pages/Lifecycle'
import BusinessService from '@/pages/BusinessService'
import {
  PhoneRepairPage,
  ComputerRepairPage,
  ConsoleRepairPage,
} from '@/pages/ServiceLanding'
import {
  RepairCategoryPage,
  RepairBrandPage,
  RepairModelPage,
  RepairIssueRoute,
  ProductSeoPage,
  RecyclingTopicPage,
} from '@/pages/SeoRoutePages'
import HtmlSitemap from '@/pages/HtmlSitemap'
import TeamChat from '@/pages/TeamChat'

function AppShell() {
  const location = useLocation()
  const hideChrome = location.pathname.startsWith('/team-chat')

  return (
    <>
      <ScrollToTop />
      {!hideChrome ? <Header /> : null}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/phone-repair" element={<PhoneRepairPage />} />
        <Route path="/computer-repair" element={<ComputerRepairPage />} />
        <Route path="/console-repair" element={<ConsoleRepairPage />} />
        <Route path="/repair/:categoryId" element={<RepairCategoryPage />} />
        <Route path="/repair/:categoryId/:brandId" element={<RepairBrandPage />} />
        <Route path="/repair/:categoryId/:brandId/:modelSlug/:issueSlug" element={<RepairIssueRoute />} />
        <Route path="/repair/:categoryId/:brandId/:modelSlug" element={<RepairModelPage />} />
        <Route path="/products/:productSlug" element={<ProductSeoPage />} />
        <Route path="/recycling/:topicSlug" element={<RecyclingTopicPage />} />
        <Route path="/sitemap" element={<HtmlSitemap />} />
        <Route path="/book-repair" element={<BookRepair />} />
        <Route path="/call-out" element={<CallOut />} />
        <Route path="/book-call-out" element={<Navigate to="/call-out" replace />} />
        <Route path="/trade-in" element={<TradeIn />} />
        <Route path="/accessories" element={<AccessoriesShop />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/recycling" element={<Recycling />} />
        <Route path="/lifecycle" element={<Lifecycle />} />
        <Route path="/lifecycle/:serviceSlug" element={<BusinessService />} />
        <Route path="/team-chat" element={<TeamChat />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChrome ? <Footer /> : null}
      {!hideChrome ? <ChatAgent /> : null}
    </>
  )
}

export default function App() {
  return <AppShell />
}
