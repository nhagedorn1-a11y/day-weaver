import { useState } from 'react';
import { FineMotorGame as FineMotorGameType } from '@/types/activities';
import { ArrowLeft, Check, Star, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface FineMotorGameProps {
  game: FineMotorGameType;
  onBack: () => void;
  onComplete: (tokens: number) => void;
}

export function FineMotorGame({ game, onBack, onComplete }: FineMotorGameProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  
  const totalSteps = game.instructions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  const handleStepComplete = () => {
    setScore(prev => prev + 1);
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const tokens = game.difficulty >= 3 ? 3 : 2;
      onComplete(tokens);
      toast.success(`+${tokens} tokens for ${game.title}!`);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScore(0);
  };

  // Difficulty indicator
  const difficultyDots = Array.from({ length: 5 }, (_, i) => i < game.difficulty);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">{game.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {game.gameType}
            </span>
            <div className="flex gap-0.5">
              {difficultyDots.map((filled, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full ${filled ? 'bg-primary' : 'bg-muted'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="w-10 h-10 rounded bg-secondary flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </header>

      {/* Progress */}
      <div className="px-4 pt-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-token" />
            {score}
          </span>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Large emoji visual */}
        <div className="w-32 h-32 rounded bg-card border-2 border-border flex items-center justify-center mb-6">
          <span className="text-7xl">{game.emoji}</span>
        </div>

        {/* Current instruction */}
        <div className="text-center max-w-xs mb-8">
          <p className="text-xl font-medium">{game.instructions[currentStep]}</p>
        </div>

        {/* Step dots */}
        <div className="flex gap-2 mb-8">
          {game.instructions.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx < currentStep 
                  ? 'bg-calm' 
                  : idx === currentStep 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Action button */}
        <button
          onClick={handleStepComplete}
          className="w-full max-w-xs py-4 rounded bg-calm text-calm-foreground font-semibold text-lg flex items-center justify-center gap-3"
        >
          <Check className="w-6 h-6" />
          <span>{currentStep === totalSteps - 1 ? 'All Done!' : 'Done!'}</span>
        </button>
      </div>
    </div>
  );
}
