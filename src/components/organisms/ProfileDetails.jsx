import Avatar from "../atoms/Avatar";

function ProfileCard({ title, fields }) {
  return (
    <section className="profile-card">
      <h2>{title}</h2>
      {fields.map(([label, value]) => (
        <div key={label} className="profile-field">
          <span>{label}</span>
          <p>{value}</p>
        </div>
      ))}
    </section>
  );
}

export default function ProfileDetails({ profile }) {
  const { firstName, lastName, email, jobTitle, department } = profile;
  const fullName = `${firstName} ${lastName}`;

  return (
    <>
      <section className="profile-summary">
        <Avatar name={fullName} firstAndLast />
        <div className="profile-summary-info">
          <h2>{fullName}</h2>
          <p>{jobTitle}</p>
          <span>{department}</span>
        </div>
      </section>

      <div className="profile-grid">
        <ProfileCard
          title="Persoonlijke gegevens"
          fields={[
            ["Voornaam", firstName],
            ["Achternaam", lastName],
            ["E-mailadres", email],
          ]}
        />
        <ProfileCard
          title="Werkgegevens"
          fields={[
            ["Rol", jobTitle],
            ["Afdeling", department],
          ]}
        />
      </div>
    </>
  );
}
