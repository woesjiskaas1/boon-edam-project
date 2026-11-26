import EmployeeForm from "../components/organisms/EmployeeForm";

// Landen en vestigingen komen uit App (Instellingen > Landen en vestigingen).
export default function AddEmployee({ employeeRoles, skills, countries, locations, onSave, onCancel }) {
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
        countries={countries}
        locations={locations}
        onSave={onSave}
        onCancel={onCancel}
      />
    </section>
  );
}
