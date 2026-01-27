import { useState } from 'react';
import { heavyWorkActivities, interoceptionChecks } from '@/data/appContent';
import { HeavyWorkActivity, InteroceptionCheck } from '@/types/jackos';
import { VisualTimer } from '@/components/VisualTimer';
import { ArrowLeft, Headphones, VolumeX, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface SensoryModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type SensoryView = 'home' | 'heavyWork' | 'timer' | 'interoception' | 'quiet';

export function SensoryModule({ onBack, onTokensEarned }: SensoryModuleProps) {
  const [view, setView] = useState<SensoryView>('home');
  const [selectedActivity, setSelectedActivity] = useState<HeavyWorkActivity | null>(null);
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);

  const handleActivityComplete = () => {
    onTokensEarned(2);
    toast.success('+2 tokens for heavy work! 💪');
    setView('home');
    setSelectedActivity(null);
  };

  const handleCheckComplete = (check: InteroceptionCheck) => {
    setCompletedChecks(prev => [...prev, check.id]);
    toast.success('Body check complete! 👍');
  };

  // Timer view for heavy work
  if (view === 'timer' && selectedActivity) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col">
        <button
          onClick={() => setView('heavyWork')}
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-6xl mb-4">{selectedActivity.icon}</span>
          <h2 className="text-2xl font-bold mb-2">{selectedActivity.title}</h2>
          <p className="text-muted-foreground mb-8 text-center">{selectedActivity.description}</p>

          <VisualTimer
            duration={selectedActivity.duration}
            onComplete={handleActivityComplete}
            variant="circle"
            autoStart
          />
        </div>
      </div>
    );
  }

  // Heavy work menu
  if (view === 'heavyWork') {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Heavy Work</h1>
        </header>

        <div className="p-4 space-y-3">
          <p className="text-muted-foreground text-sm mb-4">
            Pick an activity to help your body feel calm and organized.
          </p>

          {heavyWorkActivities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => {
                setSelectedActivity(activity);
                setView('timer');
              }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-colors text-left"
            >
              <span className="text-3xl">{activity.icon}</span>
              <div className="flex-1">
                <span className="font-medium block">{activity.title}</span>
                <span className="text-sm text-muted-foreground">{activity.description}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono">{activity.duration}s</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Interoception checks
  if (view === 'interoception') {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Body Check</h1>
        </header>

        <div className="p-4 space-y-4">
          <p className="text-muted-foreground text-sm mb-4">
            Let's check in with your body. Answer each question.
          </p>

          {interoceptionChecks.map((check) => {
            const isComplete = completedChecks.includes(check.id);
            
            return (
              <div
                key={check.id}
                className={`
                  p-4 rounded-2xl border-2 transition-all
                  ${isComplete ? 'bg-calm/10 border-calm' : 'bg-card border-border'}
                `}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">{check.icon}</span>
                  <p className="text-lg font-medium flex-1">{check.prompt}</p>
                  {isComplete && <Check className="w-6 h-6 text-calm" />}
                </div>
                
                {!isComplete && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCheckComplete(check)}
                      className="flex-1 py-3 rounded-xl bg-calm text-calm-foreground font-medium"
                    >
                      Yes, I need to
                    </button>
                    <button
                      onClick={() => handleCheckComplete(check)}
                      className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
                    >
                      No, I'm okay
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {completedChecks.length === interoceptionChecks.length && (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✨</div>
              <p className="text-lg font-medium text-calm">All body checks complete!</p>
              <button
                onClick={() => {
                  setCompletedChecks([]);
                  setView('home');
                  onTokensEarned(1);
                  toast.success('+1 token for body check! 🧘');
                }}
                className="mt-4 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Done!
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Quiet mode
  if (view === 'quiet') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 rounded-full bg-calm/20 flex items-center justify-center mb-6 animate-breathe">
          <Headphones className="w-16 h-16 text-calm" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Quiet Mode</h2>
        <p className="text-muted-foreground mb-8">
          It's okay to need quiet. Put on your headphones if you have them.
        </p>

        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={() => {
              setView('home');
              toast.success('Great job taking a quiet break! 🎧');
            }}
            className="w-full py-4 rounded-2xl bg-calm text-calm-foreground font-semibold"
          >
            I'm Ready Now
          </button>
          <button
            onClick={() => setView('home')}
            className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Home view
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-semibold text-lg">Body & Sensory</h1>
          <span className="hw-label">Regulation & breaks</span>
        </div>
      </header>

      <div className="p-4 grid grid-cols-2 gap-4">
        {/* Heavy Work */}
        <button
          onClick={() => setView('heavyWork')}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
        >
          <span className="text-5xl">💪</span>
          <span className="font-semibold">Heavy Work</span>
          <span className="text-xs text-muted-foreground text-center">Calming activities</span>
        </button>

        {/* Body Check */}
        <button
          onClick={() => setView('interoception')}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
        >
          <span className="text-5xl">🧘</span>
          <span className="font-semibold">Body Check</span>
          <span className="text-xs text-muted-foreground text-center">How does your body feel?</span>
        </button>

        {/* Quiet Mode */}
        <button
          onClick={() => setView('quiet')}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
        >
          <span className="text-5xl">🎧</span>
          <span className="font-semibold">Quiet Mode</span>
          <span className="text-xs text-muted-foreground text-center">Need a quiet break</span>
        </button>

        {/* Movement Break */}
        <button
          onClick={() => {
            setSelectedActivity(heavyWorkActivities[1]); // Bear walk
            setView('timer');
          }}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
        >
          <span className="text-5xl">🏃</span>
          <span className="font-semibold">Move Break</span>
          <span className="text-xs text-muted-foreground text-center">Quick movement</span>
        </button>
      </div>
    </div>
  );
}
