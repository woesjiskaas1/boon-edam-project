import Logo from "../components/atoms/Logo";
import "../styles/auth.css";

export default function AuthLayout({ title, intro, footer, demo, children }) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <Logo className="auth-logo" />
        <h1>{title}</h1>
        <p className="auth-intro">{intro}</p>
        {children}
        {footer && <p className="auth-switch">{footer}</p>}
        {demo && <p className="auth-demo">{demo}</p>}
      </div>
    </main>
  );
}
