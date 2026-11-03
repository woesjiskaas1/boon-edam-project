import EmployeeForm from "../components/organisms/EmployeeForm";
import employeeRoles from "../data/employeeRoles";
import skills from "../data/skills";

export default function AddEmployee({ onSave, onCancel }) {
  return (
    <section className="add-employee-page">
      <div className="employees-header">
        <div>
          <h1>Medewerker toevoegen</h1>
          <p>Vul de gegevens van de nieuwe medewerker in.</p>
        </div>
      </div>
      <EmployeeForm employeeRoles={employeeRoles} skills={skills} onSave={onSave} onCancel={onCancel} />
    </section>
  );
}
