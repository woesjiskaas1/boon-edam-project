import { useState } from "react";
import CountrySelect from "../components/molecules/CountrySelect";
import employeeRoles from "../data/employeeRoles";
import skills from "../data/skills";
import "../styles/add-employee.css";

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

function AddEmployee({ onSave, onCancel }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Eén functie voor alle gewone invoervelden.
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
    <section className="add-employee-page">
      <div className="employees-header">
        <div>
          <h1>Medewerker toevoegen</h1>
          <p>Vul de gegevens van de nieuwe medewerker in.</p>
        </div>
      </div>

      <form className="add-employee-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="form-field">
            Voornaam
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            {errors.firstName && <span className="form-error">{errors.firstName}</span>}
          </label>

          <label className="form-field">
            Achternaam
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            {errors.lastName && <span className="form-error">{errors.lastName}</span>}
          </label>

          <label className="form-field">
            Geboortedatum
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
            {errors.birthDate && <span className="form-error">{errors.birthDate}</span>}
          </label>

          <CountrySelect
            value={formData.country}
            onChange={(country) => setFormData((current) => ({ ...current, country }))}
            error={errors.country}
          />

          <label className="form-field form-field-wide">
            Adres
            <input
              type="text"
              name="address"
              autoComplete="street-address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Straatnaam 12"
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </label>

          <label className="form-field">
            E-mailadres
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="naam@boonedam.com"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </label>

          <label className="form-field">
            Telefoonnummer
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+31 6 12345678"
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </label>

          <label className="form-field form-field-wide">
            Rol
            <select name="roleId" value={formData.roleId} onChange={handleRoleChange}>
              <option value="">Kies een rol</option>
              {employeeRoles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            {errors.roleId && <span className="form-error">{errors.roleId}</span>}
          </label>
        </div>

        <fieldset className="skills-fieldset">
          <legend>Skills</legend>
          <p className="skills-hint">
            Bij het kiezen van een rol worden de standaard skills al
            aangevinkt. Je kunt ze hier aanpassen.
          </p>

          <div className="skills-list">
            {skills.map((skill) => (
              <label key={skill.id} className="skill-option">
                <input
                  type="checkbox"
                  checked={formData.skillIds.includes(skill.id)}
                  onChange={() => handleSkillToggle(skill.id)}
                />
                {skill.name}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Annuleren
          </button>
          <button type="submit" className="primary-button">
            Medewerker opslaan
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddEmployee;
