import { useState } from "react";
import Button from "../components/atoms/Button";
import RolesTable from "../components/organisms/RolesTable";
import "../styles/roles.css";

// Overzicht van alle rollen, als tabel. Bewerken gebeurt op de detailpagina.
function Roles({ jobRoles, skills, employees, onAddRole }) {
  // Wat er in het zoekveld staat, en hoe we sorteren.
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Per rol uitrekenen: hoeveel medewerkers deze rol hebben.
  const rolesWithStats = jobRoles.map((role) => {
    const roleEmployees = employees.filter((employee) =>
      employee.roleIds?.includes(role.id)
    );

    return {
      ...role,
      employeeCount: roleEmployees.length,
    };
  });

  // Zoeken: op naam en omschrijving, hoofdletters maken niet uit.
  const searchText = search.trim().toLowerCase();
  const filteredRoles = rolesWithStats.filter(
    (role) =>
      role.name.toLowerCase().includes(searchText) ||
      role.description.toLowerCase().includes(searchText)
  );

  // Sorteren: op naam (A–Z) of op aantal medewerkers (meeste eerst).
  // [...filteredRoles] maakt eerst een kopie: sort() verandert de lijst zelf.
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    if (sortBy === "employees") {
      return b.employeeCount - a.employeeCount;
    }
    return a.name.localeCompare(b.name, "nl");
  });

  return (
    <section className="roles-page">
      <div className="employees-header">
        <div>
          <h1>Rollen</h1>
          <p>Alle rollen binnen Boon Edam. Klik op een rol voor de details.</p>
        </div>

        <Button variant="primary" onClick={onAddRole}>
          Rol toevoegen
        </Button>
      </div>

      <div className="roles-tools">
        <input
          type="search"
          className="roles-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Zoek een rol..."
          aria-label="Zoek een rol"
        />
        <select
          className="roles-sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          aria-label="Sorteren"
        >
          <option value="name">Sorteren: naam (A–Z)</option>
          <option value="employees">Sorteren: meeste medewerkers</option>
        </select>
      </div>

      <RolesTable
        roles={sortedRoles}
        skills={skills}
        emptyText={
          jobRoles.length === 0
            ? "Er zijn nog geen rollen."
            : "Geen rollen gevonden. Probeer een ander woord."
        }
      />

      <p className="roles-footer">
        {sortedRoles.length === jobRoles.length
          ? `${jobRoles.length} ${jobRoles.length === 1 ? "rol" : "rollen"}`
          : `${sortedRoles.length} van ${jobRoles.length} rollen`}
      </p>
    </section>
  );
}

export default Roles;