import { useState } from "react";
import { useParams } from "react-router";
import Button from "../components/atoms/Button";
import ConfirmDialog from "../components/organisms/ConfirmDialog";
import RoleEmployees from "../components/organisms/RoleEmployees";
import EscoName from "../components/molecules/EscoName";
import "../styles/esco-search.css";
import "../styles/employee.css";
import "../styles/roles.css";

// Detailpagina van één rol.
function Role({ jobRoles, skills, employees, onBack, onAddEmployee, onUpdateSkills, onRemoveEmployee, onRename }) {
  // Het id uit de URL: /rollen/5 geeft "5". Een URL is altijd tekst.
  const { roleId } = useParams();

  // De id's in de database zijn getallen, dus we vergelijken als tekst.
  const role = jobRoles.find((item) => String(item.id) === roleId);

  // Hooks (useState) moeten altijd bovenaan, vóór een "return".
  // De Boon Edam-naam aanpassen (blok "ESCO-gegevens").
  // null = nog niet aangeraakt; dan tonen we de huidige naam.
  const [newName, setNewName] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameMessage, setRenameMessage] = useState("");
  const [renameError, setRenameError] = useState("");

  // Skills toevoegen en weghalen.
  const [skillSearch, setSkillSearch] = useState("");
  const [isSavingSkills, setIsSavingSkills] = useState(false);
  const [skillError, setSkillError] = useState("");

  // Wat de gebruiker wil verwijderen. Zolang dit niet null is, staat het
  // bevestigingsvenster open. Bijv. { type: "skill", item: skill }.
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState("");

  const backButton = (
    <Button className="employee-back-button" onClick={onBack}>
      <span aria-hidden="true">←</span> Terug naar rollen
    </Button>
  );

  // Vlak na het laden is de lijst met rollen nog leeg: dan "laden...".
  // Is de lijst wel geladen maar bestaat het id niet: "niet gevonden".
  if (!role) {
    return (
      <section className="employee-page">
        {backButton}
        <div className="employees-header">
          <div>
            <h1>{jobRoles.length === 0 ? "Rol laden..." : "Rol niet gevonden"}</h1>
            <p>Ga terug naar het overzicht en kies een rol.</p>
          </div>
        </div>
      </section>
    );
  }

  // De skills van deze rol, met naam.
  // role.defaultSkills is een lijst met id's, bijv. [3, 7].
  const roleSkills = skills.filter((skill) => role.defaultSkills.includes(skill.id));

  // Heeft deze rol een eigen Boon Edam-naam (anders dan de ESCO-naam)?
  const nameValue = newName ?? (role.escoTitle && role.name === role.escoTitle ? "" : role.name);

  // Nieuwe naam opslaan. Leeg = weer de ESCO-naam gebruiken.
  const saveName = async (event) => {
    event.preventDefault();
    const finalName = nameValue.trim() || role.escoTitle;
    setIsRenaming(true);
    setRenameError("");
    setRenameMessage("");
    try {
      await onRename(role.id, finalName);
      setNewName(null);
      setRenameMessage("Opgeslagen.");
    } catch (error) {
      setRenameError(error.message);
    } finally {
      setIsRenaming(false);
    }
  };

  // Suggesties om toe te voegen: skills die de rol nog niet heeft en die
  // passen bij wat je typt. Maximaal 8, anders wordt de lijst te lang.
  const skillSearchText = skillSearch.trim().toLowerCase();
  const skillSuggestions =
    skillSearchText === ""
      ? []
      : skills
          .filter((skill) => !role.defaultSkills.includes(skill.id))
          .filter((skill) => skill.name.toLowerCase().includes(skillSearchText))
          .slice(0, 8);

  // Stuurt de nieuwe lijst skill-id's naar App (en zo naar de backend).
  const saveSkills = async (newSkillIds) => {
    setIsSavingSkills(true);
    setSkillError("");
    try {
      await onUpdateSkills(role.id, newSkillIds);
    } catch (error) {
      setSkillError(error.message);
    } finally {
      setIsSavingSkills(false);
    }
  };

  const addSkill = (skillId) => {
    setSkillSearch("");
    saveSkills([...role.defaultSkills, skillId]);
  };

  const removeSkill = async (skillId) => {
    await saveSkills(role.defaultSkills.filter((id) => id !== skillId));
  };

  // Wordt pas aangeroepen als de gebruiker in het venster heeft bevestigd.
  const confirmRemoval = async () => {
    setIsRemoving(true);
    setRemoveError("");
    try {
      if (pendingRemoval.type === "skill") {
        await removeSkill(pendingRemoval.item.id);
      } else {
        await onRemoveEmployee(pendingRemoval.item, role);
      }
    } catch (error) {
      setRemoveError(error.message);
    } finally {
      setIsRemoving(false);
      setPendingRemoval(null);
    }
  };

  // De medewerkers met deze rol, op alfabet.
  const roleEmployees = employees
    .filter((employee) => employee.roleIds?.includes(role.id))
    .sort((a, b) => a.name.localeCompare(b.name, "nl"));

  // Per land tellen: { Nederland: 96, Duitsland: 37, ... }
  const countByCountry = {};
  for (const employee of roleEmployees) {
    const name = employee.country || "Onbekend";
    countByCountry[name] = (countByCountry[name] ?? 0) + 1;
  }
  // Als lijst [["Nederland", 96], ["Duitsland", 37]], grootste eerst.
  const countries = Object.entries(countByCountry).sort((a, b) => b[1] - a[1]);


  return (
    <section className="employee-page" aria-labelledby="role-title">
      {backButton}

      <header className="employees-header">
        <div>
          <EscoName escoTitle={role.escoTitle}>
            <h1 id="role-title">{role.name}</h1>
          </EscoName>
          <p>{role.description || "Geen omschrijving."}</p>
        </div>
      </header>

      {/* Alleen bij een rol uit ESCO: de originele gegevens en een eigen naam. */}
      {role.escoUri && (
        <section className="role-section" aria-labelledby="role-esco-title">
          <h2 id="role-esco-title">ESCO-gegevens</h2>
          <dl className="esco-facts">
            <dt>ESCO-naam</dt>
            <dd>{role.escoTitle}</dd>
            <dt>ESCO-code</dt>
            <dd>{role.escoCode || "Onbekend"}</dd>
            <dt>ESCO-id</dt>
            <dd>
              <a href={role.escoUri} target="_blank" rel="noreferrer">
                {role.escoUri}
              </a>{" "}
              <span aria-hidden="true">↗</span>
            </dd>
            <dt>Boon Edam-naam</dt>
            <dd>
              <form className="esco-rename" onSubmit={saveName}>
                <input
                  value={nameValue}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder={role.escoTitle}
                  aria-label="Boon Edam-naam van deze rol"
                />
                <button type="submit" className="primary-button" disabled={isRenaming}>
                  {isRenaming ? "Opslaan..." : "Opslaan"}
                </button>
              </form>
              <span className="form-hint">Leeg maken = weer de ESCO-naam gebruiken.</span>
              {renameMessage && <p className="form-hint">{renameMessage}</p>}
              {renameError && <p className="form-error" role="alert">{renameError}</p>}
            </dd>
          </dl>
        </section>
      )}

      {/* De belangrijkste cijfers in één oogopslag. */}
      <div className="role-stats">
        <div className="role-stat">
          <strong>{roleEmployees.length}</strong>
          <span>medewerkers</span>
        </div>
        <div className="role-stat">
          <strong>{roleSkills.length}</strong>
          <span>standaard skills</span>
        </div>
        <div className="role-stat">
          <strong>{countries.length}</strong>
          <span>{countries.length === 1 ? "land" : "landen"}</span>
        </div>
      </div>



      <section className="role-section" aria-labelledby="role-skills-title">
        <h2 id="role-skills-title">Standaard skills</h2>
        {roleSkills.length === 0 ? (
          <p className="roles-muted">Deze rol heeft nog geen skills.</p>
        ) : (
          <ul className="role-skill-list">
            {roleSkills.map((skill) => (
              <li
                key={skill.id}
                className="roles-chip"
                title={skill.escoUri ? `ESCO: ${skill.escoTitle || skill.name}\nESCO-id: ${skill.escoUri}` : "Eigen skill, niet in ESCO"}
              >
                {skill.name}
                <button
                  type="button"
                  className="role-skill-remove"
                  onClick={() => setPendingRemoval({ type: "skill", item: skill })}
                  disabled={isSavingSkills}
                  aria-label={`${skill.name} weghalen`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Een skill toevoegen: typen, en dan op een suggestie klikken. */}
        <div className="role-skill-add">
          <input
            type="search"
            className="roles-search"
            value={skillSearch}
            onChange={(event) => setSkillSearch(event.target.value)}
            placeholder="Skill toevoegen..."
            aria-label="Zoek een skill om toe te voegen"
            disabled={isSavingSkills}
          />

          {skillSearchText !== "" && (
            <ul className="role-skill-options">
              {skillSuggestions.map((skill) => (
                <li key={skill.id}>
                  <button type="button" onClick={() => addSkill(skill.id)}>
                    + {skill.name}
                  </button>
                </li>
              ))}
              {skillSuggestions.length === 0 && (
                <li className="roles-muted">Geen skill gevonden.</li>
              )}
            </ul>
          )}
        </div>

        {skillError && <p className="form-error" role="alert">{skillError}</p>}
      </section>

      <RoleEmployees
        roleId={role.id}
        employees={roleEmployees}
        allEmployees={employees}
        countries={countries}
        onAddEmployee={(employee) => onAddEmployee(employee, role)}
        onRequestRemove={(employee) => setPendingRemoval({ type: "employee", item: employee })}
        removeError={removeError}
      />

      {/* Bevestigen voordat er iets wordt verwijderd. */}
      {pendingRemoval && (
        <ConfirmDialog
          title={pendingRemoval.type === "skill" ? "Skill weghalen bij deze rol?" : "Rol weghalen bij medewerker?"}
          isBusy={isRemoving}
          onConfirm={confirmRemoval}
          onClose={() => setPendingRemoval(null)}
        >
          {pendingRemoval.type === "skill" ? (
            <p>
              De skill <strong>{pendingRemoval.item.name}</strong> is daarna geen standaard
              skill meer van <strong>{role.name}</strong>. Nieuwe medewerkers met deze rol
              krijgen hem dan niet meer automatisch.
            </p>
          ) : (
            <p>
              <strong>{pendingRemoval.item.name}</strong> ({pendingRemoval.item.id}) heeft
              daarna de rol <strong>{role.name}</strong> niet meer.
            </p>
          )}
        </ConfirmDialog>
      )}
    </section>
  );
}

export default Role;