import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'

export default function EmployeeForm({ roles, error, onSubmit, onCancel }) {
  return (
    <form className="employee-form" onSubmit={onSubmit}>
      <label>Volledige naam<input name="name" placeholder="Bijvoorbeeld: Jane Doe" autoComplete="name" required maxLength={80} /></label>
      <label>E-mailadres<input name="email" type="email" placeholder="naam@boonedam.nl" autoComplete="email" required maxLength={150} /></label>
      <label>Rol<select name="role" defaultValue="Medewerker">{roles.map((role) => <option key={role.name}>{role.name}</option>)}</select></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <p className="form-note"><Icon name="info" size={17} />Dit is een voorbeeldomgeving. Er wordt geen uitnodiging verstuurd en wijzigingen vervallen na het herladen.</p>
      <div className="dialog-actions">
        <Button variant="secondary" onClick={onCancel}>Annuleren</Button>
        <Button type="submit"><Icon name="plus" size={19} />Medewerker toevoegen</Button>
      </div>
    </form>
  )
}
