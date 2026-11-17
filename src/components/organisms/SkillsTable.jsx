import { useState } from "react";
import Button from "../atoms/Button";
import SkillCategoryFilter from "../molecules/SkillCategoryFilter";
import { sortSkills, updateSkillSort } from "../../utils/skillSorting";

export default function SkillsTable({
  skills,
  allSkills,
  employees,
  categories,
  categoryFilter,
  onCategoryChange,
  onEdit,
  emptyMessage = "Er zijn nog geen vaardigheden. Voeg je eerste skill toe.",
}) {
  const [sorts, setSorts] = useState([{ column: "name", direction: "ascending" }]);
  const employeeCounts = new Map(skills.map((skill) => [
    skill.id,
    employees.filter((employee) => employee.skills?.includes(skill.id)).length,
  ]));
  const sortedSkills = sortSkills(skills, employeeCounts, sorts);
  const nameSort = sorts.find((sort) => sort.column === "name");
  const employeeSort = sorts.find((sort) => sort.column === "employees");

  const handleSort = (column) => {
    setSorts((current) => updateSkillSort(current, column));
  };

  const sortArrow = (sort) => sort
    ? (sort.direction === "ascending" ? "↑" : "↓")
    : "↕";
  const sortDescription = sorts.map((sort, index) => {
    const direction = sort.column === "name"
      ? (sort.direction === "ascending" ? "A–Z" : "Z–A")
      : (sort.direction === "ascending" ? "laag naar hoog" : "hoog naar laag");
    return `${index === 0 ? "Eerst" : "daarna bij gelijke waarden"} op ${sort.column === "name" ? "vaardigheid" : "aantal medewerkers"} (${direction})`;
  }).join(", ");

  return (
    <>
      <div className="employees-table-container">
        <table className="employees-table skills-table">
          <caption className="skills-visually-hidden">
            Vaardigheden met categorie en het aantal gekoppelde medewerkers.
            Klik op Vaardigheid of Medewerkers om de richting te wisselen en die kolom voorrang te geven.
            De andere sortering blijft actief bij gelijke waarden.
          </caption>
          <thead>
            <tr>
              <th scope="col" aria-sort={sorts[0].column === "name" ? nameSort.direction : undefined}>
                <Button
                  className={`skills-sort-trigger${nameSort ? " is-active" : ""}`}
                  onClick={() => handleSort("name")}
                  aria-label={nameSort?.direction === "ascending"
                    ? "Sorteer eerst op vaardigheid, van Z tot A"
                    : "Sorteer eerst op vaardigheid, van A tot Z"}
                >
                  <span className="skills-sort-label">Vaardigheid</span>
                  <span className="skills-sort-arrow" aria-hidden="true">{sortArrow(nameSort)}</span>
                  {sorts.length > 1 && nameSort && (
                    <span className="skills-sort-priority" aria-hidden="true">
                      {sorts.indexOf(nameSort) + 1}
                    </span>
                  )}
                </Button>
              </th>
              <th scope="col" className="skills-category-column">
                <SkillCategoryFilter
                  skills={allSkills}
                  categories={categories}
                  value={categoryFilter}
                  onChange={onCategoryChange}
                />
              </th>
              <th
                scope="col"
                className="skills-number"
                aria-sort={sorts[0].column === "employees" ? employeeSort.direction : undefined}
              >
                <Button
                  className={`skills-sort-trigger${employeeSort ? " is-active" : ""}`}
                  onClick={() => handleSort("employees")}
                  aria-label={employeeSort?.direction === "ascending"
                    ? "Sorteer eerst op aantal medewerkers, hoog naar laag"
                    : "Sorteer eerst op aantal medewerkers, laag naar hoog"}
                >
                  <span className="skills-sort-label">Medewerkers</span>
                  <span className="skills-sort-arrow" aria-hidden="true">{sortArrow(employeeSort)}</span>
                  {sorts.length > 1 && employeeSort && (
                    <span className="skills-sort-priority" aria-hidden="true">
                      {sorts.indexOf(employeeSort) + 1}
                    </span>
                  )}
                </Button>
              </th>
              <th scope="col"><span className="skills-visually-hidden">Acties</span></th>
            </tr>
          </thead>
          <tbody>
            {sortedSkills.map((skill) => (
              <tr key={skill.id}>
                <th scope="row">{skill.name}</th>
                <td>
                  <span className={`skill-category${skill.category?.trim() ? "" : " skill-category-empty"}`}>
                    {skill.category?.trim() || "Zonder categorie"}
                  </span>
                </td>
                <td className="skills-number">
                  {employeeCounts.get(skill.id)}
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
                <td colSpan="4" className="skills-empty">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="skills-sort-summary" role="status">{sortDescription}.</p>
    </>
  );
}
