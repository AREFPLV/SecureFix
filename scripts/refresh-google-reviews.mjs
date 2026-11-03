#!/usr/bin/env node
/**
 * Refresh public/api/reviews.json from the local SecureFix reviews feed
 * (serve.py on :8765) or leave the existing file if refresh fails.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outFile = path.join(root, 'public', 'api', 'reviews.json')
const endpoints = [
  'http://127.0.0.1:8765/api/reviews',
  process.env.SECUREFIX_REVIEWS_URL,
].filter(Boolean)

async function main() {
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(20_000),
      })
      if (!res.ok) continue
      const data = await res.json()
      if (!(data?.ok && data?.source === 'google' && Array.isArray(data.reviews) && data.reviews.length)) {
        continue
      }
      fs.mkdirSync(path.dirname(outFile), { recursive: true })
      fs.writeFileSync(
        outFile,
        `${JSON.stringify(
          {
            ok: true,
            source: 'google',
            rating: data.rating,
            totalReviews: data.totalReviews,
            googleUrl: data.googleUrl,
            reviews: data.reviews,
            fetchedAt: data.fetchedAt ?? new Date().toISOString(),
          },
          null,
          2,
        )}\n`,
      )
      console.log(
        `Refreshed ${outFile} (${data.totalReviews} Google reviews, showing ${data.reviews.length})`,
      )
      return
    } catch (error) {
      console.warn(`Reviews refresh skipped for ${url}:`, error instanceof Error ? error.message : error)
    }
  }

  if (fs.existsSync(outFile)) {
    console.warn(`Keeping existing ${outFile}`)
    return
  }
  console.warn('No live Google reviews available and no existing reviews.json seed.')
  process.exitCode = 0
}

await main()
