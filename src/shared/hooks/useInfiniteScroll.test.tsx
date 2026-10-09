import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useInfiniteScroll } from './useInfiniteScroll';

/**
 * jsdom ne calcule aucun affichage : il ne fournit donc pas
 * IntersectionObserver. On le remplace par une fausse version que l'on
 * pilote à la main, avec `trigger(true)` pour simuler « l'élément entre
 * dans l'écran ».
 */
class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit | undefined;
  observed: Element[] = [];
  isDisconnected = false;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    FakeIntersectionObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observed.push(element);
  }

  disconnect() {
    this.isDisconnected = true;
  }

  unobserve() {}

  takeRecords() {
    return [];
  }

  trigger(isIntersecting: boolean) {
    const entries = this.observed.map(
      (target) => ({ isIntersecting, target }) as IntersectionObserverEntry,
    );
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

function lastObserver() {
  return FakeIntersectionObserver.instances[FakeIntersectionObserver.instances.length - 1];
}

/** Petit composant de test qui utilise le hook comme le ferait une vraie page. */
function Sentinel({ onLoadMore, enabled }: { onLoadMore: () => void; enabled: boolean }) {
  const sentinelRef = useInfiniteScroll({ onLoadMore, enabled });
  return <div ref={sentinelRef} data-testid="sentinel" />;
}

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("observe l'élément sentinelle", () => {
    const { getByTestId } = render(<Sentinel onLoadMore={vi.fn()} enabled />);

    expect(lastObserver().observed).toEqual([getByTestId('sentinel')]);
  });

  it('appelle onLoadMore quand la sentinelle devient visible', () => {
    const onLoadMore = vi.fn();
    render(<Sentinel onLoadMore={onLoadMore} enabled />);

    lastObserver().trigger(true);

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas onLoadMore tant que la sentinelle n'est pas visible", () => {
    const onLoadMore = vi.fn();
    render(<Sentinel onLoadMore={onLoadMore} enabled />);

    lastObserver().trigger(false);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("arrête d'observer juste après avoir déclenché un chargement", () => {
    render(<Sentinel onLoadMore={vi.fn()} enabled />);

    lastObserver().trigger(true);

    expect(lastObserver().isDisconnected).toBe(true);
  });

  it("n'observe rien quand le chargement est désactivé", () => {
    render(<Sentinel onLoadMore={vi.fn()} enabled={false} />);

    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it("observe de nouveau quand le chargement est réactivé (page suivante chargée)", () => {
    const onLoadMore = vi.fn();
    const { rerender } = render(<Sentinel onLoadMore={onLoadMore} enabled />);
    lastObserver().trigger(true);

    // Pendant le chargement de la page suivante...
    rerender(<Sentinel onLoadMore={onLoadMore} enabled={false} />);
    // ...puis une fois la page arrivée.
    rerender(<Sentinel onLoadMore={onLoadMore} enabled />);
    lastObserver().trigger(true);

    expect(FakeIntersectionObserver.instances).toHaveLength(2);
    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });

  it('se déconnecte quand le composant est démonté', () => {
    const { unmount } = render(<Sentinel onLoadMore={vi.fn()} enabled />);

    unmount();

    expect(lastObserver().isDisconnected).toBe(true);
  });
});
