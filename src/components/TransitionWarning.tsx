import { useEffect, useState } from 'react';
import { AlertCircle, Clock, Play } from 'lucide-react';

interface TransitionWarningProps {
  nextActivity: string;
  secondsRemaining: number;
  onExtend: () => void;
  onStartNow: () => void;
}

export function TransitionWarning({
  nextActivity,
  secondsRemaining,
  onExtend,
  onStartNow,
}: TransitionWarningProps) {
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    setIsUrgent(secondsRemaining <= 30);
  }, [secondsRemaining]);

  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      return `${mins} minute${mins > 1 ? 's' : ''}`;
    }
    return `${seconds} seconds`;
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 p-6 safe-bottom transition-colors ${
        isUrgent ? 'bg-primary' : 'bg-next'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isUrgent ? 'bg-primary-foreground/20' : 'bg-next-foreground/20'
          }`}
        >
          {isUrgent ? (
            <AlertCircle className="w-6 h-6 text-current" />
          ) : (
            <Clock className="w-6 h-6 text-current" />
          )}
        </div>

        <div className="flex-1">
          <span className="hw-label block mb-1 opacity-80">
            {isUrgent ? 'Time to switch!' : 'Heads up!'}
          </span>
          <h3 className="text-xl font-semibold mb-1">
            {nextActivity} in {formatTime(secondsRemaining)}
          </h3>
          <p className="text-sm opacity-80">Let's get ready to switch gears.</p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onExtend}
          className="flex-1 py-3 px-4 rounded-xl bg-background/10 font-medium hover:bg-background/20 transition-colors"
        >
          +2 minutes
        </button>
        <button
          onClick={onStartNow}
          className="flex-1 py-3 px-4 rounded-xl bg-background/20 font-medium hover:bg-background/30 transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          Start now
        </button>
      </div>
    </div>
  );
}
