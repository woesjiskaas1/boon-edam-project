import Sidebar from "../components/organisms/Sidebar";
import TopNavbar from "../components/organisms/TopNavbar";

export default function PortalLayout({
  currentUser,
  onNavigate,
  onLogout,
  isSidebarCollapsed,
  onSidebarToggle,
  notice,
  children,
}) {
  return (
    <div className="app-layout">
      <TopNavbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="app-body">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={onSidebarToggle} />
        <main className={`main-content${isSidebarCollapsed ? " sidebar-collapsed" : ""}`}>
          {notice}
          {children}
        </main>
      </div>
    </div>
  );
}
