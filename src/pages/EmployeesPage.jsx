import Button from '../components/atoms/Button.jsx'
import Icon from '../components/atoms/Icon.jsx'
import PageHeading from '../components/molecules/PageHeading.jsx'
import EmployeeTable from '../components/organisms/EmployeeTable.jsx'

export default function EmployeesPage({ total, employees, roles, search, roleFilter, statusFilter, onRoleFilterChange, onStatusFilterChange, onAddEmployee, onViewEmployee }) {
  return (
    <>
      <PageHeading title="Medewerkers" description="Een overzicht van alle medewerkers in je organisatie." action={<Button onClick={onAddEmployee}><Icon name="plus" size={21} />Medewerker toevoegen</Button>} />
      <section className="panel directory-panel" aria-labelledby="directory-title">
        <div className="directory-toolbar">
          <div>
            <h2 id="directory-title">Alle medewerkers <span className="count-badge">{total}</span></h2>
            <p>{employees.length} {employees.length === 1 ? 'medewerker' : 'medewerkers'}{search ? ` gevonden voor “${search}”` : ' in het overzicht'}</p>
          </div>
          <div className="directory-filters">
            <label className="filter-label">
              <span className="sr-only">Filter op rol</span>
              <select value={roleFilter} onChange={(event) => onRoleFilterChange(event.target.value)}><option>Alle rollen</option>{roles.map((role) => <option key={role.name}>{role.name}</option>)}</select>
            </label>
            <label className="filter-label">
              <span className="sr-only">Filter op status</span>
              <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}><option>Alle statussen</option><option>Actief</option><option>Uitgenodigd</option></select>
            </label>
          </div>
        </div>
        <EmployeeTable employees={employees} onView={onViewEmployee} />
      </section>
    </>
  )
}
