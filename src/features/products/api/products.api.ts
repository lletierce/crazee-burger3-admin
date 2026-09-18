import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  where,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../../../app/firebase/firebase-config';
import { productConverter } from './product.converter';
import type { Product, ProductCategory, ProductSortField, SortOrder } from '../types/product.types';
import { slugify } from '../../../shared/utils/slugify';

const productsCollection = collection(db, 'products').withConverter(productConverter);

export type ProductsPageCursor = QueryDocumentSnapshot<Product> | null;

interface FetchProductsPageParams {
  category?: ProductCategory;
  sortField?: ProductSortField;
  sortOrder?: SortOrder;
  cursor?: ProductsPageCursor;
  pageSize?: number;
}

interface ProductsPage {
  products: Product[];
  nextCursor: ProductsPageCursor;
  hasMore: boolean;
}

export async function fetchProductsPage({
  category,
  sortField = 'createdAt',
  sortOrder = 'desc',
  cursor = null,
  pageSize = 20,
}: FetchProductsPageParams = {}): Promise<ProductsPage> {
  const constraints: QueryConstraint[] = [];

  if (category) {
    constraints.push(where('category', '==', category));
  }

  constraints.push(orderBy(sortField, sortOrder));

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(pageSize + 1));

  const productsQuery = query(productsCollection, ...constraints);
  const snapshot = await getDocs(productsQuery);

  const hasMore = snapshot.docs.length > pageSize;
  const pageDocs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;

  return {
    products: pageDocs.map((docSnapshot) => docSnapshot.data()),
    nextCursor: pageDocs.at(-1) ?? null,
    hasMore,
  };
}

/**
 * `null` en retour (pas une exception) quand aucun produit ne correspond
 * — un slug qui ne matche rien est un résultat valide et attendu (lien
 * cassé, produit supprimé, faute de frappe dans l'URL), pas une erreur.
 * C'est exactement la distinction qu'un serveur fait entre un 404 et un
 * 500 : `useProduct` (juste après) s'appuie là-dessus pour distinguer
 * "produit introuvable" de "quelque chose a vraiment planté".
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const snapshot = await getDocs(query(productsCollection, where('slug', '==', slug), limit(1)));
  return snapshot.empty ? null : snapshot.docs[0].data();
}

/** 
 * Cette erreur est utilisée à la place d'un `Error` générique afin que
 * le formulaire puisse distinguer un slug déjà utilisé d'une erreur réseau
 * ou d'un autre type d'échec, et réagir différemment à chacun
 * (erreur sur le champ concerné ou message d'erreur général).
 * 
 * Un `Error` classique avec un message spécifique fonctionnerait également,
 * mais comparer des messages sous forme de chaînes de caractères est fragile :
 * le message pourrait être reformulé ultérieurement pour des raisons de
 * wording et casser silencieusement cette logique.
 * 
 * Avec `instanceof SlugAlreadyExistsError`, cette distinction repose sur
 * le type de l'erreur et ne dépend pas de son message. 
 */
export class SlugAlreadyExistsError extends Error {
  readonly slug: string;

  constructor(slug: string) {
    super(`Un produit avec le slug "${slug}" existe déjà.`);
    this.name = 'SlugAlreadyExistsError';
    this.slug = slug;
  }
}

/**
 *  Données fournies par l'appelant pour créer un produit.
 * 
 * On n'utilise volontairement PAS le type `Product` complet. 
 * `id`, `slug`, `createdAt` et `lastUpdated` sont tous calculés ici et
 * ne doivent donc pas être fournis par le formulaire :
 * 
 * - `id` est généré par Firestore ;
 * - `slug` est dérivé du nom du produit ;
 * - `createdAt` et `lastUpdated` correspondent à la date actuelle.
 * 
 * Autoriser l'appelant à fournir ces valeurs pourrait notamment permettre 
 * à un formulaire de définir `createdAt` à partir de l'horloge de son
 * propre client. 
*/
export interface NewProductInput {
  name: string;
  category: ProductCategory;
  price: number;
  quantity: number;
  imageUrl?: string;
  isAvailable: boolean;
  isPromoted: boolean;
}

/**
 * Creates a product, enforcing a unique slug.
 *
 * Two Firestore techniques worth understanding:
 *
 * 1. `doc(productsCollection)` — called WITHOUT a third argument —
 *    generates a fresh, globally-unique document reference (and its
 *    `.id`) entirely client-side, with no network round trip. This is
 *    what lets us build the *complete* `Product` object — including its
 *    final `id` — before a single byte is sent to Firestore, rather than
 *    writing first and only learning the id afterward.
 *
 * 2. The uniqueness check (`where('slug', '==', slug)`) then the write
 *    are two separate round trips, not one atomic operation — there's a
 *    theoretical (very small) race window between them. As discussed
 *    when this design was chosen: acceptable for an internal admin tool
 *    with a handful of simultaneous users, not something a
 *    public-facing signup flow could get away with.
 */
export async function createProduct(input: NewProductInput): Promise<Product> {
  const slug = slugify(input.name);

  const existing = await getDocs(query(productsCollection, where('slug', '==', slug), limit(1)));
  if (!existing.empty) {
    throw new SlugAlreadyExistsError(slug);
  }

  const now = new Date();
  const docRef = doc(productsCollection);

  const newProduct: Product = {
    id: docRef.id,
    slug,
    createdAt: now,
    lastUpdated: now,
    ...input,
  };

  // Goes through productConverter.toFirestore, which strips `id` before
  // writing — same converter, same rule, as every other write to this
  // collection.
  await setDoc(docRef, newProduct);

  return newProduct;
}

/**
 * Deletion doesn't need a slug check or any read beforehand — unlike
 * `createProduct`, there's no uniqueness constraint to protect and no
 * derived data to compute. It's the simplest write operation in this
 * file: one write, that's it.
 */
export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(productsCollection, id));
}

/**
 * What the caller gets back after an update — deliberately NOT the full
 * `Product`. The caller (EditProductModal) already has the product it
 * just edited; the only two things it genuinely can't know on its own
 * are the two fields THIS function computes: the (possibly changed)
 * slug, and the new `lastUpdated` timestamp. Returning just these two
 * avoids an unnecessary extra Firestore read to fetch the full document
 * back after writing it.
 */
interface UpdateProductResult {
  slug: string;
  lastUpdated: Date;
}


// export async function updateProduct(id: string, input: NewProductInput): Promise<UpdateProductResult> {
//   const slug = slugify(input.name);

//   const existing = await getDocs(query(productsCollection, where('slug', '==', slug), limit(2)));
//   const conflictsWithAnotherProduct = existing.docs.some((docSnapshot) => docSnapshot.id !== id);
//   if (conflictsWithAnotherProduct) {
//     throw new SlugAlreadyExistsError(slug);
//   }

//   const lastUpdated = new Date();
//   const docRef = doc(productsCollection, id);

//   // Goes through productConverter.toFirestore too, same as every other
//   // write — including the undefined-stripping fix from earlier.
//   await updateDoc(docRef, { ...input, slug, lastUpdated });

//   return { slug, lastUpdated };
// }

export async function updateProduct(id: string, input: NewProductInput): Promise<UpdateProductResult> {
  const slug = slugify(input.name);

  const existing = await getDocs(query(productsCollection, where('slug', '==', slug), limit(2)));
  const conflictsWithAnotherProduct = existing.docs.some((docSnapshot) => docSnapshot.id !== id);
  if (conflictsWithAnotherProduct) {
    throw new SlugAlreadyExistsError(slug);
  }

  const lastUpdated = new Date();
  const docRef = doc(productsCollection, id);

  // `setDoc(..., { merge: true })`, PAS `updateDoc` : updateDoc()
  // n'appelle jamais le converter d'une référence Firestore, même
  // quand `.withConverter()` a été attaché à la collection — un
  // comportement du SDK peu intuitif, mais documenté. setDoc avec
  // merge, lui, passe bien par `toFirestore()` (sa deuxième
  // signature, celle en PartialWithFieldValue) — exactement celle
  // qui contient déjà le filtrage des valeurs `undefined`. Même
  // résultat qu'une mise à jour partielle (les champs non fournis,
  // comme `createdAt`, restent intacts), mais par le bon chemin.
  await setDoc(docRef, { ...input, slug, lastUpdated }, { merge: true });

  return { slug, lastUpdated };
}