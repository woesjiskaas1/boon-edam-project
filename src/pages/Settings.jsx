import accessRoles, { permissions } from "../data/accessRoles";
import PortalAccessSettings from "../components/organisms/PortalAccessSettings";
import "../styles/settings.css";

export default function Settings({ currentUser, portalUsers }) {
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
      <PortalAccessSettings
        currentUser={currentUser}
        portalUsers={portalUsers}
        accessRoles={accessRoles}
        permissions={permissions}
      />
    </section>
  );
}
