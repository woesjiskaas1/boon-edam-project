import { useState } from "react";
import TopNavbar from "./components/organisms/TopNavbar";
import Sidebar from "./components/organisms/Sidebar";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeFunctions from "./pages/EmployeeFunctions";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings"

import Login from "./pages/Login";
import Register from "./pages/Register";

import AddEmployee from "./pages/AddEmployee";

import initialEmployees from "./data/employees";
import employeeRoles from "./data/employeeRoles";

import initialPortalUsers, { invitations as initialInvitations } from "./data/portalUsers";



import "./styles/layout.css";


function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(null);
  const [authPage, setAuthPage] = useState("login");
  const [portalUsers, setPortalUsers] = useState(initialPortalUsers);
  const [invitations, setInvitations] = useState(initialInvitations);  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
        return <Settings currentUser={currentUser} portalUsers={portalUsers} />;
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

  // Inloggen: de gebruiker wordt de ingelogde gebruiker.
  const handleLogin = (user) => {
    setCurrentUser(user);
    setActivePage("dashboard");
  };

  // Registreren: maak een account met de rol uit de uitnodiging.
  const handleRegister = (formData) => {
    const email = formData.email.trim().toLowerCase();
    const invitation = invitations.find(
      (item) => item.email.toLowerCase() === email
    );
    const highestId = Math.max(...portalUsers.map((user) => user.id));

    const newUser = {
      id: highestId + 1,
      name: formData.name.trim(),
      email: email,
      password: formData.password,
      accessRoleId: invitation.accessRoleId,
    };

    setPortalUsers((current) => [...current, newUser]);
    setInvitations((current) =>
      current.filter((item) => item.email.toLowerCase() !== email)
    );
    handleLogin(newUser);
  };

  // Uitloggen: niemand is meer ingelogd, terug naar het inlogscherm.
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthPage("login");
  };

  // Niet ingelogd? Dan alleen het inlog- of registratiescherm.
  if (!currentUser) {
    if (authPage === "register") {
      return (
        <Register
          portalUsers={portalUsers}
          invitations={invitations}
          onRegister={handleRegister}
          onShowLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <Login
        portalUsers={portalUsers}
        onLogin={handleLogin}
        onShowRegister={() => setAuthPage("register")}
      />
    );
  }


  return (
    <div className="app-layout">
      <TopNavbar
        currentUser={currentUser}
        onNavigate={setActivePage}
        onLogout={handleLogout}
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
