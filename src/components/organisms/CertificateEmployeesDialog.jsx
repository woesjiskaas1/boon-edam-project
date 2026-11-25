import { useEffect, useId, useRef } from "react";
import Button from "../atoms/Button";
import { getCertificateEmployees } from "../../utils/certificateEmployees";

export default function CertificateEmployeesDialog({ certificate, employees, isExample, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const holders = getCertificateEmployees(certificate, employees, isExample);

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="skills-dialog certificate-employees-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onClose}
    >
      <header className="certificate-employees-header">
        <h2 id={titleId}>Medewerkers met {certificate.name}</h2>
        <Button
          className="certificate-employees-close"
          aria-label="Pop-up sluiten"
          onClick={() => dialogRef.current.close()}
        >
          <span aria-hidden="true">×</span>
        </Button>
      </header>
      <p id={descriptionId} className="certificate-employees-description">
        {holders.length === 0
          ? "Er zijn nog geen medewerkers met dit certificaat."
          : `${holders.length} ${holders.length === 1 ? "medewerker heeft" : "medewerkers hebben"} dit certificaat.`}
        {isExample && " Dit zijn fictieve demomedewerkers."}
      </p>

      {holders.length > 0 && (
        <ul className="certificate-employees-list" aria-label="Medewerkers met dit certificaat">
          {holders.map(({ id, employee }) => (
            <li key={id}>
              <div className="certificate-employees-details">
                <strong>{employee?.name || `Medewerker ${id}`}</strong>
                <span>{employee ? employee.role || "Geen rol vastgelegd" : "Medewerkergegevens niet beschikbaar"}</span>
              </div>
              <span className="certificate-employees-number">{employee?.id || id}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="skills-dialog-actions">
        <Button variant="secondary" onClick={() => dialogRef.current.close()}>Sluiten</Button>
      </div>
    </dialog>
  );
}
