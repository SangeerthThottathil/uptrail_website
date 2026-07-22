export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <div className="h-7 w-48 rounded bg-muted/65" />
        <div className="h-4 w-96 rounded bg-muted/50 mt-1" />
      </div>

      {/* Grid of Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
            <div className="h-8 w-12 rounded bg-muted/65" />
            <div className="h-4 w-24 rounded bg-muted/50 mt-2" />
          </div>
        ))}
      </div>

      {/* Large Content Panels Skeletons */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((panel) => (
          <div key={panel} className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="h-5 w-36 rounded bg-muted/65" />
              <div className="h-5 w-12 rounded bg-muted/50" />
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center justify-between py-2">
                  <div className="flex flex-col gap-1.5">
                    <div className="h-4 w-32 rounded bg-muted/65" />
                    <div className="h-3 w-48 rounded bg-muted/50" />
                  </div>
                  <div className="h-5 w-16 rounded bg-muted/50" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
