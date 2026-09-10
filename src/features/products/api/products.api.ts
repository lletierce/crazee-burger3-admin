import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../../../app/firebase/firebase-config';

import { productConverter } from './product.converter';
import type { Product, ProductCategory, ProductSortField, SortOrder } from '../types/product.types';

/**
 * The typed collection reference. `withConverter` is what makes every
 * `getDocs`/`getDoc` on this reference return `Product` objects directly
 * (already passed through `fromFirestore`), and every `setDoc`/`updateDoc`
 * on it accept a `Product`-shaped object (passed through `toFirestore`).
 * This is the ONE place `collection(db, 'products')` is called — every
 * query in this file (and later, create/update/delete) builds on top of
 * this reference instead of repeating the collection name as a raw
 * string.
 */
const productsCollection = collection(db, 'products').withConverter(productConverter);

/**
 * A page cursor is just "the last document you saw". We type it against
 * `Product` (not `DocumentData`) because it comes from a converted,
 * typed query — keeping that type attached avoids an implicit `any`
 * leaking into the hook that will call this function next.
 */
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

/**
 * Fetches one page of products, filtered and sorted server-side.
 *
 * Two things worth understanding in detail:
 *
 * 1. Constraints are built as an array and spread into `query()`, instead
 *    of nesting ternaries directly in the call. Firestore's `query()`
 *    doesn't accept `undefined` as a constraint slot, so "only filter by
 *    category if one was given" has to be expressed as "only push a
 *    `where()` into the array if `category` is truthy" — an array you
 *    build conditionally, then spread, reads far better than trying to
 *    inline that logic argument-by-argument.
 *
 * 2. We ask Firestore for `pageSize + 1` documents, not `pageSize`. This
 *    is how `hasMore` is computed reliably: if we asked for exactly 20
 *    and got exactly 20 back, we genuinely don't know whether a 21st
 *    product exists or the catalog ends exactly there — the "voir plus"
 *    button would show even on the last page, and clicking it would
 *    just return an empty page. By asking for 21 and slicing off the
 *    extra one before returning, `hasMore` becomes a fact, not a guess.
 */
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
    products: pageDocs.map((doc) => doc.data()),
    nextCursor: pageDocs.at(-1) ?? null,
    hasMore,
  };
}
