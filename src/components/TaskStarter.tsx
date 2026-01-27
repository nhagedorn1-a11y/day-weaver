import { useState } from 'react';
import { Zap, ArrowRight, Star } from 'lucide-react';

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

    // 30 second countdown
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
      <div className="bg-primary/10 rounded-3xl p-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-token/20 text-token-foreground rounded-full mb-4">
          <Star className="w-4 h-4" />
          <span className="text-sm font-medium">You started! +1 token</span>
        </div>
        
        <div className="text-6xl font-mono font-bold text-primary mb-2">
          {countdown}
        </div>
        <p className="text-muted-foreground mb-6">Just {countdown} more seconds...</p>
        
        <button
          onClick={onFullStart}
          className="parent-button"
        >
          <span>I can keep going!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (hasStarted && !isCountingDown) {
    return (
      <div className="bg-calm/10 rounded-3xl p-6 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold mb-2">You did it!</h3>
        <p className="text-muted-foreground mb-6">Ready for the full task?</p>
        
        <button
          onClick={onFullStart}
          className="giant-button w-full bg-primary text-primary-foreground"
        >
          <ArrowRight className="w-6 h-6" />
          <span>Start Full Timer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl border-2 border-border p-6">
      <div className="text-center mb-6">
        <span className="hw-label block mb-2">Starting is the hardest part</span>
        <h3 className="text-xl font-semibold">{taskTitle}</h3>
      </div>

      {/* Micro-goal prompt */}
      <div className="bg-muted rounded-2xl p-4 mb-6 text-center">
        <p className="text-muted-foreground text-sm mb-1">Just try this:</p>
        <p className="font-medium">{microGoal}</p>
      </div>

      {/* Big start button */}
      <button
        onClick={handleMicroStart}
        className="giant-button w-full bg-primary text-primary-foreground hover:scale-105 active:scale-100 transition-transform"
      >
        <Zap className="w-8 h-8" />
        <span>Start for 30 seconds</span>
      </button>

      <p className="text-center text-sm text-muted-foreground mt-4">
        That's it. Just 30 seconds.
      </p>
    </div>
  );
}
