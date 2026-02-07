import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Check, Star, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface BalanceActivityType {
  id: string;
  title: string;
  emoji: string;
  instructions: string[];
  difficulty: number;
  moves?: string[];
  poses?: string[];
  speedLevels?: number[];
}

interface BalanceActivityProps {
  activity: BalanceActivityType;
  onBack: () => void;
  onComplete: (tokens: number) => void;
}

export function BalanceActivity({ activity, onBack, onComplete }: BalanceActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentMove, setCurrentMove] = useState(0);
  
  const totalSteps = activity.instructions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const moves = activity.moves || activity.poses || [];

  // Timer for timed activities
  useEffect(() => {
    let interval: number | undefined;
    if (isActive) {
      interval = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Move through poses/moves
  useEffect(() => {
    let timeout: number | undefined;
    if (isActive && moves.length > 0) {
      timeout = window.setTimeout(() => {
        setCurrentMove(prev => (prev + 1) % moves.length);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isActive, currentMove, moves.length]);

  const handleStepComplete = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsActive(false);
      const tokens = activity.difficulty >= 3 ? 3 : 2;
      onComplete(tokens);
      toast.success(`+${tokens} tokens for ${activity.title}!`);
    }
  }, [currentStep, totalSteps, activity.difficulty, activity.title, onComplete]);

  const handleReset = () => {
    setCurrentStep(0);
    setTimer(0);
    setIsActive(false);
    setCurrentMove(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              balance
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
          <span className="font-mono">{formatTime(timer)}</span>
        </div>
      </div>

      {/* Activity area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Large emoji visual */}
        <div className="w-32 h-32 rounded bg-card border-2 border-border flex items-center justify-center mb-4">
          <span className="text-7xl">{activity.emoji}</span>
        </div>

        {/* Current move/pose indicator */}
        {moves.length > 0 && isActive && (
          <div className="mb-4 px-4 py-2 rounded bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              {moves[currentMove]}
            </span>
          </div>
        )}

        {/* Current instruction */}
        <div className="text-center max-w-xs mb-8">
          <p className="text-xl font-medium">{activity.instructions[currentStep]}</p>
        </div>

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
          {!isActive ? (
            <button
              onClick={() => setIsActive(true)}
              className="flex-1 py-4 rounded bg-primary text-primary-foreground font-semibold text-lg flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={() => setIsActive(false)}
              className="w-16 py-4 rounded bg-secondary text-secondary-foreground font-semibold flex items-center justify-center"
            >
              <Pause className="w-6 h-6" />
            </button>
          )}
          
          <button
            onClick={handleStepComplete}
            className="flex-1 py-4 rounded bg-calm text-calm-foreground font-semibold text-lg flex items-center justify-center gap-3"
          >
            <Check className="w-6 h-6" />
            <span>{currentStep === totalSteps - 1 ? 'Done!' : 'Next'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
