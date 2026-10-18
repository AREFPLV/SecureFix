import { Link } from 'react-router-dom'

export default function FormPrivacyNote() {
  return (
    <p className="form-privacy-note">
      We use these details to handle your request.{' '}
      <Link to="/privacy">Privacy policy</Link>
    </p>
  )
}
