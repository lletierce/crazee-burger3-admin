import { useLocation, useNavigate, useSearchParams } from "react-router"
import MainLayout from "../../shared/ui/layouts/MainLayout";
import { logout } from "../../features/auth/logout"
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


  const filteredProducts = useFilteredProducts(products, searchTerm);
  const emptyMessage = searchTerm
    ? hasMore
      ? `Aucun produit chargé ne correspond à "${searchTerm}" — clique sur "voir plus" pour en charger davantage.`
      : `Aucun produit ne correspond à "${searchTerm}".`
    : undefined;

  const location = useLocation();
  const navigate = useNavigate()

  // Lu une seule fois, à l'initialisation — capturé via la forme
  // "fonction" de useState pour ne s'exécuter qu'au premier rendu.
  const [flashMessage, setFlashMessage] = useState<string | null>(
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


  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  function handleProductCreated(product: Product) {
    refetch();
    setFlashMessage(formatProductFlashMessage(product.name, 'ajouté'));
  }

  function handleProductDeleted(id: string) {
    if (productPendingDeletion) {
      setFlashMessage(formatProductFlashMessage(productPendingDeletion.name, 'supprimé'));
    }
    removeProduct(id);
  }


  return (
    <MainLayout userDisplayName="Loris LETIERCE" onLogout={handleLogout}>
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

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoadingMore ? 'Chargement...' : 'Voir plus'}
                  </button>
                </div>
              )}
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
      {flashMessage && <Toast message={flashMessage} onDismiss={() => setFlashMessage(null)} />}
    </MainLayout>
  )
}