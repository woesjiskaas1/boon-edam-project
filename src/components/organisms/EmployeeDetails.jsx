import Avatar from "../atoms/Avatar";
import CountryLabel from "../molecules/CountryLabel";
import "../../styles/employee.css";

export default function EmployeeDetails({ employee, skills }) {
  return (
    <>
      <div className="employee-summary">
        <Avatar name={employee.name} className="employee-avatar" firstAndLast />
        <div className="employee-summary-info">
          <h2>{employee.name}</h2>
          <p>{employee.role || "Geen rol vastgelegd"}</p>
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
              <dt>Land</dt>
              <dd><CountryLabel country={employee.country} /></dd>
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
              <dt>Rol</dt>
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
          </dl>
        </section>

        <section className="employee-detail-card employee-skills-card" aria-labelledby="employee-skills-title">
          <h2 id="employee-skills-title">Skills</h2>
          {skills.length > 0 ? (
            <ul className="employee-skill-list">
              {skills.map((skill) => <li key={skill.id}>{skill.name}</li>)}
            </ul>
          ) : (
            <p className="employee-empty-skills">Er zijn nog geen skills vastgelegd voor deze medewerker.</p>
          )}
        </section>
      </div>
    </>
  );
}
