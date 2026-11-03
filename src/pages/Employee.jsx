import { useParams } from "react-router";
import skills from "../data/skills";
import CountryLabel from "../components/molecules/CountryLabel";
import "../styles/employee.css";

function formatBirthDate(birthDate) {
  if (!birthDate) return "Niet ingevuld";

  const date = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Niet ingevuld";

  return date.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Employee({ employees, onBack }) {
  const { employeeId } = useParams();
  const employee = employees.find((item) => item.id === employeeId);
  const backButton = (
    <button type="button" className="employee-back-button" onClick={onBack}>
      <span aria-hidden="true">←</span> Terug naar medewerkers
    </button>
  );

  if (!employee) {
    return (
      <section className="employee-page">
        {backButton}
        <div className="employees-header">
          <div>
            <h1>Medewerker niet gevonden</h1>
            <p>Ga terug naar het overzicht en selecteer een medewerker.</p>
          </div>
        </div>
      </section>
    );
  }

  const initials = employee.name
    .trim()
    .split(/\s+/)
    .filter((_, index, names) => index === 0 || index === names.length - 1)
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();
  const employeeSkills = skills.filter((skill) => employee.skills?.includes(skill.id));

  return (
    <section className="employee-page" aria-labelledby="employee-page-title">
      {backButton}

      <header className="employees-header">
        <div>
          <h1 id="employee-page-title">Medewerker</h1>
          <p>Bekijk de gegevens en vaardigheden van deze medewerker.</p>
        </div>
      </header>

      <div className="employee-summary">
        <div className="employee-avatar" aria-hidden="true">{initials}</div>
        <div className="employee-summary-info">
          <h2>{employee.name}</h2>
          <p>{employee.role || "Geen functie vastgelegd"}</p>
          <span>{employee.id}</span>
        </div>
        {employee.country && (
          <span className="employee-country"><CountryLabel country={employee.country} /></span>
        )}
      </div>

      <div className="employee-details-grid">
        <section className="employee-detail-card" aria-labelledby="employee-personal-title">
          <h2 id="employee-personal-title">Persoonlijke gegevens</h2>
          <dl className="employee-fields">
            <div>
              <dt>Naam</dt>
              <dd>{employee.name}</dd>
            </div>
            <div>
              <dt>Geboortedatum</dt>
              <dd>{formatBirthDate(employee.birthDate)}</dd>
            </div>
            <div>
              <dt>Land</dt>
              <dd><CountryLabel country={employee.country} /></dd>
            </div>
            <div>
              <dt>Adres</dt>
              <dd>{employee.address || "Niet ingevuld"}</dd>
            </div>
          </dl>
        </section>

        <section className="employee-detail-card" aria-labelledby="employee-work-title">
          <h2 id="employee-work-title">Werk- en contactgegevens</h2>
          <dl className="employee-fields">
            <div>
              <dt>Medewerkers ID</dt>
              <dd>{employee.id}</dd>
            </div>
            <div>
              <dt>Functie</dt>
              <dd>{employee.role || "Niet ingevuld"}</dd>
            </div>
            <div>
              <dt>E-mailadres</dt>
              <dd>
                {employee.email
                  ? <a href={`mailto:${employee.email}`}>{employee.email}</a>
                  : "Niet ingevuld"}
              </dd>
            </div>
            <div>
              <dt>Telefoonnummer</dt>
              <dd>
                {employee.phone
                  ? <a href={`tel:${employee.phone.replace(/\s/g, "")}`}>{employee.phone}</a>
                  : "Niet ingevuld"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="employee-detail-card employee-skills-card" aria-labelledby="employee-skills-title">
          <h2 id="employee-skills-title">Skills</h2>
          {employeeSkills.length > 0 ? (
            <ul className="employee-skill-list">
              {employeeSkills.map((skill) => <li key={skill.id}>{skill.name}</li>)}
            </ul>
          ) : (
            <p className="employee-empty-skills">Er zijn nog geen skills vastgelegd voor deze medewerker.</p>
          )}
        </section>
      </div>
    </section>
  );
}

export default Employee;
