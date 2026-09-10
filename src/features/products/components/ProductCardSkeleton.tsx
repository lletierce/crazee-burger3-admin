/**
 * Deliberately mirrors ProductCard's structure element-for-element
 * (same aspect-square image area, same badge-height gap, same three text
 * lines) rather than being "a generic gray box". A skeleton that matches
 * the real layout's proportions reads as "this exact content is coming",
 * which feels faster and more polished than a shape that doesn't match
 * what's about to replace it — and it means the page doesn't visibly
 * jump in height once real cards swap in.
 *
 * `animate-pulse` is a built-in Tailwind utility (no extra CSS needed):
 * it fades the opacity in and out on a loop, the universal visual
 * language for "this is a placeholder, not broken content".
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="aspect-square w-full animate-pulse bg-neutral-200" />

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-200" />

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="h-4 w-12 animate-pulse rounded bg-neutral-200" />
          <div className="h-3 w-10 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
