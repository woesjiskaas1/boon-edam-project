const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: "⌂" },
  { id: "employees", label: "Medewerkers", icon: "♙" },
  { id: "employee-functions", label: "Functies", icon: "" },
  { id: "skills", label: "Skills", icon: "" },
    { id: "settings", label: "Instellingen", icon: "⚙" },
];

function Sidebar({ activePage, onNavigate, isCollapsed, onToggle }) {
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
          <button
            key={item.id}
            type="button"
            className={`sidebar-link ${
              activePage === item.id ? "active" : ""
            }`}
            onClick={() => onNavigate(item.id)}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="sidebar-icon" aria-hidden="true">
              {item.icon}
            </span>

            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;