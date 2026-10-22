import { useMatch } from "react-router";
import AppFrame from "../../shared/ui/layouts/AppFrame";
import NavbarSkeleton from "../../shared/ui/navbar/NavbarSkeleton";
import { ProductsPageSkeleton } from "../../features/products/components/ProductsPageSkeleton";
import { ProductPageSkeleton } from "../../features/products/components/ProductPageSkeleton";

/**
 * Écran d'attente des pages connectées, affiché pendant que Firebase vérifie
 * la session (rafraîchissement de la page, première visite).
 *
 * Même cadre que AuthenticatedLayout (AppFrame), navbar en attente, et le
 * skeleton de la page demandée : l'utilisateur voit tout de suite la forme de
 * la page qu'il a ouverte, qui se remplit ensuite, au lieu d'un écran de
 * chargement différent suivi d'un changement brutal.
 *
 * Le choix du skeleton dépend de l'URL : c'est le rôle de la couche `app`,
 * qui connaît les routes, de faire ce lien.
 */
export default function AuthenticatedLayoutSkeleton() {
    const isProductDetail = useMatch("/produits/:slug");

    return (
        <AppFrame>
            <div aria-busy="true" aria-label="Chargement de la page">
                <NavbarSkeleton />
                {isProductDetail ? (
                    // Même conteneur que ProductPage
                    <div className="md:min-h-[90vh] p-4 md:p-6">
                        <ProductPageSkeleton />
                    </div>
                ) : (
                    <ProductsPageSkeleton />
                )}
            </div>
        </AppFrame>
    );
}
