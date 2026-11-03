import { useState } from "react";
import logo from "../assets/boon-edam-logo.png";
import "../styles/auth.css";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  repeatPassword: "",
};

const MIN_PASSWORD_LENGTH = 8;

function Register({ portalUsers, invitations, onRegister, onShowLogin }) {
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
    <main className="auth-page">
      <div className="auth-card">
        <img className="auth-logo" src={logo} alt="Boon Edam" />

        <h1>Registreren</h1>
        <p className="auth-intro">
          Maak je account aan met het e-mailadres waarop je bent uitgenodigd.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field">
            Naam
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </label>

          <label className="form-field">
            E-mailadres
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </label>

          <label className="form-field">
            Wachtwoord
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="form-error">{errors.password}</span>
            )}
          </label>

          <label className="form-field">
            Herhaal wachtwoord
            <input
              type="password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.repeatPassword && (
              <span className="form-error">{errors.repeatPassword}</span>
            )}
          </label>

          <button type="submit" className="primary-button auth-submit">
            Account aanmaken
          </button>
        </form>

        <p className="auth-switch">
          Heb je al een account?{" "}
          <button type="button" className="link-button" onClick={onShowLogin}>
            Inloggen
          </button>
        </p>

        <p className="auth-demo">Demo-uitnodiging: lisa.bakker@boonedam.com</p>
      </div>
    </main>
  );
}

export default Register;