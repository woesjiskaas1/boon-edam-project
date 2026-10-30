import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import TopNavbar from "./components/organisms/TopNavbar";
import Sidebar from "./components/organisms/Sidebar";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeFunctions from "./pages/EmployeeFunctions";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Skills from "./pages/Skills";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AddEmployee from "./pages/AddEmployee";

import initialEmployees from "./data/employees";
import employeeRoles from "./data/employeeRoles";

import initialPortalUsers, { invitations as initialInvitations } from "./data/portalUsers";



import "./styles/layout.css";


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [portalUsers, setPortalUsers] = useState(initialPortalUsers);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);

  // Met navigate ga je in de code naar een andere URL.
  const navigate = useNavigate();


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
    navigate("/medewerkers");
  };

  // Inloggen: de gebruiker wordt de ingelogde gebruiker.
  const handleLogin = (user) => {
    setCurrentUser(user);
    navigate("/");
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
    navigate("/login");
  };

  // Niet ingelogd? Dan bestaan alleen de URL's voor inloggen en registreren.
  if (!currentUser) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              portalUsers={portalUsers}
              onLogin={handleLogin}
              onShowRegister={() => navigate("/registreren")}
            />
          }
        />
        <Route
          path="/registreren"
          element={
            <Register
              portalUsers={portalUsers}
              invitations={invitations}
              onRegister={handleRegister}
              onShowLogin={() => navigate("/login")}
            />
          }
        />
        {/* Elke andere URL: eerst inloggen */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <TopNavbar
        currentUser={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      <div className="app-body">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() =>
            setIsSidebarCollapsed((collapsed) => !collapsed)
          }
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/medewerkers"
              element={
                <Employees
                  employees={employees}
                  onAddEmployee={() => navigate("/medewerkers/toevoegen")}
                />
              }
            />
            <Route
              path="/medewerkers/toevoegen"
              element={
                <AddEmployee
                  onSave={handleAddEmployee}
                  onCancel={() => navigate("/medewerkers")}
                />
              }
            />
            <Route path="/functies" element={<EmployeeFunctions />} />
            <Route path="/skills" element={<Skills />} />
            <Route
              path="/instellingen"
              element={
                <Settings currentUser={currentUser} portalUsers={portalUsers} />
              }
            />
            <Route path="/profiel" element={<Profile />} />

            {/* Al ingelogd of onbekende URL: naar het dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;