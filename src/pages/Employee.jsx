import { useParams } from "react-router";
import skills from "../data/skills";
import Button from "../components/atoms/Button";
import EmployeeDetails from "../components/organisms/EmployeeDetails";

function Employee({ employees, onBack }) {
  const { employeeId } = useParams();
  const employee = employees.find((item) => item.id === employeeId);
  const backButton = (
    <Button type="button" className="employee-back-button" onClick={onBack}>
      <span aria-hidden="true">←</span> Terug naar medewerkers
    </Button>
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

      <EmployeeDetails employee={employee} skills={employeeSkills} />
    </section>
  );
}

export default Employee;
