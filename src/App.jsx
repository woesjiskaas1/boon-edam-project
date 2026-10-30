import { useState } from "react";
import TopNavbar from "./components/organisms/TopNavbar";
import Sidebar from "./components/organisms/Sidebar";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeFunctions from "./pages/EmployeeFunctions";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";


import AddEmployee from "./pages/AddEmployee";

import initialEmployees from "./data/employees";
import employeeRoles from "./data/employeeRoles";



import "./styles/layout.css";


function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);


  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "profile":
        return <Profile />;
      case "employee-functions":
        return <EmployeeFunctions />;
      case "settings":
        return <Settings />;
      case "employees":
        return (
          <Employees
            employees={employees}
            onAddEmployee={() => setActivePage("add-employee")}
          />
        );
      case "add-employee":
        return (
          <AddEmployee
            onSave={handleAddEmployee}
            onCancel={() => setActivePage("employees")}
          />
        );
      default:
        return <Dashboard />;
    }


  };

  // Maakt van de formuliergegevens een nieuwe medewerker
  // en zet die achteraan in de lijst.
  const handleAddEmployee = (formData) => {
    const selectedRole = employeeRoles.find((role) => role.id === formData.roleId);
    const nextNumber = employees.length + 1;

    const newEmployee = {
      id: `EMP${String(nextNumber).padStart(3, "0")}`,
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      birthDate: formData.birthDate,
      country: formData.country,
      address: formData.address.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: selectedRole.name,
      skills: formData.skillIds,
    };

    setEmployees((current) => [...current, newEmployee]);
    setActivePage("employees");
  };

  if (isLoggedOut) {
    return (
      <main className="logged-out-screen">
        <h1>Je bent uitgelogd</h1>
        <p>Dit is een demonstratie van de uitlogfunctie.</p>
        <button
          type="button"
          onClick={() => setIsLoggedOut(false)}
        >
          Terug naar het portaal
        </button>
      </main>
    );
  }

  return (
    <div className="app-layout">
      <TopNavbar
        onNavigate={setActivePage}
        onLogout={() => setIsLoggedOut(true)}
      />

      <div className="app-body">
        <Sidebar
          activePage={
            activePage === "add-employee" ? "employees" : activePage
          }
          onNavigate={setActivePage}
          isCollapsed={isSidebarCollapsed}
          onToggle={() =>
            setIsSidebarCollapsed((collapsed) => !collapsed)
          }
        />

        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
