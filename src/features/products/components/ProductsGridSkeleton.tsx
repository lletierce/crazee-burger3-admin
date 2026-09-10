import { ProductCardSkeleton } from './ProductCardSkeleton';
import ProductsGridLayout from './ProductsGridLayout';

interface ProductsGridSkeletonProps {
  count?: number;
}

/**
 * `count` defaults to 8, not `pageSize` (20). The skeleton's only job is
 * to signal "content is loading" — it doesn't need to predict exactly
 * how many cards are about to arrive. 20 pulsing placeholders is just
 * more visual noise for the same message; enough to fill the first
 * couple of rows on a typical screen is enough to read as "a grid is
 * loading" without overdoing it.
 */
export function ProductsGridSkeleton({ count = 8 }: ProductsGridSkeletonProps) {
  return (
    <ProductsGridLayout>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </ProductsGridLayout>
  );
}
