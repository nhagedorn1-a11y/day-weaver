import { useState, useEffect } from 'react';
import { Shield, Star, Heart, X } from 'lucide-react';

interface BraveryTimerProps {
  duration?: number; // seconds, default 30
  copingPhrase: string;
  onComplete: () => void;
  onCancel: () => void;
}

const COPING_PHRASES = [
  "I can handle this feeling.",
  "This feeling will pass.",
  "I am safe right now.",
  "I can wait a little longer.",
  "My brain is playing tricks.",
];

export function BraveryTimer({
  duration = 30,
  copingPhrase,
  onComplete,
  onCancel,
}: BraveryTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const progress = 1 - timeRemaining / duration;

  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsComplete(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    // Rotate coping phrases every 5 seconds
    const phraseTimer = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % COPING_PHRASES.length);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(phraseTimer);
    };
  }, [timeRemaining]);

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 bg-token flex flex-col items-center justify-center p-8 safe-top safe-bottom animate-fade-in">
        <div className="relative">
          <div className="text-8xl mb-6">🦁</div>
        </div>
        
        <h2 className="text-4xl font-bold text-token-foreground mb-3">
          SO BRAVE!
        </h2>
        <p className="text-token-foreground/80 text-lg mb-8 text-center max-w-xs">
          You waited the whole time! That took real courage.
        </p>

        <div className="flex items-center gap-3 mb-10 px-6 py-4 rounded bg-white/15 backdrop-blur-sm">
          <div className="w-12 h-12 rounded bg-white/20 flex items-center justify-center">
            <Star className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <div>
            <span className="text-token-foreground/70 text-sm block">You earned</span>
            <span className="text-token-foreground font-bold text-xl">+3 tokens!</span>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="w-full max-w-xs py-4 px-8 rounded bg-white/20 text-token-foreground font-bold text-lg hover:bg-white/30 active:scale-[0.98] transition-all shadow-lg border border-white/10"
        >
          Done!
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-calm flex flex-col safe-top safe-bottom animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-calm-foreground/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-calm-foreground/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-calm-foreground" />
          </div>
          <div>
            <span className="font-bold text-calm-foreground block">Bravery Time</span>
            <span className="text-xs text-calm-foreground/60">You've got this</span>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2.5 rounded bg-calm-foreground/10 text-calm-foreground text-sm font-semibold hover:bg-calm-foreground/20 transition-colors touch-bounce flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          I need help
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Calming animation */}
        <div className="relative w-60 h-60 mb-10">
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-calm-foreground/15"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * 283} 283`}
              className="text-calm-foreground transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Heart className="w-8 h-8 text-calm-foreground/70 mb-2" />
            <span className="font-mono text-6xl font-bold text-calm-foreground tracking-tight">
              {timeRemaining}
            </span>
            <span className="text-calm-foreground/60 text-sm mt-1">seconds</span>
          </div>
        </div>

        {/* Coping phrase - rotates */}
        <div className="bg-calm-foreground/10 rounded p-6 max-w-sm text-center backdrop-blur-sm border border-calm-foreground/10">
          <p className="text-calm-foreground text-xl font-medium leading-relaxed">
            "{copingPhrase || COPING_PHRASES[currentPhraseIndex]}"
          </p>
        </div>
      </div>

      {/* Footer reassurance */}
      <div className="p-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-calm-foreground/10">
          <div className="w-2 h-2 rounded bg-calm-foreground" />
          <p className="text-calm-foreground/70 text-sm font-medium">
            You're doing amazing. Just a little longer.
          </p>
        </div>
      </div>
    </div>
  );
}
