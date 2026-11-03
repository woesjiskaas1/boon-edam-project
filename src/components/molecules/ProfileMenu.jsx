import { useState } from "react";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";

export default function ProfileMenu({ currentUser, onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = (path) => {
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <div className="profile-menu">
      <Button
        className="profile-button"
        aria-expanded={isOpen}
        aria-label="Open profielmenu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <Avatar name={currentUser.name} />
        <span className="profile-label">{currentUser.name}</span>
        <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
      </Button>

      {isOpen && (
        <div className="profile-dropdown">
          <Button onClick={() => navigate("/profiel")}>Mijn profiel</Button>
          <Button onClick={() => navigate("/instellingen")}>Instellingen</Button>
          <div className="dropdown-divider" />
          <Button className="logout-button" onClick={() => { setIsOpen(false); onLogout(); }}>
            Uitloggen
          </Button>
        </div>
      )}
    </div>
  );
}
