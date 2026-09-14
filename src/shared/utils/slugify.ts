import { normalizeForSearch } from './normalizeForSearch';

/**
 * "Sauce Andalouse" -> "sauce-andalouse". Reuses `normalizeForSearch`
 * (lowercase + strip accents) rather than re-deriving the same
 * transformation — the two operations overlap almost entirely, slugify
 * just adds the punctuation-to-hyphen step on top.
 */
export function slugify(value: string): string {
  return normalizeForSearch(value)
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}