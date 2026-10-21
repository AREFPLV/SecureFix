import { Link } from 'react-router-dom'
import { serviceCards } from '@/data/content'
import './ServiceCards.css'

export default function ServiceCards() {
  return (
    <section id="services" className="service-cards">
      <div className="container">
        <div className="service-cards-grid">
          {serviceCards.map((card) => (
            <article key={card.title} className="service-cards-item">
              <div className="service-cards-icon-wrap">
                <span className="service-cards-icon">{card.icon}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link to={card.route} className="btn btn-primary btn-shiny service-cards-btn">
                {card.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
