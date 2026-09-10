import { LuPlus } from 'react-icons/lu';

interface AddProductButtonProps {
  onClick: () => void;
}

/**
 * Purely presentational on purpose — this button doesn't know or care
 * what "adding a product" actually means (a modal? a dedicated page? a
 * side drawer?). That decision belongs to whatever opens when it's
 * clicked, which doesn't exist yet. Building the real add-product flow
 * — form fields matching `Product`, validation, the slug-uniqueness
 * question flagged back when `Product` gained its `slug` field, the
 * actual write through `productConverter` — is substantial enough to be
 * its own step, verified on its own once this entry point is confirmed
 * to sit correctly in the toolbar.
 *
 * `ml-auto` lives ON this component, not on a parent wrapper — that way
 * it pushes itself to the end of whichever flex line it lands on inside
 * the toolbar's `flex-wrap` row, whether that's the same line as the
 * search input or, on a narrow screen, a line of its own.
 */
export function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-auto flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-amber-500 cursor-pointer"
    >
      <LuPlus size={16} />
      Ajouter
    </button>
  );
}
