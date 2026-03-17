import { useEngagement } from './EngagementProvider';
import { Clock, Play } from 'lucide-react';

/**
 * Ethical guardrail: gentle break reminder.
 * Shows when session exceeds 25 min or daily usage exceeds 90 min.
 * Never blocks — just encourages.
 */
export function BreakReminder() {
  const { shouldTakeBreak, acknowledgeBreak, sessionMinutes, dailyMinutes } = useEngagement();

  if (!shouldTakeBreak) return null;

  const isDailyCap = dailyMinutes >= 90;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative bg-card border-2 border-calm rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
        <div className="text-5xl">
          {isDailyCap ? '🌙' : '🧘'}
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {isDailyCap ? 'Great job today!' : "You're in the zone!"}
        </h2>
        <p className="text-muted-foreground">
          {isDailyCap 
            ? `You've been learning for ${dailyMinutes} minutes today — that's amazing! Time for some real-world adventures.`
            : `You've been focused for ${sessionMinutes} minutes. Your brain works best with breaks!`
          }
        </p>
        
        {/* Transparency tooltip */}
        <div className="bg-calm/10 rounded-xl p-3 text-xs text-muted-foreground">
          💡 This app uses fun rewards to make learning exciting. Taking breaks helps your brain remember what you learned!
        </div>

        <button
          onClick={acknowledgeBreak}
          className="w-full py-4 rounded-2xl bg-calm text-calm-foreground font-bold text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          {isDailyCap ? (
            <>
              <Clock className="w-5 h-5" />
              OK, see you tomorrow!
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              I took a break — let's go!
            </>
          )}
        </button>
      </div>
    </div>
  );
}
