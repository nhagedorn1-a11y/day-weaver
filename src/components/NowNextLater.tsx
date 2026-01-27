import { useState } from 'react';
import { Task } from '@/types/jackos';
import { ChevronRight, Lock, Check, Star, Clock } from 'lucide-react';

interface NowNextLaterProps {
  now: Task | null;
  next: Task | null;
  later: Task[];
  onComplete: (taskId: string) => void;
  isLocked?: boolean; // Cards immutable during task
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

  // Simplified swipe detection
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
      {/* NOW Card - Big and prominent */}
      {now && (
        <div
          className="task-card-now relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe progress overlay */}
          <div
            className="absolute inset-0 bg-calm/30 transition-transform origin-left"
            style={{ transform: `scaleX(${swipeProgress})` }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="hw-label text-now-foreground/70">Now</span>
              {isLocked && (
                <div className="flex items-center gap-1 text-now-foreground/50">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs">In progress</span>
                </div>
              )}
            </div>

            {/* Main content */}
            <div className="flex items-center gap-5">
              <div className="text-5xl" role="img" aria-label={now.title}>
                {iconMap[now.icon] || '⭐'}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold">{now.title}</h2>
                {now.duration && (
                  <div className="flex items-center gap-1.5 mt-1 text-now-foreground/70">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">{now.duration} min</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5" />
                <span className="font-mono font-bold">{now.tokens}</span>
              </div>
            </div>

            {/* Swipe hint */}
            {!isLocked && (
              <div className="mt-6 flex items-center justify-center gap-2 text-now-foreground/60">
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm">Swipe or tap when done</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}

            {/* Complete button for non-touch */}
            {!isLocked && (
              <button
                onClick={handleSwipeComplete}
                className="mt-4 w-full py-4 rounded-2xl bg-now-foreground/20 text-now-foreground font-semibold flex items-center justify-center gap-2 hover:bg-now-foreground/30 transition-colors"
              >
                <Check className="w-5 h-5" />
                <span>All Done!</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* NEXT Card - Medium prominence */}
      {next && (
        <div className="task-card-next">
          <div className="flex items-center justify-between mb-2">
            <span className="hw-label text-next-foreground/70">Next</span>
            <div className="flex items-center gap-1 text-next-foreground/70">
              <Star className="w-4 h-4" />
              <span className="font-mono text-sm">{next.tokens}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl" role="img" aria-label={next.title}>
              {iconMap[next.icon] || '⭐'}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{next.title}</h3>
              {next.duration && (
                <span className="text-next-foreground/60 text-sm font-mono">
                  {next.duration} min
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LATER Cards - Subtle */}
      {later.length > 0 && (
        <div className="space-y-2">
          <span className="hw-label block px-2">Later</span>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
            {later.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="task-card-later flex-shrink-0 min-w-[140px] py-4 px-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{iconMap[task.icon] || '⭐'}</span>
                  <span className="font-medium truncate">{task.title}</span>
                </div>
              </div>
            ))}
            {later.length > 4 && (
              <div className="task-card-later flex-shrink-0 min-w-[80px] py-4 px-4 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">
                  +{later.length - 4} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All done state */}
      {!now && !next && later.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold mb-2">All Done Today!</h2>
          <p className="text-muted-foreground">Great job!</p>
        </div>
      )}
    </div>
  );
}
