import { useEffect } from 'react';

/**
 * Locks page scroll while `isLocked` is true (e.g. while a full-screen
 * mobile panel is open) and always restores the previous value on cleanup.
 *
 * This lives in shared/hooks, not inside Navbar/, because it's generic:
 * you'll want the exact same behavior for a future modal, a cart drawer,
 * an image lightbox, etc. Anything that isn't specific to "being a navbar"
 * doesn't belong inside the Navbar folder.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked]);
}