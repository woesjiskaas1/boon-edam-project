import { Link } from "react-router";

// Hoeveel skills we per rol in de tabel laten zien. De rest wordt "+3".
const VISIBLE_SKILLS = 2;

// Tabel met alle rollen: één regel per rol.
// Klik op de naam of op "Bekijken" om naar de detailpagina te gaan.
function RolesTable({ roles, skills, emptyText }) {
  return (
    <div className="employees-table-container">
      <table className="employees-table roles-table">
        <thead>
          <tr>
            <th scope="col">Rol</th>
            <th scope="col">Standaard skills</th>
            <th scope="col" className="roles-number">Medewerkers</th>
            <th scope="col"><span className="roles-visually-hidden">Acties</span></th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => {
            // De skills van deze rol, met naam.
            const roleSkills = skills.filter((skill) => role.defaultSkills.includes(skill.id));
            // De eerste paar laten we zien, de rest tellen we.
            const visibleSkills = roleSkills.slice(0, VISIBLE_SKILLS);
            const hiddenCount = roleSkills.length - visibleSkills.length;

            return (
              <tr key={role.id}>
                <td>
                  <Link className="roles-name" to={`/rollen/${role.id}`}>
                    {role.name}
                  </Link>
                  {role.description && (
                    <span className="roles-description">{role.description}</span>
                  )}
                </td>
                <td>
                  {roleSkills.length === 0 ? (
                    <span className="roles-muted">Geen skills</span>
                  ) : (
                    <ul className="roles-chips">
                      {visibleSkills.map((skill) => (
                        <li key={skill.id} className="roles-chip" title={skill.name}>
                          {skill.name}
                        </li>
                      ))}
                      {hiddenCount > 0 && (
                        <li className="roles-chip roles-chip-more">+{hiddenCount}</li>
                      )}
                    </ul>
                  )}
                </td>
                <td className={`roles-number${role.employeeCount === 0 ? " roles-muted" : ""}`}>
                  {role.employeeCount}
                </td>
                <td className="roles-actions">
                  <Link to={`/rollen/${role.id}`} aria-label={`${role.name} bekijken`}>
                    Bekijken <span aria-hidden="true">→</span>
                  </Link>
                </td>
              </tr>
            );
          })}

          {roles.length === 0 && (
            <tr>
              <td colSpan="4" className="roles-muted">{emptyText}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RolesTable;