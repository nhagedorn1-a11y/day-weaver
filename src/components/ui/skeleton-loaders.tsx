export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-muted/50 animate-pulse ${className}`} />
  );
}

export function SkeletonText({ width = 'w-24', className = '' }: { width?: string; className?: string }) {
  return (
    <div className={`h-4 rounded-lg bg-muted/50 animate-pulse ${width} ${className}`} />
  );
}

export function ScheduleSkeleton() {
  return (
    <div className="space-y-3 stagger-children">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card/50">
          <div className="w-14 h-4 rounded bg-muted/50 animate-pulse" />
          <div className="w-10 h-10 rounded-xl bg-muted/50 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-muted/50 animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-muted/50 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TokenProgressSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-muted/50" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 rounded bg-muted/50" />
        <div className="h-2.5 w-full rounded-full bg-muted/50" />
      </div>
      <div className="w-10 h-10 rounded-xl bg-muted/50" />
    </div>
  );
}

export function NowCardSkeleton() {
  return (
    <div className="rounded-3xl bg-muted/30 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-5">
        <div className="h-6 w-16 rounded-full bg-muted/50" />
        <div className="h-6 w-12 rounded-full bg-muted/50" />
      </div>
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-muted/50" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-3/4 rounded bg-muted/50" />
          <div className="h-4 w-20 rounded bg-muted/50" />
        </div>
      </div>
      <div className="mt-6 h-14 w-full rounded-2xl bg-muted/50" />
    </div>
  );
}
