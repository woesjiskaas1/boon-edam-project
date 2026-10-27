import Avatar from '../atoms/Avatar.jsx'
import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'
import StatusBadge from '../atoms/StatusBadge.jsx'

export default function EmployeeTable({ employees, onView, compact = false }) {
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Medewerkerstabel, horizontaal scrollbaar op kleine schermen">
      <table className={`employee-table ${compact ? 'compact-table' : ''}`}>
        <caption className="sr-only">{compact ? 'Meest recente medewerkers' : 'Alle medewerkers'}</caption>
        <thead>
          <tr><th scope="col">Medewerker</th><th scope="col">E-mailadres</th><th scope="col">Rol</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Acties</span></th></tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <Button variant="plain" className="employee-name" onClick={() => onView(employee)}>
                  <Avatar name={employee.name} size="small" />
                  <span>{employee.name}</span>
                </Button>
              </td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td><StatusBadge tone={employee.status === 'Actief' ? 'active' : 'invited'}>{employee.status}</StatusBadge></td>
              <td><Button variant="icon" className="table-action" onClick={() => onView(employee)} aria-label={`Gegevens van ${employee.name} bekijken`}><Icon name="more" size={19} /></Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && <div className="empty-state"><Icon name="search" size={30} /><h3>Geen medewerkers gevonden</h3><p>Probeer een andere naam, e-mailadres of rol.</p></div>}
    </div>
  )
}
