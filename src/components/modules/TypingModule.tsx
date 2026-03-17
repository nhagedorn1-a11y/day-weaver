import { useState } from 'react';
import { ArrowLeft, Keyboard, Lock } from 'lucide-react';
import { FreePlay } from './typing/FreePlay';
import { KeyHunt } from './typing/KeyHunt';
import { HomeRowHeroes } from './typing/HomeRowHeroes';
import { WordBuilder } from './typing/WordBuilder';
import { PCControls } from './typing/PCControls';

type TypingView = 'home' | 'freePlay' | 'keyHunt' | 'homeRow' | 'wordBuilder' | 'pcControls';

interface TypingModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

// Rev 7: Ordered lanes with progressive unlock recommendations
const LANES = [
  { id: 'freePlay' as const, emoji: '🎹', title: 'Free Play', desc: 'Tap any key, see & hear it', color: 'bg-blue-100 dark:bg-blue-900/30', order: 0 },
  { id: 'keyHunt' as const, emoji: '🔍', title: 'Key Hunt', desc: 'Find the right key', color: 'bg-amber-100 dark:bg-amber-900/30', order: 1 },
  { id: 'homeRow' as const, emoji: '🏠', title: 'Home Row Heroes', desc: 'Learn finger positions', color: 'bg-emerald-100 dark:bg-emerald-900/30', order: 2 },
  { id: 'wordBuilder' as const, emoji: '🔤', title: 'Word Builder', desc: 'Type simple words', color: 'bg-purple-100 dark:bg-purple-900/30', order: 3 },
  { id: 'pcControls' as const, emoji: '🖥️', title: 'PC Controls', desc: 'Space, Enter, Backspace & more', color: 'bg-rose-100 dark:bg-rose-900/30', order: 4 },
];

// Simple local progression tracking (could be persisted later)
function getUnlockedLevel(): number {
  try {
    return parseInt(localStorage.getItem('keyboard-pilot-level') || '0', 10);
  } catch { return 0; }
}

function advanceLevel(current: number) {
  try {
    const stored = getUnlockedLevel();
    if (current >= stored) {
      localStorage.setItem('keyboard-pilot-level', String(current + 1));
    }
  } catch { /* noop */ }
}

export function TypingModule({ onBack, onTokensEarned }: TypingModuleProps) {
  const [view, setView] = useState<TypingView>('home');
  const unlockedLevel = getUnlockedLevel();

  const handleTokensEarned = (tokens: number, laneOrder: number) => {
    onTokensEarned(tokens);
    advanceLevel(laneOrder);
  };

  if (view === 'freePlay') return <FreePlay onBack={() => { advanceLevel(0); setView('home'); }} />;
  if (view === 'keyHunt') return <KeyHunt onBack={() => setView('home')} onTokensEarned={(t) => handleTokensEarned(t, 1)} />;
  if (view === 'homeRow') return <HomeRowHeroes onBack={() => setView('home')} onTokensEarned={(t) => handleTokensEarned(t, 2)} />;
  if (view === 'wordBuilder') return <WordBuilder onBack={() => setView('home')} onTokensEarned={(t) => handleTokensEarned(t, 3)} />;
  if (view === 'pcControls') return <PCControls onBack={() => setView('home')} onTokensEarned={(t) => handleTokensEarned(t, 4)} />;

  // Rev 7: Recommended next activity
  const recommendedIndex = Math.min(unlockedLevel, LANES.length - 1);
  const recommended = LANES[recommendedIndex];

  return (
    <div className="min-h-screen bg-background p-5">
      <button onClick={onBack} className="mb-4 px-4 py-2 rounded-xl bg-secondary flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
          <Keyboard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Keyboard Pilot</h1>
          <p className="text-sm text-muted-foreground">Learn the keyboard — no rush!</p>
        </div>
      </div>

      {/* Rev 7: Recommended "Start Here" card */}
      <button
        onClick={() => setView(recommended.id)}
        className={`w-full flex items-center gap-4 p-5 rounded-2xl border-3 border-primary ${recommended.color} shadow-md mb-6 text-left`}
      >
        <span className="text-5xl">{recommended.emoji}</span>
        <div className="flex-1">
          <p className="text-xs font-semibold text-primary mb-1">▶ Start Here</p>
          <h3 className="font-bold text-lg">{recommended.title}</h3>
          <p className="text-sm text-muted-foreground">{recommended.desc}</p>
        </div>
      </button>

      {/* Other activities */}
      {LANES.filter(l => l.id !== recommended.id).length > 0 && (
        <>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">More Activities</p>
          <div className="space-y-2">
            {LANES.filter(l => l.id !== recommended.id).map((lane) => {
              const isLocked = lane.order > unlockedLevel;
              return (
                <button
                  key={lane.id}
                  onClick={() => {
                    // Locked lanes still tappable (parent override) but show visual hint
                    setView(lane.id);
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl border-2 border-border ${lane.color} hover:shadow-sm active:scale-[0.98] transition-all text-left ${
                    isLocked ? 'opacity-60' : ''
                  }`}
                >
                  <span className="text-3xl">{lane.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-base">{lane.title}</h3>
                    <p className="text-xs text-muted-foreground">{lane.desc}</p>
                  </div>
                  {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
