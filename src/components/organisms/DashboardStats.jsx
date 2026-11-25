export default function DashboardStats({ employeeCount, roleCount, countryCount }) {
  const stats = [
    { icon: "♙", label: "Medewerkers", value: employeeCount },
    { icon: "▤", label: "Rollen", value: roleCount },
    { icon: "◎", label: "Landen", value: countryCount },
  ];

  return (
    <div className="dashboard-stats" aria-label="Teamstatistieken">
      {stats.map(({ icon, label, value }) => (
        <article className="dashboard-stat" key={label}>
          <span className="dashboard-stat-icon" aria-hidden="true">{icon}</span>
          <div>
            <p className="dashboard-stat-label">{label}</p>
            <p className="dashboard-stat-value">{value}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
