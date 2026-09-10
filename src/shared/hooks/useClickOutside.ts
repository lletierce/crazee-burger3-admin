import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Calls `onOutsideClick` when a click happens outside `ref`'s element.
 *
 * `isActive` matters: without it, this would attach a document-wide
 * click listener even while the dropdown is closed — wasted work, and a
 * source of subtle bugs if several dropdowns on the same page all react
 * to every click. Only listening while the dropdown is actually open
 * keeps this cheap and avoids interference between instances.
 *
 * Generic and not category-specific, so it lives in shared/hooks — the
 * sort menu and any future popover will reuse this exact hook rather
 * than reimplementing the same listener.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  isActive: boolean,
) {
  useEffect(() => {
    if (!isActive) return;

    function handlePointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [ref, onOutsideClick, isActive]);
}
