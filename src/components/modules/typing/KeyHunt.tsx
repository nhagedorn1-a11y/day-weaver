import { useState, useCallback, useEffect, useMemo } from 'react';
import { KeyboardDisplay } from './KeyboardDisplay';
import { TypingProgressBar } from './TypingProgressBar';
import { TransitionCountdown } from './TransitionCountdown';
import { useSound } from '@/contexts/SoundContext';
import { KEY_HUNT_TIERS, getRandomKeyHuntLevels, HAND_MAP, ROW_MAP, KEYBOARD_ROWS, type KeyHuntLevel } from '@/data/typingLessons';
import { ArrowLeft, Lock, Check } from 'lucide-react';

interface KeyHuntProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

const SESSION_LENGTH = 6;

// Persist unlocked tier
function getUnlockedTier(): number {
  try { return parseInt(localStorage.getItem('key-hunt-tier') || '0', 10); } catch { return 0; }
}
function saveUnlockedTier(tier: number) {
  try {
    const current = getUnlockedTier();
    if (tier > current) localStorage.setItem('key-hunt-tier', String(tier));
  } catch { /* noop */ }
}

function getVisibleKeys(targetKey: string, hint: string, allKeys: string[]): string[] | undefined {
  if (hint === 'full') {
    const distractors = allKeys.filter(k => k !== targetKey).sort(() => Math.random() - 0.5).slice(0, 5);
    return [targetKey, ...distractors];
  }
  if (hint === 'row') {
    const targetRow = ROW_MAP[targetKey];
    const rowKeys = allKeys.filter(k => ROW_MAP[k] === targetRow);
    const otherKeys = allKeys.filter(k => ROW_MAP[k] !== targetRow).sort(() => Math.random() - 0.5).slice(0, 4);
    return [...rowKeys, ...otherKeys];
  }
  if (hint === 'hand') {
    const hand = HAND_MAP[targetKey];
    const handKeys = allKeys.filter(k => HAND_MAP[k] === hand);
    const otherKeys = allKeys.filter(k => HAND_MAP[k] !== hand).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...handKeys, ...otherKeys];
  }
  return undefined;
}

type Phase = 'pick-tier' | 'playing' | 'transition';

export function KeyHunt({ onBack, onTokensEarned }: KeyHuntProps) {
  const { speakLetterName, playCorrect, playTap } = useSound();
  const [phase, setPhase] = useState<Phase>('pick-tier');
  const [sessionLevels, setSessionLevels] = useState<KeyHuntLevel[]>([]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [nudgeKey, setNudgeKey] = useState<string | null>(null);
  const [transitionMsg, setTransitionMsg] = useState('');
  const [currentTierIndex, setCurrentTierIndex] = useState(0);
  const unlockedTier = getUnlockedTier();

  const level = sessionLevels[levelIndex];
  const allKeys = KEYBOARD_ROWS.flat();

  const startTier = useCallback((tierIndex: number) => {
    const tier = KEY_HUNT_TIERS[tierIndex];
    setCurrentTierIndex(tierIndex);
    setSessionLevels(getRandomKeyHuntLevels(tier.hint, SESSION_LENGTH));
    setLevelIndex(0);
    setSessionCorrect(0);
    setShowCelebration(false);
    setNudgeKey(null);
    setPhase('playing');
  }, []);

  const visibleKeys = useMemo(
    () => level ? getVisibleKeys(level.targetKey, level.hint, allKeys) : undefined,
    [level?.targetKey, level?.hint]
  );

  const getHighlightedKeys = () => {
    if (!level) return [];
    if (level.hint === 'full') return [level.targetKey];
    if (nudgeKey) return [level.targetKey];
    return [];
  };

  const getColorZone = (): 'left' | 'right' | 'none' => {
    if (!level) return 'none';
    if (level.hint === 'hand' || level.hint === 'full') {
      return HAND_MAP[level.targetKey] || 'none';
    }
    return 'none';
  };

  const handleKeyPress = useCallback((key: string) => {
    if (showCelebration || !level) return;
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);

    if (key === level.targetKey) {
      playCorrect();
      speakLetterName(key);
      setNudgeKey(null);
      const nextCorrect = sessionCorrect + 1;
      setSessionCorrect(nextCorrect);
      onTokensEarned(1);

      if (nextCorrect >= SESSION_LENGTH) {
        // Tier complete — unlock next
        saveUnlockedTier(currentTierIndex + 1);
        setShowCelebration(true);
        setTimeout(() => {
          setTransitionMsg(`${KEY_HUNT_TIERS[currentTierIndex].label} complete! You found ${nextCorrect} keys!`);
          setPhase('transition');
        }, 1500);
        return;
      }

      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setLevelIndex(prev => prev + 1);
      }, 1200);
    } else {
      playTap();
      setNudgeKey(level.targetKey);
      setTimeout(() => setNudgeKey(null), 1500);
    }
  }, [level, showCelebration, sessionCorrect, currentTierIndex, playCorrect, playTap, speakLetterName, onTokensEarned]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      const k = e.key.toLowerCase();
      if (/^[a-z]$/.test(k)) handleKeyPress(k);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeyPress, phase]);

  // ── Transition ──
  if (phase === 'transition') {
    return <TransitionCountdown onComplete={onBack} message={transitionMsg} />;
  }

  // ── Tier Picker ──
  if (phase === 'pick-tier') {
    return (
      <div className="min-h-screen bg-background p-6">
        <button onClick={onBack} className="mb-6 px-4 py-2 rounded-xl bg-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">Key Hunt 🔍</h2>
        <p className="text-center text-muted-foreground text-sm mb-8">Pick a difficulty to start finding keys</p>

        <div className="space-y-3 max-w-md mx-auto">
          {KEY_HUNT_TIERS.map((tier, i) => {
            const isLocked = i > unlockedTier;
            const isCompleted = i < unlockedTier;
            return (
              <button
                key={tier.hint}
                onClick={() => !isLocked && startTier(i)}
                disabled={isLocked}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                  isLocked
                    ? 'opacity-40 cursor-not-allowed bg-muted/30'
                    : 'bg-card shadow-sm hover:shadow-md active:scale-[0.98]'
                }`}
              >
                <span className="text-3xl">{tier.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{tier.label}</h3>
                  <p className="text-xs text-muted-foreground">{tier.desc}</p>
                </div>
                {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                {isCompleted && <Check className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Playing ──
  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setPhase('pick-tier')} className="px-4 py-2 rounded-xl bg-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Tiers
        </button>
        <span className="text-xs font-medium text-muted-foreground">
          {KEY_HUNT_TIERS[currentTierIndex].emoji} {KEY_HUNT_TIERS[currentTierIndex].label}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">Key Hunt 🔍</h2>

      <div className="mb-4">
        <TypingProgressBar current={sessionCorrect} total={SESSION_LENGTH} label="Found" />
      </div>

      <div className="text-center my-4">
        {showCelebration ? (
          <div className="text-6xl">🎉</div>
        ) : level ? (
          <>
            {sessionCorrect === SESSION_LENGTH - 1 && (
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
            {nudgeKey && (
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-2">
                Almost! Try the glowing key 👉
              </p>
            )}
          </>
        ) : null}
      </div>

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
