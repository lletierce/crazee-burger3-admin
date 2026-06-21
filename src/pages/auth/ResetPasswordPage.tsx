import { useSearchParams } from "react-router";
import AuthLayout from "../../shared/ui/layouts/AuthLayout";
import { config } from "../../features/auth/reset-password/config";
import { useResetPassword } from "../../features/auth/reset-password/use-reset-password";
import ResetPasswordForm from "../../features/auth/reset-password/ResetPasswordForm";
import InvalidResetCode from "../../features/auth/reset-password/InvalidResetCode";

export default function ResetPasswordPage() {

  const [params] = useSearchParams();
  const oobCode = params.get("oobCode");

  const {
    status,
    handleResetPassword,
  } = useResetPassword();

  const current = config[status];

  if (!oobCode) {
    return(<InvalidResetCode />)
  }

  return (
      <AuthLayout
        title={current.title}
        logoVariant={current.logo}
      >
        {status === "default" && (<ResetPasswordForm oobCode={oobCode} onSubmit={handleResetPassword} />)}
      </AuthLayout>

    )
}