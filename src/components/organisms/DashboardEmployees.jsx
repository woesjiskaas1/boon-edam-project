import { Link } from "react-router";

export default function DashboardEmployees({ employees }) {
  return (
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

      {employees.length > 0 ? (
        <ul className="dashboard-employee-list">
          {employees.map((employee) => (
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
  );
}
