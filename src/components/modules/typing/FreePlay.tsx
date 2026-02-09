import { useState, useCallback, useEffect } from 'react';
import { KeyboardDisplay } from './KeyboardDisplay';
import { useSound } from '@/contexts/SoundContext';
import { ArrowLeft } from 'lucide-react';

interface FreePlayProps {
  onBack: () => void;
}

export function FreePlay({ onBack }: FreePlayProps) {
  const { speakPhoneme, playTap } = useSound();
  const [displayLetter, setDisplayLetter] = useState<string | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleKeyPress = useCallback((key: string) => {
    if (['shift', 'backspace', 'enter', 'space'].includes(key)) {
      playTap();
      setDisplayLetter(key === 'space' ? '␣' : key === 'enter' ? '↵' : key === 'backspace' ? '⌫' : '⬆️');
    } else {
      speakPhoneme(key);
      setDisplayLetter(key.toUpperCase());
    }
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);
  }, [speakPhoneme, playTap]);

  // Listen for physical keyboard too
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      const k = e.key.toLowerCase();
      if (k.length === 1 && /[a-z]/.test(k)) {
        handleKeyPress(k);
      } else if (k === ' ') {
        handleKeyPress('space');
      } else if (k === 'enter') {
        handleKeyPress('enter');
      } else if (k === 'backspace') {
        handleKeyPress('backspace');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <button onClick={onBack} className="self-start mb-4 px-4 py-2 rounded-xl bg-secondary flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h2 className="text-2xl font-bold text-center mb-2">Free Play 🎹</h2>
      <p className="text-center text-muted-foreground mb-6">Tap any key to see and hear it!</p>

      {/* Big letter display */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className={`
          w-48 h-48 rounded-3xl border-4 border-primary/20 flex items-center justify-center
          transition-all duration-200
          ${displayLetter ? 'bg-primary/10 scale-100 border-primary/40' : 'bg-muted/30 scale-95'}
        `}>
          <span className="text-8xl font-black text-foreground select-none">
            {displayLetter || '?'}
          </span>
        </div>
      </div>

      {/* Keyboard */}
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
