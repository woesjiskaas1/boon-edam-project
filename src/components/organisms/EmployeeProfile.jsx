import Avatar from '../atoms/Avatar.jsx'
import Button from '../atoms/Button.jsx'
import StatusBadge from '../atoms/StatusBadge.jsx'

export default function EmployeeProfile({ employee, onViewRole, onClose }) {
  return (
    <>
      <div className="employee-profile">
        <Avatar initials={employee.name[0]} size="large" /><h3>{employee.name}</h3>
        <StatusBadge tone={employee.status === 'Actief' ? 'active' : 'invited'}>{employee.status}</StatusBadge>
      </div>
      <dl className="profile-details">
        <div><dt>E-mailadres</dt><dd>{employee.email}</dd></div>
        <div><dt>Rol</dt><dd>{employee.role}</dd></div>
      </dl>
      <div className="dialog-actions">
        <Button variant="secondary" onClick={() => onViewRole(employee.role)}>Bekijk medewerkers met deze rol</Button>
        <Button onClick={onClose}>Sluiten</Button>
      </div>
    </>
  )
}
