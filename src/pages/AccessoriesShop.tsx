import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  accessories,
  accessoryCategories,
  type AccessoryCategory,
} from '@/data/accessories'
import { slugify } from '@/lib/slugify'
import { usePageSeo } from '@/hooks/usePageSeo'
import { accessoriesSeo } from '@/data/seo'
import './AccessoriesShop.css'

export default function AccessoriesShop() {
  usePageSeo(accessoriesSeo)
  const [category, setCategory] = useState<AccessoryCategory>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return accessories.filter((item) => {
      const matchCategory = category === 'all' || item.category === category
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.compatibility.toLowerCase().includes(q)
      return matchCategory && matchSearch
    })
  }, [category, search])

  const categoryLabel =
    accessoryCategories.find((c) => c.id === category)?.label ?? 'All'

  return (
    <div className="shop-page site-page">
      <div className="shop-hero site-hero-bg">
        <div className="container">
          <h1>Premium Phone <span className="accent">Accessories</span></h1>
          <p>Cases, chargers, cables, screen protectors &amp; more</p>
        </div>
      </div>

      <main className="shop-main">
        <div className="container">
          <div className="shop-toolbar">
            <div className="shop-filters">
              {accessoryCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`shop-filter ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <input
              type="search"
              className="shop-search"
              placeholder="Search accessories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p className="shop-results-label">
            {filtered.length === 0
              ? 'No accessories found'
              : category === 'all'
                ? `Showing all ${filtered.length} accessories`
                : `Showing ${filtered.length} in ${categoryLabel}`}
          </p>

          {filtered.length === 0 ? (
            <div className="shop-empty">
              <span>🔍</span>
              <h3>No accessories found</h3>
              <p>Try a different search term or browse categories above</p>
            </div>
          ) : (
            <div className="shop-grid">
              {filtered.map((item) => (
                <article key={item.id} className="shop-card">
                  <div className="shop-card-image">
                    <span className="shop-card-emoji">
                      {categoryEmoji(item.category)}
                    </span>
                  </div>
                  <div className="shop-card-body">
                    <span className="shop-card-brand">{item.brand}</span>
                    <span className="shop-card-compat">{item.compatibility}</span>
                    <h3>{item.name}</h3>
                    <div className="shop-card-footer">
                      <span className="shop-card-price">£{item.price.toFixed(2)}</span>
                      <Link
                        to={`/products/${item.id}-${slugify(item.name)}`}
                        className="btn btn-primary btn-shiny shop-card-btn"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    cases: '📱',
    'screen-protectors': '🛡️',
    chargers: '🔌',
    cables: '🔗',
    headphones: '🎧',
    other: '⚡',
  }
  return map[category] ?? '📦'
}
