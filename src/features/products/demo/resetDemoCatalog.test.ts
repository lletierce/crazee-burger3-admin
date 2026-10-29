import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DEMO_PRODUCTS } from './demoProducts';

/**
 * Firestore est entièrement simulé : chaque lot d'écritures (`writeBatch`)
 * est enregistré dans `batches`, ce qui permet de vérifier ce qui aurait été
 * écrit ou supprimé, et dans quel ordre, sans toucher à une vraie base.
 */
interface FakeWrite {
  type: 'set' | 'delete';
  id: string;
  data?: Record<string, unknown>;
}

const { batches, existingDocs } = vi.hoisted(() => ({
  batches: [] as FakeWrite[][],
  existingDocs: [] as { id: string; data: Record<string, unknown> }[],
}));

vi.mock('../../../app/firebase/firebase-config', () => ({ db: {} }));

vi.mock('firebase/firestore', () => {
  class FakeTimestamp {
    readonly iso: string;
    constructor(iso: string) {
      this.iso = iso;
    }
    static now() {
      return new FakeTimestamp('now');
    }
    static fromDate(date: Date) {
      return new FakeTimestamp(date.toISOString());
    }
  }

  return {
    Timestamp: FakeTimestamp,
    collection: () => ({ path: 'products' }),
    doc: (_ref: unknown, id: string) => ({ id }),
    getDocs: async () => ({
      docs: existingDocs.map(({ id, data }) => ({ id, ref: { id }, get: (field: string) => data[field] })),
    }),
    writeBatch: () => {
      const writes: FakeWrite[] = [];
      return {
        set: (ref: { id: string }, data: Record<string, unknown>) => writes.push({ type: 'set', id: ref.id, data }),
        delete: (ref: { id: string }) => writes.push({ type: 'delete', id: ref.id }),
        commit: async () => {
          batches.push(writes);
        },
      };
    },
  };
});

const { resetDemoCatalog } = await import('./resetDemoCatalog');

describe('resetDemoCatalog', () => {
  beforeEach(() => {
    batches.length = 0;
    existingDocs.length = 0;
  });

  it('restaure tous les produits de démo en un seul lot, avec leur slug', async () => {
    await resetDemoCatalog();

    const [restoreBatch] = batches;
    expect(restoreBatch).toHaveLength(DEMO_PRODUCTS.length);
    expect(restoreBatch.every((write) => write.type === 'set')).toBe(true);

    const deluxe = restoreBatch.find((write) => write.data?.name === 'Deluxe Burger');
    expect(deluxe?.data).toMatchObject({ slug: 'deluxe-burger', category: 'Burger' });
  });

  it("n'écrit que les champs autorisés par les règles Firestore", async () => {
    await resetDemoCatalog();

    const allowedKeys = ['name', 'category', 'price', 'quantity', 'imageUrl', 'slug', 'createdAt', 'lastUpdated', 'isAvailable', 'isPromoted'];
    for (const write of batches[0]) {
      expect(Object.keys(write.data ?? {}).every((key) => allowedKeys.includes(key))).toBe(true);
    }
  });

  it('conserve la date de création exacte des produits encore présents', async () => {
    const [firstDemo] = DEMO_PRODUCTS;
    const storedCreatedAt = { exact: 'valeur Firestore d’origine' };
    existingDocs.push({ id: firstDemo.id, data: { name: 'Nom vandalisé', createdAt: storedCreatedAt } });

    await resetDemoCatalog();

    const restored = batches[0].find((write) => write.id === firstDemo.id);
    expect(restored?.data?.createdAt).toBe(storedCreatedAt);
    expect(restored?.data?.name).toBe(firstDemo.name);
  });

  it("recrée un produit de démo supprimé avec sa date d'origine", async () => {
    const [firstDemo] = DEMO_PRODUCTS;

    await resetDemoCatalog();

    const restored = batches[0].find((write) => write.id === firstDemo.id);
    expect(restored?.data?.createdAt).toMatchObject({ iso: new Date(firstDemo.createdAt).toISOString() });
  });

  it('supprime les produits qui ne font pas partie de la démo, après la restauration', async () => {
    existingDocs.push({ id: 'ajoute-par-un-visiteur', data: {} }, { id: DEMO_PRODUCTS[0].id, data: {} });

    await resetDemoCatalog();

    expect(batches).toHaveLength(2);
    expect(batches[1]).toEqual([{ type: 'delete', id: 'ajoute-par-un-visiteur' }]);
  });

  it('découpe les suppressions en lots de 500 maximum', async () => {
    for (let index = 0; index < 1200; index++) {
      existingDocs.push({ id: `extra-${index}`, data: {} });
    }

    await resetDemoCatalog();

    const deleteBatches = batches.slice(1);
    expect(deleteBatches.map((batch) => batch.length)).toEqual([500, 500, 200]);
  });
});
