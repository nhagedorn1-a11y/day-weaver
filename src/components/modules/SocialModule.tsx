import { useState } from 'react';
import { SocialStory, TurnTakingGame } from '@/types/jackos';
import { ArrowLeft, Plus, Play, Pause, Check, ChevronRight, Clock, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SocialModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type SocialView = 'home' | 'stories' | 'storyView' | 'storyCreate' | 'specialPlay' | 'turnTaking';

// Demo social stories
const demoStories: SocialStory[] = [
  {
    id: 'ss1',
    title: 'Going to the Store',
    situation: 'When we need groceries',
    steps: [
      'We will drive to the store.',
      'I will stay close to Mom or Dad.',
      'I can help put things in the cart.',
      'We will wait in line to pay.',
      'Then we will go home.',
    ],
    createdBy: 'parent',
  },
  {
    id: 'ss2',
    title: 'When Plans Change',
    situation: 'Sometimes plans change and that\'s okay',
    steps: [
      'Sometimes plans need to change.',
      'I might feel upset or worried.',
      'That\'s okay. My feelings are real.',
      'I can take a deep breath.',
      'There will be a new plan.',
      'I can handle changes.',
    ],
    createdBy: 'parent',
  },
];

export function SocialModule({ onBack, onTokensEarned }: SocialModuleProps) {
  const [view, setView] = useState<SocialView>('home');
  const [stories, setStories] = useState<SocialStory[]>(demoStories);
  const [selectedStory, setSelectedStory] = useState<SocialStory | null>(null);
  const [storyStepIndex, setStoryStepIndex] = useState(0);
  
  // Special play timer
  const [specialPlayTime, setSpecialPlayTime] = useState(300); // 5 minutes
  const [specialPlayRunning, setSpecialPlayRunning] = useState(false);
  
  // Turn taking
  const [currentTurn, setCurrentTurn] = useState<'child' | 'parent'>('child');
  const [turnTime, setTurnTime] = useState(30);
  const [turnRunning, setTurnRunning] = useState(false);

  // Story viewer
  if (view === 'storyView' && selectedStory) {
    const currentStep = selectedStory.steps[storyStepIndex];
    const progress = ((storyStepIndex + 1) / selectedStory.steps.length) * 100;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button 
            onClick={() => {
              setView('stories');
              setStoryStepIndex(0);
            }} 
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">{selectedStory.title}</h1>
            <span className="hw-label">Page {storyStepIndex + 1} of {selectedStory.steps.length}</span>
          </div>
        </header>

        {/* Progress */}
        <div className="px-4 pt-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-calm transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <p className="text-2xl font-medium leading-relaxed mb-8">
            {currentStep}
          </p>

          <div className="flex gap-4">
            {storyStepIndex > 0 && (
              <button
                onClick={() => setStoryStepIndex(prev => prev - 1)}
                className="px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
              >
                Back
              </button>
            )}
            
            {storyStepIndex < selectedStory.steps.length - 1 ? (
              <button
                onClick={() => setStoryStepIndex(prev => prev + 1)}
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => {
                  setView('stories');
                  setStoryStepIndex(0);
                  onTokensEarned(1);
                  toast.success('+1 token for reading the story! 📚');
                }}
                className="px-8 py-3 rounded-xl bg-calm text-calm-foreground font-semibold flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                Done!
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Stories list
  if (view === 'stories') {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg flex-1">Social Stories</h1>
          <button
            onClick={() => toast('Story builder coming soon!', { icon: '🚧' })}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </header>

        <div className="p-4 space-y-3">
          <p className="text-muted-foreground text-sm mb-4">
            Carol Gray-style stories to preview tricky situations.
          </p>

          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => {
                setSelectedStory(story);
                setStoryStepIndex(0);
                setView('storyView');
              }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-colors text-left"
            >
              <span className="text-3xl">📖</span>
              <div className="flex-1">
                <span className="font-semibold block">{story.title}</span>
                <span className="text-sm text-muted-foreground">{story.situation}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Special playtime
  if (view === 'specialPlay') {
    const minutes = Math.floor(specialPlayTime / 60);
    const seconds = specialPlayTime % 60;

    return (
      <div className="min-h-screen bg-calm flex flex-col">
        <header className="flex items-center gap-4 p-4 safe-top">
          <button 
            onClick={() => {
              setView('home');
              setSpecialPlayRunning(false);
              setSpecialPlayTime(300);
            }} 
            className="w-10 h-10 rounded-xl bg-calm-foreground/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-calm-foreground" />
          </button>
          <h1 className="font-semibold text-lg text-calm-foreground">Special Playtime</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-8xl mb-6">🎮</div>
          
          <div className="font-mono text-6xl font-bold text-calm-foreground mb-8">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>

          {/* Coaching tips */}
          <div className="bg-calm-foreground/10 rounded-2xl p-4 mb-8 max-w-sm">
            <span className="hw-label text-calm-foreground/60 block mb-2">Parent Coaching</span>
            <ul className="text-left text-calm-foreground space-y-2 text-sm">
              <li>✓ Follow their lead</li>
              <li>✓ Narrate what they're doing</li>
              <li>✓ Avoid questions</li>
              <li>✓ Avoid directions</li>
              <li>✓ Just enjoy being together</li>
            </ul>
          </div>

          <button
            onClick={() => {
              if (specialPlayRunning) {
                setSpecialPlayRunning(false);
              } else {
                setSpecialPlayRunning(true);
                // Start countdown
                const timer = setInterval(() => {
                  setSpecialPlayTime(prev => {
                    if (prev <= 1) {
                      clearInterval(timer);
                      setSpecialPlayRunning(false);
                      onTokensEarned(2);
                      toast.success('+2 tokens for special playtime! 🎮');
                      return 300;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }
            }}
            className="giant-button bg-calm-foreground/20 text-calm-foreground w-full max-w-xs"
          >
            {specialPlayRunning ? (
              <>
                <Pause className="w-8 h-8" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-8 h-8" />
                <span>Start 5 Minutes</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Turn taking
  if (view === 'turnTaking') {
    return (
      <div className={`min-h-screen flex flex-col ${currentTurn === 'child' ? 'bg-primary' : 'bg-next'}`}>
        <header className="flex items-center gap-4 p-4 safe-top">
          <button 
            onClick={() => {
              setView('home');
              setTurnRunning(false);
              setTurnTime(30);
            }} 
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="font-semibold text-lg text-white">Turn Taking</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="text-8xl mb-6">
            {currentTurn === 'child' ? '👦' : '👨'}
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            {currentTurn === 'child' ? "Jack's Turn!" : "Parent's Turn!"}
          </h2>

          <div className="font-mono text-6xl font-bold mb-8">
            {turnTime}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setCurrentTurn(prev => prev === 'child' ? 'parent' : 'child');
                setTurnTime(30);
              }}
              className="px-8 py-4 rounded-2xl bg-white/20 font-semibold text-lg"
            >
              Switch Turn
            </button>
          </div>
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
          <h1 className="font-semibold text-lg">Social & Play</h1>
          <span className="hw-label">Stories, play & flexibility</span>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Social Stories */}
        <button
          onClick={() => setView('stories')}
          className="w-full flex items-center gap-4 p-5 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
        >
          <span className="text-5xl">📖</span>
          <div className="flex-1 text-left">
            <span className="font-semibold text-lg block">Social Stories</span>
            <span className="text-sm text-muted-foreground">Preview tricky situations</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Special Playtime */}
        <button
          onClick={() => setView('specialPlay')}
          className="w-full flex items-center gap-4 p-5 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
        >
          <span className="text-5xl">🎮</span>
          <div className="flex-1 text-left">
            <span className="font-semibold text-lg block">Special Playtime</span>
            <span className="text-sm text-muted-foreground">5 min: follow lead, narrate, enjoy</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">5 min</span>
          </div>
        </button>

        {/* Turn Taking */}
        <button
          onClick={() => setView('turnTaking')}
          className="w-full flex items-center gap-4 p-5 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
        >
          <span className="text-5xl">🔄</span>
          <div className="flex-1 text-left">
            <span className="font-semibold text-lg block">Turn Taking Game</span>
            <span className="text-sm text-muted-foreground">Visual "my turn / your turn"</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
