import { callOutSeo } from '@/data/callOut'
import {
  aboutSeo,
  accessoriesSeo,
  bookRepairSeo,
  homeSeo,
  lifecycleSeo,
  localBusinessJsonLd,
  recyclingSeo,
  repairServiceJsonLd,
  tradeInSeo,
} from '@/data/seo'
import { getIssuePage, getIssuePages, CANONICAL_ORIGIN } from '@/data/issueCatalog'
import { getSeoCatalog, getSeoPageByPath, type SeoPageEntry } from '@/data/seoCatalog'
import { getServiceLanding } from '@/data/serviceLandings'
import { privacySeo } from '@/data/privacy'

export type PageHead = {
  title: string
  description: string
  path: string
  robots: string
  jsonLd?: unknown
}

function headFrom(input: {
  title: string
  description: string
  path: string
  jsonLd?: unknown
  robots?: string
}): PageHead {
  return {
    title: input.title,
    description: input.description,
    path: input.path,
    robots: input.robots ?? 'index, follow',
    jsonLd: input.jsonLd,
  }
}

function catalogHead(page: SeoPageEntry): PageHead {
  return headFrom({
    title: page.title,
    description: page.description,
    path: page.path,
    jsonLd: [
      localBusinessJsonLd(),
      repairServiceJsonLd({
        name: page.h1,
        serviceType: page.h1,
        description: page.description,
        path: page.path,
      }),
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${CANONICAL_ORIGIN}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.h1,
            item: `${CANONICAL_ORIGIN}${page.path}`,
          },
        ],
      },
    ],
  })
}

const STATIC: Record<string, PageHead> = {
  '/': headFrom(homeSeo),
  '/book-repair': headFrom(bookRepairSeo),
  '/about': headFrom(aboutSeo),
  '/accessories': headFrom(accessoriesSeo),
  '/recycling': headFrom(recyclingSeo),
  '/lifecycle': headFrom(lifecycleSeo),
  '/trade-in': headFrom(tradeInSeo),
  '/call-out': headFrom(callOutSeo),
  '/privacy': headFrom(privacySeo),
  '/terms': headFrom({
    title: 'Terms & Conditions | SecureFix',
    description:
      'Terms for SECUREFIX LTD repairs, including the 2-year repair warranty. Liquid damage is excluded.',
    path: '/terms',
    jsonLd: localBusinessJsonLd(),
  }),
  '/sitemap': headFrom({
    title: 'HTML Sitemap | SecureFix London',
    description:
      'Browse SecureFix repair, product, business IT and recycling pages, grouped by device.',
    path: '/sitemap',
    jsonLd: localBusinessJsonLd(),
  }),
}

export function getPageHead(path: string): PageHead {
  const normalised = path !== '/' && path.endsWith('/') ? path.replace(/\/+$/, '') : path
  if (STATIC[normalised]) return STATIC[normalised]
  if (normalised === '/phone-repair' || normalised === '/computer-repair' || normalised === '/console-repair') {
    const slug = normalised.slice(1) as 'phone-repair' | 'computer-repair' | 'console-repair'
    const landing = getServiceLanding(slug)
    if (landing) return headFrom(landing.seo)
  }
  const issue = getIssuePage(normalised)
  if (issue) {
    return headFrom({
      title: issue.title,
      description: issue.description,
      path: issue.path,
      jsonLd: issue.jsonLd,
    })
  }
  const page = getSeoPageByPath(normalised)
  if (page && page.kind !== 'static') return catalogHead(page)
  if (page) return catalogHead(page)
  return headFrom({
    title: 'Page not found | SecureFix',
    description: 'That address is not on SecureFix.',
    path: normalised,
    robots: 'noindex, follow',
  })
}

export function indexablePaths(): string[] {
  const paths = new Set<string>(getSeoCatalog().map((page) => page.path))
  for (const page of getIssuePages()) paths.add(page.path)
  paths.add('/privacy')
  paths.delete('/team-chat')
  return [...paths]
}
