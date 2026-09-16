import type { Product } from "../types/product.types";
import { ProductCard } from "./ProductCard";
import { ProductsGridLayout } from "./ProductsGridLayout";

interface ProductsGridProps {
  products: Product[];
  /**
   * Resolves each product's detail-page URL. A function, not a fixed
   * string prefix — keeps this component ignorant of the exact route
   * shape (`/produits/:slug`), the same way it already knows nothing
   * about Firestore. If the URL scheme changes later, only the caller
   * that builds this function needs to change.
   */
  getProductHref?: (product: Product) => string;
  onDeleteProduct?: (product: Product) => void;
  emptyMessage?: string;
}

export function ProductsGrid({
  products,
  getProductHref,
  onDeleteProduct,
  emptyMessage = 'Aucun produit à afficher.',
}: ProductsGridProps) {
  if (products.length === 0) {
    return <p className="py-12 text-center text-sm text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <ProductsGridLayout>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          to={getProductHref?.(product)}
          onDelete={onDeleteProduct}
        />
      ))}
    </ProductsGridLayout>
  );
}