import './RecycleHeroArt.css'

/** Animated recycle mark — supplied GIF/WebP, recolored to SecureFix gold. */
export default function RecycleHeroArt() {
  return (
    <div className="recycle-hero-art" aria-hidden="true">
      <div className="recycle-hero-art-glow" />
      <div className="recycle-hero-art-ring recycle-hero-art-ring-outer" />
      <div className="recycle-hero-art-ring recycle-hero-art-ring-inner" />

      <div className="recycle-hero-art-mark">
        <picture>
          <source srcSet="/images/recycle-symbol.webp" type="image/webp" />
          <img
            src="/images/recycle-symbol.gif"
            alt=""
            className="recycle-hero-art-gif"
            width={480}
            height={480}
            decoding="async"
          />
        </picture>
      </div>

      <p className="recycle-hero-art-caption">Secure · Reuse · Recycle</p>
    </div>
  )
}
