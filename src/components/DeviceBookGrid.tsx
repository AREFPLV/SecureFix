import { Link } from 'react-router-dom'
import { bookingDeviceCards, bookingDevicePath, type BookingDeviceCard } from '@/data/bookingDevices'

type Props = {
  onSelect?: (card: BookingDeviceCard) => void
  onOther?: () => void
}

export default function DeviceBookGrid({ onSelect, onOther }: Props) {
  return (
    <div className="book-device-grid">
      {bookingDeviceCards.map((card) => {
        const inner = (
          <>
            <span className="book-card-icon" aria-hidden="true">
              {card.icon}
            </span>
            <h3>{card.label}</h3>
          </>
        )
        if (onSelect) {
          return (
            <button
              key={card.id}
              type="button"
              className="book-card book-device-card"
              onClick={() => onSelect(card)}
            >
              {inner}
            </button>
          )
        }
        return (
          <Link key={card.id} to={bookingDevicePath(card)} className="book-card book-device-card">
            {inner}
          </Link>
        )
      })}
      {onSelect ? (
        <button type="button" className="book-card book-device-card" onClick={onOther}>
          <span className="book-card-icon" aria-hidden="true">
            🔧
          </span>
          <h3>Other</h3>
        </button>
      ) : (
        <Link to="/book-repair#all-devices" className="book-card book-device-card">
          <span className="book-card-icon" aria-hidden="true">
            🔧
          </span>
          <h3>Other</h3>
        </Link>
      )}
    </div>
  )
}
