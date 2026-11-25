import { Link } from "react-router";

const quickLinks = [
  { to: "/rollen", label: "Rollen beheren" },
  { to: "/skills", label: "Skills bekijken" },
  { to: "/certificaten", label: "Certificaten bekijken" },
  { to: "/instellingen", label: "Instellingen openen" },
];

export default function DashboardQuickLinks() {
  return (
    <aside className="dashboard-panel dashboard-quick-panel">
      <p className="dashboard-eyebrow">SNEL NAAR</p>
      <h2>Beheer je portaal</h2>
      <p className="dashboard-quick-description">
        Bekijk rollen, vaardigheden en certificaten of pas de portaalinstellingen aan.
      </p>
      {quickLinks.map(({ to, label }) => (
        <Link className="dashboard-quick-link" to={to} key={to}>
          <span>{label}</span><span aria-hidden="true">→</span>
        </Link>
      ))}
    </aside>
  );
}
