import { Star } from 'lucide-react';

interface TokenBoardProps {
  earned: number;
  goal: number;
  showDetails?: boolean;
}

export function TokenBoard({ earned, goal, showDetails = false }: TokenBoardProps) {
  const tokens = Array.from({ length: goal }, (_, i) => i < earned);
  const progress = Math.min((earned / goal) * 100, 100);

  return (
    <div className="bg-card rounded-3xl p-6 border-2 border-border shadow-card">
      <div className="flex items-center justify-between mb-4">
        <span className="hw-label">Today's Tokens</span>
        <span className="font-mono text-2xl font-bold text-token">
          {earned}/{goal}
        </span>
      </div>

      {/* Token chips grid */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tokens.map((filled, index) => (
          <div
            key={index}
            className={filled ? 'token-chip' : 'token-chip-empty'}
            style={{
              animationDelay: filled ? `${index * 100}ms` : undefined,
            }}
          >
            {filled && <Star className="w-5 h-5" />}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-calm">
        <div
          className="progress-calm-fill bg-token"
          style={{ width: `${progress}%` }}
        />
      </div>

      {showDetails && progress >= 100 && (
        <div className="mt-4 p-4 bg-token/10 rounded-2xl text-center">
          <span className="text-lg font-semibold text-token">
            🎉 Goal reached! Time for a reward!
          </span>
        </div>
      )}
    </div>
  );
}
