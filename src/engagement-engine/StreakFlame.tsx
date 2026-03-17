import { useEngagement } from './EngagementProvider';
import { Shield } from 'lucide-react';

export function StreakFlame({ compact = false }: { compact?: boolean }) {
  const { engineState, sensory } = useEngagement();
  const { streakDays, streakShields } = engineState;

  if (!sensory.showStreak || streakDays === 0) return null;

  const flameSize = Math.min(streakDays, 7);
  const flameEmoji = flameSize <= 2 ? '🕯️' : flameSize <= 4 ? '🔥' : '🌋';

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-token/10 border border-token/20">
        <span className="text-sm">{flameEmoji}</span>
        <span className="text-sm font-bold text-token font-mono">{streakDays}</span>
        {streakShields > 0 && <Shield className="w-3 h-3 text-calm" />}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 border-2 border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{flameEmoji}</span>
          <div>
            <p className="font-bold text-lg text-foreground">
              {streakDays} day{streakDays !== 1 ? 's' : ''} streak!
            </p>
            <p className="text-xs text-muted-foreground">Keep practicing to grow your flame</p>
          </div>
        </div>
        {streakShields > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-calm/10">
            <Shield className="w-4 h-4 text-calm" />
            <span className="text-xs font-bold text-calm">{streakShields}</span>
          </div>
        )}
      </div>
    </div>
  );
}
