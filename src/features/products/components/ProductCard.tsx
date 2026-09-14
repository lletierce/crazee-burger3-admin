import type { KeyboardEvent } from 'react';
import { LuX } from 'react-icons/lu';
import type { Product } from '../types/product.types';
import { formatPrice } from '../../../shared/utils/formatPrice';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductCard({ product, onSelect, onDelete }: ProductCardProps) {
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

        {/*
          `event.stopPropagation()` est ce qui empêche ce clic de
          "remonter" jusqu'au `onClick` du conteneur parent (qui
          déclencherait `onSelect`, la navigation vers le détail produit,
          en même temps que la suppression). Sans ça, cliquer sur la
          croix ferait DEUX choses à la fois : ouvrir la confirmation de
          suppression ET naviguer — exactement le genre de bug qu'on ne
          remarque qu'en testant en vrai.

          Compromis assumé, pas ignoré : imbriquer un vrai `<button>`
          dans un conteneur `role="button"` n'est pas la sémantique ARIA
          la plus pure (un élément interactif dans un autre élément
          interactif). C'est un compromis pragmatique très courant pour
          ce genre de "carte avec action rapide" — le bouton interne
          reste focusable et actionnable indépendamment au clavier, ce
          qui est ce qui compte le plus en pratique.
        */}
        {onDelete && (
          <button
            type="button"
            onClick={(event) => {
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
    </div>
  );
}
