import { useEngagement } from './EngagementProvider';

export function EffortBadges({ compact = false }: { compact?: boolean }) {
  const { engineState, sensory } = useEngagement();
  const { earnedBadges, totalAttempts } = engineState;

  if (!sensory.showEffortBadges) return null;
  if (earnedBadges.length === 0 && compact) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {earnedBadges.slice(-3).map(badge => (
          <span key={badge.id} className="text-lg" title={badge.title}>{badge.emoji}</span>
        ))}
        {earnedBadges.length > 3 && (
          <span className="text-xs text-muted-foreground font-mono">+{earnedBadges.length - 3}</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-5 border-2 border-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">Effort Badges</h3>
        <span className="text-xs text-muted-foreground font-mono">{totalAttempts} attempts</span>
      </div>
      {earnedBadges.length === 0 ? (
        <p className="text-sm text-muted-foreground">Keep trying — badges are earned by effort, not being perfect!</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {earnedBadges.map(badge => (
            <div key={badge.id} className="text-center p-3 rounded-xl bg-muted/50 border border-border">
              <span className="text-2xl block mb-1">{badge.emoji}</span>
              <p className="text-xs font-semibold text-foreground">{badge.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
