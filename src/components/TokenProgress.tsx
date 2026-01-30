import { Star, Trophy } from 'lucide-react';

interface TokenProgressProps {
  earned: number;
  goal: number;
  currentReward?: {
    title: string;
    icon: string;
    cost: number;
  };
  compact?: boolean;
}

export function TokenProgress({ earned, goal, currentReward, compact = false }: TokenProgressProps) {
  const progress = Math.min((earned / goal) * 100, 100);
  const rewardProgress = currentReward 
    ? Math.min((earned / currentReward.cost) * 100, 100) 
    : 0;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 bg-token/10 rounded border border-token/20 shadow-sm">
        {/* Token icon with count badge */}
        <div className="relative">
          <div className="w-12 h-12 rounded bg-token flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          {earned > 0 && (
            <div className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md border-2 border-background">
              {earned}
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Today's Stars</span>
            <span className="font-mono text-muted-foreground">{goal - earned > 0 ? `${goal - earned} to go` : 'Goal reached!'}</span>
          </div>
          <div className="h-2.5 rounded bg-muted overflow-hidden shadow-inner">
            <div
              className="h-full rounded bg-token transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Reward preview */}
        {currentReward && (
          <div className="w-10 h-10 rounded bg-muted/50 border border-border flex items-center justify-center">
            <span className="text-xl">{currentReward.icon}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded bg-card p-6 border border-border shadow-lg">
      <div className="relative z-10">
        {/* Header with token count */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded bg-token flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white" fill="currentColor" />
              </div>
              {earned > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md border-2 border-card">
                  {earned}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">Today's Stars</h3>
              <p className="text-sm text-muted-foreground">
                {goal - earned > 0 ? `${goal - earned} more to goal` : 'Goal reached! 🎉'}
              </p>
            </div>
          </div>
          
          {currentReward && (
            <div className="flex items-center gap-2 px-3 py-2 rounded bg-muted/50 border border-border">
              <span className="text-2xl">{currentReward.icon}</span>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Next reward</span>
                <span className="text-sm font-bold">
                  {currentReward.cost - earned > 0 ? `${currentReward.cost - earned} to go` : 'Ready!'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {currentReward && (
          <div className="relative mb-5">
            <div className="h-4 rounded bg-muted overflow-hidden shadow-inner">
              <div
                className="h-full rounded bg-token transition-all duration-500"
                style={{ width: `${rewardProgress}%` }}
              />
            </div>
            
            {/* Reward indicator */}
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded bg-card border-2 border-token flex items-center justify-center shadow-lg"
            >
              <span className="text-xl">{currentReward.icon}</span>
            </div>
          </div>
        )}

        {/* Token visualization - elegant dots */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: Math.min(goal, 15) }, (_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-300 ${
                i < earned
                  ? 'bg-token shadow-md scale-100'
                  : 'bg-muted/50 border border-dashed border-border scale-95'
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {i < earned && <Star className="w-4 h-4 text-white" fill="currentColor" />}
            </div>
          ))}
          {goal > 15 && (
            <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center">
              <span className="text-xs font-bold text-muted-foreground">+{goal - 15}</span>
            </div>
          )}
        </div>

        {/* Goal reached celebration */}
        {earned >= goal && (
          <div className="mt-5 p-4 bg-token/10 rounded flex items-center gap-4 border border-token/30">
            <div className="w-12 h-12 rounded bg-token/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-token" />
            </div>
            <div className="flex-1">
              <span className="font-bold text-token block">Goal reached!</span>
              <span className="text-sm text-muted-foreground">Time for a reward! 🎉</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
