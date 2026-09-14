import type { ProductCategory } from '../types/product.types';

export interface ProductFormValues {
  name: string;
  category: ProductCategory | '';
  price: string;
  quantity: string;
  imageUrl: string;
  isAvailable: boolean;
  isPromoted: boolean;
}

export type ProductFormErrors = Partial<Record<'name' | 'category' | 'price' | 'quantity' | 'imageUrl', string>>;

/**
 * `\p{L}` and `\p{N}` (Unicode property escapes, hence the `u` flag) —
 * not `[a-zA-Z0-9]` — because real product names in this catalog carry
 * accents ("Sauce Andalouse" is fine, but something like "Café" would be
 * silently rejected by an ASCII-only pattern). The extra characters
 * allowed cover what already shows up in your data: parentheses and
 * commas ("Perrier (fraise, kiwi) 25cl"), apostrophes, hyphens.
 */
const NAME_PATTERN = /^[\p{L}\p{N}\s'(),.&-]{2,80}$/u;

/** A positive number with at most 2 decimal places: "12", "12.5", "12.50". */
const PRICE_PATTERN = /^\d+(\.\d{1,2})?$/;

/** A non-negative whole number: "0", "42" — not "4.5", not "-3". */
const QUANTITY_PATTERN = /^\d+$/;

/**
 * URL validation deliberately does NOT use a hand-rolled regex. Writing
 * a regex that correctly validates every legal URL (query strings,
 * ports, IPv6 hosts, encoded characters...) is a well-known way to
 * either reject valid URLs or accept broken ones — browsers already
 * ship a real, spec-compliant URL parser. Letting `new URL(...)` throw
 * on anything invalid is more correct than any regex we'd write here,
 * and far less code.
 */
function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function validateProductForm(values: ProductFormValues): {
  errors: ProductFormErrors;
  isValid: boolean;
} {
  const errors: ProductFormErrors = {};

  if (!NAME_PATTERN.test(values.name.trim())) {
    errors.name =
      'Le nom doit contenir entre 2 et 80 caractères (lettres, chiffres, espaces et ponctuation courante).';
  }

  if (!values.category) {
    errors.category = 'Choisis une catégorie.';
  }

  if (!PRICE_PATTERN.test(values.price.trim())) {
    errors.price = 'Le prix doit être un nombre positif, avec au plus 2 décimales (ex : 12.50).';
  }

  if (!QUANTITY_PATTERN.test(values.quantity.trim())) {
    errors.quantity = 'La quantité doit être un nombre entier positif ou nul.';
  }

  if (values.imageUrl.trim() && !isValidUrl(values.imageUrl.trim())) {
    errors.imageUrl = "L'URL de l'image n'est pas valide.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}
