import { describe, it, expect } from 'vitest';
import { DEMO_PRODUCTS } from './demoProducts';
import { PRODUCT_CATEGORIES } from '../types/product.types';
import { slugify } from '../../../shared/utils/slugify';

/**
 * Ces tests reprennent les contraintes de `isValidProduct` (firestore.rules) :
 * un produit de démo invalide ferait échouer TOUTE la réinitialisation
 * (le lot d'écritures est refusé en bloc). Mieux vaut le découvrir ici.
 */
describe('DEMO_PRODUCTS', () => {
  it('contient des produits de chaque catégorie', () => {
    for (const category of PRODUCT_CATEGORIES) {
      expect(DEMO_PRODUCTS.some((product) => product.category === category)).toBe(true);
    }
  });

  it('a des identifiants uniques', () => {
    const ids = DEMO_PRODUCTS.map((product) => product.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('a des slugs uniques et non vides', () => {
    const slugs = DEMO_PRODUCTS.map((product) => slugify(product.name));
    expect(slugs.every((slug) => slug.length > 0)).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(DEMO_PRODUCTS.map((product) => [product.name, product] as const))(
    '« %s » respecte les règles Firestore',
    (_name, product) => {
      expect(product.name.length).toBeGreaterThanOrEqual(2);
      expect(product.name.length).toBeLessThanOrEqual(80);
      expect(PRODUCT_CATEGORIES).toContain(product.category);
      expect(product.price).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(product.quantity)).toBe(true);
      expect(product.quantity).toBeGreaterThanOrEqual(0);
      expect(product.imageUrl).toMatch(/^https:\/\//);
      expect(Number.isNaN(new Date(product.createdAt).getTime())).toBe(false);
    },
  );
});
