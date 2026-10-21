type LogoProps = {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="SecureFix, same day repairs"
      className={`logo-img ${className}`}
    />
  )
}
