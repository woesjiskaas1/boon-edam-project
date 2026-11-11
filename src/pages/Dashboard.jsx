import { Link } from "react-router";
import heroImage from "../assets/hero.png";
import "../styles/dashboard.css";

function Dashboard({ currentUser, employees }) {
  const firstName = currentUser?.name.trim().split(/\s+/)[0] || "welkom";
  const rolesCount = new Set(
    employees.flatMap((employee) => employee.roleIds || (employee.role ? [employee.role] : []))
  ).size;
  const countriesCount = new Set(employees.map((employee) => employee.country).filter(Boolean)).size;
  const featuredEmployees = employees.slice(0, 4);

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="dashboard-eyebrow">BOON EDAM · MEDEWERKERSPORTAAL</p>
          <h1>Welkom, {firstName}</h1>
          <p className="dashboard-description">
            Een helder overzicht van je team en de informatie die je dagelijks nodig hebt.
          </p>
          <div className="dashboard-actions">
            <Link className="dashboard-action dashboard-action-primary" to="/medewerkers">
              Bekijk medewerkers
            </Link>
            <Link className="dashboard-action dashboard-action-secondary" to="/medewerkers/toevoegen">
              + Medewerker toevoegen
            </Link>
          </div>
        </div>
        <img className="dashboard-hero-image" src={heroImage} alt="" />
      </div>

      <div className="dashboard-stats" aria-label="Teamstatistieken">
        <article className="dashboard-stat">
          <span className="dashboard-stat-icon" aria-hidden="true">♙</span>
          <div>
            <p className="dashboard-stat-label">Medewerkers</p>
            <p className="dashboard-stat-value">{employees.length}</p>
          </div>
        </article>
        <article className="dashboard-stat">
          <span className="dashboard-stat-icon" aria-hidden="true">▤</span>
          <div>
            <p className="dashboard-stat-label">Rollen</p>
            <p className="dashboard-stat-value">{rolesCount}</p>
          </div>
        </article>
        <article className="dashboard-stat">
          <span className="dashboard-stat-icon" aria-hidden="true">◎</span>
          <div>
            <p className="dashboard-stat-label">Landen</p>
            <p className="dashboard-stat-value">{countriesCount}</p>
          </div>
        </article>
      </div>

      <div className="dashboard-content-grid">
        <section className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-eyebrow">JOUW TEAM</p>
              <h2>Medewerkers in beeld</h2>
            </div>
            <Link className="dashboard-text-link" to="/medewerkers">
              Alle medewerkers <span aria-hidden="true">→</span>
            </Link>
          </div>

          {featuredEmployees.length > 0 ? (
            <ul className="dashboard-employee-list">
              {featuredEmployees.map((employee) => (
                <li key={employee.id}>
                  <Link className="dashboard-employee" to={`/medewerkers/${employee.id}`}>
                    <span className="dashboard-employee-avatar" aria-hidden="true">
                      {employee.name
                        .split(/\s+/)
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                    <span className="dashboard-employee-details">
                      <strong>{employee.name}</strong>
                      <span>{employee.role || "Geen rol opgegeven"}</span>
                    </span>
                    <span className="dashboard-employee-arrow" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="dashboard-empty-state">
              <p>Er zijn nog geen medewerkers toegevoegd.</p>
              <Link className="dashboard-text-link" to="/medewerkers/toevoegen">
                Voeg de eerste medewerker toe <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </section>

        <aside className="dashboard-panel dashboard-quick-panel">
          <p className="dashboard-eyebrow">SNEL NAAR</p>
          <h2>Beheer je portaal</h2>
          <p className="dashboard-quick-description">
            Bekijk rollen en vaardigheden of pas de portaalinstellingen aan.
          </p>
          <Link className="dashboard-quick-link" to="/rollen">
            <span>Rollen beheren</span><span aria-hidden="true">→</span>
          </Link>
          <Link className="dashboard-quick-link" to="/skills">
            <span>Skills bekijken</span><span aria-hidden="true">→</span>
          </Link>
          <Link className="dashboard-quick-link" to="/instellingen">
            <span>Instellingen openen</span><span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default Dashboard;