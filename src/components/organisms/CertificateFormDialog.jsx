import { useEffect, useId, useRef, useState } from "react";
import Button from "../atoms/Button";
import FormField from "../molecules/FormField";

export default function CertificateFormDialog({
  certificate,
  certificates,
  categories,
  defaultCategory = "",
  onSave,
  onDelete,
  onClose,
}) {
  const dialogRef = useRef(null);
  const nameRef = useRef(null);
  const titleId = useId();
  const categoriesId = useId();
  const [name, setName] = useState(certificate?.name || "");
  const [category, setCategory] = useState(certificate ? certificate.category || "" : defaultCategory);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const duplicate = certificates.some((item) =>
      item.id !== certificate?.id &&
      item.name.trim().toLocaleLowerCase("nl") === trimmedName.toLocaleLowerCase("nl")
    );

    if (!trimmedName || duplicate) {
      setError(!trimmedName ? "Vul een naam in." : "Dit certificaat bestaat al.");
      nameRef.current.focus();
      return;
    }

    const trimmedCategory = category.trim();
    const existingCategory = categories.find((item) =>
      item.toLocaleLowerCase("nl") === trimmedCategory.toLocaleLowerCase("nl")
    );

    onSave({
      ...certificate,
      id: certificate?.id,
      name: trimmedName,
      category: existingCategory || trimmedCategory,
      employeeIds: certificate?.employeeIds || [],
    });
    dialogRef.current.close();
  };

  return (
    <dialog ref={dialogRef} className="skills-dialog" aria-labelledby={titleId} onClose={onClose}>
      <h2 id={titleId}>{certificate ? "Certificaat bewerken" : "Certificaat toevoegen"}</h2>
      <form className="skills-form" onSubmit={handleSubmit} noValidate>
        <FormField
          ref={nameRef}
          label="Naam certificaat"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
          required
          error={error}
        />
        <FormField
          label="Categorie (optioneel)"
          list={categoriesId}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
        <datalist id={categoriesId}>
          {categories.map((item) => <option key={item} value={item} />)}
        </datalist>
        <div className="skills-dialog-footer">
          {certificate && (
            <Button className="skill-delete-button" onClick={() => onDelete(certificate)} aria-label={`${certificate.name} verwijderen`}>
              Verwijderen
            </Button>
          )}
          <div className="skills-dialog-actions">
            <Button variant="secondary" onClick={() => dialogRef.current.close()}>Annuleren</Button>
            <Button type="submit" variant="primary">Opslaan</Button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
