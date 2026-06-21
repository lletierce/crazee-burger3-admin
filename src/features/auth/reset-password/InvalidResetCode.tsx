import { Link } from "react-router";
import AuthLayout from "../../../shared/ui/layouts/AuthLayout";

export default function InvalidResetCode() {
    return (
        <AuthLayout title="Lien de réinitialisation invalide" logoVariant="error">
            <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-gray-600">
                    Ce lien est invalide ou a expiré.
                </p>
                <Link
                    to="/recovery"
                >
                    <button
                        className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        type="submit">
                        Recevoir un nouveau lien
                    </button>
                </Link>
            </div>
        </AuthLayout>
    )
}