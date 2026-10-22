import { LOGIN_TITLE } from "../../features/auth/login/config";
import LoginForm from "../../features/auth/login/LoginForm";
import AuthLayout from "../../shared/ui/layouts/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout title={LOGIN_TITLE}>
      <LoginForm />
    </AuthLayout>
  )
}
