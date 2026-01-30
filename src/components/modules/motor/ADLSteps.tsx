import { useState } from 'react';
import { ADLMission } from '@/types/activities';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface ADLStepsProps {
  mission: ADLMission;
  onBack: () => void;
  onComplete: (tokens: number) => void;
}

export function ADLSteps({ mission, onBack, onComplete }: ADLStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tokensEarned, setTokensEarned] = useState(0);
  
  const progress = ((currentStep + 1) / mission.steps.length) * 100;
  const currentStepData = mission.steps[currentStep];

  // Safety check
  if (!currentStepData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-muted-foreground mb-4">Step data not available</p>
          <button 
            onClick={onBack}
            className="px-6 py-3 rounded bg-primary text-primary-foreground font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleStepComplete = () => {
    const earned = mission.tokenPerStep;
    setTokensEarned(prev => prev + earned);
    toast.success(`+${earned} token!`);

    if (currentStep < mission.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(tokensEarned + earned);
      toast.success('You did it! All steps complete! 🎉');
    }
  };

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
          <h1 className="font-semibold text-lg">{mission.title}</h1>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Step {currentStep + 1} of {mission.steps.length}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-token/10">
          <Star className="w-4 h-4 text-token" />
          <span className="font-mono text-sm">{tokensEarned}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-4 pt-4">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 px-4 pt-4">
        {mission.steps.map((_, idx) => (
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

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Large animated visual */}
        <div className="relative mb-6">
          <div className="w-36 h-36 rounded bg-card border-2 border-border flex items-center justify-center shadow-sm">
            <span 
              className="text-8xl block"
              role="img"
              aria-label={currentStepData.description}
            >
              {currentStepData.visualEmoji}
            </span>
          </div>
        </div>

        {/* Step number badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded mb-4">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            {currentStep + 1}
          </span>
          <span className="text-sm font-medium text-primary">Step {currentStep + 1}</span>
        </div>

        {/* Instruction text */}
        <h2 className="text-2xl font-bold mb-2">{currentStepData.instruction}</h2>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-8 max-w-xs">
          {currentStepData.description}
        </p>

        {/* Complete button */}
        <button
          onClick={handleStepComplete}
          className="w-full max-w-xs py-4 rounded bg-calm text-calm-foreground font-semibold text-lg flex items-center justify-center gap-3"
        >
          <Check className="w-6 h-6" />
          <span>{currentStep === mission.steps.length - 1 ? 'All Done!' : 'Done!'}</span>
        </button>
      </div>
    </div>
  );
}
