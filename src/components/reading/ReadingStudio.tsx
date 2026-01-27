import { useState, useCallback } from 'react';
import { ReadingProfile, ReadingSessionLog } from '@/types/reading';
import { readingLessons, getLesson, getNextLesson } from '@/data/readingLessons';
import { ReadingStudioHome } from './ReadingStudioHome';
import { ReadingSetup } from './ReadingSetup';
import { SessionRunner } from './SessionRunner';
import { Star, ArrowLeft, Flame, Clock, Award, Book } from 'lucide-react';

interface ReadingStudioProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

// Demo profile - in real app, load from storage/API
const defaultProfile: ReadingProfile = {
  childId: 'jack',
  currentLessonId: 'lesson-1',
  sessionMinutes: 7,
  tokenRewardEnabled: true,
  streak: 3,
  totalMinutes: 42,
  lastSessionDate: null,
};

export function ReadingStudio({ onBack, onTokensEarned }: ReadingStudioProps) {
  const [view, setView] = useState<'home' | 'setup' | 'session' | 'complete'>('home');
  const [profile, setProfile] = useState<ReadingProfile>(defaultProfile);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [lastSessionResult, setLastSessionResult] = useState<{
    tokensEarned: number;
    durationSeconds: number;
  } | null>(null);

  const handleStartSession = useCallback((lessonId: string) => {
    setCurrentLessonId(lessonId);
    setView('session');
  }, []);

  const handleSessionComplete = useCallback((tokensEarned: number, durationSeconds: number) => {
    setLastSessionResult({ tokensEarned, durationSeconds });
    setProfile(prev => ({
      ...prev,
      totalMinutes: prev.totalMinutes + Math.floor(durationSeconds / 60),
      streak: prev.streak + 1,
      lastSessionDate: new Date().toISOString(),
    }));
    
    if (profile.tokenRewardEnabled) {
      onTokensEarned(tokensEarned);
    }
    
    setView('complete');
  }, [profile.tokenRewardEnabled, onTokensEarned]);

  const handleProfileUpdate = useCallback((updates: Partial<ReadingProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const currentLesson = currentLessonId ? getLesson(currentLessonId) : null;

  // Render based on current view
  if (view === 'session' && currentLesson) {
    return (
      <SessionRunner
        lesson={currentLesson}
        sessionMinutes={profile.sessionMinutes}
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
            <span className="text-2xl font-bold">{profile.streak}</span>
            <span className="text-xs text-muted-foreground">day streak</span>
          </div>
        </div>

        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={() => {
              // Advance to next lesson
              const next = getNextLesson(profile.currentLessonId);
              if (next) {
                setProfile(prev => ({ ...prev, currentLessonId: next.id }));
              }
              setView('home');
            }}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg"
          >
            Done!
          </button>
          
          <button
            onClick={() => {
              // Quick win - 30 more seconds
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

  // Home view with back button
  return (
    <div className="min-h-screen bg-background">
      {/* Back to main app */}
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
