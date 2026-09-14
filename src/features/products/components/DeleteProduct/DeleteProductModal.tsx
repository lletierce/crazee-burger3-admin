import { useState } from 'react';
import type { Product } from '../../types/product.types';
import { deleteProduct } from '../../api/products.api';
import { Modal } from '../../../../shared/ui/components/Modal';


interface DeleteProductModalProps {
  product: Product | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

/**
 * `product: Product | null` rather than a separate `isOpen` boolean —
 * same pattern as `AddProductButton`'s state upstream, but here the
 * modal ALSO needs to know which product it's confirming, not just
 * whether it's open. One piece of state does both jobs: `null` means
 * closed, a `Product` means open AND tells us what to show/delete.
 * Two separate booleans (`isOpen` + `selectedProduct`) would let them
 * fall out of sync — open with no product selected, or a product
 * selected while closed — an invalid combination this shape makes
 * impossible to represent, same reasoning as `useNavbarState` early on.
 *
 * Inside the JSX below, `{product && (...)}` looks redundant next to
 * `Modal`'s own `isOpen` check, but it isn't: `children` is evaluated by
 * THIS component before `Modal` ever decides whether to render it — so
 * without the guard, `product.name` would throw the moment `product` is
 * `null`, regardless of what `Modal` does with the result.
 */
export function DeleteProductModal({ product, onClose, onDeleted }: DeleteProductModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!product) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteProduct(product.id);
      onDeleted(product.id);
      onClose();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Impossible de supprimer ce produit.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal isOpen={product !== null} onClose={onClose} title="Supprimer ce produit ?">
      {product && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-700">
            Tu es sur le point de supprimer <span className="font-medium">{product.name}</span>. Cette action
            est irréversible.
          </p>

          {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 cursor-pointer"
            >
              Annuler
            </button>
            {/* Rouge, pas ambre : l'ambre est déjà pris par les actions
                "positives" (Ajouter, Se déconnecter) ailleurs dans
                l'app — le rouge signale sans ambiguïté qu'il s'agit
                d'une action destructive, une convention que
                l'utilisateur reconnaît sans avoir à lire le texte. */}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}