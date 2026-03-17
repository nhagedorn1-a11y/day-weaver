import { useState, useCallback } from 'react';
import { ReadingProfile } from '@/types/reading';
import { readingLessons, getLesson, getNextLesson, TOTAL_LESSONS } from '@/data/readingLessons';
import { ReadingStudioHome } from './ReadingStudioHome';
import { ReadingSetup } from './ReadingSetup';
import { SessionRunner } from './SessionRunner';
import { Star, ArrowLeft, Flame } from 'lucide-react';
import { useLessonProgress } from '@/hooks/useLessonProgress';

interface ReadingStudioProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

export function ReadingStudio({ onBack, onTokensEarned }: ReadingStudioProps) {
  const [view, setView] = useState<'home' | 'setup' | 'session' | 'complete'>('home');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [lastSessionResult, setLastSessionResult] = useState<{
    tokensEarned: number;
    durationSeconds: number;
  } | null>(null);

  // Persistent progress
  const progress = useLessonProgress({
    subject: 'reading',
    defaultLessonId: 'lesson-1',
    defaultSessionMinutes: 7,
    totalLessons: TOTAL_LESSONS,
    getNextLessonId: (currentId) => {
      const next = getNextLesson(currentId);
      return next?.id ?? null;
    },
  });

  // Build a ReadingProfile from persisted progress for child components
  const profile: ReadingProfile = {
    childId: 'jack',
    currentLessonId: progress.currentLessonId,
    sessionMinutes: progress.sessionMinutes,
    tokenRewardEnabled: true,
    streak: progress.streak,
    totalMinutes: progress.totalMinutes,
    lastSessionDate: progress.lastSessionDate,
  };

  const handleStartSession = useCallback((lessonId: string) => {
    setCurrentLessonId(lessonId);
    setView('session');
  }, []);

  const handleSessionComplete = useCallback((tokensEarned: number, durationSeconds: number) => {
    setLastSessionResult({ tokensEarned, durationSeconds });

    // Persist progress & auto-advance to next lesson
    progress.completeSession({
      durationSeconds,
      problemsCompleted: 0,
    });

    onTokensEarned(tokensEarned);
    setView('complete');
  }, [onTokensEarned, progress]);

  const handleProfileUpdate = useCallback((updates: Partial<ReadingProfile>) => {
    if (updates.sessionMinutes !== undefined) {
      progress.updateConfig({ sessionMinutes: updates.sessionMinutes });
    }
  }, [progress]);

  const currentLesson = currentLessonId ? getLesson(currentLessonId) : null;

  // Render based on current view
  if (view === 'session' && currentLesson) {
    return (
      <SessionRunner
        lesson={currentLesson}
        sessionMinutes={progress.sessionMinutes}
        onComplete={handleSessionComplete}
        onExit={() => setView('home')}
      />
    );
  }

  if (view === 'setup') {
    return (
      <ReadingSetup
        profile={profile}
        onSave={handleProfileUpdate}
        onBack={() => setView('home')}
      />
    );
  }

  if (view === 'complete' && lastSessionResult) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="text-8xl mb-6 animate-float">📚</div>

        <h1 className="text-4xl font-bold mb-2">Amazing Reading!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          You practiced for {Math.floor(lastSessionResult.durationSeconds / 60)} minutes
        </p>

        <div className="flex gap-4 mb-8">
          <div className="bg-token/10 rounded-2xl p-4 flex flex-col items-center">
            <Star className="w-8 h-8 text-token mb-1" />
            <span className="text-2xl font-bold text-token">+{lastSessionResult.tokensEarned}</span>
            <span className="text-xs text-muted-foreground">tokens</span>
          </div>
          <div className="bg-calm/10 rounded-2xl p-4 flex flex-col items-center">
            <Flame className="w-8 h-8 text-primary mb-1" />
            <span className="text-2xl font-bold">{progress.streak}</span>
            <span className="text-xs text-muted-foreground">day streak</span>
          </div>
        </div>

        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={() => setView('home')}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg"
          >
            Done!
          </button>

          <button
            onClick={() => {
              if (currentLesson) {
                handleStartSession(currentLesson.id);
              }
            }}
            className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
          >
            Do One More 30-Second Win
          </button>
        </div>
      </div>
    );
  }

  // Home view
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 left-4 z-50 safe-top">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/80 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <ReadingStudioHome
        profile={profile}
        onStartSession={handleStartSession}
        onOpenSettings={() => setView('setup')}
      />
    </div>
  );
}
