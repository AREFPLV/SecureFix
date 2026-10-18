import { Link } from 'react-router-dom'
import { repairs, BOOKING_ROUTE } from '@/data/content'
import './Products.css'

export default function Products() {
  return (
    <section id="repairs" className="section">
      <div className="container">
        <h2 className="section-title">
          Our <span className="accent">Repair Services</span>
        </h2>
        <p className="section-subtitle">
          Phone repair, laptop &amp; computer repair, and PS5 console repair —
          screens, batteries, HDMI ports, stick drift, virus removal and data recovery
        </p>
        <div className="card-grid repairs-grid">
          {repairs.map((item) => {
            const route = 'route' in item ? item.route : undefined
            return (
              <article key={item.title} className="product-card">
                <span className="product-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p className="product-desc">{item.description}</p>
                <ul className="product-features">
                  {item.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>
                <Link to={route || BOOKING_ROUTE} className="btn btn-outline product-cta">
                  {route ? 'Learn More' : 'Book Repair'}
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
