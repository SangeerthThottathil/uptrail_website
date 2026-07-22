export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <div className="h-7 w-48 rounded bg-muted/65" />
        <div className="h-4 w-96 rounded bg-muted/50 mt-1" />
      </div>

      {/* Tabular Metric Card Skeleton */}
      <div className="rounded-xl border border-border bg-card p-0 overflow-hidden shadow-sm">
        <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-3 lg:grid-cols-6 sm:divide-y-0 sm:divide-x">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 flex flex-col justify-between h-20">
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 rounded bg-muted/65" />
                <div className="h-3.5 w-3.5 rounded-full bg-muted/50" />
              </div>
              <div className="h-6 w-8 rounded bg-muted/75" />
            </div>
          ))}
        </div>
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
