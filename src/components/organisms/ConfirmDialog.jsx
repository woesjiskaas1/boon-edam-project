import { useEffect, useId, useRef, useState } from "react";
import Button from "../atoms/Button";
import "../../styles/confirm-dialog.css";

// Een venster om iets gevaarlijks te bevestigen, zoals iets verwijderen.
// De rode knop werkt pas als je het woord "confirmWord" zelf intypt.
// Zo kan het niet per ongeluk gebeuren met één klik.
function ConfirmDialog({
  title,
  children,
  confirmWord = "verwijderen",
  confirmLabel = "Ja, verwijderen",
  isBusy = false,
  onConfirm,
  onClose,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const inputId = useId();
  const [typedWord, setTypedWord] = useState("");

  // Het venster openen zodra het component op het scherm komt.
  // showModal() maakt de rest van de pagina onklikbaar.
  useEffect(() => {
    if (!dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, []);

  // Pas als het woord precies klopt (hoofdletters maken niet uit).
  const isConfirmed = typedWord.trim().toLowerCase() === confirmWord;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isConfirmed && !isBusy) {
      onConfirm();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      role="alertdialog"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <h2 id={titleId}>{title}</h2>
        <div className="confirm-dialog-text">{children}</div>

        <label className="confirm-dialog-label" htmlFor={inputId}>
          Typ <strong>{confirmWord}</strong> om te bevestigen
        </label>
        <input
          id={inputId}
          className="confirm-dialog-input"
          value={typedWord}
          onChange={(event) => setTypedWord(event.target.value)}
          autoComplete="off"
          autoFocus
        />

        <div className="confirm-dialog-actions">
          <Button variant="secondary" onClick={() => dialogRef.current.close()}>
            Annuleren
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="confirm-dialog-danger"
            disabled={!isConfirmed || isBusy}
          >
            {isBusy ? "Bezig..." : confirmLabel}
          </Button>
        </div>
      </form>
    </dialog>
  );
}

export default ConfirmDialog;
