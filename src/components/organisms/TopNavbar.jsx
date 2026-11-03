import Logo from "../atoms/Logo";
import ProfileMenu from "../molecules/ProfileMenu";

export default function TopNavbar({ currentUser, onNavigate, onLogout }) {
  return (
    <header className="top-navbar">
      <div className="brand"><Logo /></div>
      <ProfileMenu currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />
    </header>
  );
}
