import { Star, Gift } from 'lucide-react';

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
      <div className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border">
        <div className="token-chip">
          <Star className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="progress-calm h-2">
            <div
              className="progress-calm-fill bg-token"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="font-mono font-bold text-token">{earned}</span>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-5 border-2 border-border shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="token-chip">
            <Star className="w-5 h-5" />
          </div>
          <span className="font-mono text-xl font-bold">{earned}</span>
        </div>
        
        {currentReward && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm">Next:</span>
            <span className="text-lg">{currentReward.icon}</span>
            <span className="text-sm font-medium">{currentReward.cost - earned} to go</span>
          </div>
        )}
      </div>

      {/* Progress to reward */}
      {currentReward && (
        <div className="relative">
          <div className="progress-calm h-4">
            <div
              className="progress-calm-fill bg-gradient-to-r from-token to-primary"
              style={{ width: `${rewardProgress}%` }}
            />
          </div>
          
          {/* Reward indicator at end */}
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-card border-2 border-token flex items-center justify-center shadow-md"
          >
            <span className="text-lg">{currentReward.icon}</span>
          </div>
        </div>
      )}

      {/* Token dots */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {Array.from({ length: Math.min(goal, 20) }, (_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              i < earned
                ? 'bg-token text-token-foreground scale-100'
                : 'bg-muted scale-90 opacity-40'
            }`}
          >
            {i < earned && <Star className="w-3 h-3" />}
          </div>
        ))}
        {goal > 20 && (
          <span className="text-sm text-muted-foreground self-center ml-1">
            +{goal - 20}
          </span>
        )}
      </div>

      {/* Goal reached celebration */}
      {earned >= goal && (
        <div className="mt-4 p-4 bg-token/10 rounded-2xl flex items-center gap-3">
          <Gift className="w-6 h-6 text-token" />
          <span className="font-semibold text-token">
            Goal reached! Time for a reward! 🎉
          </span>
        </div>
      )}
    </div>
  );
}
