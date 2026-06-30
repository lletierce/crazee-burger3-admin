import { useSearchParams } from "react-router";
import AuthLayout from "../../shared/ui/layouts/AuthLayout";
import { config } from "../../features/auth/reset-password/config";
import { useResetPassword } from "../../features/auth/reset-password/use-reset-password";
import ResetPasswordForm from "../../features/auth/reset-password/ResetPasswordForm";
import InvalidResetCode from "../../features/auth/reset-password/InvalidResetCode";
import ResetPasswordLoading from "../../features/auth/reset-password/ResetPasswordLoading";
import ResetPasswordSuccess from "../../features/auth/reset-password/ResetPasswordSuccess";
import ResetPasswordError from "../../features/auth/reset-password/ResetPasswordError";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const oobCode = params.get("oobCode");
  
  const { status, error, handleResetPassword } = useResetPassword();
  const current = config[status];

  if (!oobCode || status === "invalid") {
    return (<InvalidResetCode />)
  }

  return (
    <AuthLayout
      title={current.title}
      logoVariant={current.logo}
    >
      {status === 'idle' && (<ResetPasswordForm oobCode={oobCode} onSubmit={handleResetPassword} />)}

      {status === 'loading' && <ResetPasswordLoading />}

      {status === 'success' && <ResetPasswordSuccess />}

      {status === 'error' && <ResetPasswordError />}

    </AuthLayout>
  );
}