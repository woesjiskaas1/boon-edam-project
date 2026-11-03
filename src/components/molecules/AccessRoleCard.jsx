export default function AccessRoleCard({ role, permissions }) {
  return (
    <article className="access-role-card">
      <h3>{role.name}</h3>
      <p className="access-role-description">{role.description}</p>

      <ul className="permission-list">
        {permissions.map((permission) => (
          <li
            key={permission.key}
            className={role.rights[permission.key] ? "allowed" : "denied"}
          >
            <span aria-hidden="true">
              {role.rights[permission.key] ? "✓" : "✕"}
            </span>
            {permission.label}
          </li>
        ))}
      </ul>
    </article>
  );
}
