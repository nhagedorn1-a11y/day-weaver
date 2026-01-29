import { useState, useMemo } from 'react';
import { WritingProfile, LetterCard as LetterCardType } from '@/types/academics';
import { letterCards, getUppercaseLetters, getLowercaseLetters, basicStrokes } from '@/data/writingLibrary';
import { 
  Pencil, Clock, Star, ChevronRight, Settings, Flame, Check, 
  ArrowLeft, Eye, Hand 
} from 'lucide-react';

interface WritingModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type WritingView = 'home' | 'uppercase' | 'lowercase' | 'practice';

const LETTER_GROUPS = [
  { id: 'line', name: 'Line Letters', letters: ['L', 'l', 'I', 'i', 'T', 't', 'F', 'E'] },
  { id: 'circle', name: 'Circle Letters', letters: ['O', 'o', 'C', 'c', 'Q', 'G'] },
  { id: 'hump', name: 'Hump Letters', letters: ['M', 'm', 'N', 'n', 'H', 'h', 'R', 'r'] },
  { id: 'slant', name: 'Slant Letters', letters: ['A', 'V', 'v', 'W', 'w', 'X', 'x', 'K', 'k'] },
  { id: 'tail', name: 'Tail Letters', letters: ['g', 'j', 'p', 'q', 'y'] },
];

export function WritingModule({ onBack, onTokensEarned }: WritingModuleProps) {
  const [view, setView] = useState<WritingView>('home');
  const [selectedLetter, setSelectedLetter] = useState<LetterCardType | null>(null);
  const [currentStage, setCurrentStage] = useState<'trace' | 'dotToDot' | 'copy' | 'independent'>('trace');

  const [profile] = useState<WritingProfile>({
    childId: 'child-1',
    currentLessonId: 'writing-1',
    currentStage: 'trace',
    streak: 2,
    masteredLetters: ['A', 'B', 'C', 'a', 'b', 'c'],
    lastSessionDate: null,
  });

  const uppercaseLetters = useMemo(() => getUppercaseLetters(), []);
  const lowercaseLetters = useMemo(() => getLowercaseLetters(), []);

  const handleLetterSelect = (letter: LetterCardType) => {
    setSelectedLetter(letter);
    setView('practice');
  };

  if (view === 'practice' && selectedLetter) {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Practice: {selectedLetter.letter}</h1>
            <span className="hw-label">{selectedLetter.keywordEmoji} {selectedLetter.keyword}</span>
          </div>
        </header>

        <div className="p-6 flex flex-col items-center">
          {/* Letter card */}
          <div className="w-48 h-64 rounded-3xl bg-card border-4 border-primary flex flex-col items-center justify-center mb-6">
            <span className="text-4xl mb-2">{selectedLetter.keywordEmoji}</span>
            <span className="text-8xl font-serif">{selectedLetter.letter}</span>
          </div>

          {/* Formation tip */}
          <div className="bg-muted/50 rounded-2xl p-4 mb-6 w-full max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <Hand className="w-5 h-5 text-primary" />
              <span className="font-semibold">How to write it:</span>
            </div>
            <p className="text-sm text-muted-foreground">{selectedLetter.formationTip}</p>
          </div>

          {/* Stage selector */}
          <div className="flex gap-2 mb-6">
            {(['trace', 'dotToDot', 'copy', 'independent'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setCurrentStage(stage)}
                className={`px-3 py-2 rounded-xl text-sm font-medium ${
                  currentStage === stage 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {stage === 'trace' ? '✏️ Trace' : 
                 stage === 'dotToDot' ? '• Dots' : 
                 stage === 'copy' ? '📝 Copy' : '⭐ Write'}
              </button>
            ))}
          </div>

          {/* Practice area placeholder */}
          <div className="w-full max-w-sm h-48 rounded-2xl bg-white border-2 border-border flex items-center justify-center">
            <span className="text-muted-foreground">
              {currentStage === 'trace' ? 'Trace the letter with your finger' :
               currentStage === 'dotToDot' ? 'Connect the dots' :
               currentStage === 'copy' ? 'Copy the letter below' :
               'Write it on your own!'}
            </span>
          </div>

          <button
            onClick={() => {
              onTokensEarned(1);
              setView('home');
            }}
            className="giant-button mt-6 bg-calm text-calm-foreground"
          >
            <Check className="w-6 h-6" />
            <span>Done!</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-semibold text-lg">Writing Studio</h1>
          <span className="hw-label">Letter formation practice</span>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-token/10 rounded-2xl p-4 flex items-center gap-3">
            <Flame className="w-8 h-8 text-token" />
            <div>
              <span className="text-2xl font-bold">{profile.streak}</span>
              <span className="text-sm text-muted-foreground block">day streak</span>
            </div>
          </div>
          <div className="flex-1 bg-calm/10 rounded-2xl p-4 flex items-center gap-3">
            <Pencil className="w-8 h-8 text-calm" />
            <div>
              <span className="text-2xl font-bold">{profile.masteredLetters.length}</span>
              <span className="text-sm text-muted-foreground block">letters</span>
            </div>
          </div>
        </div>

        {/* Letter groups */}
        {LETTER_GROUPS.map((group) => (
          <div key={group.id}>
            <span className="hw-label block mb-3">{group.name}</span>
            <div className="flex flex-wrap gap-2">
              {group.letters.map((letter) => {
                const card = letterCards[letter];
                if (!card) return null;
                
                const isMastered = profile.masteredLetters.includes(letter);
                
                return (
                  <button
                    key={letter}
                    onClick={() => handleLetterSelect(card)}
                    className={`w-14 h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
                      isMastered 
                        ? 'bg-calm/20 border-2 border-calm' 
                        : 'bg-card border-2 border-border hover:border-primary'
                    }`}
                  >
                    <span className="text-xs">{card.keywordEmoji}</span>
                    <span className="text-xl font-serif">{letter}</span>
                    {isMastered && <Check className="w-3 h-3 text-calm" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Basic strokes */}
        <div>
          <span className="hw-label block mb-3">Basic Strokes</span>
          <div className="grid grid-cols-4 gap-2">
            {basicStrokes.map((stroke) => (
              <button
                key={stroke.id}
                className="p-3 rounded-xl bg-card border-2 border-border hover:border-primary flex flex-col items-center gap-1"
              >
                <span className="text-2xl font-mono">{stroke.pattern}</span>
                <span className="text-xs text-muted-foreground">{stroke.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
