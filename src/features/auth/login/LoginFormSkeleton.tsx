/**
 * Formulaire de connexion en attente, mêmes hauteurs que LoginForm
 * (champs 42 px, bouton 48 px, lien « mot de passe oublié »).
 *
 * On n'affiche pas le vrai formulaire pendant la vérification de session :
 * si l'utilisateur est déjà connecté, il va être redirigé vers les produits,
 * et il ne faut pas qu'il ait commencé à taper son e-mail entre-temps.
 */
export default function LoginFormSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="h-10.5 animate-pulse rounded-lg bg-neutral-200" />
            <div className="h-10.5 animate-pulse rounded-lg bg-neutral-200" />
            <div className="h-12 animate-pulse rounded-lg bg-neutral-200" />
            <div className="h-5 w-56 animate-pulse rounded bg-neutral-200" />
        </div>
    );
}
