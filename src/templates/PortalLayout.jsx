
import Sidebar from "../components/organisms/Sidebar";

export default function PortalLayout({
  activePage,
  onNavigate,
  children,
}) {
  return (
    <div className="portal-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <main className="portal-content">
        {children}
      </main>
    </div>
  );
}
