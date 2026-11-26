import { useEffect, useId, useRef } from "react";
import Button from "../atoms/Button";
import { getCertificateDetails } from "../../utils/certificateDetails";

export default function CertificateDetailsDialog({ certificate, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const topicsId = useId();
  const sourcesId = useId();
  const details = getCertificateDetails(certificate);
  const information = [
    { label: "Doelgroep", value: details.audience },
    { label: "Bewijs en erkenning", value: details.recognition },
    { label: "Geldigheid", value: details.validity },
  ].filter(({ value }) => value);

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="skills-dialog certificate-details-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onClose}
    >
      <header className="certificate-details-header">
        <h2 id={titleId}>{certificate.name}</h2>
        <Button
          className="certificate-details-close"
          aria-label="Details sluiten"
          onClick={() => dialogRef.current.close()}
        >
          <span aria-hidden="true">×</span>
        </Button>
      </header>

      <p id={descriptionId} className="certificate-details-summary">{details.summary}</p>

      {information.length > 0 && (
        <dl className="certificate-details-info">
          {information.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {details.topics.length > 0 && (
        <section className="certificate-details-section certificate-details-topics" aria-labelledby={topicsId}>
          <h3 id={topicsId}>Inhoud</h3>
          <ul>
            {details.topics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
        </section>
      )}

      {details.sources.length > 0 && (
        <section className="certificate-details-section certificate-details-sources" aria-labelledby={sourcesId}>
          <h3 id={sourcesId}>Bronnen</h3>
          <ul>
            {details.sources.map(({ label, url }) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">{label}</a>
              </li>
            ))}
          </ul>
          {details.reviewedAt && (
            <p className="certificate-details-reviewed">
              Informatie gecontroleerd op {new Intl.DateTimeFormat("nl-NL", {
                dateStyle: "long",
                timeZone: "UTC",
              }).format(new Date(details.reviewedAt))}.
            </p>
          )}
        </section>
      )}

      <div className="skills-dialog-actions">
        <Button variant="secondary" onClick={() => dialogRef.current.close()}>Sluiten</Button>
      </div>
    </dialog>
  );
}
