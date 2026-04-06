import { useState, useCallback, useEffect, useMemo } from 'react';
import { KeyboardDisplay } from './KeyboardDisplay';
import { TypingProgressBar } from './TypingProgressBar';
import { TransitionCountdown } from './TransitionCountdown';
import { useSound } from '@/contexts/SoundContext';
import { WORD_BUILDER_WORDS, KEYBOARD_ROWS } from '@/data/typingLessons';
import { ArrowLeft } from 'lucide-react';

interface WordBuilderProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

const SESSION_WORDS = 3; // Rev 6: fixed session size

export function WordBuilder({ onBack, onTokensEarned }: WordBuilderProps) {
  const { speakLetterName, playCorrect, playComplete, playTap, speakWord } = useSound();
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [nudgeKey, setNudgeKey] = useState<string | null>(null); // Rev 3
  const [showTransition, setShowTransition] = useState(false);
  const [isLastWord, setIsLastWord] = useState(false); // Rev 8

  const currentWord = WORD_BUILDER_WORDS[wordIndex % WORD_BUILDER_WORDS.length];
  const targetChar = currentWord.word[charIndex];

  // Rev 1: Only show keys relevant to the word + a few distractors
  const visibleKeys = useMemo(() => {
    const wordKeys = [...new Set(currentWord.word.split(''))];
    const allKeys = KEYBOARD_ROWS.flat();
    const distractors = allKeys.filter(k => !wordKeys.includes(k)).sort(() => Math.random() - 0.5).slice(0, Math.max(6, 10 - wordKeys.length));
    return [...wordKeys, ...distractors];
  }, [currentWord.word]);

  const handleKeyPress = useCallback((key: string) => {
    if (showCelebration) return;
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);

    if (key === targetChar) {
      speakLetterName(key);
      playCorrect();
      setNudgeKey(null);

      // Rev 4: Token per correct letter
      onTokensEarned(1);

      if (charIndex + 1 >= currentWord.word.length) {
        playComplete();
        speakWord(currentWord.word);
        setWordsCompleted(prev => prev + 1);
        setShowCelebration(true);

        const nextCompleted = wordsCompleted + 1;
        if (nextCompleted >= SESSION_WORDS) {
          // Session done
          setTimeout(() => setShowTransition(true), 2000);
        } else {
          // Rev 8: "Last one!" warning
          if (nextCompleted === SESSION_WORDS - 1) {
            setIsLastWord(true);
          }
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
      // Rev 3: Supportive error feedback
      setNudgeKey(targetChar);
      setTimeout(() => setNudgeKey(null), 1500);
    }
  }, [targetChar, charIndex, currentWord, showCelebration, wordsCompleted, speakLetterName, playCorrect, playComplete, playTap, speakWord, onTokensEarned]);

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
        message={wordsCompleted >= SESSION_WORDS ? `Wow! You typed ${wordsCompleted} words!` : 'Great spelling!'}
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
          🌟 {wordsCompleted}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">Word Builder 🔤</h2>

      {/* Rev 6: Session progress */}
      <div className="mb-4">
        <TypingProgressBar current={wordsCompleted} total={SESSION_WORDS} label="Words" />
      </div>

      {/* Word display */}
      <div className="flex-1 flex flex-col items-center justify-center mb-4">
        {showCelebration ? (
          <div className="text-center">
            <span className="text-7xl">{currentWord.emoji}</span>
            <p className="text-3xl font-black mt-3 text-primary">{currentWord.word.toUpperCase()}!</p>
            <p className="text-xl mt-2">🎉 Great job! 🎉</p>
          </div>
        ) : (
          <>
            {/* Rev 8: "Last word!" */}
            {isLastWord && (
              <p className="text-sm font-semibold text-primary mb-2">⭐ Last word!</p>
            )}
            <span className="text-6xl mb-4">{currentWord.emoji}</span>

            {/* Letter progress within word */}
            <div className="flex gap-2">
              {currentWord.word.split('').map((char, i) => (
                <div
                  key={i}
                  className={`w-14 h-16 rounded-xl border-3 flex items-center justify-center text-3xl font-black transition-all ${
                    i < charIndex
                      ? 'bg-primary/10 border-primary text-primary'
                      : i === charIndex
                      ? 'border-primary border-dashed animate-pulse bg-primary/5'
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

            {/* Rev 3: Supportive error nudge */}
            {nudgeKey && (
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-2">
                Almost! Look for the glowing key 👉
              </p>
            )}
          </>
        )}
      </div>

      <div className="pb-4">
        <KeyboardDisplay
          onKeyPress={handleKeyPress}
          highlightedKeys={showCelebration ? [] : targetChar ? [targetChar, ...(nudgeKey ? [nudgeKey] : [])] : []}
          visibleKeys={showCelebration ? undefined : visibleKeys}
          pressedKey={pressedKey}
          size="large"
        />
      </div>
    </div>
  );
}
