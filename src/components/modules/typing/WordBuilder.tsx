import { useState, useCallback, useEffect } from 'react';
import { KeyboardDisplay } from './KeyboardDisplay';
import { useSound } from '@/contexts/SoundContext';
import { WORD_BUILDER_WORDS } from '@/data/typingLessons';
import { ArrowLeft } from 'lucide-react';

interface WordBuilderProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

export function WordBuilder({ onBack, onTokensEarned }: WordBuilderProps) {
  const { speakPhoneme, playCorrect, playComplete, playTap, speakWord } = useSound();
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);

  const currentWord = WORD_BUILDER_WORDS[wordIndex % WORD_BUILDER_WORDS.length];
  const targetChar = currentWord.word[charIndex];

  const handleKeyPress = useCallback((key: string) => {
    if (showCelebration) return;
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);

    if (key === targetChar) {
      speakPhoneme(key);
      playCorrect();
      if (charIndex + 1 >= currentWord.word.length) {
        // Word complete
        playComplete();
        speakWord(currentWord.word);
        onTokensEarned(2);
        setWordsCompleted(prev => prev + 1);
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          setCharIndex(0);
          setWordIndex(prev => prev + 1);
        }, 2000);
      } else {
        setCharIndex(prev => prev + 1);
      }
    } else {
      playTap();
    }
  }, [targetChar, charIndex, currentWord, showCelebration, speakPhoneme, playCorrect, playComplete, playTap, speakWord, onTokensEarned]);

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
          Words: {wordsCompleted} 🌟
        </span>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">Word Builder 🔤</h2>

      {/* Word display */}
      <div className="flex-1 flex flex-col items-center justify-center mb-6">
        {showCelebration ? (
          <div className="text-center">
            <span className="text-7xl">{currentWord.emoji}</span>
            <p className="text-3xl font-black mt-3 text-primary">{currentWord.word.toUpperCase()}!</p>
            <p className="text-xl mt-2">🎉 Great job! 🎉</p>
          </div>
        ) : (
          <>
            <span className="text-6xl mb-4">{currentWord.emoji}</span>
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
          </>
        )}
      </div>

      <div className="pb-4">
        <KeyboardDisplay
          onKeyPress={handleKeyPress}
          highlightedKeys={showCelebration ? [] : targetChar ? [targetChar] : []}
          pressedKey={pressedKey}
          size="large"
        />
      </div>
    </div>
  );
}
