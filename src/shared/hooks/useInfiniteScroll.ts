import { useEffect, useState } from 'react';

interface UseInfiniteScrollOptions {
  /** Called when the sentinel element becomes visible on screen. */
  onLoadMore: () => void;
  /**
   * Whether loading more is currently allowed. Pass `false` while a page is
   * already loading, or when there is nothing left to load.
   */
  enabled: boolean;
  /**
   * Extra margin around the viewport, so the next page starts loading a bit
   * BEFORE the user actually reaches the bottom of the list.
   * Note: when the list lives inside its own scrollable container (as on
   * desktop here), the browser still clips the sentinel to that container,
   * so the margin mostly helps when the whole page scrolls (mobile).
   */
  rootMargin?: string;
}

/**
 * Infinite scroll based on the browser's native IntersectionObserver — no
 * library, no scroll listener (which would fire dozens of times per second).
 *
 * Usage: put the returned callback ref on an empty element placed right after
 * the list (the "sentinel"). When it scrolls into view, `onLoadMore` runs.
 *
 * Why a callback ref + state rather than `useRef`: the sentinel is rendered
 * conditionally (it disappears while the first page loads, or when there's
 * nothing more to load). Storing the DOM node in state makes the effect
 * re-run when the node appears or disappears; a plain ref would not.
 *
 * Why the observer is re-created whenever `enabled` flips back to `true`:
 * an IntersectionObserver only reports CHANGES of visibility... except right
 * after `observe()`, where it always reports the current state once. So if a
 * freshly loaded page is too short to push the sentinel off screen (big
 * monitor, or a search that hides most products), the new observer instantly
 * sees it as still visible and loads the next page — until the screen is
 * filled or there's nothing left. No setState in the effect body, which keeps
 * `react-hooks/set-state-in-effect` happy.
 */
export function useInfiniteScroll({
  onLoadMore,
  enabled,
  rootMargin = '200px',
}: UseInfiniteScrollOptions): (node: Element | null) => void {
  const [sentinel, setSentinel] = useState<Element | null>(null);

  useEffect(() => {
    if (!sentinel || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          // One trigger per observer: stop watching right away, so a quick
          // scroll can't fire a second request before `enabled` turns false.
          observer.disconnect();
          onLoadMore();
        }
      },
      { rootMargin },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel, enabled, onLoadMore, rootMargin]);

  return setSentinel;
}
