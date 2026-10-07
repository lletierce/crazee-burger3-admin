import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProductsPage, type ProductsPageCursor } from '../api/products.api';
import type { Product, ProductCategory, ProductSortField, SortOrder } from '../types/product.types';

interface UseProductsOptions {
  pageSize?: number;
  initialCategory?: ProductCategory | null;
}

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => void;

  category: ProductCategory | null;
  setCategory: (category: ProductCategory | null) => void;
  sortField: ProductSortField;
  setSortField: (field: ProductSortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  removeProduct: (id: string) => void;
  refetch: () => void;
}

/**
 * Deliberate choice: this hook owns the filter/sort STATE, not just the
 * data-fetching. It would be tempting to let a parent component (or the
 * toolbar itself) hold `category`/`sortField`/`sortOrder` and just pass
 * them in as arguments. The problem: changing the category has to reset
 * the accumulated product list AND the pagination cursor AND refetch page
 * one — three things that must happen together, atomically. If that
 * state lived outside this hook, keeping it in sync would need an extra
 * `useEffect` watching props from the outside, which is exactly the kind
 * of "two sources of truth that can drift apart" this hook exists to
 * avoid. Search is intentionally NOT here — it filters products already
 * in memory, so it doesn't need to touch the network or reset pagination;
 * it belongs in the component that renders the list, not in this hook.
 */
export function useProducts({
  pageSize = 20, initialCategory = null,
}: UseProductsOptions = {}): UseProductsResult {
  const [category, setCategory] = useState<ProductCategory | null>(initialCategory);
  const [sortField, setSortField] = useState<ProductSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [products, setProducts] = useState<Product[]>([]);
  const [cursor, setCursor] = useState<ProductsPageCursor>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * The race condition this guards against: the Firestore web SDK's
   * `getDocs` doesn't accept an `AbortSignal` the way `fetch` does, so we
   * can't truly cancel an in-flight request. Without this guard, a
   * sequence like "switch category to Burger, then immediately switch to
   * Boisson" could resolve out of order — if the first (now-stale)
   * request happens to finish after the second, its response would
   * silently overwrite the correct one on screen.
   *
   * The fix: every fetch stamps itself with the current value of this
   * ref before starting, and only applies its result if that value
   * hasn't changed by the time it resolves. One counter covers every
   * source of a new request (filter change, sort change, AND loadMore),
   * because every one of them increments it.
   */
  const requestIdRef = useRef(0);

  /**
   * Extracted into its own `useCallback`, not left inline inside the
   * `useEffect`, because it now has TWO callers: the effect (runs
   * automatically when filter/sort change) and `refetch` (called
   * manually — right now, only after a successful product creation, so
   * the new product shows up without the user reloading the page). Same
   * function either way — "load page one under the current filter/sort"
   * doesn't change meaning depending on who asked for it.
   */
  const fetchFirstPage = useCallback(() => {
    const requestId = ++requestIdRef.current;

    // Chargement de données : les setState "loading/error" au début de
    // fetchProduct sont volontaires. Refacto prévue : TanStack Query.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);

    return fetchProductsPage({ category: category ?? undefined, sortField, sortOrder, pageSize })
      .then(({ products: page, nextCursor, hasMore: more }) => {
        if (requestId !== requestIdRef.current) return; // superseded — ignore
        setProducts(page);
        setCursor(nextCursor);
        setHasMore(more);
      })
      .catch((err: unknown) => {
        if (requestId !== requestIdRef.current) return;
        setError(err instanceof Error ? err : new Error('Impossible de charger les produits.'));
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setIsLoading(false);
      });
  }, [category, sortField, sortOrder, pageSize]);

  // Reset + refetch page one whenever the filter or sort changes.
  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  const loadMore = useCallback(() => {
    // Guards against a double click firing two overlapping requests, and
    // against clicking "voir plus" while the initial page is still loading.
    if (isLoading || isLoadingMore || !hasMore) return;

    const requestId = ++requestIdRef.current;
    // Chargement de données : les setState "loading/error" au début de
    // fetchProduct sont volontaires. Refacto prévue : TanStack Query.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoadingMore(true);
    setError(null);

    fetchProductsPage({ category: category ?? undefined, sortField, sortOrder, cursor, pageSize })
      .then(({ products: page, nextCursor, hasMore: more }) => {
        if (requestId !== requestIdRef.current) return;
        setProducts((current) => [...current, ...page]);
        setCursor(nextCursor);
        setHasMore(more);
      })
      .catch((err: unknown) => {
        if (requestId !== requestIdRef.current) return;
        setError(err instanceof Error ? err : new Error('Impossible de charger la suite.'));
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setIsLoadingMore(false);
      });
  }, [category, sortField, sortOrder, cursor, hasMore, isLoading, isLoadingMore, pageSize]);

  /**
   * Unlike `refetch` (a full page-one reload, needed after a creation
   * because we don't know where the new item ranks under the current
   * sort), a deletion doesn't need any network round trip to update the
   * list correctly — we already know exactly which item to remove.
   * Just filtering it out of local state is both cheaper (zero extra
   * Firestore reads) and instant (no loading flicker).
   */
  const removeProduct = useCallback((id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  }, []);

  return {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    category,
    setCategory,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    removeProduct,
    refetch: fetchFirstPage,
  };
}