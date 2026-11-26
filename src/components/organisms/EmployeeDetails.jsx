import Avatar from "../atoms/Avatar";
import CountryLabel from "../molecules/CountryLabel";
import "../../styles/employee.css";

// Bovenkant van de medewerkerpagina: de samenvatting en de kaart "Gegevens".
// - editForm: als je aan het bewerken bent, staat dit formulier op de plek
//   van de kaart "Gegevens".
// - children: de andere kaarten (rollen, gap-analyse, skills).
export default function EmployeeDetails({ employee, editForm, children }) {
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
        {editForm ?? (
          <section className="employee-detail-card" aria-labelledby="employee-personal-title">
            <h2 id="employee-personal-title">Gegevens</h2>
            <dl className="employee-fields">
              <div>
                <dt>Naam</dt>
                <dd>{employee.name}</dd>
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
                <dt>Land</dt>
                <dd><CountryLabel country={employee.country} /></dd>
              </div>
              <div>
                <dt>Vestiging</dt>
                <dd>{employee.location || "Niet ingevuld"}</dd>
              </div>
              <div>
                <dt>Medewerkers ID</dt>
                <dd>{employee.id}</dd>
              </div>
            </dl>
          </section>
        )}

        {children}
      </div>
    </>
  );
}
