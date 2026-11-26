import { useState } from "react";
import Button from "../components/atoms/Button";
import SkillsTable from "../components/organisms/SkillsTable";
import SkillFormDialog from "../components/organisms/SkillFormDialog";
import ConfirmDeleteDialog from "../components/molecules/ConfirmDeleteDialog";
import suggestedCategories from "../data/skillCategories";
import "../styles/skills.css";

function Skills({ skills, employees, onSaveSkill, onDeleteSkill }) {
  const [editor, setEditor] = useState(null);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [status, setStatus] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const selectedCategory = categoryFilter.startsWith("category:")
    ? categoryFilter.slice("category:".length)
    : "";
  const categories = [...new Set([
    ...suggestedCategories,
    ...skills.map((skill) => skill.category?.trim()).filter(Boolean),
    ...(selectedCategory ? [selectedCategory] : []),
  ])].sort((first, second) => first.localeCompare(second, "nl"));
  const visibleSkills = skills.filter((skill) => {
    if (!categoryFilter) return true;

    const category = skill.category?.trim() || "";
    return categoryFilter === "uncategorized"
      ? category === ""
      : category === selectedCategory;
  });

  const openEditor = (skill = null) => {
    setStatus("");
    setEditor({ skill });
  };

  const handleSave = (skill) => {
    onSaveSkill(skill);
    setStatus(`${skill.name} is ${skill.id ? "bijgewerkt" : "toegevoegd"}.`);
  };

  const handleDelete = (skill) => {
    onDeleteSkill(skill.id);
    setEditor(null);
    setStatus(`${skill.name} is verwijderd.`);
  };

  return (
    <section className="skills-page" aria-labelledby="skills-page-title">
      <header className="employees-header skills-header">
        <div>
          <h1 id="skills-page-title">Skills</h1>
          <p>Beheer de vaardigheden binnen je organisatie.</p>
        </div>
        <Button variant="primary" onClick={() => openEditor()}>
          <span aria-hidden="true">+</span> Skill toevoegen
        </Button>
      </header>

      <SkillsTable
        skills={visibleSkills}
        allSkills={skills}
        employees={employees}
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onEdit={openEditor}
        emptyMessage={skills.length > 0
          ? "Geen vaardigheden gevonden in deze categorie. Kies een andere categorie of wis het filter."
          : undefined}
      />

      <div className="skills-footer">
        <span role="status" aria-atomic="true">
          {categoryFilter ? `${visibleSkills.length} van ` : ""}
          {skills.length} {skills.length === 1 ? "vaardigheid" : "vaardigheden"}
          {categoryFilter ? ` · ${selectedCategory || "Zonder categorie"}` : ""}
        </span>
        <span>Centraal overzicht van alle vaardigheden</span>
      </div>
      <p className="skills-status" role="status">{status}</p>

      {editor && (
        <SkillFormDialog
          skill={editor.skill}
          skills={skills}
          categories={categories}
          defaultCategory={selectedCategory}
          onSave={handleSave}
          onDelete={(skill) => {
            setStatus("");
            setSkillToDelete(skill);
          }}
          onClose={() => setEditor(null)}
        />
      )}

      {skillToDelete && (
        <ConfirmDeleteDialog
          title="Skill verwijderen?"
          description={`Weet je zeker dat je de skill “${skillToDelete.name}” wilt verwijderen? De skill wordt ook verwijderd bij gekoppelde medewerkers.`}
          onConfirm={() => handleDelete(skillToDelete)}
          onClose={() => setSkillToDelete(null)}
        />
      )}
    </section>
  );
}

export default Skills;
