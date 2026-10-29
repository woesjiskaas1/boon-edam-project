import { useState } from "react";
import employees from "../data/employees";
const ITEMS_PER_PAGE = 50;

function Employees({ employees, onAddEmployee }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(employees.length / ITEMS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleEmployees = employees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const firstEmployee =
    employees.length === 0 ? 0 : startIndex + 1;

  const lastEmployee = Math.min(
    startIndex + ITEMS_PER_PAGE,
    employees.length
  );

  return (
    <section className="employees-page">
      <div className="employees-header">
        <div>
          <h1>Medewerkers</h1>
          <p>Overzicht van alle medewerkers.</p>
        </div>

        <div className="employees-header-actions">
          <span className="employee-count">
            {employees.length} medewerkers
          </span>

          <button
            type="button"
            className="primary-button"
            onClick={onAddEmployee}
          >
            + Medewerker toevoegen
          </button>
        </div>
      </div>

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
            {visibleEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.id}</td>
                <td>
                  <span className="employee-role">
                    {employee.role}
                  </span>
                </td>
                <td>{employee.country}</td>
              </tr>
            ))}

            {visibleEmployees.length === 0 && (
              <tr>
                <td colSpan="3">
                  Er zijn nog geen medewerkers beschikbaar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <p className="pagination-info">
          {employees.length === 0
            ? "Geen medewerkers"
            : `Medewerkers ${firstEmployee}–${lastEmployee} van ${employees.length}`}
        </p>

        <div className="pagination-controls">
          <button
            type="button"
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((page) => page - 1)
            }
          >
            Vorige
          </button>

          <span className="pagination-current">
            Pagina {currentPage} van {totalPages}
          </span>

          <button
            type="button"
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => page + 1)
            }
          >
            Volgende
          </button>
        </div>
      </div>
    </section>
  );
}

export default Employees;