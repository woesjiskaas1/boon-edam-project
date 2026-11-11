import { useState } from "react";
import Button from "../components/atoms/Button";
import SkillsTable from "../components/organisms/SkillsTable";
import SkillFormDialog from "../components/organisms/SkillFormDialog";
import SkillDeleteDialog from "../components/organisms/SkillDeleteDialog";
import "../styles/skills.css";

function Skills({ skills, employees, onSaveSkill, onDeleteSkill }) {
  const [editor, setEditor] = useState(null);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [status, setStatus] = useState("");

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
        skills={skills}
        employees={employees}
        onEdit={openEditor}
      />

      <div className="skills-footer">
        <span>
          {skills.length} {skills.length === 1 ? "vaardigheid" : "vaardigheden"}
        </span>
        <span>Centraal overzicht van alle vaardigheden</span>
      </div>
      <p className="skills-status" role="status">{status}</p>

      {editor && (
        <SkillFormDialog
          skill={editor.skill}
          skills={skills}
          onSave={handleSave}
          onDelete={(skill) => {
            setStatus("");
            setSkillToDelete(skill);
          }}
          onClose={() => setEditor(null)}
        />
      )}

      {skillToDelete && (
        <SkillDeleteDialog
          skill={skillToDelete}
          onConfirm={handleDelete}
          onClose={() => setSkillToDelete(null)}
        />
      )}
    </section>
  );
}

export default Skills;
