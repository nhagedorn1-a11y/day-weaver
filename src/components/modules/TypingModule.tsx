import { useState } from 'react';
import { ArrowLeft, Keyboard } from 'lucide-react';
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

const LANES = [
  { id: 'freePlay' as const, emoji: '🎹', title: 'Free Play', desc: 'Tap any key, see & hear it', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'keyHunt' as const, emoji: '🔍', title: 'Key Hunt', desc: 'Find the right key', color: 'bg-amber-100 dark:bg-amber-900/30' },
  { id: 'homeRow' as const, emoji: '🏠', title: 'Home Row Heroes', desc: 'Learn finger positions', color: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'wordBuilder' as const, emoji: '🔤', title: 'Word Builder', desc: 'Type simple words', color: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'pcControls' as const, emoji: '🖥️', title: 'PC Controls', desc: 'Space, Enter, Backspace & more', color: 'bg-rose-100 dark:bg-rose-900/30' },
];

export function TypingModule({ onBack, onTokensEarned }: TypingModuleProps) {
  const [view, setView] = useState<TypingView>('home');

  if (view === 'freePlay') return <FreePlay onBack={() => setView('home')} />;
  if (view === 'keyHunt') return <KeyHunt onBack={() => setView('home')} onTokensEarned={onTokensEarned} />;
  if (view === 'homeRow') return <HomeRowHeroes onBack={() => setView('home')} onTokensEarned={onTokensEarned} />;
  if (view === 'wordBuilder') return <WordBuilder onBack={() => setView('home')} onTokensEarned={onTokensEarned} />;
  if (view === 'pcControls') return <PCControls onBack={() => setView('home')} onTokensEarned={onTokensEarned} />;

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

      <div className="space-y-3">
        {LANES.map((lane) => (
          <button
            key={lane.id}
            onClick={() => setView(lane.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border ${lane.color} hover:shadow-md active:scale-[0.98] transition-all text-left`}
          >
            <span className="text-4xl">{lane.emoji}</span>
            <div>
              <h3 className="font-bold text-lg">{lane.title}</h3>
              <p className="text-sm text-muted-foreground">{lane.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
