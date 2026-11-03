import Button from "../atoms/Button";
import NavItem from "../molecules/NavItem";
import navigationItems from "../../data/navigationItems";

export default function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <Button className="sidebar-toggle" onClick={onToggle} aria-label={isCollapsed ? "Menu uitklappen" : "Menu inklappen"} aria-expanded={!isCollapsed}>
        {isCollapsed ? "☰" : "←"}
      </Button>
      <nav aria-label="Hoofdnavigatie">
        {navigationItems.map((item) => <NavItem key={item.path} item={item} isCollapsed={isCollapsed} />)}
      </nav>
    </aside>
  );
}
