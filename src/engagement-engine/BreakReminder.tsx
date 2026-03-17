import { useEngagement } from './EngagementProvider';
import { Clock, Play } from 'lucide-react';

/**
 * Hard session cap lock + soft break reminder.
 * Non-bypassable when hard lock is active.
 */
export function BreakReminder() {
  const { shouldTakeBreak, isSessionLocked, acknowledgeBreak, sessionMinutes, dailyMinutes, config } = useEngagement();

  // Hard lock — cannot be dismissed, must wait until tomorrow
  if (isSessionLocked) {
    return (
      <div className="fixed inset-0 z-[95] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />
        <div className="relative bg-card border-2 border-calm rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="text-5xl">🌙</div>
          <h2 className="text-xl font-bold text-foreground">Great job today!</h2>
          <p className="text-muted-foreground">
            You've been learning for {dailyMinutes} minutes — that's amazing!
            Your daily session is complete. Time for some real-world adventures.
          </p>
          <div className="bg-calm/10 rounded-xl p-3 text-xs text-muted-foreground">
            💡 Daily cap: {config.sessionCap.dailyCapMinutes} minutes. This limit helps your brain
            rest and remember what you learned. A parent can adjust this in Settings → Vibe Controls.
          </div>
          <div className="py-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-muted text-muted-foreground font-semibold">
              <Clock className="w-5 h-5" />
              Session complete — see you tomorrow!
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Soft break reminder
  if (!shouldTakeBreak) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative bg-card border-2 border-calm rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
        <div className="text-5xl">🧘</div>
        <h2 className="text-xl font-bold text-foreground">You're in the zone!</h2>
        <p className="text-muted-foreground">
          You've been focused for {sessionMinutes} minutes. Your brain works best with breaks!
        </p>
        <div className="bg-calm/10 rounded-xl p-3 text-xs text-muted-foreground">
          💡 This app uses fun rewards to make learning exciting. Taking breaks helps your brain remember what you learned!
        </div>
        <button
          onClick={acknowledgeBreak}
          className="w-full py-4 rounded-2xl bg-calm text-calm-foreground font-bold text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          <Play className="w-5 h-5" />
          I took a break — let's go!
        </button>
      </div>
    </div>
  );
}
