import { useState, useCallback, useEffect } from 'react';
import { KeyboardDisplay } from './KeyboardDisplay';
import { useSound } from '@/contexts/SoundContext';
import { PC_CONTROL_LESSONS } from '@/data/typingLessons';
import { ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';

interface PCControlsProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

export function PCControls({ onBack, onTokensEarned }: PCControlsProps) {
  const { playTap, playComplete } = useSound();
  const [lessonIndex, setLessonIndex] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [triedKeys, setTriedKeys] = useState<Set<string>>(new Set());
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const lesson = PC_CONTROL_LESSONS[lessonIndex];
  const isLessonTried = triedKeys.has(lesson?.key || '');

  const handleKeyPress = useCallback((key: string) => {
    playTap();
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);

    if (lesson && (key === lesson.key || (lesson.key === 'arrows' && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)))) {
      setTriedKeys(prev => new Set(prev).add(lesson.key));
    }
  }, [lesson, playTap]);

  const handleComplete = useCallback(() => {
    if (!lesson) return;
    playComplete();
    onTokensEarned(1);
    setCompletedLessons(prev => [...prev, lesson.id]);
    setTriedKeys(new Set());
    if (lessonIndex + 1 < PC_CONTROL_LESSONS.length) {
      setLessonIndex(prev => prev + 1);
    }
  }, [lesson, lessonIndex, playComplete, onTokensEarned]);

  // Physical keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      const k = e.key.toLowerCase();
      if (k === ' ') handleKeyPress('space');
      else if (k === 'enter') handleKeyPress('enter');
      else if (k === 'backspace') handleKeyPress('backspace');
      else if (k === 'shift') handleKeyPress('shift');
      else if (k.startsWith('arrow')) handleKeyPress(k);
      else if (/^[a-z]$/.test(k)) handleKeyPress(k);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeyPress]);

  const allDone = completedLessons.length === PC_CONTROL_LESSONS.length;

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <button onClick={onBack} className="self-start mb-4 px-4 py-2 rounded-xl bg-secondary flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h2 className="text-2xl font-bold text-center mb-4">PC Controls 🖥️</h2>

      {allDone ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-6xl mb-4">🏆</span>
          <p className="text-2xl font-bold">All controls learned!</p>
          <p className="text-muted-foreground mt-2">You know your way around a keyboard!</p>
        </div>
      ) : lesson ? (
        <>
          {/* Lesson card */}
          <div className="bg-card rounded-2xl border-2 border-border p-6 mb-6">
            <div className="text-center">
              <span className="text-5xl">{lesson.emoji}</span>
              <h3 className="text-xl font-bold mt-3">{lesson.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{lesson.explanation}</p>
              <div className="mt-4 p-3 bg-primary/10 rounded-xl">
                <p className="font-semibold text-primary">{lesson.tryItPrompt}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-2 mb-4">
            {PC_CONTROL_LESSONS.map((l, i) => (
              <div
                key={l.id}
                className={`w-3 h-3 rounded-full ${
                  completedLessons.includes(l.id) ? 'bg-primary' : i === lessonIndex ? 'bg-primary/50 animate-pulse' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {isLessonTried && (
            <button
              onClick={handleComplete}
              className="mx-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 mb-4"
            >
              <CheckCircle className="w-5 h-5" />
              Got it! Next <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div className="mt-auto pb-4">
            <KeyboardDisplay
              onKeyPress={handleKeyPress}
              pressedKey={pressedKey}
              specialKeys
              size="large"
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
