import NavbarBrand from "./NavbarBrand";

/**
 * Version « en attente » de la Navbar, affichée tant que la connexion de
 * l'utilisateur n'est pas confirmée.
 *
 * Mêmes dimensions que la vraie Navbar (même <header>, même hauteur h-16) pour
 * que rien ne bouge au remplacement. Le logo, lui, est déjà le vrai : il ne
 * dépend d'aucune donnée. Seuls les éléments liés à l'utilisateur (liens,
 * nom, bouton de déconnexion) sont remplacés par des blocs gris, puisqu'on ne
 * sait pas encore s'il est connecté.
 */
export default function NavbarSkeleton() {
    return (
        <header className="relative z-50 border-b border-neutral-200 bg-white md:rounded-t-2xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
                {/* --- Mobile : icône menu | logo | icône utilisateur --- */}
                <div className="grid w-full grid-cols-3 items-center md:hidden">
                    <div className="flex justify-start">
                        <div className="h-6 w-6 animate-pulse rounded bg-neutral-200" />
                    </div>
                    <div className="flex justify-center">
                        <NavbarBrand showName={false} />
                    </div>
                    <div className="flex justify-end">
                        <div className="h-6 w-6 animate-pulse rounded-full bg-neutral-200" />
                    </div>
                </div>

                {/* --- Desktop : logo | lien | bouton --- */}
                <div className="hidden w-full items-center md:flex">
                    <div className="mr-8 shrink-0">
                        <NavbarBrand />
                    </div>
                    <div className="flex w-full items-center justify-between">
                        <div className="h-4 w-16 animate-pulse rounded bg-neutral-200" />
                        <div className="h-9 w-36 animate-pulse rounded-md bg-neutral-200" />
                    </div>
                </div>
            </div>
        </header>
    );
}
