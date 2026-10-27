import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'

export default function Toast({ message, onDismiss }) {
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {message && <div className="toast">
        <Icon name="check" size={21} /><span>{message}</span>
        <Button variant="icon" aria-label="Melding sluiten" onClick={onDismiss}><Icon name="close" size={17} /></Button>
      </div>}
    </div>
  )
}
