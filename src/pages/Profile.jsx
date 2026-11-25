import ProfileDetails from "../components/organisms/ProfileDetails";
import "../styles/profile.css";

const profile = {
  firstName: "Jan",
  lastName: "Jansen",
  email: "jan.jansen@example.com",
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
      <ProfileDetails profile={profile} />
    </section>
  );
}
