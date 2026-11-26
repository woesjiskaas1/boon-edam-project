import { Link } from "react-router";
import Button from "../atoms/Button";
import Select from "../atoms/Select";
import "../../styles/roles.css";

// Kaart "Rollen" op de medewerkerpagina: rollen tonen, toevoegen en (via de
// pagina) weghalen.
export default function EmployeeRoles({
  roles,
  otherRoles,
  roleToAdd,
  error,
  onRoleToAddChange,
  onAdd,
  onRequestRemove,
}) {
  return (
    <section className="employee-detail-card" aria-labelledby="employee-roles-title">
      <h2 id="employee-roles-title">Rollen</h2>
      {roles.length === 0 ? (
        <p className="employee-empty-skills">Nog geen rollen.</p>
      ) : (
        <ul className="role-skill-list">
          {roles.map((role) => (
            <li key={role.id} className="roles-chip">
              <Link className="employee-chip-link" to={`/rollen/${role.id}`}>{role.name}</Link>
              <Button
                className="role-skill-remove"
                onClick={() => onRequestRemove(role)}
                aria-label={`Rol ${role.name} weghalen`}
              >
                ×
              </Button>
            </li>
          ))}
        </ul>
      )}

      {otherRoles.length > 0 && (
        <div className="employee-add-row">
          <Select
            className="roles-sort"
            value={roleToAdd}
            onChange={(event) => onRoleToAddChange(event.target.value)}
            aria-label="Kies een rol om toe te voegen"
          >
            <option value="">Rol toevoegen...</option>
            {otherRoles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </Select>
          <Button variant="secondary" onClick={onAdd} disabled={roleToAdd === ""}>
            + Toevoegen
          </Button>
        </div>
      )}
      <p className="form-hint">Bij een nieuwe rol krijgt de medewerker ook de standaard skills van die rol.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  );
}
