import { useEffect, useState } from "react";
import { Link } from "react-router";
import Pagination from "../components/molecules/Pagination";
import { getAllEmployeeSkills, SKILL_LEVELS } from "../services/employeeService";
import "../styles/roles.css";
import "../styles/skills-matrix.css";

const EMPLOYEES_PER_PAGE = 20;
// Meer kolommen past niet goed op het scherm.
const MAX_COLUMNS = 8;

// Skills-matrix: medewerkers (rijen) x skills (kolommen), met het niveau in elke cel.
// Ook "Wie kan dit?": kies een skill en een minimaal niveau, dan zie je alleen
// de medewerkers die dat hebben.
function SkillsMatrix({ employees, skills, jobRoles }) {
  // { databaseId: { skillId: niveau } }, opgehaald bij het openen van de pagina.
  const [levels, setLevels] = useState({});
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [roleId, setRoleId] = useState("");
  // "Wie kan dit?"
  const [mustHaveSkill, setMustHaveSkill] = useState("");
  const [minLevel, setMinLevel] = useState(1);
  // Zelf gekozen kolommen (als er geen rol gekozen is).
  const [chosenSkillIds, setChosenSkillIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAllEmployeeSkills()
      .then((result) => setLevels(result))
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const levelOf = (employee, skillId) => levels[employee.databaseId]?.[skillId] ?? 0;
  const selectedRole = jobRoles.find((role) => String(role.id) === roleId);

  // ---------- Welke kolommen? ----------
  // Rol gekozen: de standaard skills van die rol.
  // Anders: zelf gekozen skills, of de skills die het vaakst voorkomen.
  const countPerSkill = {};
  for (const employeeLevels of Object.values(levels)) {
    for (const skillId of Object.keys(employeeLevels)) {
      countPerSkill[skillId] = (countPerSkill[skillId] ?? 0) + 1;
    }
  }
  const mostCommon = [...skills]
    .sort((a, b) => (countPerSkill[b.id] ?? 0) - (countPerSkill[a.id] ?? 0))
    .slice(0, 6);

  let columns;
  if (selectedRole) {
    columns = skills.filter((skill) => selectedRole.defaultSkills.includes(skill.id));
  } else if (chosenSkillIds.length > 0) {
    columns = chosenSkillIds.map((id) => skills.find((skill) => skill.id === id)).filter(Boolean);
  } else {
    columns = mostCommon;
  }
  columns = columns.slice(0, MAX_COLUMNS);

  // ---------- Welke rijen? ----------
  const countries = [...new Set(employees.map((employee) => employee.country).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "nl"));
  const searchText = search.trim().toLowerCase();
  const mustHaveId = mustHaveSkill === "" ? null : Number(mustHaveSkill);

  const rows = employees
    .filter((employee) => country === "" || employee.country === country)
    .filter((employee) => !selectedRole || employee.roleIds?.includes(selectedRole.id))
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchText) ||
        employee.id.toLowerCase().includes(searchText)
    )
    .filter((employee) => mustHaveId === null || levelOf(employee, mustHaveId) >= minLevel)
    .sort((a, b) => a.name.localeCompare(b.name, "nl"));

  const totalPages = Math.max(1, Math.ceil(rows.length / EMPLOYEES_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * EMPLOYEES_PER_PAGE;
  const visibleRows = rows.slice(startIndex, startIndex + EMPLOYEES_PER_PAGE);

  // Elk filter: terug naar pagina 1.
  const withReset = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const addColumn = (skillId) => {
    if (skillId === "") return;
    const id = Number(skillId);
    setChosenSkillIds((current) =>
      current.includes(id) ? current : [...current, id].slice(0, MAX_COLUMNS)
    );
  };

  const removeColumn = (skillId) => {
    setChosenSkillIds((current) => current.filter((id) => id !== skillId));
  };

  return (
    <section className="page" aria-labelledby="matrix-title">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">OVERZICHT</p>
          <h1 id="matrix-title">Skills-matrix</h1>
          <p className="page-description">
            Wie heeft welke skill, en op welk niveau. Kies een rol om te zien wie
            zijn standaard skills mist.
          </p>
        </div>
      </div>

      {/* ---------- Filters ---------- */}
      <div className="content-card matrix-filters">
        <div className="roles-tools">
          <input
            type="search"
            className="roles-search"
            value={search}
            onChange={(event) => withReset(setSearch)(event.target.value)}
            placeholder="Zoek medewerker..."
            aria-label="Zoek een medewerker"
          />
          <select
            className="roles-sort"
            value={country}
            onChange={(event) => withReset(setCountry)(event.target.value)}
            aria-label="Filter op land"
          >
            <option value="">Alle landen</option>
            {countries.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          <select
            className="roles-sort"
            value={roleId}
            onChange={(event) => withReset(setRoleId)(event.target.value)}
            aria-label="Filter op rol"
          >
            <option value="">Alle rollen</option>
            {jobRoles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
          </select>
        </div>

        {/* "Wie kan dit?" */}
        <div className="matrix-who">
          <span className="matrix-who-label">Wie kan dit?</span>
          <select
            className="roles-sort"
            value={mustHaveSkill}
            onChange={(event) => withReset(setMustHaveSkill)(event.target.value)}
            aria-label="Alleen medewerkers met deze skill"
          >
            <option value="">Kies een skill...</option>
            {skills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
          </select>
          <select
            className="roles-sort"
            value={minLevel}
            onChange={(event) => withReset(setMinLevel)(Number(event.target.value))}
            aria-label="Minimaal niveau"
            disabled={mustHaveSkill === ""}
          >
            {SKILL_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                minimaal {level.value} · {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Kolommen kiezen (alleen zonder rol) */}
        {!selectedRole && (
          <div className="matrix-columns">
            <span className="matrix-who-label">Kolommen:</span>
            {chosenSkillIds.length === 0 ? (
              <span className="roles-muted">de {mostCommon.length} skills die het vaakst voorkomen</span>
            ) : (
              columns.map((skill) => (
                <span key={skill.id} className="roles-chip matrix-column-chip">
                  {skill.name}
                  <button
                    type="button"
                    className="role-skill-remove"
                    onClick={() => removeColumn(skill.id)}
                    aria-label={`Kolom ${skill.name} weghalen`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
            {columns.length < MAX_COLUMNS && (
              <select
                className="roles-sort"
                value=""
                onChange={(event) => addColumn(event.target.value)}
                aria-label="Skill als kolom toevoegen"
              >
                <option value="">+ Kolom toevoegen</option>
                {skills
                  .filter((skill) => !chosenSkillIds.includes(skill.id))
                  .map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
              </select>
            )}
          </div>
        )}
      </div>

      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      {/* ---------- De matrix ---------- */}
      <div className="employees-table-container matrix-container">
        <table className="matrix-table">
          <thead>
            <tr>
              <th scope="col" className="matrix-name-cell">Medewerker</th>
              {columns.map((skill) => (
                <th key={skill.id} scope="col" title={skill.name}>
                  <span className="matrix-skill-head">{skill.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((employee) => (
              <tr key={employee.id}>
                <th scope="row" className="matrix-name-cell">
                  <Link className="roles-name" to={`/medewerkers/${employee.id}`}>{employee.name}</Link>
                  <span className="roles-description">{employee.role || "Geen rol"}</span>
                </th>
                {columns.map((skill) => {
                  const level = levelOf(employee, skill.id);
                  // Mist hij een standaard skill van de gekozen rol? Dan rood.
                  const isMissing = level === 0 && Boolean(selectedRole);
                  return (
                    <td
                      key={skill.id}
                      className={`matrix-cell${isMissing ? " is-missing" : ""}`}
                      title={level > 0 ? `${skill.name}: niveau ${level}` : `${skill.name}: heeft deze skill niet`}
                    >
                      {level > 0 ? (
                        <span className={`matrix-level level-${level}`}>{level}</span>
                      ) : isMissing ? (
                        <span className="matrix-missing">mist</span>
                      ) : (
                        <span className="roles-muted">–</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {!isLoading && visibleRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="roles-muted">
                  Geen medewerkers gevonden met dit filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage}>
        {isLoading
          ? "Laden..."
          : rows.length === 0
            ? "Geen medewerkers"
            : `Medewerkers ${startIndex + 1}–${startIndex + visibleRows.length} van ${rows.length}`}
      </Pagination>

      <p className="matrix-legend">
        Niveau: 1 Beginner · 2 Basis · 3 Gevorderd · 4 Ervaren · 5 Expert ·{" "}
        <span className="matrix-missing">mist</span> = standaard skill van de gekozen rol ontbreekt
      </p>
    </section>
  );
}

export default SkillsMatrix;
