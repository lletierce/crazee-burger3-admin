import { Link } from "react-router";
import AuthLayout from "../../../shared/ui/layouts/AuthLayout";

export default function InvalidResetCode() {
    return (
        <AuthLayout title="Lien de réinitialisation invalide" logoVariant="error">
            <div className="flex flex-col gap-6">
                <p className="text-gray-600">
                    Le lien que vous souhaitez utiliser est invalide ou a expiré.
                    Merci de vérifier que vous utilisez le bon lien ou de demander un nouveau lien de réinitialisation de mot de passe.
                </p>
                <Link
                    to="/recovery"
                    className="w-full bg-blue-600 text-center text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                    Recommencer
                </Link>
            </div>
        </AuthLayout>
    )
}