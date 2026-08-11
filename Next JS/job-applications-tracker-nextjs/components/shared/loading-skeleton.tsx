import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-soft">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function StatGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: count }, (_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6",
        className,
      )}
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-[220px] w-full rounded-lg" />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <Skeleton className="h-4 w-36" />
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-2/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      <div className="border-b border-border bg-muted/40 px-4 py-3">
        <Skeleton className="h-3.5 w-40" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <Skeleton className="size-4 shrink-0 rounded" />
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="hidden h-5 w-24 rounded-full sm:block" />
            <Skeleton className="hidden h-3.5 w-20 md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Detail-page shape: header block, then a wide main column beside a narrow
 * sidebar. Used by the application detail and edit routes, which await a single
 * query before rendering anything.
 */
export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-3.5 w-28" />

      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex gap-4">
          <Skeleton className="size-16 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3.5 w-32" />
            <div className="flex flex-wrap gap-2 pt-1">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-6">
          <ListSkeleton rows={3} />
          <ListSkeleton rows={3} />
        </div>
      </div>
    </div>
  );
}
