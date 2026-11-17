import { useState } from "react";
import { Link, useParams } from "react-router";
import CountryLabel from "../components/molecules/CountryLabel";
import Pagination from "../components/molecules/Pagination";
import "../styles/employee.css";
import "../styles/roles.css";

// Hoeveel medewerkers we per pagina laten zien.
const EMPLOYEES_PER_PAGE = 20;

// Detailpagina van één rol.
function Role({ jobRoles, skills, employees, onBack }) {
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
              <li key={skill.id} className="roles-chip">{skill.name}</li>
            ))}
          </ul>
        )}
      </section>

            <section className="role-section" aria-labelledby="role-employees-title">
        <h2 id="role-employees-title">Medewerkers met deze rol ({roleEmployees.length})</h2>
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
                    </tr>
                  ))}
                  {visibleEmployees.length === 0 && (
                    <tr>
                      <td colSpan="4" className="roles-muted">
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
    </section>
    
  );
}

export default Role;