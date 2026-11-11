import Button from "../atoms/Button";

export default function SkillsTable({ skills, employees, onEdit }) {
  return (
    <div className="employees-table-container">
      <table className="employees-table skills-table">
        <caption className="skills-visually-hidden">
          Vaardigheden met het aantal gekoppelde medewerkers
        </caption>
        <thead>
          <tr>
            <th scope="col">Vaardigheid</th>
            <th scope="col" className="skills-number">Medewerkers</th>
            <th scope="col"><span className="skills-visually-hidden">Acties</span></th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill.id}>
              <th scope="row">{skill.name}</th>
              <td className="skills-number">
                {employees.filter((employee) => employee.skills?.includes(skill.id)).length}
              </td>
              <td className="skills-actions">
                <Button
                  className="skill-edit-button"
                  onClick={() => onEdit(skill)}
                  aria-label={`${skill.name} bewerken`}
                >
                  Bewerken
                </Button>
              </td>
            </tr>
          ))}
          {skills.length === 0 && (
            <tr>
              <td colSpan="3" className="skills-empty">
                Er zijn nog geen vaardigheden. Voeg je eerste skill toe.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
