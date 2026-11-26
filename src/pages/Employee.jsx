import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import CountryLabel from "../components/molecules/CountryLabel";
import CountrySelect from "../components/molecules/CountrySelect";
import ConfirmDialog from "../components/organisms/ConfirmDialog";
import {
  getEmployeeSkills,
  addSkillToEmployee,
  removeSkillFromEmployee,
  updateEmployeeSkillLevel,
  SKILL_LEVELS,
} from "../services/employeeService";
import "../styles/employee.css";
import "../styles/add-employee.css";
import "../styles/roles.css";

// Detailpagina van één medewerker.
// Je kunt hier de gegevens bewerken, rollen geven of weghalen, en skills
// toevoegen of weghalen. Weghalen gaat altijd via een bevestigingsvenster.
function Employee({
  employees,
  skills,
  jobRoles,
  countries,
  locations,
  onBack,
  onUpdate,
  onAddRole,
  onRemoveRole,
}) {
  const { employeeId } = useParams();
  const employee = employees.find((item) => item.id === employeeId);

  // Hooks altijd bovenaan, vóór een "return".
  // Gegevens bewerken: null = niet aan het bewerken.
  const [editForm, setEditForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState("");
  // Skills van deze medewerker, met niveau: [{ id, level }], uit de database.
  const [skillRows, setSkillRows] = useState([]);
  const [skillsError, setSkillsError] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  // Rol toevoegen: het id uit de keuzelijst.
  const [roleToAdd, setRoleToAdd] = useState("");
  const [roleError, setRoleError] = useState("");
  // Wat je wilt weghalen; zolang dit niet null is, staat het venster open.
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const databaseId = employee?.databaseId;

  // De skills ophalen zodra we weten welke medewerker het is.
  // [databaseId] = opnieuw ophalen als je naar een andere medewerker gaat.
  useEffect(() => {
    if (!databaseId) {
      return;
    }
    getEmployeeSkills(databaseId)
      .then((rows) => setSkillRows(rows))
      .catch((error) => setSkillsError(error.message));
  }, [databaseId]);

  const backButton = (
    <button type="button" className="employee-back-button" onClick={onBack}>
      <span aria-hidden="true">←</span> Terug naar medewerkers
    </button>
  );

  if (!employee) {
    return (
      <section className="employee-page">
        {backButton}
        <div className="employees-header">
          <div>
            <h1>{employees.length === 0 ? "Medewerker laden..." : "Medewerker niet gevonden"}</h1>
            <p>Ga terug naar het overzicht en selecteer een medewerker.</p>
          </div>
        </div>
      </section>
    );
  }

  const initials = employee.name
    .trim()
    .split(/\s+/)
    .filter((_, index, names) => index === 0 || index === names.length - 1)
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  // Rollen en skills van deze medewerker, met naam.
  const employeeRoles = jobRoles.filter((role) => employee.roleIds?.includes(role.id));
  const otherRoles = jobRoles.filter((role) => !employee.roleIds?.includes(role.id));
  const skillIds = skillRows.map((row) => row.id);
  const levelOf = (skillId) => skillRows.find((row) => row.id === skillId)?.level ?? 1;
  const employeeSkills = skills.filter((skill) => skillIds.includes(skill.id));

  // Gap-analyse: welke standaard skills van zijn rollen heeft hij (nog) niet?
  const requiredSkillIds = [...new Set(employeeRoles.flatMap((role) => role.defaultSkills))];
  const missingSkills = skills.filter(
    (skill) => requiredSkillIds.includes(skill.id) && !skillIds.includes(skill.id)
  );
  const coveredCount = requiredSkillIds.length - missingSkills.length;

  // Suggesties om een skill toe te voegen (zoals op de rolpagina).
  const skillSearchText = skillSearch.trim().toLowerCase();
  const skillSuggestions =
    skillSearchText === ""
      ? []
      : skills
          .filter((skill) => !skillIds.includes(skill.id))
          .filter((skill) => skill.name.toLowerCase().includes(skillSearchText))
          .slice(0, 8);

  // ---------- Gegevens bewerken ----------
  const startEditing = () => {
    setEditForm({
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
      email: employee.email,
      country: employee.country,
      location: employee.location,
    });
    setEditError("");
  };

  const changeField = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const saveDetails = async (event) => {
    event.preventDefault();
    if (editForm.firstName.trim() === "" || editForm.lastName.trim() === "") {
      setEditError("Vul een voornaam en achternaam in.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setEditError("Vul een geldig e-mailadres in.");
      return;
    }
    setIsSaving(true);
    setEditError("");
    try {
      await onUpdate(employee, editForm);
      setEditForm(null);
    } catch (error) {
      setEditError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const countryLocations = editForm
    ? locations.filter((location) => location.country === editForm.country)
    : [];

  // ---------- Rollen ----------
  const addRole = async () => {
    const role = jobRoles.find((item) => String(item.id) === roleToAdd);
    if (!role) {
      return;
    }
    setRoleError("");
    try {
      await onAddRole(employee, role);
      setRoleToAdd("");
      // De backend geeft de medewerker ook de standaard skills van de rol.
      setSkillRows(await getEmployeeSkills(databaseId));
    } catch (error) {
      setRoleError(error.message);
    }
  };

  // ---------- Skills ----------
  const addSkill = async (skillId) => {
    setSkillsError("");
    try {
      await addSkillToEmployee(databaseId, skillId);
      setSkillRows(await getEmployeeSkills(databaseId));
      setSkillSearch("");
    } catch (error) {
      setSkillsError(error.message);
    }
  };

  // Niveau aanpassen. Pas na een "ja" van de backend tonen we het nieuwe niveau.
  const changeLevel = async (skillId, level) => {
    setSkillsError("");
    try {
      await updateEmployeeSkillLevel(databaseId, skillId, level);
      setSkillRows((current) =>
        current.map((row) => (row.id === skillId ? { ...row, level } : row))
      );
    } catch (error) {
      setSkillsError(error.message);
    }
  };

  // ---------- Weghalen (na bevestigen) ----------
  const confirmRemoval = async () => {
    setIsRemoving(true);
    try {
      if (pendingRemoval.type === "role") {
        setRoleError("");
        await onRemoveRole(employee, pendingRemoval.item);
      } else {
        setSkillsError("");
        await removeSkillFromEmployee(databaseId, pendingRemoval.item.id);
        setSkillRows((current) => current.filter((row) => row.id !== pendingRemoval.item.id));
      }
    } catch (error) {
      if (pendingRemoval.type === "role") {
        setRoleError(error.message);
      } else {
        setSkillsError(error.message);
      }
    } finally {
      setIsRemoving(false);
      setPendingRemoval(null);
    }
  };

  return (
    <section className="employee-page" aria-labelledby="employee-page-title">
      {backButton}

      <header className="employees-header">
        <div>
          <h1 id="employee-page-title">Medewerker</h1>
          <p>Bekijk en bewerk de gegevens, rollen en skills van deze medewerker.</p>
        </div>
        {editForm === null && (
          <button type="button" className="secondary-button" onClick={startEditing}>
            Gegevens bewerken
          </button>
        )}
      </header>

      <div className="employee-summary">
        <div className="employee-avatar" aria-hidden="true">{initials}</div>
        <div className="employee-summary-info">
          <h2>{employee.name}</h2>
          <p>{employee.role || "Geen rol vastgelegd"}</p>
          <span>{employee.id}</span>
        </div>
        {employee.country && (
          <span className="employee-country"><CountryLabel country={employee.country} /></span>
        )}
      </div>

      <div className="employee-details-grid">
        {/* ---------- Gegevens: bekijken of bewerken ---------- */}
        {editForm === null ? (
          <section className="employee-detail-card" aria-labelledby="employee-personal-title">
            <h2 id="employee-personal-title">Gegevens</h2>
            <dl className="employee-fields">
              <div>
                <dt>Naam</dt>
                <dd>{employee.name}</dd>
              </div>
              <div>
                <dt>E-mailadres</dt>
                <dd>
                  {employee.email
                    ? <a href={`mailto:${employee.email}`}>{employee.email}</a>
                    : "Niet ingevuld"}
                </dd>
              </div>
              <div>
                <dt>Land</dt>
                <dd><CountryLabel country={employee.country} /></dd>
              </div>
              <div>
                <dt>Vestiging</dt>
                <dd>{employee.location || "Niet ingevuld"}</dd>
              </div>
              <div>
                <dt>Medewerkers ID</dt>
                <dd>{employee.id}</dd>
              </div>
            </dl>
          </section>
        ) : (
          <form
            className="employee-detail-card employee-edit-card"
            onSubmit={saveDetails}
            aria-labelledby="employee-edit-title"
            noValidate
          >
            <h2 id="employee-edit-title">Gegevens bewerken</h2>
            <div className="form-grid form-grid-names">
              <label className="form-field">
                Voornaam
                <input name="firstName" value={editForm.firstName} onChange={changeField} />
              </label>
              <label className="form-field">
                Tussenvoegsel
                <input name="middleName" value={editForm.middleName} onChange={changeField} />
              </label>
              <label className="form-field">
                Achternaam
                <input name="lastName" value={editForm.lastName} onChange={changeField} />
              </label>
            </div>
            <div className="form-stack employee-edit-stack">
              <label className="form-field">
                E-mailadres
                <input type="email" name="email" value={editForm.email} onChange={changeField} />
              </label>
              <div className="form-grid">
                <CountrySelect
                  countries={countries}
                  value={editForm.country}
                  onChange={(country) =>
                    setEditForm((current) => ({ ...current, country, location: "" }))
                  }
                />
                <label className="form-field">
                  Vestiging
                  <select
                    name="location"
                    value={editForm.location}
                    onChange={changeField}
                    disabled={editForm.country === ""}
                  >
                    <option value="">Kies een vestiging</option>
                    {countryLocations.map((location) => (
                      <option key={location.id} value={location.name}>{location.name}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {editError && <p className="form-error form-save-error" role="alert">{editError}</p>}
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => setEditForm(null)}>
                Annuleren
              </button>
              <button type="submit" className="primary-button" disabled={isSaving}>
                {isSaving ? "Opslaan..." : "Opslaan"}
              </button>
            </div>
          </form>
        )}

        {/* ---------- Rollen ---------- */}
        <section className="employee-detail-card" aria-labelledby="employee-roles-title">
          <h2 id="employee-roles-title">Rollen</h2>
          {employeeRoles.length === 0 ? (
            <p className="employee-empty-skills">Nog geen rollen.</p>
          ) : (
            <ul className="role-skill-list">
              {employeeRoles.map((role) => (
                <li key={role.id} className="roles-chip">
                  <Link className="employee-chip-link" to={`/rollen/${role.id}`}>{role.name}</Link>
                  <button
                    type="button"
                    className="role-skill-remove"
                    onClick={() => setPendingRemoval({ type: "role", item: role })}
                    aria-label={`Rol ${role.name} weghalen`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {otherRoles.length > 0 && (
            <div className="employee-add-row">
              <select
                className="roles-sort"
                value={roleToAdd}
                onChange={(event) => setRoleToAdd(event.target.value)}
                aria-label="Kies een rol om toe te voegen"
              >
                <option value="">Rol toevoegen...</option>
                {otherRoles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <button type="button" className="secondary-button" onClick={addRole} disabled={roleToAdd === ""}>
                + Toevoegen
              </button>
            </div>
          )}
          <p className="form-hint">Bij een nieuwe rol krijgt de medewerker ook de standaard skills van die rol.</p>
          {roleError && <p className="form-error" role="alert">{roleError}</p>}
        </section>

        {/* ---------- Gap-analyse: mist hij skills voor zijn rollen? ---------- */}
        {requiredSkillIds.length > 0 && (
          <section className="employee-detail-card employee-gap-card" aria-labelledby="employee-gap-title">
            <h2 id="employee-gap-title">Skills voor zijn rollen</h2>
            <div className="gap-meter" aria-hidden="true">
              <span style={{ width: `${(coveredCount / requiredSkillIds.length) * 100}%` }} />
            </div>
            <p className="gap-summary">
              Heeft <strong>{coveredCount} van de {requiredSkillIds.length}</strong> standaard
              skills van {employeeRoles.length === 1 ? "zijn rol" : "zijn rollen"}.
            </p>
            {missingSkills.length === 0 ? (
              <p className="gap-ok">Compleet: hij heeft alle standaard skills.</p>
            ) : (
              <ul className="gap-missing">
                {missingSkills.map((skill) => (
                  <li key={skill.id}>
                    <span>Mist: <strong>{skill.name}</strong></span>
                    <button type="button" className="secondary-button" onClick={() => addSkill(skill.id)}>
                      + Toevoegen
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ---------- Skills ---------- */}
        <section className="employee-detail-card employee-skills-card" aria-labelledby="employee-skills-title">
          <h2 id="employee-skills-title">Skills ({employeeSkills.length})</h2>
          {employeeSkills.length === 0 ? (
            <p className="employee-empty-skills">Er zijn nog geen skills vastgelegd voor deze medewerker.</p>
          ) : (
            <ul className="employee-skill-rows">
              {employeeSkills.map((skill) => (
                <li key={skill.id}>
                  <span className="employee-skill-name">{skill.name}</span>
                  <select
                    className="employee-skill-level"
                    value={levelOf(skill.id)}
                    onChange={(event) => changeLevel(skill.id, Number(event.target.value))}
                    aria-label={`Niveau van ${skill.name}`}
                  >
                    {SKILL_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.value} · {level.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="role-skill-remove"
                    onClick={() => setPendingRemoval({ type: "skill", item: skill })}
                    aria-label={`Skill ${skill.name} weghalen`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="role-skill-add">
            <input
              type="search"
              className="roles-search"
              value={skillSearch}
              onChange={(event) => setSkillSearch(event.target.value)}
              placeholder="Skill toevoegen..."
              aria-label="Zoek een skill om toe te voegen"
            />
            {skillSearchText !== "" && (
              <ul className="role-skill-options">
                {skillSuggestions.map((skill) => (
                  <li key={skill.id}>
                    <button type="button" onClick={() => addSkill(skill.id)}>+ {skill.name}</button>
                  </li>
                ))}
                {skillSuggestions.length === 0 && (
                  <li className="roles-muted">Geen skill gevonden.</li>
                )}
              </ul>
            )}
          </div>
          {skillsError && <p className="form-error" role="alert">{skillsError}</p>}
        </section>
      </div>

      {pendingRemoval && (
        <ConfirmDialog
          title={pendingRemoval.type === "role" ? "Rol weghalen?" : "Skill weghalen?"}
          isBusy={isRemoving}
          onConfirm={confirmRemoval}
          onClose={() => setPendingRemoval(null)}
        >
          <p>
            <strong>{employee.name}</strong> heeft daarna de{" "}
            {pendingRemoval.type === "role" ? "rol" : "skill"}{" "}
            <strong>{pendingRemoval.item.name}</strong> niet meer.
          </p>
        </ConfirmDialog>
      )}
    </section>
  );
}

export default Employee;
