import PageHeading from '../components/molecules/PageHeading.jsx'
import RoleCard from '../components/molecules/RoleCard.jsx'

export default function RolesPage({ roles, employees, onViewRole }) {
  return (
    <>
      <PageHeading title="Rollen" description="De rollen en verantwoordelijkheden binnen je organisatie." />
      <section className="roles-grid" aria-label="Beschikbare rollen">
        {roles.map((role, index) => <RoleCard key={role.name} role={role} count={employees.filter((employee) => employee.role === role.name).length} tone={index % 2 === 0 ? 'green' : 'yellow'} onViewEmployees={() => onViewRole(role.name)} />)}
      </section>
    </>
  )
}
