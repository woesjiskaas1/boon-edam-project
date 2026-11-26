import PortalAccessSettings from "../components/organisms/PortalAccessSettings";
import accessRoles, { permissions } from "../data/accessRoles";
import "../styles/settings.css";

export default function Settings({ currentUser, portalUsers, onOpenLocations }) {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">CONFIGURATIE</p>
          <h1>Instellingen</h1>
          <p className="page-description">
            Beheer de instellingen van het portaal.
          </p>
        </div>
      </div>

      <div className="content-card settings-section">
        <div className="settings-section-header">
          <div>
            <h2>Landen en vestigingen</h2>
            <p>Beheer de landen en vestigingen die je kunt kiezen bij een medewerker.</p>
          </div>
          <button type="button" className="secondary-button" onClick={onOpenLocations}>
            Beheren →
          </button>
        </div>
      </div>

      <PortalAccessSettings
        currentUser={currentUser}
        portalUsers={portalUsers}
        accessRoles={accessRoles}
        permissions={permissions}
      />
    </section>
  );
}
