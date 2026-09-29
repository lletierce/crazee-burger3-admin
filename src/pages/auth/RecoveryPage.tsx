import { useNavigate } from "react-router";
import { config } from "../../features/auth/recovery-password/config";
import { useRecoveryPassword } from "../../features/auth/recovery-password/use-recovery-password";
import AuthLayout from "../../shared/ui/layouts/AuthLayout";
import RecoveryPasswordForm from "../../features/auth/recovery-password/RecoveryPasswordForm";
import RecoveryPasswordSend from "../../features/auth/recovery-password/RecoveryPasswordSend";
import RecoveryPasswordError from "../../features/auth/recovery-password/RecoveryPasswordError";

export default function RecoveryPage() {

    const navigate = useNavigate();

    const {
        status,
        handleRecoveryPassword,
        reset,
        loading,
    } = useRecoveryPassword();

    const current = config[status];

    return (
        <AuthLayout
            title={current.title}
            logoVariant={current.logo}
            actionButton={{
                label: "Retour",
                onClick: () => {
                    reset();
                    navigate('/login');
                }
            }}
        >
            {status === 'default' && (<RecoveryPasswordForm onSubmit={handleRecoveryPassword} loading={loading} />)}

            {status === 'send' && <RecoveryPasswordSend />}
            
            {status === 'error' && <RecoveryPasswordError />}
        
        </AuthLayout>
    );
}