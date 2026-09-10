import {
  type DocumentData,
  type FirestoreDataConverter,
  type PartialWithFieldValue,
  type QueryDocumentSnapshot,
  type SetOptions,
  type SnapshotOptions,
  type WithFieldValue,
} from 'firebase/firestore';
import type { Product } from '../types/product.types';

/**
 * Minimal shape of a Firestore Timestamp: an object with a `toDate()`
 * method. Checked structurally instead of via `instanceof Timestamp`.
 */
interface TimestampLike {
  toDate: () => Date;
}

function isTimestampLike(value: unknown): value is TimestampLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as TimestampLike).toDate === 'function'
  );
}

/**
 * Turns a raw Firestore value into a `Date`, safely.
 *
 * IMPORTANT: this deliberately checks "does this object have a
 * `toDate()` method" (structural / duck typing) rather than
 * `value instanceof Timestamp`. `instanceof` compares against one
 * SPECIFIC class reference — if the project ends up with two copies of
 * the Firebase SDK in `node_modules` (a "dual package hazard": a
 * transitive dependency pulling its own `firebase` version, a version
 * mismatch, a monorepo symlink...), there end up being two distinct
 * `Timestamp` classes in memory. The object Firestore actually hands
 * back was built by "the other one", so `instanceof` silently returns
 * `false` even though the object is a perfectly valid, real Timestamp
 * with a working `.toDate()`. This is exactly the failure mode where
 * every single document fails the same way, even ones you've verified
 * are correctly typed in the Firestore console — the data was never the
 * problem, the identity check was.
 *
 * `console.warn` still fires for genuinely missing/invalid data (e.g. a
 * document where the field is truly absent, or holds a string instead
 * of a timestamp), so this stays a real safety net — it just no longer
 * false-positives on a module-duplication issue.
 */
function toDateSafe(value: unknown, fieldName: string, docId: string): Date {
  if (isTimestampLike(value)) {
    return value.toDate();
  }

  console.warn(
    `[productConverter] Document "${docId}" has an invalid or missing "${fieldName}" field — using a fallback date. Check this document in Firestore.`,
  );
  return new Date(0);
}

/**
 * The bridge between "what Firestore stores" and "what the app works
 * with" (the `Product` type). Every read and every write to the
 * `products` collection goes through this — it's attached to the
 * collection reference with `.withConverter(productConverter)`, so the
 * rest of the codebase never sees a raw Firestore document.
 */
export const productConverter: FirestoreDataConverter<Product> = {
  /**
   * Product -> Firestore document data (writes).
   *
   * `id` is stripped before writing: it comes from `snapshot.id` (the
   * document's own address), not from a field inside it. Writing it
   * again would duplicate that information.
   */
  toFirestore(
    product: WithFieldValue<Product> | PartialWithFieldValue<Product>,
    _options?: SetOptions,
  ): DocumentData {
    const { id, ...data } = product as WithFieldValue<Product>;
    return data;
  },

  /**
   * Firestore document -> Product (reads).
   *
   * Rebuilt field by field (not spread + cast) so a renamed/missing
   * field is caught by TypeScript here, and `createdAt`/`lastUpdated`
   * go through `toDateSafe` instead of a blind assertion.
   */
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Product {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      name: data.name,
      category: data.category,
      price: data.price,
      quantity: data.quantity,
      imageUrl: data.imageUrl,
      slug: data.slug,
      isAvailable: data.isAvailable,
      isPromoted: data.isPromoted,
      createdAt: toDateSafe(data.createdAt, 'createdAt', snapshot.id),
      lastUpdated: toDateSafe(data.lastUpdated, 'lastUpdated', snapshot.id),
    };
  },
};