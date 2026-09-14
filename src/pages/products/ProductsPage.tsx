import { useNavigate } from "react-router"
import MainLayout from "../../shared/ui/layouts/MainLayout";
import { logout } from "../../features/auth/logout"
import { ProductsGrid } from "../../features/products/components/ProductsGrid";
import { useProducts } from "../../features/products/hooks/useProducts";
import { CategoryFilter } from "../../features/products/components/Toolbar/CategoryFilter";
import { ProductsGridSkeleton } from "../../features/products/components/ProductsGridSkeleton";
import { SortMenu } from "../../features/products/components/Toolbar/SortMenu";
import { SortOrderToggle } from "../../features/products/components/Toolbar/SortOrderToggle";
import { useState } from "react";
import { useFilteredProducts } from "../../features/products/hooks/useFilteredProducts";
import { SearchInput } from "../../features/products/components/Toolbar/SearchInput";
import { AddProductButton } from "../../features/products/components/Toolbar/AddProductButton";
import { AddProductModal } from "../../features/products/components/AddProduct/AddProductModal";

export default function ProductsPage() {

  const [searchTerm, setSearchTerm] = useState('');

  // TODO: remplacer par l'ouverture réelle du formulaire/modal d'ajout,
  // à construire dans la prochaine étape. Pour l'instant, ce state prouve
  // juste que le bouton déclenche bien quelque chose.
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const {
    products, category, setCategory,
    sortField, setSortField, sortOrder, setSortOrder,
    isLoading, error, hasMore, isLoadingMore, loadMore,
    refetch,
  } = useProducts();


  const filteredProducts = useFilteredProducts(products, searchTerm);
  const emptyMessage = searchTerm
    ? hasMore
      ? `Aucun produit chargé ne correspond à "${searchTerm}" — clique sur "voir plus" pour en charger davantage.`
      : `Aucun produit ne correspond à "${searchTerm}".`
    : undefined;

  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }
  <button onClick={handleLogout}>Logout</button>


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
        onProductCreated={refetch}
      />
    </MainLayout>
  )
}