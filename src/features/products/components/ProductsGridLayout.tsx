import type { ReactNode } from 'react';

interface ProductsGridLayoutProps {
  children: ReactNode;
}

/**
 * Just the responsive grid classes, extracted into their own component.
 *
 * Why this exists as a separate file instead of a shared string constant:
 * `ProductsGrid` (real cards) and `ProductsGridSkeleton` (loading
 * placeholders) need to look like the EXACT same grid — same column
 * counts at every breakpoint — or the page visibly "jumps" the instant
 * real data replaces the skeleton. Copy-pasting the class string into
 * both files works today, but the day someone tweaks one (say, adds an
 * `xl:grid-cols-6`) and forgets the other, they silently drift apart.
 * One component used by both makes that impossible.
 */
export default function ProductsGridLayout({ children }: ProductsGridLayoutProps) {
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{children}</div>;
}
