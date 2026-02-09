import { useState, useCallback, useEffect } from 'react';
import { KeyboardDisplay } from './KeyboardDisplay';
import { useSound } from '@/contexts/SoundContext';
import { HOME_ROW_LESSONS } from '@/data/typingLessons';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface HomeRowHeroesProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

export function HomeRowHeroes({ onBack, onTokensEarned }: HomeRowHeroesProps) {
  const { speakPhoneme, playCorrect, playComplete, playTap } = useSound();
  const [lessonIndex, setLessonIndex] = useState(0);
  const [targetKeyIndex, setTargetKeyIndex] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const lesson = HOME_ROW_LESSONS[lessonIndex];
  const targetKey = lesson?.keys[targetKeyIndex];
  const isAllDone = completedLessons.length === HOME_ROW_LESSONS.length;

  const handleKeyPress = useCallback((key: string) => {
    if (!targetKey || isAllDone) return;
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);

    if (key === targetKey) {
      speakPhoneme(key);
      playCorrect();
      if (targetKeyIndex + 1 >= lesson.keys.length) {
        // Lesson complete
        playComplete();
        onTokensEarned(1);
        setCompletedLessons(prev => [...prev, lesson.id]);
        setTargetKeyIndex(0);
        if (lessonIndex + 1 < HOME_ROW_LESSONS.length) {
          setLessonIndex(prev => prev + 1);
        }
      } else {
        setTargetKeyIndex(prev => prev + 1);
      }
    } else {
      playTap();
    }
  }, [targetKey, targetKeyIndex, lesson, lessonIndex, isAllDone, speakPhoneme, playCorrect, playComplete, playTap, onTokensEarned]);

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
      <button onClick={onBack} className="self-start mb-4 px-4 py-2 rounded-xl bg-secondary flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h2 className="text-2xl font-bold text-center mb-2">Home Row Heroes 🏠</h2>

      {/* Lesson selector */}
      <div className="flex justify-center gap-2 mb-4">
        {HOME_ROW_LESSONS.map((l, i) => (
          <button
            key={l.id}
            onClick={() => { setLessonIndex(i); setTargetKeyIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              lessonIndex === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {completedLessons.includes(l.id) && <CheckCircle className="inline w-3 h-3 mr-1" />}
            {l.title}
          </button>
        ))}
      </div>

      {isAllDone ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-6xl mb-4">🏆</span>
          <p className="text-2xl font-bold">All drills complete!</p>
          <p className="text-muted-foreground mt-2">You're a Home Row Hero!</p>
        </div>
      ) : (
        <>
          {/* Current target */}
          <div className="text-center my-6">
            <p className="text-muted-foreground text-sm mb-1">
              {lesson.hand === 'both' ? 'Both Hands' : `${lesson.hand === 'left' ? 'Left' : 'Right'} Hand`}
            </p>
            <p className="text-xl font-semibold">
              Press: <span className="text-4xl text-primary font-black">{targetKey?.toUpperCase()}</span>
            </p>
            {lesson.fingerMap[targetKey || ''] && (
              <p className="text-sm text-muted-foreground mt-1">
                Use your {lesson.fingerMap[targetKey || '']} finger
              </p>
            )}
            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {lesson.keys.map((k, i) => (
                <div
                  key={k}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i < targetKeyIndex ? 'bg-primary' : i === targetKeyIndex ? 'bg-primary/50 animate-pulse' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-auto pb-4">
            <KeyboardDisplay
              onKeyPress={handleKeyPress}
              highlightedKeys={targetKey ? [targetKey] : []}
              colorZone="home"
              showFingerGuides
              pressedKey={pressedKey}
              size="large"
            />
          </div>
        </>
      )}
    </div>
  );
}
