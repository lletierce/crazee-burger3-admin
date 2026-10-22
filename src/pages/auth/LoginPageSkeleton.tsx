import { LOGIN_TITLE } from "../../features/auth/login/config";
import LoginFormSkeleton from "../../features/auth/login/LoginFormSkeleton";
import AuthLayout from "../../shared/ui/layouts/AuthLayout";

/**
 * Page de connexion en attente, affichée pendant la vérification de session.
 * Logo et titre sont les vrais (ils ne dépendent de rien), seul le formulaire
 * est remplacé par un skeleton.
 */
export default function LoginPageSkeleton() {
    return (
        <AuthLayout title={LOGIN_TITLE}>
            <div aria-busy="true" aria-label="Chargement de la page de connexion">
                <LoginFormSkeleton />
            </div>
        </AuthLayout>
    );
}
