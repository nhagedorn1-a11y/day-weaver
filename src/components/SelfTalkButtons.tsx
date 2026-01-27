import { SelfTalkButton } from '@/types/jackos';
import { selfTalkPrompts } from '@/data/appContent';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SelfTalkButtonsProps {
  onSelect?: (button: SelfTalkButton) => void;
}

export function SelfTalkButtons({ onSelect }: SelfTalkButtonsProps) {
  const [activeButton, setActiveButton] = useState<SelfTalkButton | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const handlePress = (button: SelfTalkButton) => {
    setActiveButton(button);
    setShowPrompt(true);
    onSelect?.(button);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowPrompt(false);
      setActiveButton(null);
    }, 3000);
  };

  const buttons: SelfTalkButton[] = ['first', 'next', 'check', 'tryAgain'];

  const buttonColors: Record<SelfTalkButton, string> = {
    first: 'from-primary/20 to-primary/5 border-primary/30 hover:border-primary/50',
    next: 'from-next/20 to-next/5 border-next/30 hover:border-next/50',
    check: 'from-calm/20 to-calm/5 border-calm/30 hover:border-calm/50',
    tryAgain: 'from-token/20 to-token/5 border-token/30 hover:border-token/50',
  };

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Self-Talk Helpers
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Prompt display */}
      {showPrompt && activeButton && (
        <div className="bg-gradient-to-r from-primary/10 to-token/10 rounded-2xl p-5 border border-primary/30 text-center animate-scale-in">
          <p className="text-xl font-bold text-foreground">
            {selfTalkPrompts[activeButton].prompt}
          </p>
        </div>
      )}

      {/* Buttons row */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((button) => {
          const config = selfTalkPrompts[button];
          const isActive = activeButton === button;
          
          return (
            <button
              key={button}
              onClick={() => handlePress(button)}
              className={`
                relative py-3.5 px-2 rounded-xl font-semibold text-sm
                transition-all touch-bounce overflow-hidden
                ${isActive 
                  ? 'bg-primary text-primary-foreground scale-105 shadow-lg' 
                  : `bg-gradient-to-b ${buttonColors[button]} border text-foreground`
                }
              `}
            >
              <span className="relative z-10">{config.label}</span>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
