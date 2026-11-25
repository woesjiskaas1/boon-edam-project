import Button from "../atoms/Button";
import NavItem from "../molecules/NavItem";
import navigationItems from "../../data/navigationItems";

function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <Button
        className="sidebar-toggle"
        onClick={onToggle}
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "Menu uitklappen" : "Menu inklappen"}
      >
        {isCollapsed ? "☰" : "←"}
      </Button>

      <nav aria-label="Hoofdnavigatie">
        {navigationItems.map((item) => (
          <NavItem key={item.path} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
