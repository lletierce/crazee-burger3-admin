import { useState } from "react";

type RecoveryPasswordFormProps = {
    onSubmit: (email: string) => Promise<void>
}

export default function RecoveryPasswordForm({ onSubmit }: RecoveryPasswordFormProps) {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(email);
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>Indiquez l'adresse e-mail de votre compte pour recevoir un e-mail vous permetant de modifier votre mot de passe.</div>

            {error && <p className="text-red-600">{error}</p>}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                maxLength={30}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                type="submit">
                Envoyer
            </button>
        </form>
    )
}
