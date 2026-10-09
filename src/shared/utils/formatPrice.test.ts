import { describe, it, expect } from 'vitest';
import { formatPrice } from './formatPrice';

/**
 * Intl.NumberFormat (fr-FR) utilise des espaces insécables :
 * - U+00A0 avant le symbole €
 * - U+202F comme séparateur de milliers
 * On les remplace par des espaces normales pour écrire des attentes lisibles.
 */
const normalizeSpaces = (value: string) => value.replace(/\s/g, ' ');

describe('formatPrice', () => {
  it('formate un prix décimal en euros, au format français', () => {
    expect(normalizeSpaces(formatPrice(3.49))).toBe('3,49 €');
  });

  it('ajoute toujours deux décimales à un prix entier', () => {
    expect(normalizeSpaces(formatPrice(5))).toBe('5,00 €');
  });

  it('formate un prix nul', () => {
    expect(normalizeSpaces(formatPrice(0))).toBe('0,00 €');
  });

  it('arrondit au centime le plus proche', () => {
    expect(normalizeSpaces(formatPrice(2.999))).toBe('3,00 €');
  });

  it('sépare les milliers', () => {
    expect(normalizeSpaces(formatPrice(1234.5))).toBe('1 234,50 €');
  });
});
