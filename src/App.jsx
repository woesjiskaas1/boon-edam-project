import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import TopNavbar from "./components/organisms/TopNavbar";
import Sidebar from "./components/organisms/Sidebar";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Employee from "./pages/Employee";
import EmployeeFunctions from "./pages/EmployeeFunctions";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Skills from "./pages/Skills";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AddEmployee from "./pages/AddEmployee";

import {
  getEmployees,
  getJobRoles,
  getSkills,
  createEmployee,
} from "./services/employeeService";

import initialPortalUsers, { invitations as initialInvitations } from "./data/portalUsers";



import "./styles/layout.css";


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [portalUsers, setPortalUsers] = useState(initialPortalUsers);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeesError, setEmployeesError] = useState("");
    const [jobRoles, setJobRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  // Met navigate ga je in de code naar een andere URL.
  const navigate = useNavigate();

  // Haalt de medewerkers één keer op uit de database, als de app start.
  useEffect(() => {
    getEmployees()
      .then((loadedEmployees) => setEmployees(loadedEmployees))
      .catch((error) => setEmployeesError(error.message));

    // Ook de rollen en skills komen nu uit de database.
    getJobRoles()
      .then((loadedRoles) => setJobRoles(loadedRoles))
      .catch((error) => setEmployeesError(error.message));

    getSkills()
      .then((loadedSkills) => setSkills(loadedSkills))
      .catch((error) => setEmployeesError(error.message));
  }, []);


  // Slaat een nieuwe medewerker op in de database
  // en zet hem daarna achteraan in de lijst.
  // "async": we wachten op de backend. Gaat er iets mis, dan gooit
  // createEmployee een fout; die vangt de pagina AddEmployee op.
  const handleAddEmployee = async (formData) => {
    const savedEmployee = await createEmployee(formData);

    // De namen van de gekozen rollen, voor in de lijst.
    const selectedRoles = jobRoles.filter((role) => formData.roleIds.includes(role.id));

    const newEmployee = {
      ...savedEmployee,
      roleIds: formData.roleIds,
      role: selectedRoles.map((role) => role.name).join(", "),
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

        <main className={`main-content${isSidebarCollapsed ? " sidebar-collapsed" : ""}`}>
          {employeesError && (
            <p className="auth-error" role="alert">
              {employeesError} Draait de backend?
            </p>
          )}
          <Routes>
            <Route
              path="/"
              element={<Dashboard currentUser={currentUser} employees={employees} />}
            />
            <Route
              path="/medewerkers"
              element={
                <Employees
                  employees={employees}
                  onAddEmployee={() => navigate("/medewerkers/toevoegen")}
                  onSelectEmployee={(employeeId) => navigate(`/medewerkers/${employeeId}`)}
                />
              }
            />
            <Route
              path="/medewerkers/toevoegen"
              element={
                <AddEmployee
                  employeeRoles={jobRoles}
                  skills={skills}
                  onSave={handleAddEmployee}
                  onCancel={() => navigate("/medewerkers")}
                />
              }
            />
            <Route
              path="/medewerkers/:employeeId"
              element={
                <Employee
                  employees={employees}
                  onBack={() => navigate("/medewerkers")}
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
