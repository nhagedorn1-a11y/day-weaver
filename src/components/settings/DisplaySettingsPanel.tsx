import { Palette, ChevronRight, Sun, Moon, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

interface DisplaySettingsPanelProps {
  onBack: () => void;
}

export function DisplaySettingsPanel({ onBack }: DisplaySettingsPanelProps) {
  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('reduced-motion') === 'true';
  });
  
  const [textSize, setTextSize] = useState(() => {
    return parseFloat(localStorage.getItem('text-size') || '1');
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
  });

  useEffect(() => {
    localStorage.setItem('reduced-motion', String(reducedMotion));
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('text-size', String(textSize));
    document.documentElement.style.fontSize = `${textSize * 100}%`;
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground mb-6">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back
      </button>
      
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <Palette className="w-5 h-5" />
        Display
      </h2>
      <p className="text-sm text-muted-foreground mb-6">Customize how the app looks</p>

      <div className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <label className="font-medium">Theme</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`p-3 rounded-xl text-center transition-all ${
                theme === 'light'
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Sun className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs font-medium">Light</p>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-xl text-center transition-all ${
                theme === 'dark'
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Moon className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs font-medium">Dark</p>
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-3 rounded-xl text-center transition-all ${
                theme === 'system'
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Sparkles className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs font-medium">Auto</p>
            </button>
          </div>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
          <div>
            <p className="font-medium">Reduce Motion</p>
            <p className="text-sm text-muted-foreground">Minimize animations</p>
          </div>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`
              w-14 h-8 rounded-full transition-colors relative
              ${reducedMotion ? 'bg-primary' : 'bg-muted-foreground/30'}
            `}
          >
            <div 
              className={`
                absolute top-1 w-6 h-6 rounded-full bg-white shadow-md
                transition-transform
                ${reducedMotion ? 'translate-x-7' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        {/* Text Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">Text Size</label>
            <span className="text-sm text-muted-foreground">
              {textSize < 0.9 ? 'Small' : textSize > 1.1 ? 'Large' : 'Normal'}
            </span>
          </div>
          <Slider
            value={[textSize]}
            onValueChange={([v]) => setTextSize(v)}
            min={0.8}
            max={1.3}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>A</span>
            <span className="text-lg">A</span>
          </div>
        </div>

        {/* Low-stimulation info */}
        <div className="p-4 rounded-xl bg-calm/10 border border-calm/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-calm/20 flex items-center justify-center flex-shrink-0">
              <Palette className="w-4 h-4 text-calm" />
            </div>
            <div>
              <p className="font-medium text-calm">Low-Stimulation Design</p>
              <p className="text-sm text-muted-foreground mt-1">
                This app uses calm colors and minimal animations by default for a comfortable experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
