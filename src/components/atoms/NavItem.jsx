
export default function NavItem({
  item,
  isActive,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`nav-item ${isActive ? "active" : ""}`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="nav-item-icon" aria-hidden="true">
        {item.icon === "users" ? "👥" : "⚙️"}
      </span>

      <span className="nav-item-label">
        {item.label}
      </span>
    </button>
  );
}
