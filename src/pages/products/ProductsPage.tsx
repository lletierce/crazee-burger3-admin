import { useLocation, useNavigate, useSearchParams } from "react-router"
import { ProductsGrid } from "../../features/products/components/ProductsGrid";
import { useProducts } from "../../features/products/hooks/useProducts";
import { CategoryFilter } from "../../features/products/components/Toolbar/CategoryFilter";
import { ProductsGridSkeleton } from "../../features/products/components/ProductsGridSkeleton";
import { SortMenu } from "../../features/products/components/Toolbar/SortMenu";
import { SortOrderToggle } from "../../features/products/components/Toolbar/SortOrderToggle";
import { useEffect, useState } from "react";
import { useFilteredProducts } from "../../features/products/hooks/useFilteredProducts";
import { SearchInput } from "../../features/products/components/Toolbar/SearchInput";
import { AddProductButton } from "../../features/products/components/Toolbar/AddProductButton";
import { AddProductModal } from "../../features/products/components/AddProduct/AddProductModal";
import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from "../../features/products/types/product.types";
import { DeleteProductModal } from "../../features/products/components/DeleteProduct/DeleteProductModal";
import { Toast } from "../../shared/ui/components/Toast";
import { formatProductFlashMessage } from "../../shared/utils/productFlashMessages";
import { useFlashMessage } from "../../shared/hooks/useFlashMessage";
import { useInfiniteScroll } from "../../shared/hooks/useInfiniteScroll";

export default function ProductsPage() {

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  // On ne fait jamais confiance à une donnée venant de l'URL sans la
  // valider — même logique que pour les données Firestore, mais ici la
  // source de vérité extérieure est l'URL, pas la base.
  const initialCategory: ProductCategory | null = PRODUCT_CATEGORIES.includes(categoryParam as ProductCategory)
    ? (categoryParam as ProductCategory)
    : null;


  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productPendingDeletion, setProductPendingDeletion] = useState<Product | null>(null);

  const {
    products, category, setCategory,
    sortField, setSortField, sortOrder, setSortOrder,
    isLoading, error, hasMore, isLoadingMore, loadMore,
    removeProduct, refetch,
  } = useProducts({ initialCategory });


  // Défilement infini : la page suivante se charge dès que la sentinelle
  // (placée sous la grille) arrive à l'écran. Désactivé pendant un
  // chargement et quand il n'y a plus rien à charger.
  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    enabled: hasMore && !isLoading && !isLoadingMore,
  });

  const filteredProducts = useFilteredProducts(products, searchTerm);
  // Si la recherche ne trouve rien parmi les produits déjà chargés, la
  // sentinelle reste visible : les pages suivantes se chargent toutes seules
  // jusqu'à trouver un résultat ou arriver à la fin du catalogue.
  const emptyMessage = searchTerm
    ? hasMore
      ? `Recherche de "${searchTerm}" dans les produits suivants…`
      : `Aucun produit ne correspond à "${searchTerm}".`
    : undefined;

  const location = useLocation();
  const navigate = useNavigate()

  const { message: flashMessage, show: showFlashMessage, clear: clearFlashMessage } = useFlashMessage(
    () => (location.state as { flashMessage?: string } | null)?.flashMessage ?? null,
  );

  // Nettoie le state de l'historique une seule fois au montage — sinon un
  // rafraîchissement de page ou un retour arrière ferait réapparaître le
  // message "produit supprimé" alors que ce n'est plus d'actualité.
  useEffect(() => {
    if (flashMessage) {
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  function handleProductCreated(product: Product) {
    refetch();
    showFlashMessage(formatProductFlashMessage(product.name, 'ajouté'));
  }

  function handleProductDeleted(id: string) {
    if (productPendingDeletion) {
      showFlashMessage(formatProductFlashMessage(productPendingDeletion.name, 'supprimé'));
    }
    removeProduct(id);
  }


  return (
    <>
      <div className="md:h-[90vh] md:overflow-y-auto md:shadow-[inset_0_8px_20px_8px_rgba(0,0,0,0.2)]">
        {/* La barre d'outils n'est plus derrière un `if` — elle est toujours là */}
        <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white p-4 md:p-6 md:pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryFilter value={category} onChange={setCategory} />
            <SortMenu value={sortField} onChange={setSortField} />
            <SortOrderToggle value={sortOrder} onChange={setSortOrder} />
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
            <AddProductButton onClick={() => { setIsAddProductOpen(true) }} />
          </div>
        </div>

        <div className="p-4 md:p-6 md:pt-0">
          {/* Seule cette zone change de contenu selon l'état */}
          {isLoading ? (
            <ProductsGridSkeleton />
          ) : error ? (
            <p className="py-12 text-center text-sm text-red-600">{error.message}</p>
          ) : (
            <>
              <ProductsGrid
                products={filteredProducts}
                getProductHref={(product) => `/produits/${product.slug}`}
                onDeleteProduct={setProductPendingDeletion}
                emptyMessage={emptyMessage}
              />

              {/* Sentinelle invisible : quand elle entre à l'écran, la page suivante se charge. */}
              {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}

              {/* role="status" : annoncé par les lecteurs d'écran, qui ne "voient" pas le défilement. */}
              <p role="status" className="py-6 text-center text-sm text-neutral-500">
                {isLoadingMore
                  ? 'Chargement des produits…'
                  : !hasMore && products.length > 0
                    ? 'Tous les produits sont affichés.'
                    : ''}
              </p>
            </>
          )}
        </div>
      </div>
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={handleProductCreated}
      />
      <DeleteProductModal
        product={productPendingDeletion}
        onClose={() => setProductPendingDeletion(null)}
        onDeleted={handleProductDeleted}
      />
      {flashMessage && <Toast message={flashMessage} onDismiss={clearFlashMessage} />}
    </>
  )
}