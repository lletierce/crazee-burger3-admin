import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import { useProduct } from '../../features/products/hooks/useProduct';
import { ProductPageSkeleton } from '../../features/products/components/ProductPageSkeleton';
import NotFoundPage from '../error/NotFoundPage';
import { Breadcrumbs } from '../../shared/ui/components/Breadcrumbs';
import { DeleteProductModal } from '../../features/products/components/DeleteProduct/DeleteProductModal';
import { formatPrice } from '../../shared/utils/formatPrice';
import { formatDate } from '../../shared/utils/formatDate';
import { useFlashMessage } from '../../shared/hooks/useFlashMessage';
import { formatProductFlashMessage } from '../../shared/utils/productFlashMessages';
import { EditProductModal, type ProductUpdatedInfo } from '../../features/products/components/EditProduct/EditProductModal';
import { Toast } from '../../shared/ui/components/Toast';


export function ProductPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { product, isLoading, error, notFound, refetch } = useProduct(slug);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const { message: flashMessage, show: showFlashMessage, clear: clearFlashMessage } = useFlashMessage(
    () => (location.state as { flashMessage?: string } | null)?.flashMessage ?? null,
  );

  // Scrub the message from history once, right after reading it — same
  // reasoning walked through in detail previously: without this, an
  // F5 on this exact page after arriving from a redirect would
  // resurface a stale toast.
  useEffect(() => {
    if (flashMessage) {
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  function handleDeleted() {
    navigate('/produits', {
      state: { flashMessage: product ? formatProductFlashMessage(product.name, 'supprimé') : undefined },
    });
  }

  /**
   * Two genuinely different outcomes, handled differently on purpose:
   *
   * - The name (and therefore the slug) changed: this page is currently
   *   at `/produits/:slug` for the OLD slug, which no longer matches
   *   anything — `useProduct` would report "not found" on the next
   *   fetch. `replace: true` because we're correcting the URL to point
   *   at the same logical product, not navigating to a different page
   *   the user should be able to "back" away from.
   * - The name didn't change: same URL is still correct, no navigation
   *   needed — just tell `useProduct` to refetch so the page reflects
   *   the edit immediately, and show the toast locally.
   */
  function handleProductUpdated({ name, slug: newSlug, slugChanged }: ProductUpdatedInfo) {
    if (slugChanged) {
      navigate(`/produits/${newSlug}`, {
        replace: true,
        state: { flashMessage: formatProductFlashMessage(name, 'modifié') },
      });
    } else {
      showFlashMessage(formatProductFlashMessage(name, 'modifié'));
      refetch();
    }
  }

  return (
    <>
      <div className="md:min-h-[90vh] p-4 md:p-6">
        {isLoading && <ProductPageSkeleton />}

        {!isLoading && notFound && (
          <NotFoundPage
            title="Produit introuvable"
            message="Ce produit n'existe pas ou a été supprimé."
            backHref="/produits"
            backLabel="Retour aux produits"
          />
        )}

        {!isLoading && error && <p className="py-12 text-center text-sm text-red-600">{error.message}</p>}

        {!isLoading && !notFound && !error && product && (
          <>
            <Breadcrumbs
              items={[
                { label: 'Produits', to: '/produits' },
                { label: product.category, to: `/produits?category=${encodeURIComponent(product.category)}` },
                { label: product.name },
              ]}
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <LuPencil size={16} />
                Modifier
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LuTrash2 size={16} />
                Supprimer
              </button>
            </div>

            <DeleteProductModal
              product={isDeleteModalOpen ? product : null}
              onClose={() => setIsDeleteModalOpen(false)}
              onDeleted={handleDeleted}
            />

            <EditProductModal
              product={isEditModalOpen ? product : null}
              onClose={() => setIsEditModalOpen(false)}
              onProductUpdated={handleProductUpdated}
            />

            {flashMessage && <Toast message={flashMessage} onDismiss={clearFlashMessage} />}

            {/*
              Panneau bordé unique englobant texte + image : c'est CE
              conteneur qui fait lire les deux comme un seul bloc, pas
              juste leur proximité. `md:justify-start` explicite
              documente l'intention (contenu collé à gauche) même si
              c'était déjà la valeur par défaut. Le padding passe à
              p-6/sm:p-8 (contre p-4/sm:p-6 avant) pour que le panneau
              occupe un peu plus de place dans la page.
            */}
            <div className="mt-6 rounded-lg border border-neutral-200 p-6 sm:p-8">
              <div className="flex flex-col gap-8 md:flex-row-reverse md:items-start md:justify-start">
                {/*
                  Image agrandie : md:w-80 (contre md:w-72 avant),
                  lg:w-96 sur les très grands écrans pour qu'elle occupe
                  vraiment plus de place dans le panneau.
                */}
                <div className="w-full md:w-80 md:shrink-0 lg:w-96">
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm text-neutral-400">Aucune image</span>
                    )}
                  </div>
                </div>

                <div className="w-full flex-1 md:max-w-md">
                  {(product.isPromoted || !product.isAvailable) && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {product.isPromoted && (
                        <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-medium text-neutral-900">
                          En avant
                        </span>
                      )}
                      {!product.isAvailable && (
                        <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                          Indisponible
                        </span>
                      )}
                    </div>
                  )}

                  <h1 className="text-2xl font-semibold text-neutral-900">{product.name}</h1>
                  <p className="mt-1 text-sm uppercase tracking-wide text-neutral-500">{product.category}</p>

                  {/*
                    Prix et Quantité rejoignent le <dl> ci-dessous avec le
                    même style que les autres champs (libellé gris
                    au-dessus, valeur noire en dessous) — le bloc séparé
                    qu'il y avait ici avant a disparu, tout est
                    maintenant une seule liste cohérente.
                  */}
                  <dl className="mt-6 flex flex-col gap-4 text-sm">
                    <div>
                      <dt className="text-neutral-500">Prix</dt>
                      <dd className="text-neutral-900">{formatPrice(product.price)}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Quantité en stock</dt>
                      <dd className="text-neutral-900">{product.quantity}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Slug</dt>
                      <dd className="text-neutral-900">{product.slug}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Dernière modification</dt>
                      <dd className="text-neutral-900">{formatDate(product.lastUpdated)}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Créé le</dt>
                      <dd className="text-neutral-900">{formatDate(product.createdAt)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}