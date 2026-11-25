import CertificateCard from "../molecules/CertificateCard";

export default function CertificatesGrid({ certificates, total, onShowDetails, onShowEmployees, onEdit }) {
  if (certificates.length === 0) {
    return (
      <p className="certificates-empty">
        {total > 0
          ? "Geen certificaten gevonden in deze categorie. Kies een andere categorie of wis het filter."
          : "Er zijn nog geen certificaten. Voeg je eerste certificaat toe."}
      </p>
    );
  }

  return (
    <ul className="certificate-grid" aria-label="Certificatenoverzicht">
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onShowDetails={onShowDetails}
          onShowEmployees={onShowEmployees}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
