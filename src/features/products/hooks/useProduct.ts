import { useEffect, useRef, useState } from 'react';
import type { Product } from '../types/product.types';
import { fetchProductBySlug } from '../api/products.api';


interface UseProductResult {
  product: Product | null;
  isLoading: boolean;
  error: Error | null;
  notFound: boolean;
}

/**
 * `notFound` is kept separate from `error` on purpose. A slug matching
 * no product is a normal, expected outcome — not a failure — so
 * `ProductPage` can show a calm "produit introuvable" message instead of
 * an alarming "something went wrong" banner for what's really just a
 * bad link. Same `requestIdRef` race-guard as `useProducts`: if the
 * user navigates from one product to another quickly (clicking a
 * different card before this one's fetch resolves), a stale response
 * won't overwrite the newer one.
 */
export function useProduct(slug: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    fetchProductBySlug(slug)
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

  return { product, isLoading, error, notFound };
}