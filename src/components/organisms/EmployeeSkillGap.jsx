import Button from "../atoms/Button";

// Gap-analyse: welke standaard skills van zijn rollen heeft de medewerker (nog) niet?
export default function EmployeeSkillGap({ requiredCount, missingSkills, roleCount, onAddSkill }) {
  const coveredCount = requiredCount - missingSkills.length;

  return (
    <section className="employee-detail-card employee-gap-card" aria-labelledby="employee-gap-title">
      <h2 id="employee-gap-title">Skills voor zijn rollen</h2>
      <div className="gap-meter" aria-hidden="true">
        <span style={{ width: `${(coveredCount / requiredCount) * 100}%` }} />
      </div>
      <p className="gap-summary">
        Heeft <strong>{coveredCount} van de {requiredCount}</strong> standaard
        skills van {roleCount === 1 ? "zijn rol" : "zijn rollen"}.
      </p>
      {missingSkills.length === 0 ? (
        <p className="gap-ok">Compleet: hij heeft alle standaard skills.</p>
      ) : (
        <ul className="gap-missing">
          {missingSkills.map((skill) => (
            <li key={skill.id}>
              <span>Mist: <strong>{skill.name}</strong></span>
              <Button variant="secondary" onClick={() => onAddSkill(skill.id)}>
                + Toevoegen
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
