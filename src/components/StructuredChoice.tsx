import { useState } from 'react';
import { AppModule } from '@/types/jackos';
import { MODULE_REGISTRY } from '@/config/modules';

interface ChoiceOption {
  moduleId: AppModule;
  questName: string;
  emoji: string;
  description: string;
}

interface StructuredChoiceProps {
  options: [AppModule, AppModule];
  onChoose: (moduleId: AppModule) => void;
  onSkip?: () => void;
}

const QUEST_NAMES: Partial<Record<AppModule, string>> = {
  reading: 'Word Forest',
  math: 'Math Cave',
  writing: 'Letter Lab',
  typing: 'Key Kingdom',
  science: 'Discovery Zone',
  motor: 'Move Mountain',
  sensory: 'Chill Cove',
  social: 'Friend Island',
  bravery: 'Courage Peak',
};

function buildOption(moduleId: AppModule): ChoiceOption {
  const config = MODULE_REGISTRY[moduleId];
  return {
    moduleId,
    questName: QUEST_NAMES[moduleId] ?? config?.title ?? moduleId,
    emoji: config?.emoji ?? '📦',
    description: config?.description ?? '',
  };
}

export function StructuredChoice({ options, onChoose, onSkip }: StructuredChoiceProps) {
  const [a, b] = options.map(buildOption);

  return (
    <div className="animate-fade-in space-y-4">
      {/* Prompt */}
      <div className="text-center">
        <p className="text-base font-semibold">Where do you want to go?</p>
        <p className="text-xs text-muted-foreground mt-0.5">Pick one</p>
      </div>

      {/* Two cards */}
      <div className="grid grid-cols-2 gap-3">
        {[a, b].map((opt) => (
          <button
            key={opt.moduleId}
            onClick={() => onChoose(opt.moduleId)}
            className="relative flex flex-col items-center gap-2.5 p-4 rounded-lg border border-border bg-card
              transition-all duration-150 active:scale-[0.98]
              hover:bg-muted/50 border-l-[3px] border-l-primary/40"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <span className="text-4xl">{opt.emoji}</span>
            <span className="text-sm font-medium text-foreground">{opt.questName}</span>
            <span className="text-[11px] text-muted-foreground text-center leading-snug">{opt.description}</span>
          </button>
        ))}
      </div>

      {onSkip && (
        <button
          onClick={onSkip}
          className="w-full text-center text-xs text-muted-foreground underline underline-offset-2"
        >
          I'll choose later
        </button>
      )}
    </div>
  );
}
