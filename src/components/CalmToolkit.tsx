import { useState, useEffect } from 'react';
import { X, Wind, Heart, Hand, Headphones, Dumbbell, Moon, Shield, MessageSquare, ChevronDown } from 'lucide-react';

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
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

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

  const bodyParts = [
    { emoji: '🧠', label: 'Head', question: 'What are you thinking?' },
    { emoji: '❤️', label: 'Heart', question: 'What are you feeling?' },
    { emoji: '🖐️', label: 'Hands', question: 'What can you touch?' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-calm via-calm to-calm/90 flex flex-col safe-top safe-bottom overflow-y-auto animate-fade-in">
      {/* Header with "We're safe" anchor */}
      <div className="flex items-center justify-between p-5 sticky top-0 bg-calm/95 backdrop-blur-md z-10 border-b border-calm-foreground/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-calm-foreground/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-calm-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-calm-foreground">We're Safe</h2>
            <p className="text-xs text-calm-foreground/60">Take your time</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-11 h-11 rounded-xl bg-calm-foreground/10 flex items-center justify-center hover:bg-calm-foreground/20 transition-colors touch-bounce"
        >
          <X className="w-5 h-5 text-calm-foreground" />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-5 pb-6 stagger-children">
        {/* Breathing circle - main focus */}
        <div className="flex-1 flex items-center justify-center py-8 min-h-[280px]">
          <button
            onClick={() => setActiveBreathing(!activeBreathing)}
            className="relative group"
          >
            {/* Outer ring */}
            <div className={`absolute inset-0 rounded-full border-4 border-calm-foreground/20 transition-all duration-[4000ms] ${
              activeBreathing && breathPhase === 'in' ? 'scale-[1.3] border-calm-foreground/40' : 
              activeBreathing && breathPhase === 'out' ? 'scale-100 border-calm-foreground/20' : ''
            }`} />
            
            <div
              className={`w-52 h-52 rounded-full bg-calm-foreground/15 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out ${
                activeBreathing ? (breathPhase === 'in' ? 'scale-125' : breathPhase === 'out' ? 'scale-100' : 'scale-125') : 'group-hover:scale-105'
              }`}
            >
              <div className="w-32 h-32 rounded-full bg-calm-foreground/25 flex items-center justify-center shadow-inner">
                <Wind className={`w-12 h-12 text-calm-foreground transition-transform duration-1000 ${activeBreathing ? 'animate-pulse' : ''}`} />
              </div>
            </div>
            
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
              <span className="text-calm-foreground text-lg font-semibold whitespace-nowrap block">
                {activeBreathing ? breathText[breathPhase] : 'Tap to breathe'}
              </span>
              {!activeBreathing && (
                <span className="text-calm-foreground/50 text-xs">4-4-4 pattern</span>
              )}
            </div>
          </button>
        </div>

        {/* Body check - head, heart, hands */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-calm-foreground/60" />
            <span className="text-xs font-bold uppercase tracking-wider text-calm-foreground/60">Body Check</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            {bodyParts.map((item) => (
              <button
                key={item.label}
                onClick={() => setSelectedBodyPart(selectedBodyPart === item.label ? null : item.label)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all touch-bounce min-w-[100px] ${
                  selectedBodyPart === item.label 
                    ? 'bg-calm-foreground/30 scale-105 shadow-lg' 
                    : 'bg-calm-foreground/10 hover:bg-calm-foreground/20'
                }`}
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-calm-foreground text-sm font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
          
          {/* Show question for selected body part */}
          {selectedBodyPart && (
            <div className="mt-4 p-4 rounded-2xl bg-calm-foreground/15 text-center animate-scale-in">
              <p className="text-calm-foreground text-lg font-medium">
                {bodyParts.find(b => b.label === selectedBodyPart)?.question}
              </p>
            </div>
          )}
        </div>

        {/* Sensory menu */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Hand className="w-4 h-4 text-calm-foreground/60" />
            <span className="text-xs font-bold uppercase tracking-wider text-calm-foreground/60">Sensory Menu</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {sensoryTools.map((tool) => (
              <button
                key={tool.id}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-calm-foreground/10 hover:bg-calm-foreground/20 transition-all touch-bounce"
              >
                <div className="w-10 h-10 rounded-lg bg-calm-foreground/15 flex items-center justify-center">
                  <tool.icon className="w-5 h-5 text-calm-foreground" />
                </div>
                <span className="text-calm-foreground text-[10px] font-semibold text-center leading-tight">
                  {tool.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Parent scripts - expandable */}
        <div className="rounded-2xl bg-calm-foreground/10 overflow-hidden">
          <button
            onClick={() => setShowScripts(!showScripts)}
            className="w-full flex items-center justify-between p-4 hover:bg-calm-foreground/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-calm-foreground/60" />
              <span className="text-sm font-semibold text-calm-foreground">Parent Scripts</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-calm-foreground/60 transition-transform ${showScripts ? 'rotate-180' : ''}`} />
          </button>
          
          {showScripts && (
            <div className="px-4 pb-4 space-y-2 animate-slide-down">
              {parentScripts.map((script, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-calm-foreground/10 text-calm-foreground text-sm"
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
