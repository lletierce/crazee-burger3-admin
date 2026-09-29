/**
 * The three categories from the toolbar filter. A union of string literals
 * (not `string`, not an enum) so TypeScript can catch a typo like
 * 'Burgers' at compile time, and so the filter dropdown can be built by
 * just mapping over this array — one source of truth for both the type
 * and the UI options.
 */
export const PRODUCT_CATEGORIES = ['Burger', 'Boisson', 'Supplément'] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

/**
 * The fields the toolbar lets you sort by. Same reasoning as above: this
 * array drives both the type and the "trier par..." menu.
 */
export const PRODUCT_SORT_FIELDS = ['name', 'price', 'quantity', 'createdAt'] as const;
export type ProductSortField = (typeof PRODUCT_SORT_FIELDS)[number];

/**
 * French labels for each sort field. Exported so the toolbar (or
 * anything else that needs to display "currently sorted by X" as text)
 * can reuse the same mapping instead of re-deriving it.
 */
export const SORT_FIELD_LABELS: Record<ProductSortField, string> = {
  name: 'Nom',
  price: 'Prix',
  quantity: 'Quantité',
  createdAt: 'Date de création',
};

export type SortOrder = 'asc' | 'desc';


/**
 * A product as your APP understands it — this is the shape every
 * component and hook in this feature works with.
 *
 * Deliberately NOT the same type as "whatever Firestore gives back".
 * Firestore stores dates as `Timestamp` objects, not JS `Date`, and
 * document data arrives untyped (`DocumentData`). If we let that raw
 * shape leak into components, every component would need to know
 * Firestore-specific details (calling `.toDate()`, casting `any`, etc.).
 * Converting once at the data layer (next step) means the rest of the
 * app only ever sees this clean type.
 *
 * Fields are grouped by role rather than listed alphabetically or in
 * arrival order — it's a small thing, but it means anyone opening this
 * file for the first time reads it as "catalog data, then identity, then
 * lifecycle/state" instead of a flat wall of unrelated lines.
 */
export interface Product {
  // Catalog data — what the toolbar filters/sorts/searches on
  name: string;
  category: ProductCategory;
  price: number;
  quantity: number;
  imageUrl?: string;

  // Identity — how this product is referenced
  id: string;
  slug: string;

  // Lifecycle / state
  createdAt: Date;
  lastUpdated: Date;
  isAvailable: boolean;
  isPromoted: boolean;
}
