import { Link } from "react-router";

interface BreadcrumbItem {
  label: string;
  /** Omit `to` for the current page — it renders as plain text, not a link. */
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Generic (a list of label/link pairs), not "the product page's
 * breadcrumb" — the same component will fit anywhere else in the app
 * that needs a trail (an order detail page, a future settings section),
 * without knowing anything about products.
 *
 * `aria-current="page"` on the last item: the standard way to tell
 * assistive tech "this is where the user currently is" in a breadcrumb
 * trail, distinct from the clickable ancestors before it.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && (
              <span aria-hidden="true" className="text-neutral-300">
                /
              </span>
            )}
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-neutral-900 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-medium text-neutral-900' : ''}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
