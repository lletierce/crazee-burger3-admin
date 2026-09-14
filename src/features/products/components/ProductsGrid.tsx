import type { Product } from "../types/product.types";
import { ProductCard } from "./ProductCard";
import { ProductsGridLayout } from "./ProductsGridLayout";


interface ProductsGridProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
  emptyMessage?: string;
}

export function ProductsGrid({
  products,
  onSelectProduct,
  onDeleteProduct,
  emptyMessage = 'Aucun produit à afficher.',
}: ProductsGridProps) {
  if (products.length === 0) {
    return <p className="py-12 text-center text-sm text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <ProductsGridLayout>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelectProduct} onDelete={onDeleteProduct} />
      ))}
    </ProductsGridLayout>
  );
}