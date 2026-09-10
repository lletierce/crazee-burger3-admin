import { ProductCard } from './ProductCard';
import type { Product } from '../types/product.types';
import ProductsGridLayout from './ProductsGridLayout';

interface ProductsGridProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  emptyMessage?: string;
}

/**
 * `key={product.id}` matters more here than in a typical list: this grid
 * can be RE-SORTED (the toolbar's "trier par" changes `sortField`, which
 * triggers a fresh fetch that comes back in a different order). If we
 * keyed by array index instead, React would see "the item at index 0
 * changed from Burger Classic to Coca-Cola" after a sort and reuse that
 * DOM node/component instance for a completely different product —
 * wrong image flashing before the real one loads, stale internal state,
 * etc. Keying by `id` tells React "this is the same product that moved",
 * so it moves the existing DOM node instead of mutating it in place.
 *
 * Responsive columns: 2 on mobile (compact cards read fine at that
 * width), scaling up to 5 on large desktop screens. Easy to tune later —
 * this is a starting point, not a fixed rule.
 */
export function ProductsGrid({
  products,
  onSelectProduct,
  emptyMessage = 'Aucun produit à afficher.',
}: ProductsGridProps) {
  if (products.length === 0) {
    return <p className="py-12 text-center text-sm text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <ProductsGridLayout>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
      ))}
    </ProductsGridLayout>
  );
}