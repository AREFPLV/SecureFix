import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from '@/App'
import { getPageHead, indexablePaths, type PageHead } from '@/data/pageHead'

export function render(url: string): { html: string; head: PageHead } {
  const head = getPageHead(url)
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
  return { html, head }
}

export function routes(): string[] {
  return indexablePaths()
}
