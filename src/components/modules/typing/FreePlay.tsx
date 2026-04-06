import { useState, useCallback, useEffect } from 'react';
import { KeyboardDisplay } from './KeyboardDisplay';
import { TransitionCountdown } from './TransitionCountdown';
import { useSound } from '@/contexts/SoundContext';
import { SENSORY_DEFAULTS } from '@/data/childProfile';
import { ArrowLeft } from 'lucide-react';

interface FreePlayProps {
  onBack: () => void;
}

const REDIRECT_THRESHOLD = 20;
const REDIRECT_REPEAT = 30;

export function FreePlay({ onBack }: FreePlayProps) {
  const { speakLetterName, playTap } = useSound();
  const [displayLetter, setDisplayLetter] = useState<string | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [pressCount, setPressCount] = useState(0);
  const [showRedirect, setShowRedirect] = useState(false);
  const [redirectDismissed, setRedirectDismissed] = useState(0);
  const [showTransition, setShowTransition] = useState(false);

  const handleKeyPress = useCallback((key: string) => {
    if (['shift', 'backspace', 'enter', 'space'].includes(key)) {
      playTap();
      setDisplayLetter(key === 'space' ? '␣' : key === 'enter' ? '↵' : key === 'backspace' ? '⌫' : '⬆️');
    } else {
      speakLetterName(key);
      setDisplayLetter(key.toUpperCase());
    }
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);

    // Rev 5: Perseveration redirect
    setPressCount(prev => {
      const next = prev + 1;
      const threshold = REDIRECT_THRESHOLD + redirectDismissed * REDIRECT_REPEAT;
      if (next >= threshold && !showRedirect) {
        setShowRedirect(true);
      }
      return next;
    });
  }, [speakLetterName, playTap, redirectDismissed, showRedirect]);

  // Physical keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      const k = e.key.toLowerCase();
      if (k.length === 1 && /[a-z]/.test(k)) handleKeyPress(k);
      else if (k === ' ') handleKeyPress('space');
      else if (k === 'enter') handleKeyPress('enter');
      else if (k === 'backspace') handleKeyPress('backspace');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeyPress]);

  const handleBack = () => setShowTransition(true);

  // Rev 10: Sensory-aware display animation
  const displayClass = SENSORY_DEFAULTS.reducedMotion
    ? 'transition-colors duration-200'
    : 'transition-all duration-200';

  if (showTransition) {
    return <TransitionCountdown onComplete={onBack} message="Nice exploring!" />;
  }

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handleBack} className="px-4 py-2 rounded-xl bg-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-xs text-muted-foreground">{pressCount} keys explored</span>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">Free Play 🎹</h2>
      <p className="text-center text-muted-foreground mb-6">Tap any key to see and hear it!</p>

      {/* Rev 5: Gentle perseveration redirect */}
      {showRedirect && (
        <div className="mx-auto mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 max-w-sm text-center">
          <p className="text-lg font-semibold">You've explored so many keys! 🌟</p>
          <p className="text-sm text-muted-foreground mt-1">Want to try finding a special key?</p>
          <div className="flex gap-2 justify-center mt-3">
            <button
              onClick={() => {
                setShowRedirect(false);
                setRedirectDismissed(prev => prev + 1);
              }}
              className="px-4 py-2 rounded-xl bg-secondary text-sm font-semibold"
            >
              Keep playing
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Try Key Hunt! 🔍
            </button>
          </div>
        </div>
      )}

      {/* Big letter display */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className={`
          w-48 h-48 rounded-3xl border-4 border-primary/20 flex items-center justify-center
          ${displayClass}
          ${displayLetter
            ? SENSORY_DEFAULTS.reducedMotion
              ? 'bg-primary/10 border-primary/40'
              : 'bg-primary/10 scale-100 border-primary/40'
            : SENSORY_DEFAULTS.reducedMotion
              ? 'bg-muted/30'
              : 'bg-muted/30 scale-95'
          }
        `}>
          <span className="text-8xl font-black text-foreground select-none">
            {displayLetter || '?'}
          </span>
        </div>
      </div>

      <div className="pb-4">
        <KeyboardDisplay
          onKeyPress={handleKeyPress}
          pressedKey={pressedKey}
          specialKeys
          size="large"
        />
      </div>
    </div>
  );
}
