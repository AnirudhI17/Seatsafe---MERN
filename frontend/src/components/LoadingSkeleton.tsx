interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-800/70 ${className ?? ''}`}
    />
  )
}

export function EventCardSkeletonGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={idx} className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4">
          <Skeleton className="h-40 w-full rounded-xl bg-slate-800/80" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  )
}

