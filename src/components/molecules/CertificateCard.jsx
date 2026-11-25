import Button from "../atoms/Button";

const categoryIcons = new Map([
  ["veiligheid", { tone: "safety", symbol: "✓" }],
  ["techniek", { tone: "tech", symbol: "⚙" }],
  ["organisatie", { tone: "organization", symbol: "▤" }],
]);

const defaultIcon = { tone: "neutral", symbol: "◇" };

export default function CertificateCard({ certificate, onShowDetails, onShowEmployees, onEdit }) {
  const category = certificate.category?.trim() || "";
  const icon = categoryIcons.get(category.toLocaleLowerCase("nl")) ?? defaultIcon;
  const employeeCount = certificate.employeeIds.length;

  return (
    <li className="certificate-card">
      <span className="certificate-card-icon" data-tone={icon.tone} aria-hidden="true">{icon.symbol}</span>
      <div className="certificate-card-heading">
        <p className="certificate-card-category">{category || "Zonder categorie"}</p>
        <h2>
          <Button
            className="certificate-card-title"
            aria-label={`Details van ${certificate.name}`}
            aria-haspopup="dialog"
            onClick={() => onShowDetails(certificate)}
          >
            {certificate.name}
            <span className="certificate-card-info" aria-hidden="true">ⓘ</span>
          </Button>
        </h2>
      </div>
      <div className="certificate-card-footer">
        <Button
          className="certificate-card-count certificate-card-employees"
          aria-label={`Bekijk medewerkers met ${certificate.name} (${employeeCount})`}
          aria-haspopup="dialog"
          onClick={() => onShowEmployees(certificate)}
        >
          {employeeCount} {employeeCount === 1 ? "medewerker" : "medewerkers"}
        </Button>
        <Button
          className="certificate-card-edit"
          aria-label={`Bewerken: ${certificate.name}`}
          onClick={() => onEdit(certificate)}
        >
          Bewerken
        </Button>
      </div>
    </li>
  );
}
