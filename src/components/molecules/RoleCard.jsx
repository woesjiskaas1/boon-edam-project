import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'

export default function RoleCard({ role, count, tone, onViewEmployees }) {
  return (
    <article className="panel role-card">
      <span className={`stat-icon tone-${tone}`}><Icon name="shield" size={25} /></span>
      <h2>{role.name}</h2><p>{role.description}</p>
      <div className="role-card-footer">
        <span><Icon name="users" size={18} />{count} medewerkers</span>
        <Button variant="text" onClick={onViewEmployees} aria-label={`Medewerkers met de rol ${role.name} bekijken`}><Icon name="arrow-right" size={19} /></Button>
      </div>
    </article>
  )
}
