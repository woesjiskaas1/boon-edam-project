import { useState } from "react";
import Button from "../atoms/Button";
import FormField from "../molecules/FormField";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  repeatPassword: "",
};

const MIN_PASSWORD_LENGTH = 8;

function RegisterForm({ portalUsers, invitations, onRegister }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Controleert alle velden. Een leeg object betekent: alles klopt.
  const validate = () => {
    const newErrors = {};
    const email = formData.email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const hasAccount = portalUsers.some(
      (user) => user.email.toLowerCase() === email
    );
    const isInvited = invitations.some(
      (invitation) => invitation.email.toLowerCase() === email
    );

    if (formData.name.trim() === "") {
      newErrors.name = "Vul je naam in.";
    }

    if (!emailPattern.test(email)) {
      newErrors.email = "Vul een geldig e-mailadres in.";
    } else if (hasAccount) {
      newErrors.email = "Er is al een account met dit e-mailadres. Log in.";
    } else if (!isInvited) {
      newErrors.email = "Dit e-mailadres is niet uitgenodigd. Vraag een beheerder om een uitnodiging.";
    }

    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Je wachtwoord moet minstens ${MIN_PASSWORD_LENGTH} tekens hebben.`;
    }

    if (formData.repeatPassword !== formData.password) {
      newErrors.repeatPassword = "De wachtwoorden zijn niet hetzelfde.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    // Zijn er fouten? Dan stoppen we hier en wordt er geen account gemaakt.
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onRegister(formData);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <FormField
        label="Naam"
        name="name"
        value={formData.name}
        onChange={handleChange}
        autoComplete="name"
        error={errors.name}
      />
      <FormField
        label="E-mailadres"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        autoComplete="email"
        error={errors.email}
      />
      <FormField
        label="Wachtwoord"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="new-password"
        error={errors.password}
      />
      <FormField
        label="Herhaal wachtwoord"
        type="password"
        name="repeatPassword"
        value={formData.repeatPassword}
        onChange={handleChange}
        autoComplete="new-password"
        error={errors.repeatPassword}
      />
      <Button type="submit" variant="primary" className="auth-submit">Account aanmaken</Button>
    </form>
  );
}

export default RegisterForm;
