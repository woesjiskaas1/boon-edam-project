import { useState } from "react";
import Button from "../components/atoms/Button";
import Pagination from "../components/molecules/Pagination";
import EmployeesTable from "../components/organisms/EmployeesTable";
const ITEMS_PER_PAGE = 50;

function Employees({ employees, onAddEmployee, onSelectEmployee }) {
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
          <p>Klik op een naam om de gegevens van een medewerker te bekijken.</p>
        </div>

        <div className="employees-header-actions">
          <span className="employee-count">
            {employees.length} medewerkers
          </span>

          <Button
            type="button"
            variant="primary"
            onClick={onAddEmployee}
          >
            + Medewerker toevoegen
          </Button>
        </div>
      </div>

      <EmployeesTable employees={visibleEmployees} onSelectEmployee={onSelectEmployee} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}>
        {employees.length === 0
          ? "Geen medewerkers"
          : `Medewerkers ${firstEmployee}–${lastEmployee} van ${employees.length}`}
      </Pagination>
    </section>
  );
}

export default Employees;
