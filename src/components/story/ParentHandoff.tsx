import { Clock, Star, Wind, Shield, TrendingUp, AlertCircle } from 'lucide-react';

interface ParentHandoffProps {
  childName?: string;
  currentTime?: Date;
  transitionsToday: number;
  transitionsNeededExtension: number;
  tokensEarned: number;
  tokensGoal: number;
  currentReward?: string;
  lastHardTask?: string;
  calmToolkitUses: number;
  notes?: string[];
  onDismiss?: () => void;
}

export function ParentHandoff({
  childName = 'Jack',
  currentTime = new Date(),
  transitionsToday,
  transitionsNeededExtension,
  tokensEarned,
  tokensGoal,
  currentReward,
  lastHardTask,
  calmToolkitUses,
  notes = [],
  onDismiss,
}: ParentHandoffProps) {
  const timeOfDay = currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 17 ? 'afternoon' : 'evening';

  return (
    <div className="fixed inset-x-4 top-20 z-50 max-w-md mx-auto animate-slide-down">
      <div className="bg-card rounded-2xl border-2 border-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-secondary/50 px-4 py-3 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-sm">This {timeOfDay}</span>
          </div>
          <button 
            onClick={onDismiss}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Transitions summary */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm">
                <strong>{transitionsToday}</strong> transitions
                {transitionsNeededExtension > 0 && (
                  <span className="text-muted-foreground">
                    {' '}({transitionsNeededExtension} needed extension)
                  </span>
                )}
              </p>
              {lastHardTask && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lastHardTask} was challenging
                </p>
              )}
            </div>
          </div>

          {/* Token progress */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-token/10 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 text-token" />
            </div>
            <div>
              <p className="text-sm">
                <strong>{tokensEarned}</strong> of {tokensGoal} tokens
              </p>
              {currentReward && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Aiming for: {currentReward}
                </p>
              )}
            </div>
          </div>

          {/* Calm toolkit */}
          {calmToolkitUses > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-calm/10 flex items-center justify-center shrink-0">
                <Wind className="w-4 h-4 text-calm" />
              </div>
              <div>
                <p className="text-sm">
                  Used calm tools <strong>{calmToolkitUses}</strong> {calmToolkitUses === 1 ? 'time' : 'times'}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {notes.length > 0 && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</span>
              </div>
              <ul className="space-y-1">
                {notes.map((note, i) => (
                  <li key={i} className="text-xs text-muted-foreground pl-5 relative">
                    <span className="absolute left-0">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
