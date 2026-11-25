import { Link } from "react-router";
import heroImage from "../../assets/hero.png";

export default function DashboardWelcome({ firstName }) {
  return (
    <div className="dashboard-hero">
      <div className="dashboard-hero-copy">
        <p className="dashboard-eyebrow">BOON EDAM · MEDEWERKERSPORTAAL</p>
        <h1>Welkom, {firstName}</h1>
        <p className="dashboard-description">
          Een helder overzicht van je team en de informatie die je dagelijks nodig hebt.
        </p>
        <div className="dashboard-actions">
          <Link className="dashboard-action dashboard-action-primary" to="/medewerkers">
            Bekijk medewerkers
          </Link>
          <Link className="dashboard-action dashboard-action-secondary" to="/medewerkers/toevoegen">
            + Medewerker toevoegen
          </Link>
        </div>
      </div>
      <img className="dashboard-hero-image" src={heroImage} alt="" />
    </div>
  );
}
