import { useState } from "react";
import Button from "../atoms/Button";
import Select from "../atoms/Select";
import CountrySelect from "../molecules/CountrySelect";
import FormField from "../molecules/FormField";
import SkillSelect from "../molecules/SkillSelect";
import "../../styles/add-employee.css";

// Zo ziet het formulier eruit als je de pagina opent: alles leeg.
const emptyForm = {
  firstName: "",
  lastName: "",
  birthDate: "",
  country: "",
  address: "",
  email: "",
  phone: "",
  roleId: "",
  skillIds: [],
};

function EmployeeForm({ employeeRoles, skills, onSave, onCancel }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Eén handler voor alle gewone invoervelden.
  // "name" van het veld bepaalt welke waarde in formData verandert.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Bij het kiezen van een rol vullen we meteen de standaard skills in.
  const handleRoleChange = (event) => {
    const roleId = event.target.value;
    const selectedRole = employeeRoles.find((role) => role.id === roleId);

    setFormData((current) => ({
      ...current,
      roleId: roleId,
      skillIds: selectedRole ? [...selectedRole.defaultSkills] : [],
    }));
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

    if (formData.birthDate === "") {
      newErrors.birthDate = "Kies een geboortedatum.";
    } else if (new Date(formData.birthDate) > new Date()) {
      newErrors.birthDate = "Een geboortedatum kan niet in de toekomst liggen.";
    }

    if (formData.country === "") {
      newErrors.country = "Kies een land.";
    }

    if (formData.address.trim() === "") {
      newErrors.address = "Vul een adres in.";
    }

    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Vul een geldig e-mailadres in.";
    }

    if (formData.phone.trim() === "") {
      newErrors.phone = "Vul een telefoonnummer in.";
    }

    if (formData.roleId === "") {
      newErrors.roleId = "Kies een rol.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    // Zijn er fouten? Dan stoppen we hier en wordt er niets opgeslagen.
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSave(formData);
  };

  return (
    <form className="add-employee-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <FormField
          label="Voornaam"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <FormField
          label="Achternaam"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <FormField
          label="Geboortedatum"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          error={errors.birthDate}
        />
        <CountrySelect
          value={formData.country}
          onChange={(country) => setFormData((current) => ({ ...current, country }))}
          error={errors.country}
        />
        <FormField
          label="Adres"
          className="form-field-wide"
          name="address"
          autoComplete="street-address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Straatnaam 12"
          error={errors.address}
        />
        <FormField
          label="E-mailadres"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="naam@boonedam.com"
          error={errors.email}
        />
        <FormField
          label="Telefoonnummer"
          type="tel"
          name="phone"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+31 6 12345678"
          error={errors.phone}
        />
        <FormField label="Rol" control={Select} className="form-field-wide" name="roleId" value={formData.roleId} onChange={handleRoleChange} error={errors.roleId}>
          <option value="">Kies een rol</option>
          {employeeRoles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
        </FormField>
      </div>
      <SkillSelect skills={skills} selectedIds={formData.skillIds} onToggle={handleSkillToggle} />
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>Annuleren</Button>
        <Button type="submit" variant="primary">Medewerker opslaan</Button>
      </div>
    </form>
  );
}

export default EmployeeForm;
