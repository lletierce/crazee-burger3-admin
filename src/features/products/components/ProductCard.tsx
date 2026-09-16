import { LuX } from 'react-icons/lu';
import type { Product } from '../types/product.types';
import { formatPrice } from '../../../shared/utils/formatPrice';
import { Link } from 'react-router';

interface ProductCardProps {
  product: Product;
  /** The URL this card should navigate to. Omit to render a non-clickable card. */
  to?: string;
  onDelete?: (product: Product) => void;
}

export function ProductCard({ product, to, onDelete }: ProductCardProps) {
  const content = (
    <>
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

        {onDelete && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDelete(product);
            }}
            aria-label={`Supprimer ${product.name}`}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LuX size={14} cursor="pointer" />
          </button>
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
    </>
  );

  const cardClassName = `group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all duration-200 ${
    to ? 'hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-200/50' : ''
  }`;

  if (to) {
    return (
      <Link to={to} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return <div className={cardClassName}>{content}</div>;
}