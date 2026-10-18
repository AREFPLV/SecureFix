import { useEffect } from 'react'

const CANONICAL_ORIGIN = 'https://securefix.uk'

type PageSeo = {
  title: string
  description: string
  path: string
  image?: string
  keywords?: string
  robots?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[] | unknown
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

const JSON_LD_ID = 'page-jsonld'

/**
 * Sets document title, meta tags, and optional schema.org JSON-LD for SPA routes.
 */
export function usePageSeo({ title, description, path, image, keywords, robots, jsonLd }: PageSeo) {
  const jsonLdKey = JSON.stringify(jsonLd ?? null)
  useEffect(() => {
    const url = `${CANONICAL_ORIGIN}${path === '/' ? '/' : path}`
    const img = image ? `${CANONICAL_ORIGIN}${image}` : `${CANONICAL_ORIGIN}/images/hero-banner.png`

    const previousTitle = document.title
    document.title = title

    upsertMeta('name', 'description', description)
    if (keywords) upsertMeta('name', 'keywords', keywords)
    upsertMeta('name', 'robots', robots ?? 'index, follow')

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', img)
    upsertMeta('property', 'og:locale', 'en_GB')
    upsertMeta('property', 'og:site_name', 'SecureFix')

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', img)

    upsertLink('canonical', url)

    document.head.querySelector(`#${JSON_LD_ID}`)?.remove()
    if (jsonLdKey !== 'null') {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = JSON_LD_ID
      script.text = jsonLdKey
      document.head.appendChild(script)
    }

    return () => {
      document.title = previousTitle
      document.head.querySelector(`#${JSON_LD_ID}`)?.remove()
    }
  }, [title, description, path, image, keywords, robots, jsonLdKey])
}
