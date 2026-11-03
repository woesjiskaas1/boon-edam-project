
import "../styles/profile.css";

const profile = {
  firstName: "Jan",
  lastName: "Jansen",
  email: "jan.jansen@example.com",
  phone: "+31 6 12345678",
  jobTitle: "Medewerker",
  department: "IT",
};

export default function Profile() {
  return (
    <section className="profile-page">
      <header className="profile-page-header">
        <div>
          <p className="profile-eyebrow">MIJN ACCOUNT</p>
          <h1>Mijn profiel</h1>
          <p className="profile-description">
            Bekijk je persoonlijke en werkgerelateerde gegevens.
          </p>
        </div>
      </header>

      <section className="profile-summary">
        <div className="profile-avatar" aria-hidden="true">
          {profile.firstName.charAt(0)}
          {profile.lastName.charAt(0)}
        </div>

        <div className="profile-summary-info">
          <h2>
            {profile.firstName} {profile.lastName}
          </h2>
          <p>{profile.jobTitle}</p>
          <span>{profile.department}</span>
        </div>
      </section>

      <div className="profile-grid">
        <section className="profile-card">
          <h2>Persoonlijke gegevens</h2>

          <div className="profile-field">
            <span>Voornaam</span>
            <p>{profile.firstName}</p>
          </div>

          <div className="profile-field">
            <span>Achternaam</span>
            <p>{profile.lastName}</p>
          </div>

          <div className="profile-field">
            <span>E-mailadres</span>
            <p>{profile.email}</p>
          </div>

          <div className="profile-field">
            <span>Telefoonnummer</span>
            <p>{profile.phone}</p>
          </div>
        </section>

        <section className="profile-card">
          <h2>Werkgegevens</h2>

          <div className="profile-field">
            <span>Functie</span>
            <p>{profile.jobTitle}</p>
          </div>

          <div className="profile-field">
            <span>Afdeling</span>
            <p>{profile.department}</p>
          </div>
        </section>
      </div>
    </section>
  );
}