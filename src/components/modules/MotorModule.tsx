import { useState } from 'react';
import { WritingStage } from '@/types/jackos';
import { ADLMission } from '@/types/activities';
import { adlMissions } from '@/data/motorActivities';
import { letterOrder } from '@/data/appContent';
import { TracePad } from '@/components/reading/TracePad';
import { ArrowLeft, Check, Star, ChevronRight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface MotorModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type MotorView = 'home' | 'letters' | 'tracing' | 'adl' | 'adlSteps';

const writingStages: { id: WritingStage; label: string; description: string }[] = [
  { id: 'trace', label: 'Trace', description: 'Follow the dotted line' },
  { id: 'dotToDot', label: 'Dot-to-Dot', description: 'Connect the dots' },
  { id: 'copy', label: 'Copy', description: 'Look and write' },
  { id: 'flashcard', label: 'Flashcard', description: 'See and write from memory' },
  { id: 'memory', label: 'Memory', description: 'Write without looking' },
];

export function MotorModule({ onBack, onTokensEarned }: MotorModuleProps) {
  const [view, setView] = useState<MotorView>('home');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState<WritingStage>('trace');
  const [selectedADL, setSelectedADL] = useState<ADLMission | null>(null);
  const [adlStep, setAdlStep] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<string[]>([]);

  const currentLetter = letterOrder[currentLetterIndex];

  const handleLetterComplete = () => {
    setCompletedLetters(prev => [...prev, currentLetter]);
    
    if (currentLetterIndex < letterOrder.length - 1) {
      setCurrentLetterIndex(prev => prev + 1);
      toast.success('Great letter! 🎉');
    } else {
      onTokensEarned(3);
      toast.success('+3 tokens for letter practice! ✏️');
      setView('home');
    }
  };

  const handleADLStepComplete = () => {
    if (!selectedADL) return;

    onTokensEarned(selectedADL.tokenPerStep);
    toast.success(`+${selectedADL.tokenPerStep} token for this step!`);

    if (adlStep < selectedADL.steps.length - 1) {
      setAdlStep(prev => prev + 1);
    } else {
      toast.success('You did it! All steps complete! 🎉');
      setView('home');
      setSelectedADL(null);
      setAdlStep(0);
    }
  };

  // Letter tracing
  if (view === 'tracing') {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('letters')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Letter: {currentLetter.toUpperCase()}</h1>
            <span className="hw-label">{writingStages.find(s => s.id === currentStage)?.label}</span>
          </div>
          <button
            onClick={() => setCurrentLetterIndex(prev => Math.max(0, prev - 1))}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </header>

        <div className="p-6 flex flex-col items-center">
          {/* Stage selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 w-full">
            {writingStages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setCurrentStage(stage.id)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${currentStage === stage.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                  }
                `}
              >
                {stage.label}
              </button>
            ))}
          </div>

          {/* Tracing area */}
          <div className="mb-6">
            <TracePad
              letter={currentLetter}
              onComplete={handleLetterComplete}
              size={250}
            />
          </div>

          {/* Instructions */}
          <p className="text-center text-muted-foreground mb-6">
            {writingStages.find(s => s.id === currentStage)?.description}
          </p>

          {/* Letter navigation */}
          <div className="flex gap-2 flex-wrap justify-center max-w-xs">
            {letterOrder.slice(0, 10).map((letter, idx) => (
              <button
                key={letter}
                onClick={() => setCurrentLetterIndex(idx)}
                className={`
                  w-10 h-10 rounded-lg font-bold transition-all
                  ${idx === currentLetterIndex 
                    ? 'bg-primary text-primary-foreground' 
                    : completedLetters.includes(letter)
                      ? 'bg-calm text-calm-foreground'
                      : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Letters home
  if (view === 'letters') {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Letter Formation</h1>
        </header>

        <div className="p-4 space-y-4">
          <p className="text-muted-foreground text-sm">
            Practice letters in the recommended order. Tap one to start.
          </p>

          <div className="grid grid-cols-6 gap-2">
            {letterOrder.slice(0, 26).map((letter, idx) => (
              <button
                key={letter}
                onClick={() => {
                  setCurrentLetterIndex(idx);
                  setView('tracing');
                }}
                className={`
                  h-14 rounded-xl font-bold text-xl transition-all
                  ${completedLetters.includes(letter)
                    ? 'bg-calm text-calm-foreground'
                    : 'bg-card border-2 border-border hover:border-primary/50'
                  }
                `}
              >
                {letter}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setCurrentLetterIndex(0);
              setView('tracing');
            }}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold mt-6"
          >
            Start from Beginning
          </button>
        </div>
      </div>
    );
  }

  // ADL steps with visual progression
  if (view === 'adlSteps' && selectedADL) {
    const currentStepData = selectedADL.steps[adlStep];
    const progress = ((adlStep + 1) / selectedADL.steps.length) * 100;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button 
            onClick={() => {
              setView('home');
              setSelectedADL(null);
              setAdlStep(0);
            }} 
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">{selectedADL.title}</h1>
            <span className="hw-label">Step {adlStep + 1} of {selectedADL.steps.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-token" />
            <span className="font-mono text-sm">+{selectedADL.tokenPerStep}/step</span>
          </div>
        </header>

        {/* Progress bar */}
        <div className="px-4 pt-4">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 px-4 pt-4">
          {selectedADL.steps.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx < adlStep 
                  ? 'bg-calm scale-100' 
                  : idx === adlStep 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted scale-100'
              }`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          {/* Large animated visual for current step */}
          <div 
            key={adlStep}
            className="relative mb-6 animate-scale-in"
          >
            {/* Background glow */}
            <div className="absolute inset-0 blur-3xl bg-primary/10 rounded-full" />
            
            {/* Main step visual */}
            <div className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-card to-muted/50 border-4 border-primary/20 flex items-center justify-center shadow-lg">
              <span 
                className="text-8xl block animate-fade-in"
                role="img"
                aria-label={currentStepData.description}
              >
                {currentStepData.visualEmoji}
              </span>
            </div>
          </div>

          {/* Step number badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4 animate-fade-in">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {adlStep + 1}
            </span>
            <span className="text-sm font-medium text-primary">Step {adlStep + 1}</span>
          </div>

          {/* Instruction text */}
          <h2 className="text-2xl font-bold mb-2 animate-fade-in">{currentStepData.instruction}</h2>
          
          {/* Description for context */}
          <p className="text-muted-foreground text-sm mb-8 max-w-xs animate-fade-in">
            {currentStepData.description}
          </p>

          <button
            onClick={handleADLStepComplete}
            className="giant-button w-full max-w-xs bg-calm text-calm-foreground animate-fade-in"
          >
            <Check className="w-8 h-8" />
            <span>{adlStep === selectedADL.steps.length - 1 ? 'All Done!' : 'Done!'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ADL list
  if (view === 'adl') {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={() => setView('home')} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Daily Living Skills</h1>
        </header>

        <div className="p-4 space-y-3">
          <p className="text-muted-foreground text-sm mb-4">
            Practice everyday skills one step at a time. Earn tokens for each step!
          </p>

          {adlMissions.map((mission) => (
            <button
              key={mission.id}
              onClick={() => {
                setSelectedADL(mission);
                setAdlStep(0);
                setView('adlSteps');
              }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
            >
              <span className="text-4xl">{mission.emoji}</span>
              <div className="flex-1 text-left">
                <span className="font-semibold block">{mission.title}</span>
                <span className="text-sm text-muted-foreground">
                  {mission.steps.length} steps • {mission.tokenPerStep} token each
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
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
          <h1 className="font-semibold text-lg">Writing & Motor Skills</h1>
          <span className="hw-label">Letters & daily living</span>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Letter formation */}
        <button
          onClick={() => setView('letters')}
          className="w-full flex items-center gap-4 p-5 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
        >
          <span className="text-5xl">✏️</span>
          <div className="flex-1 text-left">
            <span className="font-semibold text-lg block">Letter Formation</span>
            <span className="text-sm text-muted-foreground">
              Trace → Dot-to-Dot → Copy → Memory
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* ADL routines */}
        <button
          onClick={() => setView('adl')}
          className="w-full flex items-center gap-4 p-5 rounded-3xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
        >
          <span className="text-5xl">👕</span>
          <div className="flex-1 text-left">
            <span className="font-semibold text-lg block">Daily Living Skills</span>
            <span className="text-sm text-muted-foreground">
              Buttons, zippers, shoes & more
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Quick trace */}
        <div className="pt-4">
          <span className="hw-label block mb-3">Quick Practice</span>
          <div className="flex gap-2">
            {['a', 'b', 'c', 'd', 'e'].map((letter) => (
              <button
                key={letter}
                onClick={() => {
                  setCurrentLetterIndex(letterOrder.indexOf(letter));
                  setView('tracing');
                }}
                className="flex-1 h-16 rounded-xl bg-secondary text-secondary-foreground font-bold text-2xl hover:bg-secondary/80"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
