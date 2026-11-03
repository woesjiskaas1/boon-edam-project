import Button from "../components/atoms/Button";
import LoginForm from "../components/organisms/LoginForm";
import AuthLayout from "../templates/AuthLayout";

export default function Login({ portalUsers, onLogin, onShowRegister }) {
  return (
    <AuthLayout
      title="Inloggen"
      intro="Log in om het HR-portaal te gebruiken."
      footer={<>Uitgenodigd, maar nog geen account?{" "}<Button variant="link" onClick={onShowRegister}>Registreren</Button></>}
      demo="Demo: jane.doe@boonedam.com / Welkom123"
    >
      <LoginForm portalUsers={portalUsers} onLogin={onLogin} />
    </AuthLayout>
  );
}
