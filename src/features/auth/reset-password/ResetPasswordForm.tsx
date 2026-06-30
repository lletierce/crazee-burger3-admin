import { useState } from "react";

type ResetPasswordFormProps = {
    oobCode: string,
    onSubmit: (oobCode: string, password: string) => Promise<void>,
}

export default function ResetPasswordForm({ oobCode, onSubmit }: ResetPasswordFormProps) {

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setValidationError("Les mots de passe ne correspondent pas.");
            return;
        }

        await onSubmit(oobCode, newPassword);
    };


    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>Indiquez le nouveau mot de passe que vous souhaitez utiliser pour votre compte.</div>

            {validationError && (
                <p className="text-red-600">{validationError}</p>
            )}

            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Nouveau mot de passe"
                minLength={5}
                maxLength={30}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirmer le mot de passe"
                minLength={5}
                maxLength={30}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                type="submit"
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
                Valider
            </button>
        </form>
    )
}