import { useEffect, useId, useRef } from "react";
import Button from "../atoms/Button";

export default function SkillDeleteDialog({ skill, onConfirm, onClose, title = "Skill verwijderen?", description }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal();
  }, []);

  const handleConfirm = () => {
    onConfirm(skill);
    dialogRef.current.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="skills-dialog skills-delete-dialog"
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onClose}
    >
      <h2 id={titleId}>{title}</h2>
      <p id={descriptionId} className="skills-dialog-description">
        {description || <>Weet je zeker dat je de skill “{skill.name}” wilt verwijderen?
          {" "}De skill wordt ook verwijderd bij gekoppelde medewerkers.</>}
      </p>
      <div className="skills-dialog-actions">
        <Button variant="secondary" onClick={() => dialogRef.current.close()}>
          Annuleren
        </Button>
        <Button variant="primary" className="skills-confirm-delete" onClick={handleConfirm}>
          Ja, verwijderen
        </Button>
      </div>
    </dialog>
  );
}
