import { useState } from "react";
import Button from "../atoms/Button";
import Select from "../atoms/Select";
import CountrySelect from "../molecules/CountrySelect";
import FormField from "../molecules/FormField";
import TagPicker from "../molecules/TagPicker";
import "../../styles/add-employee.css";
import "../../styles/tag-picker.css";

// Zo ziet het formulier eruit als je de pagina opent: alles leeg.
const emptyForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  country: "",
  location: "",
  roleIds: [],
  skillIds: [],
};

export default function EmployeeForm({ employeeRoles, skills, countries, locations, onSave, onCancel }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  // Bezig met opslaan? Dan zetten we de knop uit.
  const [isSaving, setIsSaving] = useState(false);
  // Foutmelding van de backend, bijv. als de server niet draait.
  const [saveError, setSaveError] = useState("");

  // Eén handler voor alle gewone invoervelden.
  // "name" van het veld bepaalt welke waarde in formData verandert.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const countryLocations = locations.filter(
    (location) => location.country === formData.country
  );
  const previewRoles = employeeRoles.filter((role) => formData.roleIds.includes(role.id));
  const previewSkills = skills.filter((skill) => formData.skillIds.includes(skill.id));

  // Bij het kiezen van rollen vullen we de gecombineerde standaardskills in.
  const handleRoleToggle = (roleId) => {
    setFormData((current) => {
      const roleIds = current.roleIds.includes(roleId)
        ? current.roleIds.filter((id) => id !== roleId)
        : [...current.roleIds, roleId];
      const selectedRoles = employeeRoles.filter((role) => roleIds.includes(role.id));
      const skillIds = [...new Set(selectedRoles.flatMap((role) => role.defaultSkills))]
        .filter((id) => skills.some((skill) => skill.id === id));

      return {
        ...current,
        roleIds,
        skillIds,
      };
    });
  };

  // Vinkje aan = skill erbij, vinkje uit = skill eraf.
  const handleSkillToggle = (skillId) => {
    setFormData((current) => {
      if (current.skillIds.includes(skillId)) {
        return {
          ...current,
          skillIds: current.skillIds.filter((id) => id !== skillId),
        };
      }

      return {
        ...current,
        skillIds: [...current.skillIds, skillId],
      };
    });
  };

  // Controleert alle velden en geeft een object met foutmeldingen terug.
  // Een leeg object betekent: alles is goed ingevuld.
  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.firstName.trim() === "") {
      newErrors.firstName = "Vul een voornaam in.";
    }

    if (formData.lastName.trim() === "") {
      newErrors.lastName = "Vul een achternaam in.";
    }

    if (formData.country === "") {
      newErrors.country = "Kies een land.";
    }

    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Vul een geldig e-mailadres in.";
    }

    if (formData.roleIds.length === 0) {
      newErrors.roleIds = "Kies minimaal één rol.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    // Zijn er fouten? Dan stoppen we hier en wordt er niets opgeslagen.
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      await onSave(formData);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="add-employee-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-section-title">Persoonsgegevens</h2>
      <div className="form-grid form-grid-names">
        <FormField
          label="Voornaam"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />

        <FormField
          label="Tussenvoegsel"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
        />

        <FormField
          label="Achternaam"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />

        <FormField
          label="E-mailadres"
          className="form-field-wide"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="naam@boonedam.com"
          error={errors.email}
        />
      </div>

      <h2 className="form-section-title">Werkplek</h2>
      <div className="form-grid">
        <CountrySelect
          countries={countries}
          value={formData.country}
          onChange={(country) =>
            setFormData((current) => ({ ...current, country, location: "" }))
          }
          error={errors.country}
        />

        <FormField
          label="Vestiging"
          control={Select}
          name="location"
          value={formData.location}
          onChange={handleChange}
          disabled={formData.country === ""}
        >
          <option value="">
            {formData.country === "" ? "Kies eerst een land" : "Kies een vestiging"}
          </option>
          {countryLocations.map((location) => (
            <option key={location.id} value={location.name}>{location.name}</option>
          ))}
        </FormField>
      </div>

      <h2 className="form-section-title">Rollen en skills</h2>
      <div className="form-stack">
        <TagPicker
          label="Rollen"
          hint="Een medewerker kan meerdere rollen hebben."
          placeholder="Zoek een rol..."
          selectedItems={previewRoles}
          options={employeeRoles}
          onSelect={handleRoleToggle}
          onRemove={handleRoleToggle}
          error={errors.roleIds}
        />

        <TagPicker
          label="Skills"
          hint="De standaard skills van de rollen komen er vanzelf bij. Je kunt ze aanpassen."
          placeholder="Zoek een skill..."
          selectedItems={previewSkills}
          options={skills}
          onSelect={handleSkillToggle}
          onRemove={handleSkillToggle}
        />
      </div>

      {saveError && (
        <p className="form-error form-save-error" role="alert">
          {saveError}
        </p>
      )}

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? "Bezig met opslaan..." : "Medewerker opslaan"}
        </Button>
      </div>
    </form>
  );
}
