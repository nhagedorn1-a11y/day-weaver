import { useState, useMemo } from 'react';
import { WritingProfile, LetterCard as LetterCardType } from '@/types/academics';
import { letterCards, getUppercaseLetters, getLowercaseLetters, basicStrokes, numberCards, NumberCard } from '@/data/writingLibrary';
import { 
  Pencil, Clock, Star, ChevronRight, Settings, Flame, Check, 
  ArrowLeft, Eye, Hand, Hash
} from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { TracePad } from '@/components/writing/TracePad';
import { DotToDotPad } from '@/components/writing/DotToDotPad';
import { CopyPad } from '@/components/writing/CopyPad';
import { IndependentPad } from '@/components/writing/IndependentPad';

interface WritingModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type WritingView = 'home' | 'uppercase' | 'lowercase' | 'numbers' | 'practice';
type PracticeItem = LetterCardType | NumberCard;

const LETTER_GROUPS = [
  { id: 'numbers', name: 'Numbers 0-10', items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], isNumbers: true },
  { id: 'line', name: 'Line Letters', items: ['L', 'l', 'I', 'i', 'T', 't', 'F', 'E'], isNumbers: false },
  { id: 'circle', name: 'Circle Letters', items: ['O', 'o', 'C', 'c', 'Q', 'G'], isNumbers: false },
  { id: 'hump', name: 'Hump Letters', items: ['M', 'm', 'N', 'n', 'H', 'h', 'R', 'r'], isNumbers: false },
  { id: 'slant', name: 'Slant Letters', items: ['A', 'V', 'v', 'W', 'w', 'X', 'x', 'K', 'k'], isNumbers: false },
  { id: 'tail', name: 'Tail Letters', items: ['g', 'j', 'p', 'q', 'y'], isNumbers: false },
];

export function WritingModule({ onBack, onTokensEarned }: WritingModuleProps) {
  const [view, setView] = useState<WritingView>('home');
  const [selectedItem, setSelectedItem] = useState<PracticeItem | null>(null);
  const [currentStage, setCurrentStage] = useState<'trace' | 'dotToDot' | 'copy' | 'independent'>('trace');
  const [stageCompleted, setStageCompleted] = useState(false);
  const { playTap, playComplete, playTokenEarned, playCorrect } = useSound();

  const STAGES: ('trace' | 'dotToDot' | 'copy' | 'independent')[] = ['trace', 'dotToDot', 'copy', 'independent'];

  // Helper to check if item is a letter or number
  const isLetterCard = (item: PracticeItem): item is LetterCardType => {
    return 'letter' in item;
  };

  const getCharacter = (item: PracticeItem): string => {
    return isLetterCard(item) ? item.letter : item.character;
  };

  const handleStageComplete = () => {
    playCorrect();
    setStageCompleted(true);
    
    // Auto-advance after a brief celebration pause
    setTimeout(() => {
      const currentIndex = STAGES.indexOf(currentStage);
      if (currentIndex < STAGES.length - 1) {
        // Move to next stage
        setCurrentStage(STAGES[currentIndex + 1]);
        setStageCompleted(false);
      } else {
        // All stages complete - award tokens and return home
        playComplete();
        playTokenEarned();
        onTokensEarned(2);
        setView('home');
        setCurrentStage('trace');
        setStageCompleted(false);
      }
    }, 800);
  };

  const [profile] = useState<WritingProfile>({
    childId: 'child-1',
    currentLessonId: 'writing-1',
    currentStage: 'trace',
    streak: 2,
    masteredLetters: ['A', 'B', 'C', 'a', 'b', 'c', '1', '2', '3'],
    lastSessionDate: null,
  });

  const uppercaseLetters = useMemo(() => getUppercaseLetters(), []);
  const lowercaseLetters = useMemo(() => getLowercaseLetters(), []);

  const handleItemSelect = (item: PracticeItem) => {
    playTap();
    setSelectedItem(item);
    setView('practice');
  };

  if (view === 'practice' && selectedItem) {
    const character = getCharacter(selectedItem);
    
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Practice: {character}</h1>
            <span className="hw-label">{selectedItem.keywordEmoji} {selectedItem.keyword}</span>
          </div>
        </header>

        <div className="p-6 flex flex-col items-center">
          {/* Letter/Number card */}
          <div className="w-48 h-64 rounded-3xl bg-card border-4 border-primary flex flex-col items-center justify-center mb-6">
            <span className="text-4xl mb-2">{selectedItem.keywordEmoji}</span>
            <span className="text-8xl font-serif">{character}</span>
          </div>

          {/* Formation tip */}
          <div className="bg-muted/50 rounded-2xl p-4 mb-6 w-full max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <Hand className="w-5 h-5 text-primary" />
              <span className="font-semibold">How to write it:</span>
            </div>
            <p className="text-sm text-muted-foreground">{selectedItem.formationTip}</p>
          </div>

          {/* Stage selector */}
          <div className="flex gap-2 mb-6">
            {(['trace', 'dotToDot', 'copy', 'independent'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => {
                  playTap(); // Play tap sound on stage change
                  setCurrentStage(stage);
                }}
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

          {/* Practice area - actual components */}
          <div className="w-full max-w-sm flex flex-col items-center">
            {stageCompleted && (
              <div className="mb-4 text-center animate-scale-in">
                <span className="text-4xl">✨</span>
                <p className="text-calm font-medium">Great job!</p>
              </div>
            )}
            {currentStage === 'trace' && (
              <TracePad 
                letter={character} 
                size={220}
                onComplete={handleStageComplete}
              />
            )}
            {currentStage === 'dotToDot' && (
              <DotToDotPad 
                letter={character} 
                size={220}
                onComplete={handleStageComplete}
              />
            )}
            {currentStage === 'copy' && (
              <CopyPad 
                letter={character} 
                size={220}
                onComplete={handleStageComplete}
              />
            )}
            {currentStage === 'independent' && (
              <IndependentPad 
                letter={character} 
                size={220}
                onComplete={handleStageComplete}
              />
            )}
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mt-4">
            {STAGES.map((stage, idx) => (
              <div
                key={stage}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx < STAGES.indexOf(currentStage) 
                    ? 'bg-calm' 
                    : idx === STAGES.indexOf(currentStage) 
                      ? 'bg-primary scale-125' 
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              playComplete(); // Play completion sound
              playTokenEarned(); // Play token earned sound
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

        {/* Letter and Number groups */}
        {LETTER_GROUPS.map((group) => (
          <div key={group.id}>
            <div className="flex items-center gap-2 mb-3">
              {group.isNumbers && <Hash className="w-4 h-4 text-token" />}
              <span className="hw-label">{group.name}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((itemId) => {
                // Get the card from the appropriate source
                const card = group.isNumbers ? numberCards[itemId] : letterCards[itemId];
                if (!card) return null;
                
                const displayChar = group.isNumbers ? (card as NumberCard).character : (card as LetterCardType).letter;
                const isMastered = profile.masteredLetters.includes(itemId);
                
                return (
                  <button
                    key={itemId}
                    onClick={() => handleItemSelect(card as PracticeItem)}
                    className={`w-14 h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
                      isMastered 
                        ? 'bg-calm/20 border-2 border-calm' 
                        : group.isNumbers 
                          ? 'bg-token/5 border-2 border-token/30 hover:border-token'
                          : 'bg-card border-2 border-border hover:border-primary'
                    }`}
                  >
                    <span className="text-xs">{card.keywordEmoji}</span>
                    <span className="text-xl font-serif">{displayChar}</span>
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
