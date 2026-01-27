import { useState, useEffect } from 'react';
import { Clock, ArrowRight, Plus, Pause, AlertCircle } from 'lucide-react';

interface TransitionScriptProps {
  nextActivity: string;
  secondsRemaining: number;
  script: string;
  onExtend: () => void;
  onStartNow: () => void;
  onPause?: () => void;
}

const DEFAULT_SCRIPTS = {
  warning5min: "Five more minutes, then we'll switch to",
  warning2min: "Two more minutes. Let's finish up for",
  warning30sec: "Almost time! Get ready for",
  change: "Plans changed. That's okay. Now we're doing",
};

export function TransitionScript({
  nextActivity,
  secondsRemaining,
  script,
  onExtend,
  onStartNow,
  onPause,
}: TransitionScriptProps) {
  const [phase, setPhase] = useState<'warning' | 'urgent' | 'now'>('warning');

  useEffect(() => {
    if (secondsRemaining <= 10) {
      setPhase('now');
    } else if (secondsRemaining <= 30) {
      setPhase('urgent');
    } else {
      setPhase('warning');
    }
  }, [secondsRemaining]);

  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      return `${mins} min`;
    }
    return `${seconds}s`;
  };

  const phaseStyles = {
    warning: {
      bg: 'bg-next',
      text: 'text-next-foreground',
      icon: Clock,
    },
    urgent: {
      bg: 'bg-token',
      text: 'text-token-foreground',
      icon: AlertCircle,
    },
    now: {
      bg: 'bg-primary',
      text: 'text-primary-foreground',
      icon: ArrowRight,
    },
  };

  const { bg, text, icon: Icon } = phaseStyles[phase];

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 ${bg} ${text} safe-bottom`}>
      {/* Wrapping up indicator */}
      <div className="flex items-center justify-center gap-2 py-2 bg-black/10">
        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
        <span className="text-xs font-medium uppercase tracking-wider opacity-80">
          {phase === 'now' ? 'Time to switch' : 'Wrapping up'}
        </span>
      </div>

      <div className="p-6">
        {/* Script - the neutral third party speaks */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-medium leading-snug">
              {script} <strong>{nextActivity}</strong>.
            </p>
            <div className="flex items-center gap-2 mt-2 opacity-80">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(secondsRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onExtend}
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+2 min</span>
          </button>
          
          {onPause && (
            <button
              onClick={onPause}
              className="py-3 px-4 rounded-xl bg-white/10 font-medium hover:bg-white/20 transition-colors"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={onStartNow}
            className="flex-1 py-3 px-4 rounded-xl bg-white/20 font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
          >
            <span>Switch Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
