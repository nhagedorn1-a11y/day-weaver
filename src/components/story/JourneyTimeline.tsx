import { useMemo } from 'react';
import { Star, CheckCircle2, XCircle, Shield, Wind } from 'lucide-react';

interface DayData {
  date: Date;
  tasksCompleted: number;
  totalTasks: number;
  tokensEarned: number;
  calmToolkitUses: number;
  braveryAttempts: number;
}

interface JourneyTimelineProps {
  days: DayData[];
  childName?: string;
}

export function JourneyTimeline({ days, childName = 'Jack' }: JourneyTimelineProps) {
  const weeklyStats = useMemo(() => {
    const totalTasks = days.reduce((sum, d) => sum + d.tasksCompleted, 0);
    const totalTokens = days.reduce((sum, d) => sum + d.tokensEarned, 0);
    const totalBravery = days.reduce((sum, d) => sum + d.braveryAttempts, 0);
    const totalCalm = days.reduce((sum, d) => sum + d.calmToolkitUses, 0);
    const activeDays = days.filter(d => d.totalTasks > 0).length;
    
    return { totalTasks, totalTokens, totalBravery, totalCalm, activeDays };
  }, [days]);

  const getDayFingerprint = (day: DayData) => {
    // Create a unique visual pattern based on day's activities
    const completionRate = day.totalTasks > 0 ? day.tasksCompleted / day.totalTasks : 0;
    const hasCalm = day.calmToolkitUses > 0;
    const hasBravery = day.braveryAttempts > 0;
    
    let baseColor = 'bg-muted';
    if (completionRate >= 0.8) baseColor = 'bg-calm/60';
    else if (completionRate >= 0.5) baseColor = 'bg-token/60';
    else if (completionRate > 0) baseColor = 'bg-primary/40';
    
    return { baseColor, hasCalm, hasBravery, completionRate };
  };

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-card rounded-2xl border-2 border-border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{childName}'s Journey</h3>
        <span className="hw-label">This Week</span>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2 mb-5">
        {/* Day labels */}
        {weekdays.map((day, i) => (
          <div key={i} className="text-center">
            <span className="text-[10px] font-mono text-muted-foreground">{day}</span>
          </div>
        ))}
        
        {/* Day cells */}
        {days.slice(0, 7).map((day, i) => {
          const { baseColor, hasCalm, hasBravery, completionRate } = getDayFingerprint(day);
          const isToday = new Date().toDateString() === day.date.toDateString();
          
          return (
            <div
              key={i}
              className={`
                relative aspect-square rounded-lg ${baseColor}
                flex items-center justify-center
                ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                transition-all hover:scale-105
              `}
            >
              {/* Completion indicator */}
              {day.totalTasks > 0 && (
                <span className="font-mono text-xs font-bold text-foreground/70">
                  {Math.round(completionRate * 100)}
                </span>
              )}
              
              {/* Activity dots */}
              <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                {hasCalm && <div className="w-1 h-1 rounded-full bg-calm" />}
                {hasBravery && <div className="w-1 h-1 rounded-full bg-token" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly summary stats */}
      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-border">
        <div className="text-center">
          <div className="font-mono text-lg font-bold">{weeklyStats.activeDays}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Days</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-token">{weeklyStats.totalTokens}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Stars</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-primary">{weeklyStats.totalBravery}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Brave</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-calm">{weeklyStats.totalCalm}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Calm</div>
        </div>
      </div>

      {/* Encouragement */}
      <div className="mt-4 p-3 rounded-xl bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground italic">
          {weeklyStats.activeDays >= 5 
            ? "What a week! Look at all those days of effort."
            : weeklyStats.activeDays >= 3
            ? "Making progress, one day at a time."
            : "Every journey starts with a single step."
          }
        </p>
      </div>
    </div>
  );
}
