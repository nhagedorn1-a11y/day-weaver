import { useState } from 'react';
import { Task } from '@/types/jackos';
import { ChevronRight, Lock, Check, Star, Clock } from 'lucide-react';

interface NowNextLaterProps {
  now: Task | null;
  next: Task | null;
  later: Task[];
  onComplete: (taskId: string) => void;
  isLocked?: boolean;
}

const iconMap: Record<string, string> = {
  breakfast: '🍳',
  teeth: '🦷',
  dress: '👕',
  backpack: '🎒',
  reading: '📖',
  homework: '✏️',
  play: '🎮',
  bath: '🛁',
  bed: '🌙',
  calm: '🧘',
  brave: '🦁',
  snack: '🍎',
  walk: '🚶',
  music: '🎵',
  art: '🎨',
  outside: '🌳',
};

export function NowNextLater({ now, next, later, onComplete, isLocked = false }: NowNextLaterProps) {
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleSwipeComplete = () => {
    if (now && !isLocked) {
      onComplete(now.id);
      setSwipeProgress(0);
      setIsSwiping(false);
    }
  };

  const handleTouchStart = () => {
    if (!isLocked) setIsSwiping(true);
  };

  const handleTouchEnd = () => {
    if (swipeProgress > 0.7) {
      handleSwipeComplete();
    } else {
      setSwipeProgress(0);
    }
    setIsSwiping(false);
  };

  return (
    <div className="space-y-4">
      {/* NOW Card - Hero prominence */}
      {now && (
        <div
          className="relative overflow-hidden rounded bg-now shadow-xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe progress overlay */}
          <div
            className="absolute inset-0 bg-calm/40 transition-transform origin-left"
            style={{ transform: `scaleX(${swipeProgress})` }}
          />

          <div className="relative z-10 p-6">
            {/* Header with badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded bg-white/20 backdrop-blur-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-now-foreground">
                    Now
                  </span>
                </div>
                {isLocked && (
                  <div className="flex items-center gap-1 text-now-foreground/70">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/20 backdrop-blur-sm">
                <Star className="w-4 h-4 text-token" fill="currentColor" />
                <span className="font-mono font-bold text-now-foreground">{now.tokens}</span>
              </div>
            </div>

            {/* Main content with large icon */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-inner">
                <span className="text-5xl" role="img" aria-label={now.title}>
                  {iconMap[now.icon] || '⭐'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-now-foreground leading-tight">
                  {now.title}
                </h2>
                {now.duration && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/10">
                      <Clock className="w-3.5 h-3.5 text-now-foreground/80" />
                      <span className="font-mono text-sm text-now-foreground/90">{now.duration} min</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Complete button */}
            {!isLocked && (
              <button
                onClick={handleSwipeComplete}
                className="mt-6 w-full py-4 rounded bg-white/20 backdrop-blur-sm text-now-foreground font-bold flex items-center justify-center gap-3 hover:bg-white/30 active:scale-[0.98] transition-all shadow-lg border border-white/10"
              >
                <Check className="w-6 h-6" />
                <span className="text-lg">All Done!</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* NEXT Card - Clean card with subtle accent */}
      {next && (
        <div className="relative overflow-hidden rounded bg-next border border-next/30 shadow-lg">
          <div className="relative p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-next-foreground/70">
                Up Next
              </span>
              <div className="flex items-center gap-1 text-next-foreground/70">
                <Star className="w-3.5 h-3.5" />
                <span className="font-mono text-sm">{next.tokens}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded bg-white/10 flex items-center justify-center">
                <span className="text-3xl">{iconMap[next.icon] || '⭐'}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-next-foreground">{next.title}</h3>
                {next.duration && (
                  <span className="text-next-foreground/60 text-sm font-mono">
                    {next.duration} min
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LATER Cards - Horizontal scroll with frosted glass look */}
      {later.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Coming Later
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {later.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="flex-shrink-0 min-w-[130px] p-4 rounded bg-card/80 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center mb-2">
                  <span className="text-xl">{iconMap[task.icon] || '⭐'}</span>
                </div>
                <span className="font-medium text-sm text-foreground/80 line-clamp-2">{task.title}</span>
              </div>
            ))}
            {later.length > 4 && (
              <div className="flex-shrink-0 min-w-[80px] p-4 rounded bg-muted/50 border border-dashed border-border flex items-center justify-center">
                <span className="text-sm text-muted-foreground font-medium">
                  +{later.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All done state - Celebration */}
      {!now && !next && later.length === 0 && (
        <div className="text-center py-16 px-6">
          <div className="relative inline-block">
            <div className="text-7xl mb-4">🌟</div>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-primary">
            All Done Today!
          </h2>
          <p className="text-muted-foreground text-lg">You did amazing!</p>
        </div>
      )}
    </div>
  );
}
