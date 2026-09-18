import { useEffect } from 'react';
import { LuCheck, LuX } from 'react-icons/lu';

interface ToastProps {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
}

/**
 * The visual piece (this component) is safe to make reusable on its
 * first real use — unlike a hook encoding a behavioral decision (where
 * guessing wrong before a second real case burns you), a toast is about
 * as close to a universal, low-risk UI primitive as it gets. What's
 * NOT extracted yet is the "navigate, then show a message after
 * redirect" mechanism itself (see ProductsPage) — that's genuinely the
 * first time this app needs it. If a second page later needs the same
 * pattern, THAT'S the signal to pull it into a shared `useFlashMessage`
 * hook, not before.
 *
 * Responsive positioning: bottom-center, near-full-width on mobile
 * (thumb-reachable, doesn't fight with the sticky toolbar up top);
 * bottom-right, fixed width on `sm:` and up — the conventional desktop
 * toast placement.
 */
export function Toast({ message, onDismiss, durationMs = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [onDismiss, durationMs]);

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-lg bg-neutral-900 px-4 py-3 text-sm text-white shadow-lg sm:left-auto sm:right-4 sm:w-auto sm:translate-x-0"
    >
      <LuCheck size={18} className="shrink-0 text-green-400" />
      <span className="flex-1">{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Fermer" className="shrink-0 text-neutral-400 hover:text-white">
        <LuX size={16} />
      </button>
    </div>
  );
}
