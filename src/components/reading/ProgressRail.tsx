import { SessionStep } from '@/types/reading';
import { Check, Circle } from 'lucide-react';

interface ProgressRailProps {
  currentStep: SessionStep;
  completedSteps: SessionStep[];
}

const STEPS: { id: SessionStep; label: string; shortLabel: string }[] = [
  { id: 'warmup', label: 'Warm-Up', shortLabel: 'A' },
  { id: 'review', label: 'Review', shortLabel: 'B' },
  { id: 'teach', label: 'New Learning', shortLabel: 'C' },
  { id: 'practice', label: 'Practice', shortLabel: 'D' },
  { id: 'sentence', label: 'Sentences', shortLabel: 'E' },
  { id: 'finish', label: 'Finish', shortLabel: 'F' },
];

export function ProgressRail({ currentStep, completedSteps }: ProgressRailProps) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-between gap-1 px-2 py-3 bg-muted rounded-2xl">
      {STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = step.id === currentStep;
        const isPast = index < currentIndex;

        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step indicator */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  font-mono text-sm font-bold transition-all
                  ${isCompleted 
                    ? 'bg-calm text-calm-foreground' 
                    : isCurrent 
                      ? 'bg-primary text-primary-foreground scale-110 shadow-md' 
                      : isPast
                        ? 'bg-muted-foreground/30 text-muted-foreground'
                        : 'bg-background text-muted-foreground border-2 border-border'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.shortLabel
                )}
              </div>
              <span 
                className={`text-xs font-medium text-center leading-tight ${
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div 
                className={`h-1 flex-1 rounded-full mx-1 ${
                  isPast || isCompleted ? 'bg-calm' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
