import Button from "../components/atoms/Button";
import RoleCard from "../components/organisms/RoleCard";
import employeeRoles from "../data/employeeRoles";
import skills from "../data/skills";
import "../styles/roles.css";

// Overzicht van alle rollen, met per rol de skills die erbij horen.
function Roles() {
  return (
    <section className="roles-page">
      <div className="employees-header">
        <div>
          <h1>Rollen</h1>
          <p>Beheer de rollen en de standaard skills die erbij horen.</p>
        </div>
        <Button variant="primary">Rol toevoegen</Button>
      </div>

      <div className="roles-grid">
        {employeeRoles.map((role) => (
          <RoleCard key={role.id} role={role} skills={skills} />
        ))}
      </div>
    </section>
  );
}

export default Roles;