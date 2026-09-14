import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { LuX } from 'react-icons/lu';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Generic on purpose — this isn't "the add-product modal", it's "a
 * modal", reused by anything that needs one later (edit product, delete
 * confirmation...). Same reasoning as `useClickOutside` and
 * `useBodyScrollLock` before it: a second consumer is what justifies the
 * shared/ home, not a guess that one might show up eventually — and
 * here, "any future modal in this app" is a near-certainty, not a guess.
 *
 * Reuses `useBodyScrollLock` (already built for `MobileMenuPanel`)
 * rather than reimplementing scroll-locking — same need, same fix.
 */
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      {/* stopPropagation: without it, a click anywhere inside the panel
          would bubble up to the backdrop's onClick and close the modal —
          the exact opposite of what clicking the form should do. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-neutral-400 hover:text-neutral-700"
          >
            <LuX size={20} cursor="pointer" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
