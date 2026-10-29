import { useState } from "react";
import logo from "../../assets/boon-edam-logo.png";

function TopNavbar({ onNavigate, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="top-navbar">
      <div className="brand">
        <img
          className="brand-logo"
          src={logo}
          alt="Boon Edam"
        />
      </div>

      <div className="profile-menu">
        <button
          type="button"
          className="profile-button"
          aria-expanded={isMenuOpen}
          aria-label="Open profielmenu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="profile-avatar">G</span>
          <span className="profile-label">Gebruiker</span>
          <span aria-hidden="true">{isMenuOpen ? "▲" : "▼"}</span>
        </button>

        {isMenuOpen && (
          <div className="profile-dropdown">
            <button
              type="button"
              onClick={() => handleNavigate("profile")}
            >
              Mijn profiel
            </button>

            <button
              type="button"
              onClick={() => handleNavigate("settings")}
            >
              Instellingen
            </button>

            <div className="dropdown-divider" />

            <button
              type="button"
              className="logout-button"
              onClick={() => {
                setIsMenuOpen(false);
                onLogout();
              }}
            >
              Uitloggen
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default TopNavbar;