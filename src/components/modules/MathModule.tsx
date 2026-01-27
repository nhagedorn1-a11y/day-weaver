import { useState } from 'react';
import { MathLevel, MathActivity } from '@/types/jackos';
import { ArrowLeft, Check, Star, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface MathModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type MathView = 'home' | 'counting' | 'compare' | 'activity';

const countingActivities = [
  { id: 'm1', title: 'Count Crayons', prompt: 'Count out 5 crayons', target: 5, icon: '🖍️' },
  { id: 'm2', title: 'Count Blocks', prompt: 'Stack 4 blocks', target: 4, icon: '🧱' },
  { id: 'm3', title: 'Count Steps', prompt: 'Take 6 steps', target: 6, icon: '👣' },
  { id: 'm4', title: 'Count Claps', prompt: 'Clap 3 times', target: 3, icon: '👏' },
  { id: 'm5', title: 'Count Snacks', prompt: 'Put 7 snacks in a bowl', target: 7, icon: '🍪' },
];

const compareActivities = [
  { id: 'c1', left: 3, right: 5, answer: 'more' as const },
  { id: 'c2', left: 4, right: 4, answer: 'same' as const },
  { id: 'c3', left: 6, right: 2, answer: 'less' as const },
  { id: 'c4', left: 1, right: 8, answer: 'more' as const },
  { id: 'c5', left: 5, right: 5, answer: 'same' as const },
];

export function MathModule({ onBack, onTokensEarned }: MathModuleProps) {
  const [view, setView] = useState<MathView>('home');
  const [currentLevel, setCurrentLevel] = useState<MathLevel>('concrete');
  const [activityIndex, setActivityIndex] = useState(0);
  const [compareIndex, setCompareIndex] = useState(0);
  const [score, setScore] = useState(0);

  const levels: { id: MathLevel; label: string; icon: string }[] = [
    { id: 'concrete', label: 'Objects', icon: '🧱' },
    { id: 'pictures', label: 'Pictures', icon: '🖼️' },
    { id: 'tallies', label: 'Tallies', icon: '📊' },
    { id: 'numbers', label: 'Numbers', icon: '🔢' },
  ];

  const handleCountingComplete = () => {
    setScore(prev => prev + 1);
    
    if (activityIndex < countingActivities.length - 1) {
      setActivityIndex(prev => prev + 1);
      toast.success('Great counting! 🎉');
    } else {
      onTokensEarned(3);
      toast.success('+3 tokens for counting practice! 🔢');
      setView('home');
      setActivityIndex(0);
    }
  };

  const handleCompareAnswer = (answer: 'more' | 'less' | 'same') => {
    const current = compareActivities[compareIndex];
    const isCorrect = answer === current.answer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success('Correct! 🎉');
      
      if (compareIndex < compareActivities.length - 1) {
        setCompareIndex(prev => prev + 1);
      } else {
        onTokensEarned(3);
        toast.success('+3 tokens for comparing! 🔢');
        setView('home');
        setCompareIndex(0);
      }
    } else {
      toast("Let's try again!", { icon: '🤔' });
    }
  };

  // Counting activity
  if (view === 'counting') {
    const activity = countingActivities[activityIndex];
    
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Counting Mission</h1>
            <span className="hw-label">{activityIndex + 1} of {countingActivities.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-token" />
            <span className="font-mono font-bold">{score}</span>
          </div>
        </header>

        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <span className="text-8xl mb-6">{activity.icon}</span>
          <h2 className="text-2xl font-bold mb-2 text-center">{activity.prompt}</h2>
          
          {/* Visual representation based on level */}
          <div className="flex flex-wrap justify-center gap-3 my-8 max-w-xs">
            {Array.from({ length: activity.target }, (_, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-xl bg-primary/20 border-2 border-primary flex items-center justify-center"
              >
                {currentLevel === 'numbers' ? (
                  <span className="font-mono font-bold">{i + 1}</span>
                ) : currentLevel === 'tallies' ? (
                  <span className="font-mono">|</span>
                ) : (
                  <span className="text-xl">{activity.icon}</span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleCountingComplete}
            className="giant-button w-full max-w-xs bg-calm text-calm-foreground"
          >
            <Check className="w-6 h-6" />
            <span>I counted {activity.target}!</span>
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pb-6">
          {countingActivities.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx < activityIndex ? 'bg-calm' : idx === activityIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Compare activity
  if (view === 'compare') {
    const current = compareActivities[compareIndex];
    
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Compare Sets</h1>
            <span className="hw-label">{compareIndex + 1} of {compareActivities.length}</span>
          </div>
        </header>

        <div className="p-6">
          <p className="text-center text-muted-foreground mb-6">
            Which side has MORE dots?
          </p>

          {/* Side by side comparison */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {/* Left side */}
            <div className="flex-1 bg-card rounded-3xl p-6 border-2 border-border">
              <div className="flex flex-wrap justify-center gap-2 min-h-[100px]">
                {Array.from({ length: current.left }, (_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-primary" />
                ))}
              </div>
              {currentLevel !== 'concrete' && (
                <div className="text-center mt-4 font-mono text-2xl font-bold">{current.left}</div>
              )}
            </div>

            <span className="text-2xl font-bold text-muted-foreground">vs</span>

            {/* Right side */}
            <div className="flex-1 bg-card rounded-3xl p-6 border-2 border-border">
              <div className="flex flex-wrap justify-center gap-2 min-h-[100px]">
                {Array.from({ length: current.right }, (_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-next" />
                ))}
              </div>
              {currentLevel !== 'concrete' && (
                <div className="text-center mt-4 font-mono text-2xl font-bold">{current.right}</div>
              )}
            </div>
          </div>

          {/* Answer buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleCompareAnswer('less')}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg"
            >
              Left has MORE
            </button>
            <button
              onClick={() => handleCompareAnswer('same')}
              className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-lg"
            >
              They're the SAME
            </button>
            <button
              onClick={() => handleCompareAnswer('more')}
              className="w-full py-4 rounded-2xl bg-next text-next-foreground font-semibold text-lg"
            >
              Right has MORE
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
          <h1 className="font-semibold text-lg">Math Foundations</h1>
          <span className="hw-label">Number sense games</span>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Level selector */}
        <div>
          <span className="hw-label block mb-3">Learning Level</span>
          <div className="flex gap-2">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setCurrentLevel(level.id)}
                className={`
                  flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all
                  ${currentLevel === level.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                  }
                `}
              >
                <span className="text-xl">{level.icon}</span>
                <span className="text-xs font-medium">{level.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="space-y-3">
          <button
            onClick={() => setView('counting')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
          >
            <span className="text-4xl">🔢</span>
            <div className="flex-1 text-left">
              <span className="font-semibold block">Counting Missions</span>
              <span className="text-sm text-muted-foreground">Count real things around you</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => setView('compare')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
          >
            <span className="text-4xl">⚖️</span>
            <div className="flex-1 text-left">
              <span className="font-semibold block">Compare Sets</span>
              <span className="text-sm text-muted-foreground">More, less, or same?</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => toast('Coming soon!', { icon: '🚧' })}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border-2 border-border opacity-60"
          >
            <span className="text-4xl">🎯</span>
            <div className="flex-1 text-left">
              <span className="font-semibold block">One-to-One</span>
              <span className="text-sm text-muted-foreground">Match items to numbers</span>
            </div>
            <span className="text-xs bg-secondary px-2 py-1 rounded">Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
}
