import { useState } from 'react';
import { ReadingProfile } from '@/types/reading';
import { readingLessons, getLesson } from '@/data/readingLessons';
import { Book, Clock, Star, ChevronRight, Settings, Flame, Check, Award } from 'lucide-react';

interface ReadingStudioHomeProps {
  profile: ReadingProfile;
  onStartSession: (lessonId: string) => void;
  onOpenSettings: () => void;
}

const SESSION_STEPS = [
  { id: 'A', label: 'Warm-Up', description: 'Quick sound blending' },
  { id: 'B', label: 'Review', description: 'Cards we know' },
  { id: 'C', label: 'New Learning', description: 'One new skill' },
  { id: 'D', label: 'Practice', description: 'Read new words' },
  { id: 'E', label: 'Sentences', description: 'Put it together' },
  { id: 'F', label: 'Finish', description: 'Celebrate!' },
];

export function ReadingStudioHome({ profile, onStartSession, onOpenSettings }: ReadingStudioHomeProps) {
  const currentLesson = getLesson(profile.currentLessonId) || readingLessons[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 safe-top border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Book className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Reading Studio</h1>
            <span className="hw-label">Lesson {currentLesson.order} of {readingLessons.length}</span>
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
        {/* Streak + stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-token/10 rounded-2xl p-4 flex items-center gap-3">
            <Flame className="w-8 h-8 text-token" />
            <div>
              <span className="text-2xl font-bold">{profile.streak}</span>
              <span className="text-sm text-muted-foreground block">day streak</span>
            </div>
          </div>
          <div className="flex-1 bg-calm/10 rounded-2xl p-4 flex items-center gap-3">
            <Clock className="w-8 h-8 text-calm" />
            <div>
              <span className="text-2xl font-bold">{profile.totalMinutes}</span>
              <span className="text-sm text-muted-foreground block">total min</span>
            </div>
          </div>
        </div>

        {/* Today's lesson card */}
        <div className="bg-card rounded-3xl border-2 border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="hw-label">Today's Lesson</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">{profile.sessionMinutes} min</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
          <p className="text-muted-foreground mb-4">
            Learn the {currentLesson.newGraphemes[0]?.phoneme} sound
          </p>

          {/* New grapheme preview with visual cue */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-24 rounded-xl bg-primary text-primary-foreground flex flex-col items-center justify-center">
              {currentLesson.newGraphemes[0]?.keywordEmoji && (
                <span className="text-2xl mb-0.5">{currentLesson.newGraphemes[0].keywordEmoji}</span>
              )}
              <span className="text-3xl font-bold">{currentLesson.newGraphemes[0]?.grapheme}</span>
              <span className="text-xs font-mono opacity-80">{currentLesson.newGraphemes[0]?.phoneme}</span>
            </div>
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">
                {currentLesson.newGraphemes[0]?.keyword && (
                  <>{currentLesson.newGraphemes[0].keywordEmoji} = "{currentLesson.newGraphemes[0].keyword}"</>
                )}
              </span>
              <p className="font-medium mt-1">Words like: {currentLesson.wordList.slice(0, 3).map(w => w.word).join(', ')}</p>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={() => onStartSession(currentLesson.id)}
            className="giant-button w-full bg-primary text-primary-foreground hover:scale-105 transition-transform"
          >
            <Book className="w-8 h-8" />
            <span>Start Reading</span>
          </button>
        </div>

        {/* Session plan (A-F steps) */}
        <div>
          <span className="hw-label block mb-3">Today's Plan</span>
          <div className="space-y-2">
            {SESSION_STEPS.map((step, index) => (
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

        {/* Lesson progress */}
        <div>
          <span className="hw-label block mb-3">All Lessons</span>
          <div className="space-y-2">
            {readingLessons.map((lesson, index) => {
              const isCurrent = lesson.id === profile.currentLessonId;
              const isPast = lesson.order < (currentLesson?.order || 1);
              
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
                    <span className="text-sm text-muted-foreground block">{lesson.newGraphemes[0]?.phoneme}</span>
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
