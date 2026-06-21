import LoginForm from "../../features/auth/login/LoginForm";
import AuthLayout from "../../shared/ui/layouts/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout title="Connectez-vous à votre compte crazee-burger">
      <LoginForm />
    </AuthLayout>

  )
}
