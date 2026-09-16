import { useParams } from 'react-router';
import { useProduct } from '../../features/products/hooks/useProduct';
import { ProductPageSkeleton } from '../../features/products/components/ProductPageSkeleton';
import NotFoundPage from '../error/NotFoundPage';
import { Breadcrumbs } from '../../shared/ui/components/Breadcrumbs';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import { formatPrice } from '../../shared/utils/formatPrice';
import { formatDate } from '../../shared/utils/formatDate';
import MainLayout from '../../shared/ui/layouts/MainLayout';


export function ProductPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { product, isLoading, error, notFound } = useProduct(slug);

  return (
    <MainLayout userDisplayName="Loris LETIERCE" onLogout={() => { }}>
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
                className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                <LuPencil size={16} />
                Modifier
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LuTrash2 size={16} />
                Supprimer
              </button>
            </div>

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
    </MainLayout>
  );
}
