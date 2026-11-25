import { useState } from "react";
import { Link } from "react-router";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import CountryLabel from "../molecules/CountryLabel";
import Pagination from "../molecules/Pagination";

const EMPLOYEES_PER_PAGE = 20;

export default function RoleEmployees({ employees, countries }) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const countByLocation = new Map();
  for (const employee of employees) {
    if (country && (employee.country || "Onbekend") !== country) continue;
    const name = employee.location || "Onbekend";
    countByLocation.set(name, (countByLocation.get(name) ?? 0) + 1);
  }
  const locations = [...countByLocation].sort((a, b) => b[1] - a[1]);

  const searchText = search.trim().toLowerCase();
  const filteredEmployees = employees.filter((employee) => {
    const matchesCountry = !country || (employee.country || "Onbekend") === country;
    const matchesLocation = !location || (employee.location || "Onbekend") === location;
    const matchesSearch = employee.name.toLowerCase().includes(searchText)
      || employee.id.toLowerCase().includes(searchText);
    return matchesCountry && matchesLocation && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * EMPLOYEES_PER_PAGE;
  const visibleEmployees = filteredEmployees.slice(startIndex, startIndex + EMPLOYEES_PER_PAGE);

  return (
    <section className="role-section" aria-labelledby="role-employees-title">
      <h2 id="role-employees-title">Medewerkers met deze rol ({employees.length})</h2>
      {employees.length === 0 ? (
        <p className="roles-muted">Nog geen medewerkers met deze rol.</p>
      ) : (
        <>
          <div className="roles-tools">
            <Input
              type="search"
              className="roles-search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Zoek op naam of nummer..."
              aria-label="Zoek een medewerker met deze rol"
            />
            <Select
              className="roles-sort"
              value={country}
              onChange={(event) => {
                setCountry(event.target.value);
                setLocation("");
                setCurrentPage(1);
              }}
              aria-label="Filter op land"
            >
              <option value="">Alle landen ({employees.length})</option>
              {countries.map(([name, count]) => (
                <option key={name} value={name}>{name} ({count})</option>
              ))}
            </Select>
            <Select
              className="roles-sort"
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter op vestiging"
            >
              <option value="">Alle vestigingen</option>
              {locations.map(([name, count]) => (
                <option key={name} value={name}>{name} ({count})</option>
              ))}
            </Select>
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

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage}>
            {filteredEmployees.length === 0
              ? "Geen medewerkers"
              : `Medewerkers ${startIndex + 1}–${startIndex + visibleEmployees.length} van ${filteredEmployees.length}`}
          </Pagination>
        </>
      )}
    </section>
  );
}
