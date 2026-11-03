import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

function googleReviewsDevApi(): Plugin {
  const seedFile = path.resolve(__dirname, 'public/api/reviews.json')

  async function loadReviewsJson(): Promise<string | null> {
    try {
      const upstream = await fetch('http://127.0.0.1:8765/api/reviews', {
        signal: AbortSignal.timeout(8_000),
      })
      if (upstream.ok) {
        const text = await upstream.text()
        if (text.trim().startsWith('{')) return text
      }
    } catch {
      // fall through to seed file
    }
    if (fs.existsSync(seedFile)) return fs.readFileSync(seedFile, 'utf8')
    return null
  }

  return {
    name: 'securefix-google-reviews-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url !== '/api/reviews' && url !== '/api/reviews/') return next()
        if (req.method && req.method !== 'GET' && req.method !== 'HEAD') return next()
        const body = await loadReviewsJson()
        if (!body) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ ok: false, source: 'error', reviews: [] }))
          return
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        res.end(body)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), googleReviewsDevApi()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Chat / other APIs (when the Node server is running). Reviews are handled above.
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        bypass(req) {
          const url = req.url?.split('?')[0] ?? ''
          // Live Google reviews are served by the plugin / public/api seed, not :3001.
          if (url === '/api/reviews' || url === '/api/reviews/' || url === '/api/reviews.json') {
            return req.url
          }
        },
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api/reviews': { target: 'http://127.0.0.1:8765', changeOrigin: true },
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
