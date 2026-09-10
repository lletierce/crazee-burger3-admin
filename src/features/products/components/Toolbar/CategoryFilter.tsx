import { useRef, useState } from 'react';
import { LuFilter } from 'react-icons/lu';
import { useClickOutside } from '../../../../shared/hooks/useClickOutside';
import { PRODUCT_CATEGORIES, type ProductCategory } from '../../types/product.types';
import { MenuOption } from './MenuOption';

interface CategoryFilterProps {
  value: ProductCategory | null;
  onChange: (category: ProductCategory | null) => void;
}

const ALL_CATEGORIES_LABEL = 'Toutes les catégories';

/**
 * `value`/`onChange` instead of internal state for the SELECTION itself
 * — this component doesn't own "which category is selected", it's a
 * controlled input. `useProducts` owns that state (see the reasoning
 * from when the hook was built: changing the category has to reset
 * pagination atomically, so that state has to live where the fetch
 * logic lives, not inside this dropdown). What this component DOES own
 * locally is `isOpen` — purely a UI concern, nobody outside this
 * component needs to know whether the dropdown is currently open.
 *
 * Unlike `MobileMenuPanel`, this dropdown doesn't need a slide
 * animation, so there's no reason to keep it permanently mounted and
 * toggle a transform — a plain `{isOpen && ...}` conditional render is
 * simpler and does the job. Reach for the "always mounted + CSS
 * transition" pattern only when there's an actual animation to run.
 */
export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const handleSelect = (category: ProductCategory | null) => {
    onChange(category);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
          value
            ? 'border-neutral-900 bg-neutral-900 text-white'
            : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
        }`}
      >
        <LuFilter size={16} />
        <span>{value ?? 'Catégorie'}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute left-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
        >
          <MenuOption
            label={ALL_CATEGORIES_LABEL}
            isSelected={value === null}
            onSelect={() => handleSelect(null)}
          />
          {PRODUCT_CATEGORIES.map((category) => (
            <MenuOption
              key={category}
              label={category}
              isSelected={value === category}
              onSelect={() => handleSelect(category)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
