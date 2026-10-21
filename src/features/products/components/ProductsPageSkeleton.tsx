import { ProductsGridSkeleton } from './ProductsGridSkeleton';

/**
 * Page produits complète en attente : barre d'outils + grille.
 *
 * Utilisée pendant la vérification de connexion, avant que ProductsPage ne
 * soit montée. Reprend exactement les conteneurs de ProductsPage (mêmes
 * classes de hauteur, d'ombre et de padding) et la taille réelle de chaque
 * contrôle de la barre d'outils : quand la vraie page prend le relais avec
 * son propre ProductsGridSkeleton, seuls les contrôles changent, la grille
 * reste en place.
 *
 * ⚠️ Si tu modifies la mise en page de ProductsPage ou de sa barre d'outils,
 * pense à répercuter le changement ici.
 */
export function ProductsPageSkeleton() {
  return (
    <div className="md:h-[90vh] md:overflow-y-auto md:shadow-[inset_0_8px_20px_8px_rgba(0,0,0,0.2)]">
      <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white p-4 md:p-6 md:pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Catégorie, tri, ordre, recherche, ajouter */}
          <div className="h-9.5 w-29 animate-pulse rounded-md bg-neutral-200" />
          <div className="h-9.5 w-20 animate-pulse rounded-md bg-neutral-200" />
          <div className="h-9 w-9 animate-pulse rounded-md bg-neutral-200" />
          <div className="h-9.5 w-full animate-pulse rounded-md bg-neutral-200 sm:w-64" />
          <div className="ml-auto h-9 w-26 animate-pulse rounded-md bg-neutral-200" />
        </div>
      </div>

      <div className="p-4 md:p-6">
        <ProductsGridSkeleton />
      </div>
    </div>
  );
}
