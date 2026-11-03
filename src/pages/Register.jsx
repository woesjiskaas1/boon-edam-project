import Button from "../components/atoms/Button";
import RegisterForm from "../components/organisms/RegisterForm";
import AuthLayout from "../templates/AuthLayout";

export default function Register({ portalUsers, invitations, onRegister, onShowLogin }) {
  return (
    <AuthLayout
      title="Registreren"
      intro="Maak je account aan met het e-mailadres waarop je bent uitgenodigd."
      footer={<>Heb je al een account?{" "}<Button variant="link" onClick={onShowLogin}>Inloggen</Button></>}
      demo="Demo-uitnodiging: lisa.bakker@boonedam.com"
    >
      <RegisterForm portalUsers={portalUsers} invitations={invitations} onRegister={onRegister} />
    </AuthLayout>
  );
}
