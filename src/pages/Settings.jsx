import { useState } from "react";
import accessRoles, { permissions } from "../data/accessRoles";
import Button from "../components/atoms/Button";
import PortalAccessSettings from "../components/organisms/PortalAccessSettings";
import "../styles/settings.css";

// De tabbladen van het menu bovenaan de pagina.
const tabs = [
  { id: "general", label: "Algemeen" },
  { id: "access", label: "Toegang" },
];

function Settings({ currentUser, portalUsers }) {
  const [activeTab, setActiveTab] = useState("general");

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

      <div className="settings-tabs" role="tablist">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="content-card">
          <h2>Algemene instellingen</h2>
          <p>Hier komen straks de algemene instellingen.</p>
        </div>
      )}

      {activeTab === "access" && (
        <PortalAccessSettings
          currentUser={currentUser}
          portalUsers={portalUsers}
          accessRoles={accessRoles}
          permissions={permissions}
        />
      )}
    </section>
  );
}

export default Settings;
