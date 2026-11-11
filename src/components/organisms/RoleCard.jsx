import Button from "../atoms/Button";

// Eén kaart in het overzicht: de naam van de rol, de gekoppelde skills,
// en een keuzelijst om een skill toe te voegen (werkt nog niet).
function RoleCard({ role, skills }) {
  // Skills die al bij de rol horen (met naam, voor op het scherm).
  const linkedSkills = skills.filter((skill) =>
    role.defaultSkills.includes(skill.id)
  );

  // Skills die nog NIET bij de rol horen: die komen in de keuzelijst.
  const availableSkills = skills.filter(
    (skill) => !role.defaultSkills.includes(skill.id)
  );

  return (
    <article className="role-card">
      <h2>{role.name}</h2>

      <h3 className="role-skills-title">Skills ({linkedSkills.length})</h3>

      <ul className="role-skills">
        {linkedSkills.map((skill) => (
          <li key={skill.id} className="role-skill">
            {skill.name}
            <button
              type="button"
              className="role-skill-remove"
              aria-label={`${skill.name} verwijderen uit ${role.name}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="role-add-skill">
        <select aria-label={`Skill toevoegen aan ${role.name}`}>
          <option value="">Kies een skill</option>
          {availableSkills.map((skill) => (
            <option key={skill.id} value={skill.id}>{skill.name}</option>
          ))}
        </select>
        <Button variant="secondary">Toevoegen</Button>
      </div>
    </article>
  );
}

export default RoleCard;