import EmployeeForm from "../components/organisms/EmployeeForm";
import locations from "../data/locations";

export default function AddEmployee({ employeeRoles, skills, onSave, onCancel }) {
  return (
    <section className="add-employee-page">
      <div className="employees-header">
        <div>
          <h1>Medewerker toevoegen</h1>
          <p>Vul de gegevens van de nieuwe medewerker in.</p>
        </div>
      </div>
      <EmployeeForm
        employeeRoles={employeeRoles}
        skills={skills}
        locations={locations}
        onSave={onSave}
        onCancel={onCancel}
      />
    </section>
  );
}
