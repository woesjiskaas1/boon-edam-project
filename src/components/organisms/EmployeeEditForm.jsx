import Button from "../atoms/Button";
import Select from "../atoms/Select";
import CountrySelect from "../molecules/CountrySelect";
import FormField from "../molecules/FormField";
import "../../styles/add-employee.css";

// Formulier om de gegevens van een medewerker te bewerken (alleen weergave;
// de pagina Employee bewaart de waarden en slaat op).
export default function EmployeeEditForm({
  values,
  countries,
  locations,
  error,
  isSaving,
  onChange,
  onCountryChange,
  onSubmit,
  onCancel,
}) {
  const countryLocations = locations.filter((location) => location.country === values.country);

  return (
    <form
      className="employee-detail-card employee-edit-card"
      onSubmit={onSubmit}
      aria-labelledby="employee-edit-title"
      noValidate
    >
      <h2 id="employee-edit-title">Gegevens bewerken</h2>
      <div className="form-grid form-grid-names">
        <FormField label="Voornaam" name="firstName" value={values.firstName} onChange={onChange} />
        <FormField label="Tussenvoegsel" name="middleName" value={values.middleName} onChange={onChange} />
        <FormField label="Achternaam" name="lastName" value={values.lastName} onChange={onChange} />
      </div>
      <div className="form-stack employee-edit-stack">
        <FormField label="E-mailadres" type="email" name="email" value={values.email} onChange={onChange} />
        <div className="form-grid">
          <CountrySelect countries={countries} value={values.country} onChange={onCountryChange} />
          <FormField
            label="Vestiging"
            control={Select}
            name="location"
            value={values.location}
            onChange={onChange}
            disabled={values.country === ""}
          >
            <option value="">Kies een vestiging</option>
            {countryLocations.map((location) => (
              <option key={location.id} value={location.name}>{location.name}</option>
            ))}
          </FormField>
        </div>
      </div>
      {error && <p className="form-error form-save-error" role="alert">{error}</p>}
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>Annuleren</Button>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? "Opslaan..." : "Opslaan"}
        </Button>
      </div>
    </form>
  );
}
