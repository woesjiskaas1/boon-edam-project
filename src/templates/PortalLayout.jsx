import { useState } from "react";
import Sidebar from "../components/organisms/Sidebar";
import TopNavbar from "../components/organisms/TopNavbar";
import "../styles/layout.css";

export default function PortalLayout({ currentUser, onNavigate, onLogout, children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <TopNavbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="app-body">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed((collapsed) => !collapsed)} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
