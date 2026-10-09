import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import type { Product } from '../types/product.types';
import { ProductCard } from './ProductCard';

/**
 * Fabrique un produit de test.
 * Les "overrides" permettent de modifier seulement les champs utiles à chaque test.
 * ⚠️ Adapte les champs à ton type Product si besoin (id, createdAt, lastUpdated…).
 */
function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'product-1',
    name: 'Burger Smoke BBQ',
    category: 'Burger',
    price: 5.6,
    quantity: 12,
    imageUrl: 'https://example.com/burger.png',
    slug: 'burger-smoke-bbq',
    isAvailable: true,
    isPromoted: false,
    ...overrides,
  } as Product;
}

/** Le composant utilise <Link>, qui doit être rendu à l'intérieur d'un routeur. */
function renderCard(props: Partial<Parameters<typeof ProductCard>[0]> = {}) {
  const product = props.product ?? createProduct();
  render(
    <MemoryRouter>
      <ProductCard product={product} {...props} />
    </MemoryRouter>,
  );
  return { product };
}

describe('ProductCard', () => {
  describe('affichage des informations', () => {
    it('affiche le nom, la catégorie, le prix et la quantité', () => {
      renderCard();

      expect(screen.getByRole('heading', { name: 'Burger Smoke BBQ' })).toBeInTheDocument();
      expect(screen.getByText('Burger')).toBeInTheDocument();
      expect(screen.getByText('5,60 €')).toBeInTheDocument();
      expect(screen.getByText('Qté : 12')).toBeInTheDocument();
    });

    it("affiche l'image du produit avec un texte alternatif", () => {
      renderCard();

      const image = screen.getByRole('img', { name: 'Burger Smoke BBQ' });
      expect(image).toHaveAttribute('src', 'https://example.com/burger.png');
    });

    it("affiche un texte de remplacement quand le produit n'a pas d'image", () => {
      renderCard({ product: createProduct({ imageUrl: undefined }) });

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByText("Pas d'image")).toBeInTheDocument();
    });
  });

  describe('badges', () => {
    it('affiche le badge "En avant" pour un produit mis en avant', () => {
      renderCard({ product: createProduct({ isPromoted: true }) });

      expect(screen.getByText('En avant')).toBeInTheDocument();
    });

    it('n\'affiche pas le badge "En avant" pour un produit standard', () => {
      renderCard();

      expect(screen.queryByText('En avant')).not.toBeInTheDocument();
    });

    it('affiche "Indisponible" pour un produit indisponible', () => {
      renderCard({ product: createProduct({ isAvailable: false }) });

      expect(screen.getByText('Indisponible')).toBeInTheDocument();
    });

    it('n\'affiche pas "Indisponible" pour un produit disponible', () => {
      renderCard();

      expect(screen.queryByText('Indisponible')).not.toBeInTheDocument();
    });
  });

  describe('suppression', () => {
    it("n'affiche pas le bouton de suppression sans la prop onDelete", () => {
      renderCard();

      expect(screen.queryByRole('button', { name: /supprimer/i })).not.toBeInTheDocument();
    });

    it('appelle onDelete avec le produit lors du clic sur le bouton', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      const { product } = renderCard({ onDelete });

      await user.click(screen.getByRole('button', { name: 'Supprimer Burger Smoke BBQ' }));

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith(product);
    });
  });

  describe('navigation', () => {
    it('rend la carte cliquable vers la bonne URL quand "to" est fourni', () => {
      renderCard({ to: '/products/burger-smoke-bbq' });

      expect(screen.getByRole('link')).toHaveAttribute('href', '/products/burger-smoke-bbq');
    });

    it('rend une carte non cliquable sans la prop "to"', () => {
      renderCard();

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });
});
