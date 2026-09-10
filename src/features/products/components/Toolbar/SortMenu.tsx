import { useRef, useState } from 'react';
import { LuArrowUpDown } from 'react-icons/lu';
import { useClickOutside } from '../../../../shared/hooks/useClickOutside';
import { PRODUCT_SORT_FIELDS, type ProductSortField } from '../../types/product.types';
import { MenuOption } from './MenuOption';

interface SortMenuProps {
  value: ProductSortField;
  onChange: (field: ProductSortField) => void;
}

/**
 * French labels for each sort field. Exported so the toolbar (or
 * anything else that needs to display "currently sorted by X" as text)
 * can reuse the same mapping instead of re-deriving it.
 */
export const SORT_FIELD_LABELS: Record<ProductSortField, string> = {
  name: 'Nom',
  price: 'Prix',
  quantity: 'Quantité',
  createdAt: 'Date de création',
};

/**
 * Once you've built one accessible single-select dropdown
 * (`CategoryFilter`), the next one is "swap the data source and
 * labels" — same button, same `useClickOutside`, same `MenuOption`
 * list. The one real difference: there's no "all" option here. A sort
 * field is always required (`useProducts` initializes `sortField` to
 * `'createdAt'`, never `null`), so this component has one fewer branch
 * to handle than `CategoryFilter` did.
 */
export function SortMenu({ value, onChange }: SortMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const handleSelect = (field: ProductSortField) => {
    onChange(field);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
      >
        <LuArrowUpDown size={16} />
        <span>{SORT_FIELD_LABELS[value]}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute left-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {PRODUCT_SORT_FIELDS.map((field) => (
            <MenuOption
              key={field}
              label={SORT_FIELD_LABELS[field]}
              isSelected={value === field}
              onSelect={() => handleSelect(field)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
