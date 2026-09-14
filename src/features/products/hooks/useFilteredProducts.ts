import { useMemo } from 'react';
import { normalizeForSearch } from '../../../shared/utils/normalizeForSearch';
import type { Product } from '../types/product.types';

/**
 * Deliberately separate from `useProducts`. As decided when that hook
 * was built: search filters what's ALREADY in memory, it doesn't touch
 * the network or reset pagination — so it doesn't belong in the hook
 * that owns fetching. Keeping it as its own small hook (rather than
 * inlining the `.filter()` directly in `ProductsPage`) makes it
 * independently readable and, if it ever needs to search more than just
 * `name`, the one place to extend.
 *
 * `useMemo`, not a plain `.filter()` call in the component body: without
 * it, this would re-run the filter on every render of `ProductsPage` —
 * including renders triggered by something unrelated, like the sort
 * order toggling. `useMemo` only recomputes when `products` or
 * `searchTerm` actually change.
 */
export function useFilteredProducts(products: Product[], searchTerm: string): Product[] {
  return useMemo(() => {
    const normalizedTerm = normalizeForSearch(searchTerm.trim());

    if (!normalizedTerm) {
      return products;
    }

    return products.filter((product) => normalizeForSearch(product.name).includes(normalizedTerm));
  }, [products, searchTerm]);
}