import { Link } from "react-router";

interface NavbarBrandProps {
    /** Affiche le nom « Crazee Burger » à côté du logo (masqué là où la place manque). */
    showName?: boolean;
    /** Permet de fermer un menu mobile ouvert au clic. */
    onClick?: () => void;
}

const LOGO_SRC = "/images/logo-orange.png";

/**
 * Logo de l'app dans la barre de navigation, cliquable vers la page d'accueil
 * de l'admin (convention attendue par les utilisateurs).
 *
 * - `width`/`height` réels de l'image : le navigateur réserve la place avant le
 *   chargement, la barre ne « saute » pas ;
 * - taille fixée par la hauteur (`h-9` / `md:h-10`), la largeur suit le ratio ;
 * - nom accessible du lien = alt de l'image ; le nom affiché est décoratif
 *   (`aria-hidden`) pour ne pas être lu deux fois.
 */
export default function NavbarBrand({ showName = true, onClick }: NavbarBrandProps) {
    return (
        <Link
            to="/produits"
            onClick={onClick}
            className="flex shrink-0 items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong"
        >
            <img
                src={LOGO_SRC}
                alt="Crazee Burger, accueil"
                width={599}
                height={417}
                className="h-9 w-auto md:h-10"
            />
            {showName && (
                <span
                    aria-hidden="true"
                    className="whitespace-nowrap font-amatic text-2xl font-bold leading-none text-neutral-900 md:text-3xl"
                >
                    Crazee Burger
                </span>
            )}
        </Link>
    );
}