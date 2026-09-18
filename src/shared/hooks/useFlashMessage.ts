import { useCallback, useState } from 'react';

/**
 * Accepts the same initial-value shapes as `useState` itself (a plain
 * value, or a lazy `() => value` initializer) — `ProductPage` needs the
 * lazy form to seed this from `location.state` only once on mount,
 * `ProductsPage` just needs `null`. `show` is typed to only accept a
 * string (not `string | null`) — you "show" a message, you don't
 * accidentally "show nothing"; `clear` is the explicit way to dismiss.
 *
 * What's NOT in here: anything about react-router or `location.state`.
 * Reading a flash message out of navigation state is specific to
 * whichever page received it that way — baking that assumption into
 * this hook would force every consumer (including ProductsPage, which
 * never receives messages via navigation) to carry router-specific
 * concerns it doesn't need.
 */
export function useFlashMessage(initialMessage: string | null | (() => string | null) = null) {
  const [message, setMessage] = useState<string | null>(initialMessage);

  const show = useCallback((text: string) => setMessage(text), []);
  const clear = useCallback(() => setMessage(null), []);

  return { message, show, clear };
}
