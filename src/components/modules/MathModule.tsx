import { useState } from 'react';
import { MathProfile } from '@/types/academics';
import { MathStudioHome } from './MathStudioHome';
import { MathSessionRunner } from './MathSessionRunner';
import { getNextMathLesson, TOTAL_MATH_LESSONS } from '@/data/mathLessonGenerator';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { toast } from 'sonner';

interface MathModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type MathView = 'home' | 'session' | 'settings';

export function MathModule({ onBack, onTokensEarned }: MathModuleProps) {
  const [view, setView] = useState<MathView>('home');
  const [currentSessionLessonId, setCurrentSessionLessonId] = useState<string>('math-1');

  // Persistent progress
  const progress = useLessonProgress({
    subject: 'math',
    defaultLessonId: 'math-1',
    defaultSessionMinutes: 7,
    defaultLevel: 'concrete',
    totalLessons: TOTAL_MATH_LESSONS,
    getNextLessonId: (currentId) => {
      const next = getNextMathLesson(currentId);
      return next?.id ?? null;
    },
  });

  // Build MathProfile from persisted progress
  const profile: MathProfile = {
    childId: 'child-1',
    currentLessonId: progress.currentLessonId,
    sessionMinutes: (progress.sessionMinutes === 5 || progress.sessionMinutes === 7 || progress.sessionMinutes === 10 ? progress.sessionMinutes : 7) as 5 | 7 | 10,
    level: progress.level as 'concrete' | 'pictorial' | 'abstract',
    streak: progress.streak,
    totalProblems: progress.totalProblems,
    lastSessionDate: progress.lastSessionDate,
  };

  const handleStartSession = (lessonId: string) => {
    setCurrentSessionLessonId(lessonId);
    setView('session');
  };

  const handleSessionComplete = (tokensEarned: number, problemsCompleted: number) => {
    // Persist & auto-advance
    progress.completeSession({
      durationSeconds: progress.sessionMinutes * 60,
      problemsCompleted,
    });

    onTokensEarned(tokensEarned);
    toast.success(`+${tokensEarned} tokens for math practice! 🧮`);
    setView('home');
  };

  const handleOpenSettings = () => {
    toast('Settings coming soon!', { icon: '⚙️' });
  };

  if (view === 'session') {
    return (
      <MathSessionRunner
        profile={profile}
        lessonId={currentSessionLessonId}
        onComplete={handleSessionComplete}
        onExit={() => setView('home')}
      />
    );
  }

  return (
    <MathStudioHome
      profile={profile}
      onStartSession={handleStartSession}
      onOpenSettings={handleOpenSettings}
      onBack={onBack}
    />
  );
}
