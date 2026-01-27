import { useState, useEffect } from 'react';
import { Shield, Star, Heart } from 'lucide-react';

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
      <div className="fixed inset-0 z-50 bg-token/95 flex flex-col items-center justify-center p-8 safe-top safe-bottom">
        <div className="text-7xl mb-6 animate-float">🦁</div>
        <h2 className="text-3xl font-bold text-token-foreground mb-2">
          SO BRAVE!
        </h2>
        <p className="text-token-foreground/80 text-lg mb-8 text-center">
          You waited! That took real courage.
        </p>

        <div className="flex items-center gap-3 mb-8">
          <div className="token-chip">
            <Star className="w-5 h-5" />
          </div>
          <span className="text-token-foreground font-semibold">+3 tokens earned!</span>
        </div>

        <button
          onClick={onComplete}
          className="giant-button bg-token-foreground/20 text-token-foreground w-full max-w-xs"
        >
          <span>Done!</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-calm flex flex-col safe-top safe-bottom">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-calm-foreground" />
          <span className="font-semibold text-calm-foreground">Bravery Time</span>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-calm-foreground/10 text-calm-foreground text-sm font-medium hover:bg-calm-foreground/20 transition-colors"
        >
          I need help
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Calming animation */}
        <div className="relative w-56 h-56 mb-8">
          {/* Outer pulse */}
          <div className="absolute inset-0 rounded-full bg-calm-foreground/10 animate-breathe" />
          
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-calm-foreground/20"
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
            <Heart className="w-8 h-8 text-calm-foreground mb-2 animate-calm-pulse" />
            <span className="font-mono text-5xl font-bold text-calm-foreground">
              {timeRemaining}
            </span>
          </div>
        </div>

        {/* Coping phrase - rotates */}
        <div className="bg-calm-foreground/10 rounded-2xl p-6 max-w-sm text-center">
          <p className="text-calm-foreground text-lg font-medium leading-relaxed">
            "{copingPhrase || COPING_PHRASES[currentPhraseIndex]}"
          </p>
        </div>
      </div>

      {/* Footer reassurance */}
      <div className="p-6 text-center">
        <p className="text-calm-foreground/60 text-sm">
          You're doing amazing. Just a little longer.
        </p>
      </div>
    </div>
  );
}
