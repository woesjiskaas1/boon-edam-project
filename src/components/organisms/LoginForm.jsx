import { useState } from "react";
import Button from "../atoms/Button";
import FormField from "../molecules/FormField";

function LoginForm({ portalUsers, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Stap 1: zijn beide velden ingevuld?
    if (email.trim() === "" || password === "") {
      setError("Vul je e-mailadres en wachtwoord in.");
      return;
    }

    // Stap 2: bestaat er een gebruiker met dit e-mailadres EN dit wachtwoord?
    const user = portalUsers.find(
      (portalUser) =>
        portalUser.email.toLowerCase() === email.trim().toLowerCase() &&
        portalUser.password === password
    );

    // Expres één algemene melding: we verklappen niet welk van de twee fout is.
    if (!user) {
      setError("E-mailadres of wachtwoord klopt niet.");
      return;
    }

    setError("");
    onLogin(user);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <FormField
        label="E-mailadres"
        type="email"
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
      />
      <FormField
        label="Wachtwoord"
        type="password"
        name="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
      />
      {error && <p className="auth-error" role="alert">{error}</p>}
      <Button type="submit" variant="primary" className="auth-submit">Inloggen</Button>
    </form>
  );
}

export default LoginForm;
