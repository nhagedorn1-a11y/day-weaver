import { useState, useEffect, useCallback } from 'react';

interface ProcessingTimerProps {
  /** Seconds to wait before showing the prompt/hint (default 10) */
  delaySeconds?: number;
  /** The gentle nudge shown after the delay */
  nudgeMessage?: string;
  /** Called when timer fires — parent can trigger companion speech etc. */
  onNudge?: () => void;
  /** If true, the timer is active. Reset by toggling this to false then true. */
  active: boolean;
  children?: React.ReactNode;
}

/**
 * ProcessingTimer — respects working memory by waiting before re-prompting.
 * 
 * Shows nothing for `delaySeconds`, then gently fades in a nudge message.
 * Follows the 10-second rule: give the child ample processing time
 * before a character prompts them again.
 */
export function ProcessingTimer({
  delaySeconds = 10,
  nudgeMessage = "Take your time. Ready when you are.",
  onNudge,
  active,
  children,
}: ProcessingTimerProps) {
  const [showNudge, setShowNudge] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(delaySeconds);

  // Reset when active toggles or delay changes
  useEffect(() => {
    if (!active) {
      setShowNudge(false);
      setSecondsLeft(delaySeconds);
      return;
    }

    setShowNudge(false);
    setSecondsLeft(delaySeconds);

    const countdown = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setShowNudge(true);
          onNudge?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [active, delaySeconds, onNudge]);

  if (!active) return null;

  return (
    <div className="relative">
      {children}

      {/* Subtle thinking indicator while waiting */}
      {!showNudge && (
        <div className="flex items-center gap-2 mt-3 text-muted-foreground">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '300ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '600ms' }} />
          </div>
          <span className="text-xs font-medium">Thinking time…</span>
        </div>
      )}

      {/* Gentle nudge after delay */}
      {showNudge && (
        <div className="animate-fade-in mt-3 px-4 py-2.5 rounded-2xl bg-calm/10 border border-calm/20">
          <p className="text-sm text-calm font-medium">{nudgeMessage}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Hook version for integrating processing delay into lesson runners.
 * Returns whether enough time has passed to show a nudge.
 */
export function useProcessingTimer(delaySeconds = 10) {
  const [isWaiting, setIsWaiting] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  const startWaiting = useCallback(() => {
    setIsWaiting(true);
    setShowNudge(false);
  }, []);

  const stopWaiting = useCallback(() => {
    setIsWaiting(false);
    setShowNudge(false);
  }, []);

  useEffect(() => {
    if (!isWaiting) return;

    const timer = setTimeout(() => {
      setShowNudge(true);
    }, delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [isWaiting, delaySeconds]);

  return { isWaiting, showNudge, startWaiting, stopWaiting };
}
