import Button from "../atoms/Button";
import CountryLabel from "../molecules/CountryLabel";

export default function EmployeesTable({ employees, onSelectEmployee }) {
  return (
    <div className="employees-table-container">
      <table className="employees-table">
        <thead>
          <tr>
            <th>Naam</th>
            <th>Medewerkers ID</th>
            <th>Rol</th>
            <th>Land</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <Button
                  type="button"
                  className="employee-name-button"
                  onClick={() => onSelectEmployee(employee.id)}
                  aria-label={`Bekijk medewerker ${employee.name}`}
                >
                  {employee.name}
                </Button>
              </td>
              <td>{employee.id}</td>
              <td>
                <span className="employee-role">
                  {employee.role}
                </span>
              </td>
              <td><CountryLabel country={employee.country} /></td>
            </tr>
          ))}

          {employees.length === 0 && (
            <tr>
              <td colSpan="4">
                Er zijn nog geen medewerkers beschikbaar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  );
}
