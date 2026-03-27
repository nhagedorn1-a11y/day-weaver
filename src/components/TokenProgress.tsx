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
      <div className="flex items-center gap-3 py-2">
        {/* Token icon */}
        <div className="relative">
          <div className="w-9 h-9 rounded-lg bg-token flex items-center justify-center">
            <Star className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          {earned > 0 && (
            <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-0.5 rounded-md bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
              {earned}
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-foreground">Today's Stars</span>
            <span className="font-mono text-muted-foreground">{goal - earned > 0 ? `${goal - earned} to go` : 'Goal reached!'}</span>
          </div>
          <div className="h-1.5 rounded-sm bg-muted overflow-hidden">
            <div
              className="h-full rounded-sm bg-token transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Reward preview */}
        {currentReward && (
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-base">{currentReward.icon}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card p-6 border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
      {/* Header with token count */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-lg bg-token flex items-center justify-center">
              <Star className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            {earned > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-md bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                {earned}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-base">Today's Stars</h3>
            <p className="text-sm text-muted-foreground">
              {goal - earned > 0 ? `${goal - earned} more to goal` : 'Goal reached! 🎉'}
            </p>
          </div>
        </div>
        
        {currentReward && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border">
            <span className="text-xl">{currentReward.icon}</span>
            <div className="text-right">
              <span className="text-[11px] text-muted-foreground block">Next reward</span>
              <span className="text-sm font-medium">
                {currentReward.cost - earned > 0 ? `${currentReward.cost - earned} to go` : 'Ready!'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {currentReward && (
        <div className="relative mb-5">
          <div className="h-2 rounded-sm bg-muted overflow-hidden">
            <div
              className="h-full rounded-sm bg-token transition-all duration-500"
              style={{ width: `${rewardProgress}%` }}
            />
          </div>
          
          {/* Reward indicator */}
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <span className="text-lg">{currentReward.icon}</span>
          </div>
        </div>
      )}

      {/* Token visualization */}
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: Math.min(goal, 15) }, (_, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded flex items-center justify-center transition-all duration-300 ${
              i < earned
                ? 'bg-token'
                : 'bg-muted border border-dashed border-border'
            }`}
          >
            {i < earned && <Star className="w-3.5 h-3.5 text-white" fill="currentColor" />}
          </div>
        ))}
        {goal > 15 && (
          <div className="w-7 h-7 rounded bg-muted flex items-center justify-center">
            <span className="text-[10px] font-bold text-muted-foreground">+{goal - 15}</span>
          </div>
        )}
      </div>

      {/* Goal reached */}
      {earned >= goal && (
        <div className="mt-5 p-3 bg-muted rounded-lg flex items-center gap-3 border border-border">
          <Trophy className="w-5 h-5 text-token" />
          <div className="flex-1">
            <span className="font-medium text-foreground block text-sm">Goal reached!</span>
            <span className="text-xs text-muted-foreground">Time for a reward 🎉</span>
          </div>
        </div>
      )}
    </div>
  );
}
