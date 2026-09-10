import { LuCheck } from 'react-icons/lu';

interface MenuOptionProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * Extracted here, not earlier: `CategoryFilter` had this exact markup
 * inline as `CategoryOption`, and that was fine with a single consumer.
 * Now that `SortMenu` needs the identical "single-select menu row"
 * (role="menuitemradio", checkmark, same classes), duplicating it a
 * second time is the signal to pull it out — not before. Extracting
 * "reusable" pieces before a real second use case exists tends to guess
 * wrong: you end up with props nobody uses, or a shape that doesn't
 * actually fit the second consumer once it shows up.
 */
export function MenuOption({ label, isSelected, onSelect }: MenuOptionProps) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={isSelected}
      onClick={onSelect}
      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
    >
      {label}
      {isSelected && <LuCheck size={16} className="text-neutral-900" />}
    </button>
  );
}
