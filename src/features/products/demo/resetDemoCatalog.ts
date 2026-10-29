import { collection, doc, getDocs, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../../app/firebase/firebase-config';
import { slugify } from '../../../shared/utils/slugify';
import { DEMO_PRODUCTS } from './demoProducts';

/** Limite Firestore : 500 opérations maximum par lot d'écritures. */
const MAX_WRITES_PER_BATCH = 500;

const DEMO_PRODUCT_IDS = new Set(DEMO_PRODUCTS.map((product) => product.id));

/**
 * Remet la collection `products` dans l'état du catalogue de démonstration :
 * les produits de démo sont restaurés (valeurs d'origine), tous les autres
 * sont supprimés.
 *
 * Deux étapes, dans cet ordre volontairement :
 *
 * 1. **Restauration des produits de démo, en un seul lot** : soit les 29
 *    produits sont restaurés, soit aucun (en cas d'erreur, rien ne change).
 * 2. **Suppression des produits en trop**, par lots de 500. Si cette étape
 *    échoue en cours de route, le catalogue de démo est déjà complet.
 *
 * Pourquoi la collection « brute » (sans `productConverter`) :
 * les règles Firestore interdisent de modifier `createdAt` sur un produit
 * existant (`request.resource.data.createdAt == resource.data.createdAt`).
 * Le converter transforme les dates en `Date` JavaScript, précises à la
 * milliseconde seulement, alors que Firestore les stocke à la microseconde :
 * réécrire une date passée par le converter pourrait la modifier très
 * légèrement, et l'écriture serait refusée. On réutilise donc la valeur
 * exacte lue dans Firestore.
 */
export async function resetDemoCatalog(): Promise<void> {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  const existingById = new Map(snapshot.docs.map((docSnapshot) => [docSnapshot.id, docSnapshot]));
  const now = Timestamp.now();

  // 1. Restauration des produits de démo
  const restoreBatch = writeBatch(db);

  for (const { id, createdAt, ...fields } of DEMO_PRODUCTS) {
    const existingCreatedAt = existingById.get(id)?.get('createdAt');

    restoreBatch.set(doc(productsRef, id), {
      ...fields,
      slug: slugify(fields.name),
      createdAt: existingCreatedAt ?? Timestamp.fromDate(new Date(createdAt)),
      lastUpdated: now,
    });
  }

  await restoreBatch.commit();

  // 2. Suppression des produits qui ne font pas partie de la démo
  const extraDocs = snapshot.docs.filter((docSnapshot) => !DEMO_PRODUCT_IDS.has(docSnapshot.id));

  for (let start = 0; start < extraDocs.length; start += MAX_WRITES_PER_BATCH) {
    const deleteBatch = writeBatch(db);
    extraDocs.slice(start, start + MAX_WRITES_PER_BATCH).forEach((docSnapshot) => deleteBatch.delete(docSnapshot.ref));
    await deleteBatch.commit();
  }
}
