import { useState, useMemo } from 'react';
import { MathProfile } from '@/types/academics';
import { mathLessons, getMathLesson, getTodaysMathLesson, TOTAL_MATH_LESSONS } from '@/data/mathLessonGenerator';
import { 
  Calculator, Clock, Star, ChevronRight, Settings, Flame, Check, 
  Shuffle, RefreshCw, ArrowLeft, Sparkles 
} from 'lucide-react';

interface MathStudioHomeProps {
  profile: MathProfile;
  onStartSession: (lessonId: string) => void;
  onOpenSettings: () => void;
  onBack: () => void;
}

const SESSION_STEPS = [
  { id: 'A', label: 'Warm-Up', description: 'Quick mental math' },
  { id: 'B', label: 'Review', description: 'What we know' },
  { id: 'C', label: 'New Learning', description: 'One new concept' },
  { id: 'D', label: 'Practice', description: 'Solve problems' },
  { id: 'E', label: 'Challenge', description: 'Think harder!' },
  { id: 'F', label: 'Finish', description: 'Celebrate!' },
];

export function MathStudioHome({ profile, onStartSession, onOpenSettings, onBack }: MathStudioHomeProps) {
  const currentLessonIndex = useMemo(() => {
    const staticLesson = mathLessons.find(l => l.id === profile.currentLessonId);
    return staticLesson ? staticLesson.order - 1 : 0;
  }, [profile.currentLessonId]);

  const todaysLesson = useMemo(() => {
    const daily = getTodaysMathLesson(currentLessonIndex);
    return daily || getMathLesson(profile.currentLessonId) || mathLessons[0];
  }, [currentLessonIndex, profile.currentLessonId]);

  const isReviewDay = todaysLesson.id.startsWith('math-review-');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 safe-top border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">Math Studio</h1>
            <span className="hw-label">
              {isReviewDay ? 'Review Day!' : `Lesson ${currentLessonIndex + 1} of ${TOTAL_MATH_LESSONS}`}
            </span>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
        >
          <Settings className="w-5 h-5 text-secondary-foreground" />
        </button>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-token/10 rounded-2xl p-4 flex items-center gap-3">
            <Flame className="w-8 h-8 text-token" />
            <div>
              <span className="text-2xl font-bold">{profile.streak}</span>
              <span className="text-sm text-muted-foreground block">day streak</span>
            </div>
          </div>
          <div className="flex-1 bg-primary/10 rounded-2xl p-4 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-primary" />
            <div>
              <span className="text-2xl font-bold">{profile.totalProblems}</span>
              <span className="text-sm text-muted-foreground block">problems</span>
            </div>
          </div>
        </div>

        {/* Today's lesson card */}
        <div className={`rounded-3xl border-2 p-6 ${isReviewDay ? 'bg-gradient-to-br from-token/10 to-primary/10 border-token/30' : 'bg-card border-border'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isReviewDay && <Shuffle className="w-4 h-4 text-token" />}
              <span className="hw-label">{isReviewDay ? 'Review Session' : "Today's Lesson"}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">{profile.sessionMinutes} min</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">{todaysLesson.title}</h2>
          <p className="text-muted-foreground mb-4">
            {isReviewDay 
              ? 'Practice problems you\'ve learned'
              : todaysLesson.newConcepts[0]?.description || 'Learn something new!'
            }
          </p>

          {/* Concept preview */}
          {todaysLesson.newConcepts[0] && (
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-24 rounded-xl bg-primary text-primary-foreground flex flex-col items-center justify-center">
                <span className="text-3xl mb-1">{todaysLesson.newConcepts[0].emoji}</span>
                <span className="text-sm font-bold">{todaysLesson.newConcepts[0].symbol}</span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-muted-foreground">
                  {todaysLesson.newConcepts[0].name}
                </span>
                <p className="font-medium mt-1">
                  {todaysLesson.practiceProblems.length} practice problems
                </p>
              </div>
            </div>
          )}

          {/* Review day preview */}
          {isReviewDay && (
            <div className="flex flex-wrap gap-2 mb-6">
              {todaysLesson.warmUpProblems.slice(0, 4).map((problem) => (
                <span key={problem.id} className="px-3 py-1.5 rounded-lg bg-background/50 font-mono font-medium text-sm">
                  {problem.prompt.split('?')[0]}?
                </span>
              ))}
            </div>
          )}

          {/* Level indicator */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Level:</span>
            <div className="flex gap-1">
              {['concrete', 'pictorial', 'abstract'].map((level) => (
                <div
                  key={level}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    profile.level === level 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {level === 'concrete' ? '🧱' : level === 'pictorial' ? '🖼️' : '🔢'} {level}
                </div>
              ))}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={() => onStartSession(todaysLesson.id)}
            className="giant-button w-full bg-primary text-primary-foreground hover:scale-105 transition-transform"
          >
            {isReviewDay ? <RefreshCw className="w-8 h-8" /> : <Calculator className="w-8 h-8" />}
            <span>{isReviewDay ? 'Start Review' : 'Start Math'}</span>
          </button>
        </div>

        {/* Session plan */}
        <div>
          <span className="hw-label block mb-3">Today's Plan</span>
          <div className="space-y-2">
            {SESSION_STEPS.map((step) => (
              <div
                key={step.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/50"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-mono font-bold text-sm">
                  {step.id}
                </div>
                <div className="flex-1">
                  <span className="font-medium">{step.label}</span>
                  <span className="text-sm text-muted-foreground block">{step.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All lessons */}
        <div>
          <span className="hw-label block mb-3">All Lessons</span>
          <div className="space-y-2">
            {mathLessons.map((lesson) => {
              const isCurrent = lesson.id === profile.currentLessonId;
              const isPast = lesson.order < (currentLessonIndex + 1);
              
              return (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    isCurrent ? 'bg-primary/10 border-2 border-primary' : isPast ? 'bg-calm/10' : 'bg-muted/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isPast ? 'bg-calm text-calm-foreground' : isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {isPast ? <Check className="w-4 h-4" /> : lesson.order}
                  </div>
                  <div className="flex-1">
                    <span className={`font-medium ${isPast ? 'text-muted-foreground' : ''}`}>{lesson.title}</span>
                    <span className="text-sm text-muted-foreground block">
                      {lesson.newConcepts[0]?.emoji} {lesson.newConcepts[0]?.name}
                    </span>
                  </div>
                  {isCurrent && (
                    <ChevronRight className="w-5 h-5 text-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
