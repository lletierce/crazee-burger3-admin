/**
 * Lowercases and strips diacritics (accents). Without this, a user
 * typing "peche" (no accent, the easy keystroke) wouldn't match a
 * product named "Pêche" — and your actual data already has entries like
 * "Sauce Andalouse" where accents matter. `.normalize('NFD')` splits
 * accented characters into a base letter + a separate combining accent
 * mark, and the regex strips just the accent marks (Unicode range
 * U+0300–U+036F), leaving the plain base letters behind.
 *
 * Generic string utility, not product-specific — lives in shared/utils
 * so anything else that needs forgiving text matching later (search in
 * a future feature, an admin lookup, whatever) can reuse it instead of
 * re-deriving the same regex.
 */
export function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
