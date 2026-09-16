export function ProductPageSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6 md:flex-row">
      <div className="aspect-square w-full rounded-lg bg-neutral-200 md:w-80 md:shrink-0" />

      <div className="flex-1 space-y-3">
        <div className="h-4 w-24 rounded bg-neutral-200" />
        <div className="h-8 w-2/3 rounded bg-neutral-200" />
        <div className="h-4 w-40 rounded bg-neutral-200" />
        <div className="mt-4 h-6 w-32 rounded bg-neutral-200" />
      </div>
    </div>
  );
}
