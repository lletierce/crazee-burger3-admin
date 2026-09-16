import { Link } from "react-router";

interface NotFoundPageProps {
  title?: string;
  message?: string;
  backHref?: string;
  backLabel?: string;
}

/**
 * Generic, with sensible defaults — usable as-is for a catch-all route
 * (`<Route path="*" element={<NotFoundPage />} />`), or customized with
 * product-specific wording when a slug matches nothing. Same reasoning
 * as `Breadcrumbs` and `Modal`: this belongs in shared/ because a real
 * second use case exists right now, not as a guess about future reuse.
 */
export default function NotFoundPage({
  title = 'Page introuvable',
  message = "La page que tu cherches n'existe pas ou plus.",
  backHref = '/',
  backLabel = "Retour à l'accueil",
}: NotFoundPageProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="text-lg font-semibold text-neutral-900">{title}</p>
      <p className="text-sm text-neutral-600">{message}</p>
      <Link to={backHref} className="mt-2 text-sm font-medium text-neutral-900 hover:underline">
        {backLabel}
      </Link>
    </div>
  );
}
