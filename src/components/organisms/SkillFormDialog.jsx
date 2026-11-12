import { useEffect, useId, useRef, useState } from "react";
import Button from "../atoms/Button";
import FormField from "../molecules/FormField";

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
  const categoryListId = useId();
  const categoryHintId = useId();
  const [name, setName] = useState(skill?.name || "");
  const [category, setCategory] = useState(skill ? (skill.category || "") : defaultCategory);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const duplicate = skills.some((item) =>
      item.id !== skill?.id &&
      item.name.toLocaleLowerCase("nl") === trimmedName.toLocaleLowerCase("nl")
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

    onSave({ id: skill?.id, name: trimmedName, category: existingCategory || trimmedCategory });
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
        <FormField
          ref={nameRef}
          label="Naam van de vaardigheid"
          name="skillName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Bijvoorbeeld: preventief onderhoud"
          maxLength={60}
          required
          error={error}
        />
        <div className="skills-category-field">
          <FormField
            label="Categorie"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            list={categoryListId}
            autoComplete="off"
            placeholder="Bijvoorbeeld: Communicatie"
            maxLength={60}
            aria-describedby={categoryHintId}
          />
          <datalist id={categoryListId}>
            {categories.map((item) => <option key={item} value={item} />)}
          </datalist>
          <p id={categoryHintId} className="skills-category-hint">
            Kies een bestaande categorie of typ een nieuwe. Laat leeg voor Zonder categorie.
          </p>
        </div>
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
