import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

type Head = {
  title: string
  description: string
  path: string
  robots: string
  jsonLd?: unknown
}

type Rendered = { html: string; head: Head }

const root = process.cwd()
const dist = path.join(root, 'dist')
const template = readFileSync(path.join(dist, 'index.html'), 'utf8')
const server = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)
const render = server.render as (url: string) => Rendered
const routes = server.routes as () => string[]
const today = new Date().toISOString().slice(0, 10)

function escapeAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function apply(html: string, head: Head) {
  const canonical = `https://securefix.uk${head.path === '/' ? '/' : head.path}`
  let out = template
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(head.title)}</title>`)
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeAttr(head.description)}" />`,
  )
  out = out.replace(
    /<meta name="robots" content="[^"]*"\s*\/?>/,
    `<meta name="robots" content="${escapeAttr(head.robots)}" />`,
  )
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`,
  )
  out = out.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttr(head.title)}" />`,
  )
  out = out.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeAttr(head.description)}" />`,
  )
  out = out.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonical}" />`,
  )
  if (head.jsonLd) {
    const json = JSON.stringify(head.jsonLd).replace(/</g, '\\u003c')
    out = out.replace(
      '</head>',
      `<script type="application/ld+json" id="page-jsonld">${json}</script>\n</head>`,
    )
  }
  out = out.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  return out
}

const paths = routes()
let count = 0
for (const route of paths) {
  const rendered = render(route)
  const file =
    route === '/'
      ? path.join(dist, 'index.html')
      : path.join(dist, route.replace(/^\//, ''), 'index.html')
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, apply(rendered.html, rendered.head))
  count += 1
  if (count % 250 === 0) console.log(`prerendered ${count}/${paths.length}`)
}

const teamDir = path.join(dist, 'team-chat')
mkdirSync(teamDir, { recursive: true })
let team = template.replace(/<title>[\s\S]*?<\/title>/, '<title>Team chat | SecureFix</title>')
team = team.replace(
  /<meta name="robots" content="[^"]*"\s*\/?>/,
  '<meta name="robots" content="noindex, nofollow" />',
)
team = team.replace(
  /<link rel="canonical" href="[^"]*"\s*\/?>/,
  '<link rel="canonical" href="https://securefix.uk/team-chat" />',
)
writeFileSync(path.join(teamDir, 'index.html'), team)

const body = paths
  .map((route) => {
    const loc = `https://securefix.uk${route === '/' ? '/' : route}`
    return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`
  })
  .join('\n')
writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
)

const live = path.join(root, 'public_html')
rmSync(path.join(live, 'assets'), { recursive: true, force: true })
cpSync(dist, live, { recursive: true })
console.log(`prerendered ${count} routes, sitemap ${today}`)
