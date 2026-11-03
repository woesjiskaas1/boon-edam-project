import Button from "../atoms/Button";
import AccessRoleCard from "../molecules/AccessRoleCard";

export default function PortalAccessSettings({ currentUser, portalUsers, accessRoles, permissions }) {
  // Zoekt een toegangsrol op aan de hand van het id.
  const getRole = (roleId) =>
    accessRoles.find((accessRole) => accessRole.id === roleId);

  // Geeft de naam van een rol, of "Onbekend" als het id niet bestaat.
  const getRoleName = (roleId) => {
    const role = getRole(roleId);

    if (!role) {
      return "Onbekend";
    }

    return role.name;
  };

  // Bepaalt of de ingelogde gebruiker de rol van iemand anders mag wijzigen.
  // Geeft de reden terug waarom het NIET mag, of null als het wel mag.
  const getChangeBlockReason = (currentUser, targetUser) => {
    // Regel 1: je kunt nooit je eigen rol wijzigen.
    if (currentUser.id === targetUser.id) {
      return;
    }

    const myRole = getRole(currentUser.accessRoleId);
    const theirRole = getRole(targetUser.accessRoleId);

    // Veiligheid: bestaat een van de rollen niet, dan mag het niet.
    if (!myRole || !theirRole) {
      return "Onbekende rol.";
    }

    // Regel 2: alleen wie instellingen mag beheren, mag rollen wijzigen.
    if (!myRole.rights.settings) {
      return "Je hebt geen rechten om toegang te beheren.";
    }

    // Regel 3: je mag alleen iemand met een lagere rol wijzigen.
    if (theirRole.rank >= myRole.rank) {
      return "Je kunt alleen rollen lager dan die van jou wijzigen.";
    }

    // Geen enkele regel houdt het tegen: wijzigen mag.
    return null;
  };

  return (
    <>
      <div className="content-card settings-section">
        <div className="settings-section-header">
          <div>
            <h2>Portaalgebruikers</h2>
            <p>Bepaal wie het portaal mag gebruiken en wat diegene mag doen.</p>

          </div>

          {/* Nog zonder functie: wordt later gekoppeld */}
          <Button type="button" variant="primary">
            + Gebruiker uitnodigen
          </Button>
        </div>

        <div className="employees-table-container">
          <table className="employees-table">
            <thead>
              <tr>
                <th>Naam</th>
                <th>E-mailadres</th>
                <th>Toegangsrol</th>
                <th>Acties</th>
              </tr>
            </thead>

            <tbody>
              {portalUsers.map((user) => {
                const blockReason = getChangeBlockReason(currentUser, user);
                const isCurrentUser = user.id === currentUser.id;

                return (
                  <tr key={user.id}>
                    <td>
                      {user.name}
                      {isCurrentUser && <span className="you-badge">jij</span>}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="employee-role">
                        {getRoleName(user.accessRoleId)}
                      </span>
                    </td>
                    <td>
                      {/* Nog zonder functie: wordt later gekoppeld */}
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={blockReason !== null}
                      >
                        Wijzigen
                      </Button>
                      {blockReason && (
                        <span className="action-note">{blockReason}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-card settings-section">
        <h2>Toegangsrollen</h2>
        <p>Dit mag elke rol in het portaal.</p>

        <div className="access-role-grid">
          {accessRoles.map((role) => (
            <AccessRoleCard key={role.id} role={role} permissions={permissions} />
          ))}
        </div>
      </div>
    </>
  );
}
