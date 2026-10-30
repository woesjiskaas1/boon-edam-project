import { useState } from "react";
import logo from "../assets/boon-edam-logo.png";
import "../styles/auth.css";

function Login({ portalUsers, onLogin, onShowRegister }) {
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
    <main className="auth-page">
      <div className="auth-card">
        <img className="auth-logo" src={logo} alt="Boon Edam" />

        <h1>Inloggen</h1>
        <p className="auth-intro">Log in om het HR-portaal te gebruiken.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field">
            E-mailadres
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="form-field">
            Wachtwoord
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="primary-button auth-submit">
            Inloggen
          </button>
        </form>

        <p className="auth-switch">
          Uitgenodigd, maar nog geen account?{" "}
          <button type="button" className="link-button" onClick={onShowRegister}>
            Registreren
          </button>
        </p>

        <p className="auth-demo">
          Demo: jane.doe@boonedam.com / Welkom123
        </p>
      </div>
    </main>
  );
}

export default Login;