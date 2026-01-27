import { useState } from 'react';
import { Zap, ArrowRight, Star, Sparkles } from 'lucide-react';

interface TaskStarterProps {
  taskTitle: string;
  microGoal: string;
  onStart: () => void;
  onFullStart: () => void;
}

export function TaskStarter({ taskTitle, microGoal, onStart, onFullStart }: TaskStarterProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const handleMicroStart = () => {
    setHasStarted(true);
    setIsCountingDown(true);
    onStart();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCountingDown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (hasStarted && isCountingDown) {
    return (
      <div className="bg-gradient-to-br from-primary/15 to-token/10 rounded-3xl p-6 text-center border border-primary/20 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-token/20 text-token-foreground rounded-full mb-5 animate-success-pop">
          <Star className="w-4 h-4" fill="currentColor" />
          <span className="text-sm font-semibold">You started! +1 token</span>
        </div>
        
        <div className="relative inline-block mb-4">
          <div className="text-7xl font-mono font-bold text-primary animate-calm-pulse">
            {countdown}
          </div>
          <Sparkles className="absolute -top-2 -right-4 w-5 h-5 text-token animate-pulse" />
        </div>
        <p className="text-muted-foreground mb-6">Just {countdown} more seconds...</p>
        
        <button
          onClick={onFullStart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border font-semibold hover:bg-muted transition-colors touch-bounce"
        >
          <span>I can keep going!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (hasStarted && !isCountingDown) {
    return (
      <div className="bg-gradient-to-br from-calm/20 to-token/10 rounded-3xl p-8 text-center border border-calm/30 animate-fade-in">
        <div className="text-6xl mb-4 animate-bounce-gentle">🎉</div>
        <h3 className="text-2xl font-bold mb-2 text-calm">You did it!</h3>
        <p className="text-muted-foreground mb-6">Ready for the full task?</p>
        
        <button
          onClick={onFullStart}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
        >
          <ArrowRight className="w-6 h-6" />
          <span>Start Full Timer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl border-2 border-border p-6 shadow-lg animate-fade-in-up">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 mb-3">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Start</span>
        </div>
        <h3 className="text-xl font-bold">{taskTitle}</h3>
      </div>

      {/* Micro-goal prompt */}
      <div className="bg-gradient-to-r from-muted/80 to-muted/50 rounded-2xl p-5 mb-6 text-center border border-border/50">
        <p className="text-muted-foreground text-sm mb-1">Just try this:</p>
        <p className="font-semibold text-lg">{microGoal}</p>
      </div>

      {/* Big start button */}
      <button
        onClick={handleMicroStart}
        className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
      >
        <Zap className="w-7 h-7" />
        <span>Start for 30 seconds</span>
      </button>

      <p className="text-center text-sm text-muted-foreground mt-4">
        That's it. Just 30 seconds. ✨
      </p>
    </div>
  );
}
