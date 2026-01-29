import { useState } from 'react';
import { MathProfile } from '@/types/academics';
import { MathStudioHome } from './MathStudioHome';
import { MathSessionRunner } from './MathSessionRunner';
import { toast } from 'sonner';

interface MathModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type MathView = 'home' | 'session' | 'settings';

export function MathModule({ onBack, onTokensEarned }: MathModuleProps) {
  const [view, setView] = useState<MathView>('home');
  const [currentLessonId, setCurrentLessonId] = useState<string>('math-1');

  // Profile state (would come from database in production)
  const [profile, setProfile] = useState<MathProfile>({
    childId: 'child-1',
    currentLessonId: 'math-1',
    sessionMinutes: 7,
    level: 'concrete',
    streak: 3,
    totalProblems: 42,
    lastSessionDate: null,
  });

  const handleStartSession = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setView('session');
  };

  const handleSessionComplete = (tokensEarned: number, problemsCompleted: number) => {
    // Update profile
    setProfile(prev => ({
      ...prev,
      totalProblems: prev.totalProblems + problemsCompleted,
      streak: prev.streak + 1,
      lastSessionDate: new Date().toISOString(),
    }));

    onTokensEarned(tokensEarned);
    toast.success(`+${tokensEarned} tokens for math practice! 🧮`);
    setView('home');
  };

  const handleOpenSettings = () => {
    // For now, just show a toast - settings modal would go here
    toast('Settings coming soon!', { icon: '⚙️' });
  };

  if (view === 'session') {
    return (
      <MathSessionRunner
        profile={profile}
        lessonId={currentLessonId}
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
