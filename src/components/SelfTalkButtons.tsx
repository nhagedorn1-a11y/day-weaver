import { SelfTalkButton } from '@/types/jackos';
import { selfTalkPrompts } from '@/data/appContent';
import { useState } from 'react';

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

  return (
    <div className="space-y-4">
      {/* Prompt display */}
      {showPrompt && activeButton && (
        <div className="bg-card rounded-2xl p-4 border-2 border-primary text-center animate-scale-in">
          <p className="text-xl font-semibold">{selfTalkPrompts[activeButton].prompt}</p>
        </div>
      )}

      {/* Buttons row */}
      <div className="flex gap-2">
        {buttons.map((button) => {
          const config = selfTalkPrompts[button];
          const isActive = activeButton === button;
          
          return (
            <button
              key={button}
              onClick={() => handlePress(button)}
              className={`
                flex-1 py-3 px-2 rounded-xl font-semibold text-sm
                transition-all
                ${isActive 
                  ? 'bg-primary text-primary-foreground scale-105 shadow-lg' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }
              `}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
