import { useState, useCallback, useEffect } from 'react';
import { KeyboardDisplay } from './KeyboardDisplay';
import { useSound } from '@/contexts/SoundContext';
import { KEY_HUNT_LEVELS, HAND_MAP, ROW_MAP, KEYBOARD_ROWS } from '@/data/typingLessons';
import { ArrowLeft } from 'lucide-react';

interface KeyHuntProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

export function KeyHunt({ onBack, onTokensEarned }: KeyHuntProps) {
  const { speakPhoneme, playCorrect, playTap } = useSound();
  const [levelIndex, setLevelIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const level = KEY_HUNT_LEVELS[levelIndex % KEY_HUNT_LEVELS.length];

  // Determine highlighted keys based on hint type
  const getHighlightedKeys = () => {
    if (level.hint === 'full') return [level.targetKey];
    return [];
  };

  const getColorZone = (): 'left' | 'right' | 'none' => {
    if (level.hint === 'hand' || level.hint === 'full') {
      return HAND_MAP[level.targetKey] || 'none';
    }
    return 'none';
  };

  // For row hints, dim keys NOT in the target row
  const getDisabledKeys = () => {
    if (level.hint === 'row' || level.hint === 'full') {
      const targetRow = ROW_MAP[level.targetKey];
      return KEYBOARD_ROWS.flatMap(row => row).filter(k => ROW_MAP[k] !== targetRow);
    }
    return [];
  };

  const handleKeyPress = useCallback((key: string) => {
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);

    if (key === level.targetKey) {
      playCorrect();
      speakPhoneme(key);
      setCorrectCount(prev => {
        const next = prev + 1;
        if (next % 5 === 0) {
          onTokensEarned(1);
        }
        return next;
      });
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setLevelIndex(prev => prev + 1);
      }, 1200);
    } else {
      playTap();
    }
  }, [level.targetKey, playCorrect, playTap, speakPhoneme, onTokensEarned]);

  // Physical keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      const k = e.key.toLowerCase();
      if (/^[a-z]$/.test(k)) handleKeyPress(k);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="px-4 py-2 rounded-xl bg-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-sm font-semibold text-muted-foreground">
          Found: {correctCount} {correctCount > 0 && correctCount % 5 === 0 ? '🌟' : ''}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">Key Hunt 🔍</h2>

      {/* Prompt */}
      <div className="text-center my-6">
        {showCelebration ? (
          <div className="text-6xl animate-bounce">🎉</div>
        ) : (
          <>
            <span className="text-6xl">{level.emoji}</span>
            <p className="text-2xl font-bold mt-3">
              Find the <span className="text-primary text-4xl">{level.targetKey.toUpperCase()}</span>!
            </p>
            <p className="text-muted-foreground mt-1">
              {level.targetKey.toUpperCase()} is for {level.keyword}
            </p>
            {level.hint === 'row' && (
              <p className="text-sm text-muted-foreground mt-1">
                Hint: Look in the {ROW_MAP[level.targetKey] === 0 ? 'top' : ROW_MAP[level.targetKey] === 1 ? 'middle' : 'bottom'} row
              </p>
            )}
            {level.hint === 'hand' && (
              <p className="text-sm text-muted-foreground mt-1">
                Hint: It's on the {HAND_MAP[level.targetKey]} side
              </p>
            )}
          </>
        )}
      </div>

      {/* Keyboard */}
      <div className="mt-auto pb-4">
        <KeyboardDisplay
          onKeyPress={handleKeyPress}
          highlightedKeys={getHighlightedKeys()}
          disabledKeys={showCelebration ? KEYBOARD_ROWS.flat() : getDisabledKeys()}
          colorZone={getColorZone()}
          pressedKey={pressedKey}
          size="large"
        />
      </div>
    </div>
  );
}
