import { useState } from 'react';
import { AppModule } from '@/types/jackos';
import { MODULE_REGISTRY, ModuleConfig } from '@/config/modules';

interface ChoiceOption {
  moduleId: AppModule;
  questName: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
}

interface StructuredChoiceProps {
  /** Two modules to choose between */
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

const COLOR_MAP: Partial<Record<AppModule, { color: string; bgColor: string }>> = {
  reading: { color: 'text-primary', bgColor: 'bg-primary/15' },
  math: { color: 'text-token', bgColor: 'bg-token/15' },
  writing: { color: 'text-calm', bgColor: 'bg-calm/15' },
  typing: { color: 'text-secondary-foreground', bgColor: 'bg-secondary' },
  science: { color: 'text-next', bgColor: 'bg-next/15' },
  motor: { color: 'text-muted-foreground', bgColor: 'bg-muted' },
  sensory: { color: 'text-calm', bgColor: 'bg-calm/15' },
  social: { color: 'text-primary', bgColor: 'bg-primary/15' },
  bravery: { color: 'text-token', bgColor: 'bg-token/15' },
};

function buildOption(moduleId: AppModule): ChoiceOption {
  const config = MODULE_REGISTRY[moduleId];
  const colors = COLOR_MAP[moduleId] ?? { color: 'text-foreground', bgColor: 'bg-muted' };
  return {
    moduleId,
    questName: QUEST_NAMES[moduleId] ?? config?.title ?? moduleId,
    emoji: config?.emoji ?? '📦',
    color: colors.color,
    bgColor: colors.bgColor,
    description: config?.description ?? '',
  };
}

export function StructuredChoice({ options, onChoose, onSkip }: StructuredChoiceProps) {
  const [hoveredId, setHoveredId] = useState<AppModule | null>(null);
  const [a, b] = options.map(buildOption);

  return (
    <div className="animate-fade-in space-y-4">
      {/* Prompt — simple, visual-first */}
      <div className="text-center">
        <p className="text-lg font-bold">Where do you want to go?</p>
        <p className="text-sm text-muted-foreground">Pick one!</p>
      </div>

      {/* Two big visual cards */}
      <div className="grid grid-cols-2 gap-4">
        {[a, b].map((opt) => (
          <button
            key={opt.moduleId}
            onClick={() => onChoose(opt.moduleId)}
            onPointerEnter={() => setHoveredId(opt.moduleId)}
            onPointerLeave={() => setHoveredId(null)}
            className={`
              relative flex flex-col items-center gap-3 p-5 rounded-3xl border-3
              transition-all duration-200 active:scale-95
              ${opt.bgColor} border-border
              ${hoveredId === opt.moduleId ? 'shadow-xl scale-105 border-primary/40' : 'shadow-md'}
            `}
          >
            {/* Big emoji */}
            <span className="text-5xl drop-shadow-sm">{opt.emoji}</span>
            
            {/* Quest name */}
            <span className={`text-base font-bold ${opt.color}`}>
              {opt.questName}
            </span>
            
            {/* Description */}
            <span className="text-xs text-muted-foreground text-center leading-snug">
              {opt.description}
            </span>
          </button>
        ))}
      </div>

      {onSkip && (
        <button
          onClick={onSkip}
          className="w-full text-center text-sm text-muted-foreground underline underline-offset-2"
        >
          I'll choose later
        </button>
      )}
    </div>
  );
}
