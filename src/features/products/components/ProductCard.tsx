import type { KeyboardEvent } from 'react';
import { formatPrice } from '../../../shared/utils/formatPrice';
import type { Product } from '../types/product.types';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

/**
 * `onSelect` is optional because this card is meant to be reusable
 * beyond "click to see details" — e.g. a future picker/preview context
 * where it's purely informational. Rather than switching the root
 * element between `<button>` and `<div>` (which gets messy to type in
 * TypeScript), we always render a `<div>` and only attach interactive
 * behavior — `role="button"`, keyboard focus, and Enter/Space handling —
 * when `onSelect` is actually provided. This is the manual version of
 * what a real `<button>` gives you for free; it's more code, but it's
 * the correct pattern any time a non-button element needs to act like
 * one for accessibility (screen readers, keyboard-only navigation).
 */
export function ProductCard({ product, onSelect }: ProductCardProps) {
  const isClickable = Boolean(onSelect);

  const handleClick = () => {
    onSelect?.(product);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(product);
    }
  };

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      className={`group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow ${
        isClickable ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
            Pas d'image
          </div>
        )}

        {product.isPromoted && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-medium text-neutral-900">
            En avant
          </span>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-900">
              Indisponible
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs uppercase tracking-wide text-neutral-500">{product.category}</span>
        <h3 className="text-sm font-medium text-neutral-900">{product.name}</h3>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-neutral-900">{formatPrice(product.price)}</span>
          <span className="text-xs text-neutral-500">Qté : {product.quantity}</span>
        </div>
      </div>
    </div>
  );
}
