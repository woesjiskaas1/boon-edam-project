import { NavLink } from "react-router";

export default function NavItem({ item, isCollapsed }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
      title={isCollapsed ? item.label : undefined}
      aria-label={isCollapsed ? item.label : undefined}
    >
      <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
      {!isCollapsed && <span>{item.label}</span>}
    </NavLink>
  );
}
