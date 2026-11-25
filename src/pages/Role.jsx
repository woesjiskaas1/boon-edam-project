import { useParams } from "react-router";
import Button from "../components/atoms/Button";
import RoleEmployees from "../components/organisms/RoleEmployees";
import "../styles/employee.css";
import "../styles/roles.css";

// Detailpagina van één rol.
function Role({ jobRoles, skills, employees, onBack }) {
  // Het id uit de URL: /rollen/5 geeft "5". Een URL is altijd tekst.
  const { roleId } = useParams();

  // De id's in de database zijn getallen, dus we vergelijken als tekst.
  const role = jobRoles.find((item) => String(item.id) === roleId);

  const backButton = (
    <Button className="employee-back-button" onClick={onBack}>
      <span aria-hidden="true">←</span> Terug naar rollen
    </Button>
  );

  // Vlak na het laden is de lijst met rollen nog leeg: dan "laden...".
  // Is de lijst wel geladen maar bestaat het id niet: "niet gevonden".
  if (!role) {
    return (
      <section className="employee-page">
        {backButton}
        <div className="employees-header">
          <div>
            <h1>{jobRoles.length === 0 ? "Rol laden..." : "Rol niet gevonden"}</h1>
            <p>Ga terug naar het overzicht en kies een rol.</p>
          </div>
        </div>
      </section>
    );
  }

  // De skills van deze rol, met naam.
  // role.defaultSkills is een lijst met id's, bijv. [3, 7].
  const roleSkills = skills.filter((skill) => role.defaultSkills.includes(skill.id));

  // De medewerkers met deze rol, op alfabet.
  const roleEmployees = employees
    .filter((employee) => employee.roleIds?.includes(role.id))
    .sort((a, b) => a.name.localeCompare(b.name, "nl"));

  const countByCountry = new Map();
  for (const employee of roleEmployees) {
    const name = employee.country || "Onbekend";
    countByCountry.set(name, (countByCountry.get(name) ?? 0) + 1);
  }
  const countries = [...countByCountry].sort((a, b) => b[1] - a[1]);

  return (
    <section className="employee-page" aria-labelledby="role-title">
      {backButton}

      <header className="employees-header">
        <div>
          <h1 id="role-title">{role.name}</h1>
          <p>{role.description || "Geen omschrijving."}</p>
        </div>
      </header>

      {/* De belangrijkste cijfers in één oogopslag. */}
      <div className="role-stats">
        <div className="role-stat">
          <strong>{roleEmployees.length}</strong>
          <span>medewerkers</span>
        </div>
        <div className="role-stat">
          <strong>{roleSkills.length}</strong>
          <span>standaard skills</span>
        </div>
        <div className="role-stat">
          <strong>{countries.length}</strong>
          <span>{countries.length === 1 ? "land" : "landen"}</span>
        </div>
      </div>

      <section className="role-section" aria-labelledby="role-skills-title">
        <h2 id="role-skills-title">Standaard skills</h2>
        {roleSkills.length === 0 ? (
          <p className="roles-muted">Deze rol heeft nog geen skills.</p>
        ) : (
          <ul className="role-skill-list">
            {roleSkills.map((skill) => (
              <li key={skill.id} className="roles-chip">{skill.name}</li>
            ))}
          </ul>
        )}
      </section>

      <RoleEmployees employees={roleEmployees} countries={countries} />
    </section>
  );
}

export default Role;