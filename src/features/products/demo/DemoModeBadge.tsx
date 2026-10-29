import { useState } from 'react';
import { LuFlaskConical, LuRotateCcw } from 'react-icons/lu';
import { Modal } from '../../../shared/ui/components/Modal';
import { resetDemoCatalog } from './resetDemoCatalog';

interface DemoModeBadgeProps {
  /** Appelé une fois le catalogue restauré (rechargement de la page, message). */
  onReset: () => void;
}

/**
 * Pastille flottante « Mode démo », en bas à gauche de l'écran.
 *
 * Volontairement présentée comme un outil à part (style « add-on de dev »)
 * et non comme une fonctionnalité du back-office : le visiteur comprend
 * qu'elle sert uniquement à remettre la démonstration dans un état propre.
 * N'est affichée que si le mode démo est activé (voir demo.config.ts).
 */
export function DemoModeBadge({ onReset }: DemoModeBadgeProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeConfirm() {
    if (isResetting) return;
    setIsConfirmOpen(false);
    setError(null);
  }

  async function handleConfirm() {
    setIsResetting(true);
    setError(null);

    try {
      await resetDemoCatalog();
      setIsConfirmOpen(false);
      onReset();
    } catch {
      setError('La réinitialisation a échoué. Vérifie ta connexion et réessaie.');
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1 rounded-full border border-neutral-200 bg-white/95 py-1 pl-3 pr-1 text-xs shadow-lg backdrop-blur transition-shadow hover:shadow-xl">
        <LuFlaskConical size={14} aria-hidden="true" className="text-orange-primary" />
        <span className="font-medium text-neutral-700">Mode démo</span>
        {/*
          Survol (souris uniquement : Tailwind 4 n'applique `hover:` que sur les
          appareils qui le permettent) : fond orange de la marque, et la flèche
          fait un demi-tour, comme un « retour en arrière ». Animation coupée si
          l'utilisateur a demandé à réduire les animations.
        */}
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="group ml-1 flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-700 transition-colors hover:bg-orange-primary hover:text-neutral-900 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-primary"
        >
          <LuRotateCcw
            size={12}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-rotate-180 motion-reduce:transition-none"
          />
          Réinitialiser
        </button>
      </div>

      <Modal isOpen={isConfirmOpen} onClose={closeConfirm} title="Réinitialiser la démo ?">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-700">
            Le catalogue va être remplacé par les produits de démonstration d'origine. Les produits ajoutés,
            modifiés ou supprimés depuis seront perdus.
          </p>

          {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeConfirm}
              disabled={isResetting}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isResetting}
              className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-amber-500 disabled:opacity-50"
            >
              {isResetting ? 'Réinitialisation...' : 'Réinitialiser'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}