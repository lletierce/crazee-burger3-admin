import { useCallback, useEffect, useRef, useState } from 'react';
import type { Product } from '../types/product.types';
import { fetchProductBySlug } from '../api/products.api';


interface UseProductResult {
  product: Product | null;
  isLoading: boolean;
  error: Error | null;
  notFound: boolean;
  refetch: () => void;
}

/**
 * `notFound` is kept separate from `error` on purpose. A slug matching
 * no product is a normal, expected outcome — not a failure — so
 * `ProductPage` can show a calm "produit introuvable" message instead of
 * an alarming "something went wrong" banner for what's really just a
 * bad link. Same `requestIdRef` race-guard as `useProducts`.
 *
 * `refetch` exists for exactly one real case right now: after editing a
 * product WITHOUT changing its name (so the slug, and therefore the
 * URL, stays the same) — the component never unmounts, `slug` never
 * changes, so the effect below never re-runs on its own. Without an
 * explicit `refetch`, the page would keep showing the pre-edit values
 * until a manual reload. Same reasoning as `useProducts`' `refetch`:
 * extracted into its own `useCallback` because it now has two callers
 * (the effect, and this manual trigger).
 */
export function useProduct(slug: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);

  const requestIdRef = useRef(0);

  const fetchProduct = useCallback(() => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    return fetchProductBySlug(slug)
      .then((result) => {
        if (requestId !== requestIdRef.current) return;
        if (result === null) {
          setNotFound(true);
        } else {
          setProduct(result);
        }
      })
      .catch((err: unknown) => {
        if (requestId !== requestIdRef.current) return;
        setError(err instanceof Error ? err : new Error('Impossible de charger ce produit.'));
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setIsLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    // Chargement de données : les setState "loading/error" au début de
    // fetchProduct sont volontaires. Refacto prévue : TanStack Query.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProduct();
  }, [fetchProduct]);

  return { product, isLoading, error, notFound, refetch: fetchProduct };
}