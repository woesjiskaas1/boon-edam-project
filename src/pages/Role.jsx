import { useState } from "react";
import { Link, useParams } from "react-router";
import CountryLabel from "../components/molecules/CountryLabel";
import Pagination from "../components/molecules/Pagination";
import ConfirmDialog from "../components/organisms/ConfirmDialog";
import "../styles/employee.css";
import "../styles/roles.css";

// Hoeveel medewerkers we per pagina laten zien.
const EMPLOYEES_PER_PAGE = 20;

// Detailpagina van één rol.
function Role({ jobRoles, skills, employees, onBack, onAddEmployee, onUpdateSkills, onRemoveEmployee }) {
  // Het id uit de URL: /rollen/5 geeft "5". Een URL is altijd tekst.
  const { roleId } = useParams();

  // De id's in de database zijn getallen, dus we vergelijken als tekst.
  const role = jobRoles.find((item) => String(item.id) === roleId);
    // Zoeken, filteren op land/vestiging en de huidige pagina van de lijst.
  // Hooks (useState) moeten altijd bovenaan, vóór een "return".
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Medewerkers toevoegen aan deze rol.
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [addingEmployeeId, setAddingEmployeeId] = useState(null);
  const [addError, setAddError] = useState("");

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
    <button type="button" className="employee-back-button" onClick={onBack}>
      <span aria-hidden="true">←</span> Terug naar rollen
    </button>
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

     // Vestigingen tellen, alleen binnen het gekozen land (of alle landen).
     const countByLocation = {};
     for (const employee of roleEmployees) {
       if (country !== "" && (employee.country || "Onbekend") !== country) {
         continue;
       }
       const name = employee.location || "Onbekend";
       countByLocation[name] = (countByLocation[name] ?? 0) + 1;
     }
     const locations = Object.entries(countByLocation).sort((a, b) => b[1] - a[1]);


          // Eerst filteren op land en vestiging, dan zoeken op naam of nummer.
     const searchText = search.trim().toLowerCase();
     const filteredEmployees = roleEmployees.filter((employee) => {
       const matchesCountry = country === "" || (employee.country || "Onbekend") === country;
       const matchesLocation = location === "" || (employee.location || "Onbekend") === location;
       const matchesSearch =
         employee.name.toLowerCase().includes(searchText) ||
         employee.id.toLowerCase().includes(searchText);
       return matchesCountry && matchesLocation && matchesSearch;
     });

          // Alleen de medewerkers van de huidige pagina.
     const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE));
     // Nooit voorbij de laatste pagina (bijv. als de lijst korter wordt).
     const page = Math.min(currentPage, totalPages);
     const startIndex = (page - 1) * EMPLOYEES_PER_PAGE;
     const visibleEmployees = filteredEmployees.slice(startIndex, startIndex + EMPLOYEES_PER_PAGE);

          // Ander filter of andere zoekterm: terug naar pagina 1.
     // Ander land: ook de vestiging leegmaken, die hoort bij het oude land.
     const changeCountry = (value) => {
       setCountry(value);
       setLocation("");
       setCurrentPage(1);
     };
     const changeLocation = (value) => {
       setLocation(value);
       setCurrentPage(1);
     };
     const changeSearch = (value) => {
       setSearch(value);
       setCurrentPage(1);
     };

  // Suggesties: medewerkers die deze rol nog NIET hebben en passen bij de zoekterm.
  const employeeSearchText = employeeSearch.trim().toLowerCase();
  const employeeSuggestions =
    employeeSearchText === ""
      ? []
      : employees
          .filter((employee) => !employee.roleIds?.includes(role.id))
          .filter(
            (employee) =>
              employee.name.toLowerCase().includes(employeeSearchText) ||
              employee.id.toLowerCase().includes(employeeSearchText)
          )
          .slice(0, 8);

  // Geeft de gekozen medewerker deze rol (via App naar de backend).
  const addEmployee = async (employee) => {
    setAddingEmployeeId(employee.id);
    setAddError("");
    try {
      await onAddEmployee(employee, role);
      setEmployeeSearch("");
    } catch (error) {
      setAddError(error.message);
    } finally {
      setAddingEmployeeId(null);
    }
  };
     
  return (
    <section className="employee-page" aria-labelledby="role-title">
      {backButton}

      <header className="employees-header">
        <div>
          <h1 id="role-title">{role.name}</h1>
          <p>{role.description || "Geen omschrijving."}</p>
        </div>
      </header>

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
              <li key={skill.id} className="roles-chip">
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

            <section className="role-section" aria-labelledby="role-employees-title">
        <h2 id="role-employees-title">Medewerkers met deze rol ({roleEmployees.length})</h2>

        {removeError && <p className="form-error" role="alert">{removeError}</p>}

        {/* Een medewerker deze rol geven: zoeken en op "Toevoegen" klikken. */}
        <div className="role-add-employee">
          <input
            type="search"
            className="roles-search"
            value={employeeSearch}
            onChange={(event) => setEmployeeSearch(event.target.value)}
            placeholder="Medewerker toevoegen: zoek op naam of nummer..."
            aria-label="Zoek een medewerker om deze rol te geven"
          />

          {employeeSearchText !== "" && (
            <ul className="role-add-list">
              {employeeSuggestions.map((employee) => (
                <li key={employee.id}>
                  <span>
                    <strong>{employee.name}</strong>{" "}
                    <span className="roles-muted">
                      {employee.id} · {employee.country || "Onbekend"}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => addEmployee(employee)}
                    disabled={addingEmployeeId !== null}
                  >
                    {addingEmployeeId === employee.id ? "Bezig..." : "+ Toevoegen"}
                  </button>
                </li>
              ))}
              {employeeSuggestions.length === 0 && (
                <li className="roles-muted">Geen medewerker gevonden zonder deze rol.</li>
              )}
            </ul>
          )}

          {addError && <p className="form-error" role="alert">{addError}</p>}
        </div>

        {roleEmployees.length === 0 ? (
          <p className="roles-muted">Nog geen medewerkers met deze rol.</p>
        ) : (
          <>            {/* Zoeken en filteren naast elkaar. */}
            <div className="roles-tools">
              <input
                type="search"
                className="roles-search"
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
                placeholder="Zoek op naam of nummer..."
                aria-label="Zoek een medewerker met deze rol"
              />

              <select
                className="roles-sort"
                value={country}
                onChange={(event) => changeCountry(event.target.value)}
                aria-label="Filter op land"
              >
                <option value="">Alle landen ({roleEmployees.length})</option>
                {countries.map(([name, count]) => (
                  <option key={name} value={name}>
                    {name} ({count})
                  </option>
                ))}
              </select>

              <select
                className="roles-sort"
                value={location}
                onChange={(event) => changeLocation(event.target.value)}
                aria-label="Filter op vestiging"
              >
                <option value="">Alle vestigingen</option>
                {locations.map(([name, count]) => (
                  <option key={name} value={name}>
                    {name} ({count})
                  </option>
                ))}
              </select>
            </div>
            <div className="employees-table-container">
              <table className="employees-table role-employees-table">
                <thead>
                  <tr>
                    <th scope="col">Naam</th>
                    <th scope="col">Nummer</th>
                    <th scope="col">Land</th>
                    <th scope="col">Vestiging</th>
                    <th scope="col"><span className="roles-visually-hidden">Acties</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <Link className="roles-name" to={`/medewerkers/${employee.id}`}>
                          {employee.name}
                        </Link>
                      </td>
                      <td>{employee.id}</td>
                      <td><CountryLabel country={employee.country} /></td>
                      <td>{employee.location || "Niet ingevuld"}</td>
                      <td className="roles-actions">
                        <button
                          type="button"
                          className="role-remove-button"
                          onClick={() => setPendingRemoval({ type: "employee", item: employee })}
                        >
                          Rol weghalen
                        </button>
                      </td>
                    </tr>
                  ))}
                  {visibleEmployees.length === 0 && (
                    <tr>
                      <td colSpan="5" className="roles-muted">
                        Geen medewerkers gevonden met dit filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
                        <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            >
              {filteredEmployees.length === 0
                ? "Geen medewerkers"
                : `Medewerkers ${startIndex + 1}–${startIndex + visibleEmployees.length} van ${filteredEmployees.length}`}
            </Pagination>
          </>
        )}
         </section>

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