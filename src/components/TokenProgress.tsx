import { Star, Gift, Trophy } from 'lucide-react';

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
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-token/10 to-primary/5 rounded-2xl border border-token/20">
        <div className="w-10 h-10 rounded-full bg-token/20 flex items-center justify-center">
          <Star className="w-5 h-5 text-token" fill="currentColor" />
        </div>
        <div className="flex-1">
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-token to-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="font-mono text-lg font-bold text-token">{earned}</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-muted/30 p-6 border border-border shadow-lg">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-token/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        {/* Header with token count */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-token to-primary flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white" fill="currentColor" />
              </div>
              {earned > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                  {earned}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">Today's Stars</h3>
              <p className="text-sm text-muted-foreground">{goal - earned} more to goal</p>
            </div>
          </div>
          
          {currentReward && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border">
              <span className="text-2xl">{currentReward.icon}</span>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Next reward</span>
                <span className="text-sm font-bold">{currentReward.cost - earned} to go</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar with glow effect */}
        {currentReward && (
          <div className="relative mb-5">
            <div className="h-4 rounded-full bg-muted overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-token via-primary to-token transition-all duration-500 relative"
                style={{ width: `${rewardProgress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
            
            {/* Reward indicator */}
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-xl bg-card border-2 border-token flex items-center justify-center shadow-lg"
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
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                i < earned
                  ? 'bg-gradient-to-br from-token to-primary shadow-md scale-100'
                  : 'bg-muted/50 border border-dashed border-border scale-95'
              }`}
            >
              {i < earned && <Star className="w-4 h-4 text-white" fill="currentColor" />}
            </div>
          ))}
          {goal > 15 && (
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <span className="text-xs font-bold text-muted-foreground">+{goal - 15}</span>
            </div>
          )}
        </div>

        {/* Goal reached celebration */}
        {earned >= goal && (
          <div className="mt-5 p-4 bg-gradient-to-r from-token/20 to-primary/20 rounded-2xl flex items-center gap-4 border border-token/30">
            <div className="w-12 h-12 rounded-xl bg-token/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-token" />
            </div>
            <div>
              <span className="font-bold text-token block">Goal reached!</span>
              <span className="text-sm text-muted-foreground">Time for a reward! 🎉</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
