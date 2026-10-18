import { Link } from 'react-router-dom'
import { usePageSeo } from '@/hooks/usePageSeo'

export default function NotFound() {
  usePageSeo({
    title: 'Page not found | SecureFix',
    description: 'That address is not on SecureFix.',
    path: '/404',
    robots: 'noindex, follow',
  })

  return (
    <main className="site-page not-found-page">
      <div className="container">
        <h1>Page not found</h1>
        <p>That address is not on SecureFix.</p>
        <Link to="/" className="btn btn-primary">
          Back to the homepage
        </Link>
      </div>
    </main>
  )
}
