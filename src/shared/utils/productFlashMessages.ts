/**
 * Extracted once a second real caller needed the exact same formatting
 * (ProductPage's post-delete-and-redirect message, ProductsPage's
 * post-create and post-delete-in-place messages) — not extracted
 * pre-emptively. `'modifié'` is included now even though nothing calls
 * it yet, because the edit feature is already planned and will need the
 * identical shape; the small win here (three related strings living in
 * one type-checked place) is worth it precisely because all three
 * exist for a real, known reason.
 */
export function formatProductFlashMessage(
  productName: string,
  action: 'ajouté' | 'supprimé' | 'modifié',
): string {
  return `« ${productName} » a été ${action}.`;
}
