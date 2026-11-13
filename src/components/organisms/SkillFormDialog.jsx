import { useEffect, useId, useRef, useState } from "react";
import Button from "../atoms/Button";
import EscoAutocomplete from "../molecules/EscoAutocomplete";

export default function SkillFormDialog({
  skill,
  skills,
  categories,
  defaultCategory = "",
  onSave,
  onDelete,
  onClose,
}) {
  const dialogRef = useRef(null);
  const nameRef = useRef(null);
  const titleId = useId();
  const [name, setName] = useState(skill?.name || "");
  const [escoSkill, setEscoSkill] = useState(skill?.escoUri ? { name: skill.name, uri: skill.escoUri } : null);
  const [category, setCategory] = useState(skill ? (skill.category || "") : defaultCategory);
  const [escoCategory, setEscoCategory] = useState(skill?.escoCategoryUri
    ? { name: skill.category, uri: skill.escoCategoryUri, code: skill.escoCategoryCode }
    : null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const duplicate = skills.some((item) =>
      item.id !== skill?.id &&
      (item.name.trim().toLocaleLowerCase("nl") === trimmedName.toLocaleLowerCase("nl") ||
        (escoSkill && item.escoUri === escoSkill.uri))
    );

    if (!trimmedName || duplicate) {
      setError(!trimmedName ? "Vul een naam in." : "Deze vaardigheid bestaat al.");
      nameRef.current.focus();
      return;
    }

    const trimmedCategory = category.trim();
    const existingCategory = categories.find((item) =>
      item.toLocaleLowerCase("nl") === trimmedCategory.toLocaleLowerCase("nl")
    );

    onSave({
      ...skill, id: skill?.id, name: trimmedName,
      category: escoCategory ? escoCategory.name : existingCategory || trimmedCategory,
      escoUri: escoSkill?.uri || null,
      escoCategoryUri: escoCategory?.uri || null,
      escoCategoryCode: escoCategory?.code || null,
    });
    dialogRef.current.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="skills-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <h2 id={titleId}>{skill ? "Skill bewerken" : "Skill toevoegen"}</h2>
      <form className="skills-form" onSubmit={handleSubmit} noValidate>
        <EscoAutocomplete
          ref={nameRef}
          value={name}
          selectedItem={escoSkill}
          onChange={(value) => {
            setName(value);
            setEscoSkill(null);
            setError("");
          }}
          onSelect={(selected) => {
            setName(selected.name);
            setEscoSkill(selected);
            setError("");
          }}
          error={error}
        />
        <EscoAutocomplete
          kind="category"
          value={category}
          selectedItem={escoCategory}
          existingOptions={categories}
          onChange={(value) => {
            setCategory(value);
            setEscoCategory(null);
          }}
          onSelect={(selected) => {
            setCategory(selected.name);
            setEscoCategory(selected.uri ? selected : null);
          }}
        />
        <div className="skills-dialog-footer">
          {skill && (
            <Button
              className="skill-delete-button"
              onClick={() => onDelete(skill)}
              aria-label={`${skill.name} verwijderen`}
            >
              Verwijderen
            </Button>
          )}
          <div className="skills-dialog-actions">
            <Button variant="secondary" onClick={() => dialogRef.current.close()}>
              Annuleren
            </Button>
            <Button type="submit" variant="primary">Opslaan</Button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
