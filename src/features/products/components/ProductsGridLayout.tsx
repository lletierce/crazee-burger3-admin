import type { ReactNode } from 'react';

interface ProductsGridLayoutProps {
  children: ReactNode;
}

export function ProductsGridLayout({ children }: ProductsGridLayoutProps) {
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{children}</div>;
}