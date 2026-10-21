import { site, whyUs } from '@/data/content'
import './WhyUs.css'

export default function WhyUs() {
  return (
    <section id="why-us" className="section section-alt">
      <div className="container">
        <h2 className="section-title">
          Why Choose <span className="accent">{site.name}</span>?
        </h2>
        <p className="section-subtitle">
          Phone, computer and console repairs at 218 City Road, London EC1V 2PN, with a 1-year
          repair warranty. Liquid damage is excluded.
        </p>
        <div className="card-grid why-grid">
          {whyUs.map((item) => (
            <article key={item.title} className="why-card">
              <span className="why-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
