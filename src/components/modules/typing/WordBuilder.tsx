import { useState, useCallback, useEffect, useMemo } from 'react';
import { KeyboardDisplay } from './KeyboardDisplay';
import { TypingProgressBar } from './TypingProgressBar';
import { TransitionCountdown } from './TransitionCountdown';
import { useSound } from '@/contexts/SoundContext';
import { WORD_BUILDER_LEVELS, getRandomWords, type WordBuilderWord } from '@/data/typingLessons';
import { KEYBOARD_ROWS } from '@/data/typingLessons';
import { ArrowLeft, Lock, Check } from 'lucide-react';

interface WordBuilderProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

const SESSION_WORDS = 5;

// Persist highest unlocked level
function getUnlockedLevel(): number {
  try { return parseInt(localStorage.getItem('word-builder-level') || '1', 10); } catch { return 1; }
}
function saveUnlockedLevel(level: number) {
  try {
    const current = getUnlockedLevel();
    if (level > current) localStorage.setItem('word-builder-level', String(level));
  } catch { /* noop */ }
}

type Phase = 'pick-level' | 'playing' | 'transition';

export function WordBuilder({ onBack, onTokensEarned }: WordBuilderProps) {
  const { speakLetterName, playCorrect, playComplete, playTap, speakWord } = useSound();
  const [phase, setPhase] = useState<Phase>('pick-level');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [sessionWords, setSessionWords] = useState<WordBuilderWord[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [nudgeKey, setNudgeKey] = useState<string | null>(null);
  const [transitionMsg, setTransitionMsg] = useState('');
  const unlockedLevel = getUnlockedLevel();

  const currentWord = sessionWords[wordIndex];
  const targetChar = currentWord?.word[charIndex];

  const startLevel = useCallback((level: 1 | 2 | 3 | 4 | 5) => {
    setDifficulty(level);
    setSessionWords(getRandomWords(level, SESSION_WORDS));
    setWordIndex(0);
    setCharIndex(0);
    setWordsCompleted(0);
    setShowCelebration(false);
    setNudgeKey(null);
    setPhase('playing');
  }, []);

  // Visible keys: word keys + distractors
  const visibleKeys = useMemo(() => {
    if (!currentWord) return KEYBOARD_ROWS.flat();
    const wordKeys = [...new Set(currentWord.word.split(''))];
    const allKeys = KEYBOARD_ROWS.flat();
    const distractors = allKeys.filter(k => !wordKeys.includes(k)).sort(() => Math.random() - 0.5).slice(0, Math.max(6, 10 - wordKeys.length));
    return [...wordKeys, ...distractors];
  }, [currentWord?.word]);

  const handleKeyPress = useCallback((key: string) => {
    if (showCelebration || !currentWord) return;
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);

    if (key === targetChar) {
      speakLetterName(key);
      playCorrect();
      setNudgeKey(null);
      onTokensEarned(1);

      if (charIndex + 1 >= currentWord.word.length) {
        playComplete();
        speakWord(currentWord.word);
        setWordsCompleted(prev => prev + 1);
        setShowCelebration(true);

        const nextCompleted = wordsCompleted + 1;
        if (nextCompleted >= SESSION_WORDS) {
          // Level complete — unlock next
          const nextLevel = Math.min(difficulty + 1, 5) as 1 | 2 | 3 | 4 | 5;
          saveUnlockedLevel(nextLevel);
          setTimeout(() => {
            setTransitionMsg(`Level ${difficulty} complete! You typed ${nextCompleted} words!`);
            setPhase('transition');
          }, 2000);
        } else {
          setTimeout(() => {
            setShowCelebration(false);
            setCharIndex(0);
            setWordIndex(prev => prev + 1);
          }, 2000);
        }
      } else {
        setCharIndex(prev => prev + 1);
      }
    } else {
      playTap();
      setNudgeKey(targetChar);
      setTimeout(() => setNudgeKey(null), 1500);
    }
  }, [targetChar, charIndex, currentWord, showCelebration, wordsCompleted, difficulty, speakLetterName, playCorrect, playComplete, playTap, speakWord, onTokensEarned]);

  // Physical keyboard
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

  // ── Transition screen ──
  if (phase === 'transition') {
    return (
      <TransitionCountdown
        onComplete={onBack}
        message={transitionMsg}
      />
    );
  }

  // ── Level picker ──
  if (phase === 'pick-level') {
    return (
      <div className="min-h-screen bg-background p-6">
        <button onClick={onBack} className="mb-6 px-4 py-2 rounded-xl bg-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">Word Builder 🔤</h2>
        <p className="text-center text-muted-foreground text-sm mb-8">Pick a level to start typing words</p>

        <div className="space-y-3 max-w-md mx-auto">
          {WORD_BUILDER_LEVELS.map((level) => {
            const isLocked = level.difficulty > unlockedLevel;
            const isCompleted = level.difficulty < unlockedLevel;
            return (
              <button
                key={level.difficulty}
                onClick={() => !isLocked && startLevel(level.difficulty)}
                disabled={isLocked}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                  isLocked
                    ? 'opacity-40 cursor-not-allowed bg-muted/30'
                    : 'bg-card shadow-sm hover:shadow-md active:scale-[0.98]'
                }`}
              >
                <span className="text-3xl">{level.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Level {level.difficulty}</h3>
                    <span className="text-xs text-muted-foreground">({level.label})</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{level.desc}</p>
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
        <button onClick={() => setPhase('pick-level')} className="px-4 py-2 rounded-xl bg-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Levels
        </button>
        <span className="text-xs font-medium text-muted-foreground">
          Level {difficulty} · {WORD_BUILDER_LEVELS[difficulty - 1].label}
        </span>
      </div>

      {/* Session progress */}
      <div className="mb-4">
        <TypingProgressBar current={wordsCompleted} total={SESSION_WORDS} label="Words" />
      </div>

      {/* Word display */}
      <div className="flex-1 flex flex-col items-center justify-center mb-4">
        {showCelebration && currentWord ? (
          <div className="text-center">
            <span className="text-7xl">{currentWord.emoji}</span>
            <p className="text-3xl font-black mt-3 text-primary">{currentWord.word.toUpperCase()}!</p>
            <p className="text-xl mt-2">🎉 Great job! 🎉</p>
          </div>
        ) : currentWord ? (
          <>
            {wordsCompleted === SESSION_WORDS - 1 && (
              <p className="text-sm font-semibold text-primary mb-2">⭐ Last word!</p>
            )}
            <span className="text-6xl mb-4">{currentWord.emoji}</span>

            <div className="flex gap-2">
              {currentWord.word.split('').map((char, i) => (
                <div
                  key={i}
                  className={`w-14 h-16 rounded-xl border flex items-center justify-center text-3xl font-black transition-all ${
                    i < charIndex
                      ? 'bg-primary/10 border-primary text-primary'
                      : i === charIndex
                      ? 'border-primary border-dashed bg-primary/5'
                      : 'border-muted bg-muted/20 text-transparent'
                  }`}
                >
                  {i < charIndex ? char.toUpperCase() : i === charIndex ? '_' : char.toUpperCase()}
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              Type: <span className="text-primary font-bold text-lg">{targetChar?.toUpperCase()}</span>
            </p>

            {nudgeKey && (
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-2">
                Almost! Look for the glowing key 👉
              </p>
            )}
          </>
        ) : null}
      </div>

      <div className="pb-4">
        <KeyboardDisplay
          onKeyPress={handleKeyPress}
          highlightedKeys={showCelebration || !targetChar ? [] : [targetChar, ...(nudgeKey ? [nudgeKey] : [])]}
          visibleKeys={showCelebration ? undefined : visibleKeys}
          pressedKey={pressedKey}
          size="large"
        />
      </div>
    </div>
  );
}
