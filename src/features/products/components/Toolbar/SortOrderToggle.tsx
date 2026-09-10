import { LuArrowDownWideNarrow, LuArrowUpWideNarrow } from 'react-icons/lu';
import type { SortOrder } from '../../types/product.types';

interface SortOrderToggleProps {
  value: SortOrder;
  onChange: (order: SortOrder) => void;
}

/**
 * Deliberately simpler than CategoryFilter/SortMenu: there are only two
 * possible values, so a single toggle button is the right control — not
 * a dropdown. Reaching for the dropdown pattern here "for consistency
 * with the other two" would add an extra click and a menu just to
 * express a binary choice that one click already communicates on its
 * own. Matching a pattern for its own sake, when the simpler thing
 * fits, is how toolbars end up with more clicks than they need.
 *
 * Icons: "wide to narrow" / "narrow to wide" rather than A-Z icons —
 * this toggle applies to price, quantity, and date just as much as to
 * name, so an alphabetical icon would be misleading whenever the active
 * sort field isn't "Nom".
 */
export function SortOrderToggle({ value, onChange }: SortOrderToggleProps) {
  const isAscending = value === 'asc';

  return (
    <button
      type="button"
      onClick={() => onChange(isAscending ? 'desc' : 'asc')}
      // aria-label describes what clicking DOES (the resulting action),
      // which is the correct convention for a toggle — a screen reader
      // user hears "trier par ordre décroissant" and knows exactly what
      // will happen if they activate it right now.
      aria-label={isAscending ? 'Trier par ordre décroissant' : 'Trier par ordre croissant'}
      // title, unlike aria-label, describes the CURRENT state rather
      // than the action — it's the little tooltip a mouse user sees on
      // hover, where "what am I currently looking at" is more useful
      // than "what would happen if I clicked".
      title={isAscending ? 'Ordre croissant' : 'Ordre décroissant'}
      className="flex items-center justify-center rounded-md border border-neutral-300 p-2 text-neutral-700 transition-colors hover:bg-neutral-50"
    >
      {isAscending ? <LuArrowUpWideNarrow size={18} /> : <LuArrowDownWideNarrow size={18} />}
    </button>
  );
}
