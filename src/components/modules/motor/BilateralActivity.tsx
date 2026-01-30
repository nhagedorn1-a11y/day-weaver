import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Check, Star, Play, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface BilateralActivityType {
  id: string;
  title: string;
  emoji: string;
  instructions: string[];
  difficulty: number;
  patterns?: string[];
}

interface BilateralActivityProps {
  activity: BilateralActivityType;
  onBack: () => void;
  onComplete: (tokens: number) => void;
}

export function BilateralActivity({ activity, onBack, onComplete }: BilateralActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPattern, setCurrentPattern] = useState(0);
  const [reps, setReps] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  const totalSteps = activity.instructions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const patterns = activity.patterns || [];
  const targetReps = 5;

  // Auto-advance patterns for clapping activities
  useEffect(() => {
    let timeout: number | undefined;
    if (isRunning && patterns.length > 0 && reps < targetReps) {
      timeout = window.setTimeout(() => {
        setCurrentPattern(prev => (prev + 1) % patterns.length);
        setReps(prev => prev + 1);
      }, 2000);
    }
    if (reps >= targetReps && patterns.length > 0) {
      setIsRunning(false);
    }
    return () => clearTimeout(timeout);
  }, [isRunning, currentPattern, patterns.length, reps]);

  const handleStepComplete = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      setReps(0);
      setIsRunning(false);
    } else {
      const tokens = activity.difficulty >= 3 ? 3 : 2;
      onComplete(tokens);
      toast.success(`+${tokens} tokens for ${activity.title}!`);
    }
  }, [currentStep, totalSteps, activity.difficulty, activity.title, onComplete]);

  const handleReset = () => {
    setCurrentStep(0);
    setReps(0);
    setCurrentPattern(0);
    setIsRunning(false);
  };

  const handleRepTap = () => {
    setReps(prev => prev + 1);
  };

  // Difficulty indicator
  const difficultyDots = Array.from({ length: 5 }, (_, i) => i < activity.difficulty);

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
          <h1 className="font-semibold text-lg">{activity.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              bilateral
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
            {reps} reps
          </span>
        </div>
      </div>

      {/* Activity area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Large emoji visual */}
        <div className="w-32 h-32 rounded bg-card border-2 border-border flex items-center justify-center mb-4">
          <span className="text-7xl">{activity.emoji}</span>
        </div>

        {/* Pattern display */}
        {patterns.length > 0 && (
          <div className="mb-4 px-6 py-3 rounded bg-secondary/50 border border-border">
            <span className="text-lg font-mono font-medium">
              {patterns[currentPattern]}
            </span>
          </div>
        )}

        {/* Current instruction */}
        <div className="text-center max-w-xs mb-6">
          <p className="text-xl font-medium">{activity.instructions[currentStep]}</p>
        </div>

        {/* Rep counter for non-pattern activities */}
        {patterns.length === 0 && (
          <button
            onClick={handleRepTap}
            className="w-24 h-24 rounded bg-primary/10 border-2 border-primary/30 flex flex-col items-center justify-center mb-6 active:scale-95 transition-transform"
          >
            <span className="text-3xl font-bold text-primary">{reps}</span>
            <span className="text-xs text-muted-foreground uppercase">tap</span>
          </button>
        )}

        {/* Step dots */}
        <div className="flex gap-2 mb-8">
          {activity.instructions.map((_, idx) => (
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

        {/* Controls */}
        <div className="flex gap-3 w-full max-w-xs">
          {patterns.length > 0 && !isRunning && reps < targetReps && (
            <button
              onClick={() => setIsRunning(true)}
              className="flex-1 py-4 rounded bg-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              <span>Start</span>
            </button>
          )}
          
          <button
            onClick={handleStepComplete}
            className="flex-1 py-4 rounded bg-calm text-calm-foreground font-semibold text-lg flex items-center justify-center gap-3"
          >
            <Check className="w-6 h-6" />
            <span>{currentStep === totalSteps - 1 ? 'All Done!' : 'Next'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
