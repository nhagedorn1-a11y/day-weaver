import { useState, useEffect } from 'react';
import { X, Wind, Heart, Hand, Headphones, Dumbbell, Moon, Shield, MessageSquare } from 'lucide-react';

interface CalmToolkitProps {
  onClose: () => void;
  parentScripts?: string[];
}

const defaultScripts = [
  "You're safe. I'm here with you.",
  "Let's take a breath together.",
  "This feeling will pass.",
  "You don't have to figure it out right now.",
  "Let's try: head, heart, hands.",
  "We can take a break.",
];

const sensoryTools = [
  { id: 'headphones', title: 'Headphones', icon: Headphones, description: 'Quiet sounds' },
  { id: 'squeeze', title: 'Squeeze', icon: Hand, description: 'Squeeze tight' },
  { id: 'heavy', title: 'Heavy Work', icon: Dumbbell, description: 'Push the wall' },
  { id: 'dark', title: 'Dark Corner', icon: Moon, description: 'Quiet space' },
];

export function CalmToolkit({ onClose, parentScripts = defaultScripts }: CalmToolkitProps) {
  const [activeBreathing, setActiveBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [showScripts, setShowScripts] = useState(false);

  // Breathing cycle: 4s in, 4s hold, 4s out
  useEffect(() => {
    if (!activeBreathing) return;

    const phases: Array<'in' | 'hold' | 'out'> = ['in', 'hold', 'out'];
    let currentPhaseIndex = 0;

    const interval = setInterval(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      setBreathPhase(phases[currentPhaseIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeBreathing]);

  const breathText = {
    in: 'Breathe in...',
    hold: 'Hold...',
    out: 'Breathe out...',
  };

  return (
    <div className="fixed inset-0 z-50 bg-calm flex flex-col safe-top safe-bottom overflow-y-auto">
      {/* Header with "We're safe" anchor */}
      <div className="flex items-center justify-between p-6 sticky top-0 bg-calm/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-calm-foreground" />
          <h2 className="text-xl font-semibold text-calm-foreground">We're Safe</h2>
        </div>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-calm-foreground/10 flex items-center justify-center hover:bg-calm-foreground/20 transition-colors"
        >
          <X className="w-6 h-6 text-calm-foreground" />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-6">
        {/* Breathing circle - main focus */}
        <div className="flex-1 flex items-center justify-center py-8">
          <button
            onClick={() => setActiveBreathing(!activeBreathing)}
            className="relative"
          >
            <div
              className={`w-56 h-56 rounded-full bg-calm-foreground/20 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out ${
                activeBreathing ? (breathPhase === 'in' ? 'scale-125' : breathPhase === 'out' ? 'scale-100' : 'scale-125') : ''
              }`}
            >
              <div className="w-36 h-36 rounded-full bg-calm-foreground/30 flex items-center justify-center">
                <Wind className="w-12 h-12 text-calm-foreground" />
              </div>
            </div>
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-calm-foreground text-lg font-medium whitespace-nowrap">
              {activeBreathing ? breathText[breathPhase] : 'Tap to breathe'}
            </span>
          </button>
        </div>

        {/* Body check - head, heart, hands */}
        <div className="mb-8">
          <span className="hw-label block mb-3 text-calm-foreground/60">Body Check</span>
          <div className="flex items-center justify-center gap-4">
            {[
              { emoji: '🧠', label: 'Head', question: 'What are you thinking?' },
              { emoji: '❤️', label: 'Heart', question: 'What are you feeling?' },
              { emoji: '🖐️', label: 'Hands', question: 'What can you touch?' },
            ].map((item) => (
              <button
                key={item.label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-calm-foreground/10 hover:bg-calm-foreground/20 transition-colors min-w-[90px]"
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-calm-foreground text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sensory menu */}
        <div className="mb-8">
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

        {/* Parent scripts - expandable */}
        <div>
          <button
            onClick={() => setShowScripts(!showScripts)}
            className="flex items-center gap-2 mb-3"
          >
            <MessageSquare className="w-4 h-4 text-calm-foreground/60" />
            <span className="hw-label text-calm-foreground/60">Parent Scripts</span>
          </button>
          
          {showScripts && (
            <div className="space-y-2">
              {parentScripts.map((script, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-calm-foreground/10 text-calm-foreground"
                >
                  "{script}"
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
