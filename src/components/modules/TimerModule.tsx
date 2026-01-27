import { useState } from 'react';
import { ArrowLeft, Clock, Timer, Hourglass, Play } from 'lucide-react';
import { VisualTimer } from '@/components/VisualTimer';

interface TimerModuleProps {
  onBack: () => void;
  onTokensEarned: (tokens: number) => void;
}

type TimerVariant = 'circle' | 'bar' | 'sand';

interface TimerPreset {
  label: string;
  minutes: number;
  icon: string;
}

const presets: TimerPreset[] = [
  { label: '1 min', minutes: 1, icon: '⚡' },
  { label: '2 min', minutes: 2, icon: '🎯' },
  { label: '5 min', minutes: 5, icon: '⏱️' },
  { label: '10 min', minutes: 10, icon: '📚' },
  { label: '15 min', minutes: 15, icon: '✏️' },
  { label: '20 min', minutes: 20, icon: '🎨' },
  { label: '30 min', minutes: 30, icon: '📖' },
  { label: '45 min', minutes: 45, icon: '🧩' },
];

const variants: { id: TimerVariant; label: string; icon: React.ReactNode }[] = [
  { id: 'circle', label: 'Circle', icon: <Clock className="w-5 h-5" /> },
  { id: 'bar', label: 'Bar', icon: <Timer className="w-5 h-5" /> },
  { id: 'sand', label: 'Sand', icon: <Hourglass className="w-5 h-5" /> },
];

export function TimerModule({ onBack, onTokensEarned }: TimerModuleProps) {
  const [activeTimer, setActiveTimer] = useState(false);
  const [duration, setDuration] = useState(300); // 5 minutes default
  const [variant, setVariant] = useState<TimerVariant>('circle');
  const [timerLabel, setTimerLabel] = useState('Timer');

  const handlePresetSelect = (preset: TimerPreset) => {
    setDuration(preset.minutes * 60);
    setTimerLabel(`${preset.label} Timer`);
  };

  const handleTimerComplete = () => {
    setActiveTimer(false);
    onTokensEarned(1);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
  };

  if (activeTimer) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="flex items-center gap-3 p-4 safe-top border-b border-border">
          <button
            onClick={() => setActiveTimer(false)}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">{timerLabel}</h1>
            <span className="hw-label">Visual Timer</span>
          </div>
        </header>

        {/* Timer Display */}
        <div className="p-6">
          <VisualTimer
            duration={duration}
            onComplete={handleTimerComplete}
            onDurationChange={handleDurationChange}
            label={timerLabel}
            variant={variant}
            showControls
            autoStart={false}
          />

          {/* Variant switcher */}
          <div className="mt-6">
            <span className="hw-label block mb-3">Timer Style</span>
            <div className="flex gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariant(v.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    variant === v.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {v.icon}
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 safe-top border-b border-border">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-semibold text-lg">Visual Timers</h1>
          <span className="hw-label">Set a timer for any activity</span>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Quick Presets */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Quick Start</h2>
          <div className="grid grid-cols-4 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.minutes}
                onClick={() => {
                  handlePresetSelect(preset);
                  setActiveTimer(true);
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover:scale-105 active:scale-100 transition-all"
              >
                <span className="text-2xl">{preset.icon}</span>
                <span className="font-semibold text-sm">{preset.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Timer Style Preview */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Timer Style</h2>
          <div className="flex gap-3">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariant(v.id)}
                className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  variant === v.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  variant === v.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}>
                  {v.icon}
                </div>
                <span className={`font-semibold ${variant === v.id ? 'text-primary' : ''}`}>
                  {v.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Custom Timer */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Custom Timer</h2>
          <button
            onClick={() => setActiveTimer(true)}
            className="w-full giant-button bg-primary text-primary-foreground hover:scale-[1.02] active:scale-100"
          >
            <Play className="w-8 h-8" />
            <span>Create Custom Timer</span>
          </button>
          <p className="text-sm text-muted-foreground text-center mt-3">
            Tap to start, then adjust the time with the scroll picker
          </p>
        </section>

        {/* Tips */}
        <section className="bg-calm/10 rounded-2xl p-4">
          <h3 className="font-semibold text-calm mb-2">💡 Timer Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Circle:</strong> Great for seeing time shrink visually</li>
            <li>• <strong>Bar:</strong> Shows progress like a loading bar</li>
            <li>• <strong>Sand:</strong> Calming, like an hourglass</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
