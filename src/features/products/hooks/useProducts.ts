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

  /**
   * Incremented by `refetch` to force a reload of page one even when the
   * filter/sort haven't changed (e.g. after a product creation).
   */
  const [refreshToken, setRefreshToken] = useState(0);

  const [products, setProducts] = useState<Product[]>([]);
  const [cursor, setCursor] = useState<ProductsPageCursor>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  /**
   * Identifies "page one under the current filter/sort". Every input that
   * should trigger a fresh page-one load is part of this key.
   */
  const queryKey = `${category ?? 'all'}|${sortField}|${sortOrder}|${pageSize}|${refreshToken}`;

  /**
   * Why `isLoading` is DERIVED instead of stored: the effect below must not
   * call setState synchronously (react-hooks/set-state-in-effect — it causes
   * an extra cascading render). So instead of "setIsLoading(true) when a
   * request starts", we remember which key the last COMPLETED request was
   * for. If it doesn't match the current key, a request for the current
   * key is still in flight → we're loading. Initially null → loading.
   */
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const isLoading = loadedKey !== queryKey;

  /**
   * Same idea for the error: it's tagged with the key it belongs to, so an
   * error from a previous filter disappears as soon as the filter changes,
   * without having to reset it synchronously in the effect.
   */
  const [errorState, setErrorState] = useState<{ key: string; error: Error } | null>(null);
  const error = errorState?.key === queryKey ? errorState.error : null;

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
   * source of a new request (filter change, sort change, refetch AND
   * loadMore), because every one of them increments it.
   */
  const requestIdRef = useRef(0);

  // Load page one whenever the filter, sort or refresh token changes.
  // Every setState below happens in an async callback, never synchronously.
  useEffect(() => {
    const requestId = ++requestIdRef.current;

    fetchProductsPage({ category: category ?? undefined, sortField, sortOrder, pageSize })
      .then(({ products: page, nextCursor, hasMore: more }) => {
        if (requestId !== requestIdRef.current) return; // superseded — ignore
        setProducts(page);
        setCursor(nextCursor);
        setHasMore(more);
        setErrorState(null);
      })
      .catch((err: unknown) => {
        if (requestId !== requestIdRef.current) return;
        setErrorState({
          key: queryKey,
          error: err instanceof Error ? err : new Error('Impossible de charger les produits.'),
        });
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setLoadedKey(queryKey);
      });
  }, [category, sortField, sortOrder, pageSize, queryKey]);

  /**
   * Called from event handlers only (e.g. after a successful product
   * creation, so the new product shows up without the user reloading the
   * page). Changing the token changes `queryKey`, which re-runs the effect.
   */
  const refetch = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  const loadMore = useCallback(() => {
    // Guards against a double click firing two overlapping requests, and
    // against clicking "voir plus" while the initial page is still loading.
    if (isLoading || isLoadingMore || !hasMore) return;

    const requestId = ++requestIdRef.current;
    setIsLoadingMore(true);

    fetchProductsPage({ category: category ?? undefined, sortField, sortOrder, cursor, pageSize })
      .then(({ products: page, nextCursor, hasMore: more }) => {
        if (requestId !== requestIdRef.current) return;
        setProducts((current) => [...current, ...page]);
        setCursor(nextCursor);
        setHasMore(more);
        setErrorState(null);
      })
      .catch((err: unknown) => {
        if (requestId !== requestIdRef.current) return;
        setErrorState({
          key: queryKey,
          error: err instanceof Error ? err : new Error('Impossible de charger la suite.'),
        });
      })
      .finally(() => {
        // Always reset, even if this request was superseded: otherwise a
        // filter change during "voir plus" would leave the button stuck in
        // its loading state forever (loadMore can't overlap with itself,
        // so there's no newer loadMore whose flag we could clobber).
        setIsLoadingMore(false);
      });
  }, [category, sortField, sortOrder, cursor, hasMore, isLoading, isLoadingMore, pageSize, queryKey]);

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
    refetch,
  };
}