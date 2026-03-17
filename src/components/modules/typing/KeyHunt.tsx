import { useState, useCallback, useEffect, useMemo } from 'react';
import { KeyboardDisplay } from './KeyboardDisplay';
import { TypingProgressBar } from './TypingProgressBar';
import { TransitionCountdown } from './TransitionCountdown';
import { useSound } from '@/contexts/SoundContext';
import { KEY_HUNT_LEVELS, HAND_MAP, ROW_MAP, KEYBOARD_ROWS } from '@/data/typingLessons';
import { ArrowLeft } from 'lucide-react';

interface KeyHuntProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

const SESSION_LENGTH = 5; // Rev 6: fixed session size for predictability

// Rev 1: Generate visible key set based on difficulty
function getVisibleKeys(targetKey: string, hint: string, allKeys: string[]): string[] | undefined {
  if (hint === 'full') {
    // Show only 6 keys: target + 5 random distractors
    const distractors = allKeys.filter(k => k !== targetKey);
    const shuffled = [...distractors].sort(() => Math.random() - 0.5).slice(0, 5);
    return [targetKey, ...shuffled];
  }
  if (hint === 'row') {
    // Show only the target row + a few from adjacent rows (10 keys)
    const targetRow = ROW_MAP[targetKey];
    const rowKeys = allKeys.filter(k => ROW_MAP[k] === targetRow);
    const otherKeys = allKeys.filter(k => ROW_MAP[k] !== targetRow).sort(() => Math.random() - 0.5).slice(0, 4);
    return [...rowKeys, ...otherKeys];
  }
  if (hint === 'hand') {
    // Show the target hand side (13 keys) + a few from the other side
    const hand = HAND_MAP[targetKey];
    const handKeys = allKeys.filter(k => HAND_MAP[k] === hand);
    const otherKeys = allKeys.filter(k => HAND_MAP[k] !== hand).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...handKeys, ...otherKeys];
  }
  // 'none' = all keys visible
  return undefined;
}

export function KeyHunt({ onBack, onTokensEarned }: KeyHuntProps) {
  const { speakPhoneme, playCorrect, playTap } = useSound();
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [nudgeKey, setNudgeKey] = useState<string | null>(null); // Rev 3: wrong-press feedback
  const [showTransition, setShowTransition] = useState(false);
  const [isLastOne, setIsLastOne] = useState(false); // Rev 8: "Last one!" warning

  const level = KEY_HUNT_LEVELS[levelIndex % KEY_HUNT_LEVELS.length];
  const allKeys = KEYBOARD_ROWS.flat();

  // Rev 1: Compute visible keys for current level
  const visibleKeys = useMemo(
    () => getVisibleKeys(level.targetKey, level.hint, allKeys),
    [level.targetKey, level.hint]
  );

  // Determine highlighted keys based on hint type
  const getHighlightedKeys = () => {
    if (level.hint === 'full') return [level.targetKey];
    if (nudgeKey) return [level.targetKey]; // Rev 3: show target after wrong press
    return [];
  };

  const getColorZone = (): 'left' | 'right' | 'none' => {
    if (level.hint === 'hand' || level.hint === 'full') {
      return HAND_MAP[level.targetKey] || 'none';
    }
    return 'none';
  };

  const handleKeyPress = useCallback((key: string) => {
    if (showCelebration) return;
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);

    if (key === level.targetKey) {
      playCorrect();
      speakPhoneme(key);
      setNudgeKey(null);

      const nextSessionCorrect = sessionCorrect + 1;
      setSessionCorrect(nextSessionCorrect);

      // Rev 4: Continuous reinforcement — token per correct response
      onTokensEarned(1);

      // Rev 8: Check if this was the last one in session
      if (nextSessionCorrect >= SESSION_LENGTH) {
        setShowCelebration(true);
        setTimeout(() => {
          setShowTransition(true);
        }, 1500);
        return;
      }

      // Rev 8: "Last one!" warning
      if (nextSessionCorrect === SESSION_LENGTH - 1) {
        setIsLastOne(true);
      }

      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setLevelIndex(prev => prev + 1);
      }, 1200);
    } else {
      playTap();
      // Rev 3: Supportive error feedback — pulse the correct key
      setNudgeKey(level.targetKey);
      setTimeout(() => setNudgeKey(null), 1500);
    }
  }, [level.targetKey, showCelebration, sessionCorrect, playCorrect, playTap, speakPhoneme, onTokensEarned]);

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

  const handleBack = () => setShowTransition(true);

  if (showTransition) {
    return (
      <TransitionCountdown
        onComplete={onBack}
        message={sessionCorrect >= SESSION_LENGTH ? `Amazing! You found ${sessionCorrect} keys!` : 'Good exploring!'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handleBack} className="px-4 py-2 rounded-xl bg-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-sm font-semibold text-muted-foreground">
          🌟 {sessionCorrect}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">Key Hunt 🔍</h2>

      {/* Rev 6: Session progress bar */}
      <div className="mb-4">
        <TypingProgressBar current={sessionCorrect} total={SESSION_LENGTH} label="Found" />
      </div>

      {/* Prompt */}
      <div className="text-center my-4">
        {showCelebration ? (
          <div className="text-6xl">🎉</div>
        ) : (
          <>
            {/* Rev 8: "Last one!" indicator */}
            {isLastOne && (
              <p className="text-sm font-semibold text-primary mb-2">⭐ Last one!</p>
            )}
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

            {/* Rev 3: Supportive error nudge */}
            {nudgeKey && (
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-2 animate-pulse">
                Almost! Try the glowing key 👉
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
          visibleKeys={showCelebration ? [] : visibleKeys}
          disabledKeys={showCelebration ? KEYBOARD_ROWS.flat() : []}
          colorZone={getColorZone()}
          pressedKey={pressedKey}
          size="large"
        />
      </div>
    </div>
  );
}
