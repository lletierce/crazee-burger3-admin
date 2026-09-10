/**
 * `Intl.NumberFormat` instances are relatively expensive to construct —
 * they parse locale data on creation. Creating one at module scope means
 * it's built once when this file is first imported, and every call to
 * `formatPrice` afterward reuses it. Creating it INSIDE the function
 * (`new Intl.NumberFormat(...)` on every call) would rebuild it on every
 * single render of every card — wasted work that's easy to avoid.
 */
const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}
