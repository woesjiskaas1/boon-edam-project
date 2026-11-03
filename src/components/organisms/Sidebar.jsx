import { NavLink } from "react-router";

// Elk menu-item hoort bij een URL ("path").
const navigationItems = [
  { path: "/", label: "Dashboard", icon: "⌂" },
  { path: "/medewerkers", label: "Medewerkers", icon: "♙" },
  { path: "/functies", label: "Functies", icon: "" },
  { path: "/skills", label: "Skills", icon: "" },
  { path: "/instellingen", label: "Instellingen", icon: "⚙" },
];

function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label={isCollapsed ? "Menu uitklappen" : "Menu inklappen"}
      >
        {isCollapsed ? "☰" : "←"}
      </button>

      <nav aria-label="Hoofdnavigatie">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            title={isCollapsed ? item.label : undefined}
          >
            <span className="sidebar-icon" aria-hidden="true">
              {item.icon}
            </span>

            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;