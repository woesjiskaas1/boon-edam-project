import DashboardWelcome from "../components/organisms/DashboardWelcome";
import DashboardStats from "../components/organisms/DashboardStats";
import DashboardEmployees from "../components/organisms/DashboardEmployees";
import DashboardQuickLinks from "../components/organisms/DashboardQuickLinks";
import "../styles/dashboard.css";

function Dashboard({ currentUser, employees }) {
  const firstName = currentUser?.name.trim().split(/\s+/)[0] || "welkom";
  const rolesCount = new Set(
    employees.flatMap((employee) => employee.roleIds || (employee.role ? [employee.role] : []))
  ).size;
  const countriesCount = new Set(employees.map((employee) => employee.country).filter(Boolean)).size;
  const featuredEmployees = employees.slice(0, 4);

  return (
    <section className="dashboard-page">
      <DashboardWelcome firstName={firstName} />
      <DashboardStats
        employeeCount={employees.length}
        roleCount={rolesCount}
        countryCount={countriesCount}
      />
      <div className="dashboard-content-grid">
        <DashboardEmployees employees={featuredEmployees} />
        <DashboardQuickLinks />
      </div>
    </section>
  );
}

export default Dashboard;
