import { useState } from 'react';
import { X, Wind, Heart, Hand, Headphones, Dumbbell, Moon } from 'lucide-react';

interface CalmToolkitProps {
  onClose: () => void;
}

const sensoryTools = [
  { id: 'headphones', title: 'Headphones', icon: Headphones, description: 'Quiet sounds' },
  { id: 'squeeze', title: 'Squeeze Ball', icon: Hand, description: 'Squeeze tight' },
  { id: 'heavy-work', title: 'Heavy Work', icon: Dumbbell, description: 'Push the wall' },
  { id: 'dark', title: 'Dark Corner', icon: Moon, description: 'Quiet space' },
];

export function CalmToolkit({ onClose }: CalmToolkitProps) {
  const [activeBreathing, setActiveBreathing] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-calm/95 flex flex-col safe-top safe-bottom">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <h2 className="text-2xl font-semibold text-calm-foreground">Calm Space</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-calm-foreground/10 flex items-center justify-center hover:bg-calm-foreground/20 transition-colors"
        >
          <X className="w-6 h-6 text-calm-foreground" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
        {/* Breathing circle */}
        <button
          onClick={() => setActiveBreathing(!activeBreathing)}
          className="relative"
        >
          <div
            className={`w-48 h-48 rounded-full bg-calm-foreground/20 flex items-center justify-center ${
              activeBreathing ? 'animate-breathe' : ''
            }`}
          >
            <div className="w-32 h-32 rounded-full bg-calm-foreground/30 flex items-center justify-center">
              <Wind className="w-12 h-12 text-calm-foreground" />
            </div>
          </div>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-calm-foreground/80 text-sm font-medium">
            {activeBreathing ? 'Breathe...' : 'Tap to breathe'}
          </span>
        </button>

        {/* Body check */}
        <div className="flex items-center gap-6">
          <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-calm-foreground/10 hover:bg-calm-foreground/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-calm-foreground/20 flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
            <span className="text-calm-foreground/80 text-xs font-medium">Head</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-calm-foreground/10 hover:bg-calm-foreground/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-calm-foreground/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-calm-foreground" />
            </div>
            <span className="text-calm-foreground/80 text-xs font-medium">Heart</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-calm-foreground/10 hover:bg-calm-foreground/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-calm-foreground/20 flex items-center justify-center">
              <Hand className="w-6 h-6 text-calm-foreground" />
            </div>
            <span className="text-calm-foreground/80 text-xs font-medium">Hands</span>
          </button>
        </div>
      </div>

      {/* Sensory menu */}
      <div className="p-6">
        <span className="hw-label block mb-3 text-calm-foreground/60">Sensory Menu</span>
        <div className="grid grid-cols-4 gap-3">
          {sensoryTools.map((tool) => (
            <button
              key={tool.id}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-calm-foreground/10 hover:bg-calm-foreground/20 transition-colors"
            >
              <tool.icon className="w-6 h-6 text-calm-foreground" />
              <span className="text-calm-foreground text-xs font-medium text-center">
                {tool.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
