import { LuSearch, LuX } from 'react-icons/lu';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * No debounce here — deliberately. Debounce exists to delay an
 * expensive or network-bound operation (a Firestore query, an API call)
 * until the user pauses typing. This search filters an array already
 * sitting in memory with a plain `.filter()` — cheap regardless of
 * keystroke speed. Adding a debounce here would only introduce a delay
 * the user *feels* (the list not updating for 300ms after they stop
 * typing) for a performance problem that doesn't exist. Debounce
 * earns its place the moment this search starts triggering a network
 * request instead of filtering in-memory data — not before.
 *
 * `w-full sm:w-64` on the wrapper, not `flex-1`: with `flex-1` the input
 * grabbed 100% of whatever empty space was left in the toolbar row —
 * looked fine with three narrow controls and nothing else, but leaves
 * no room to reason about where a future "Ajouter" button goes, and
 * just looks odd stretched edge to edge. A fixed width (full width only
 * on the smallest screens, where it wraps to its own line anyway) keeps
 * it sized like the other toolbar controls.
 */
export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full sm:w-64">
      <LuSearch
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rechercher un produit..."
        className="w-full rounded-md border border-neutral-300 py-2 pl-9 pr-8 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Effacer la recherche"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
        >
          <LuX size={16} />
        </button>
      )}
    </div>
  );
}