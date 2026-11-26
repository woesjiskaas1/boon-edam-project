import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import { SKILL_LEVELS } from "../../services/employeeService";
import "../../styles/roles.css";

// Kaart "Skills" op de medewerkerpagina: skills met niveau, toevoegen en
// (via de pagina) weghalen.
export default function EmployeeSkills({
  skills,
  levelOf,
  search,
  suggestions,
  error,
  onSearchChange,
  onAdd,
  onLevelChange,
  onRequestRemove,
}) {
  const searchText = search.trim();

  return (
    <section className="employee-detail-card employee-skills-card" aria-labelledby="employee-skills-title">
      <h2 id="employee-skills-title">Skills ({skills.length})</h2>
      {skills.length === 0 ? (
        <p className="employee-empty-skills">Er zijn nog geen skills vastgelegd voor deze medewerker.</p>
      ) : (
        <ul className="employee-skill-rows">
          {skills.map((skill) => (
            <li key={skill.id}>
              <span className="employee-skill-name">{skill.name}</span>
              <Select
                className="employee-skill-level"
                value={levelOf(skill.id)}
                onChange={(event) => onLevelChange(skill.id, Number(event.target.value))}
                aria-label={`Niveau van ${skill.name}`}
              >
                {SKILL_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.value} · {level.label}
                  </option>
                ))}
              </Select>
              <Button
                className="role-skill-remove"
                onClick={() => onRequestRemove(skill)}
                aria-label={`Skill ${skill.name} weghalen`}
              >
                ×
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="role-skill-add">
        <Input
          type="search"
          className="roles-search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Skill toevoegen..."
          aria-label="Zoek een skill om toe te voegen"
        />
        {searchText !== "" && (
          <ul className="role-skill-options">
            {suggestions.map((skill) => (
              <li key={skill.id}>
                <Button onClick={() => onAdd(skill.id)}>+ {skill.name}</Button>
              </li>
            ))}
            {suggestions.length === 0 && <li className="roles-muted">Geen skill gevonden.</li>}
          </ul>
        )}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  );
}
