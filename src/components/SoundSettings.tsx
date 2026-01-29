import { Volume2, VolumeX, Settings, ChevronDown } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

export function SoundSettings() {
  const { 
    isEnabled, 
    volume, 
    toggle, 
    setVolume, 
    settings, 
    setSettings, 
    availableVoices,
    speakPhoneme 
  } = useSound();
  const [isOpen, setIsOpen] = useState(false);

  const testSound = () => {
    speakPhoneme('a');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className={`
            flex items-center gap-2 px-3 py-2 rounded-xl
            transition-colors
            ${isEnabled 
              ? 'bg-primary/10 text-primary hover:bg-primary/20' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }
          `}
        >
          {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          <Settings className="w-4 h-4" />
        </button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[340px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Sound Settings
          </SheetTitle>
          <SheetDescription>
            Configure how phonetic sounds are spoken
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div>
              <p className="font-medium">Sound Effects</p>
              <p className="text-sm text-muted-foreground">Enable audio feedback</p>
            </div>
            <button
              onClick={toggle}
              className={`
                w-14 h-8 rounded-full transition-colors relative
                ${isEnabled ? 'bg-primary' : 'bg-muted-foreground/30'}
              `}
            >
              <div 
                className={`
                  absolute top-1 w-6 h-6 rounded-full bg-white shadow-md
                  transition-transform
                  ${isEnabled ? 'translate-x-7' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {isEnabled && (
            <>
              {/* Volume */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Volume</label>
                  <span className="text-sm text-muted-foreground">{Math.round(volume * 100)}%</span>
                </div>
                <Slider
                  value={[volume]}
                  onValueChange={([v]) => setVolume(v)}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Speech Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Speech Speed</label>
                  <span className="text-sm text-muted-foreground">
                    {settings.speechRate < 0.7 ? 'Slow' : settings.speechRate > 0.9 ? 'Normal' : 'Clear'}
                  </span>
                </div>
                <Slider
                  value={[settings.speechRate]}
                  onValueChange={([v]) => setSettings({ speechRate: v })}
                  min={0.5}
                  max={1.2}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Slower speeds help with phoneme clarity
                </p>
              </div>

              {/* Speech Pitch */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Pitch</label>
                  <span className="text-sm text-muted-foreground">
                    {settings.speechPitch < 0.9 ? 'Lower' : settings.speechPitch > 1.1 ? 'Higher' : 'Normal'}
                  </span>
                </div>
                <Slider
                  value={[settings.speechPitch]}
                  onValueChange={([v]) => setSettings({ speechPitch: v })}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Voice Selection */}
              <div className="space-y-3">
                <label className="font-medium">Voice</label>
                <div className="relative">
                  <select
                    value={settings.voiceURI}
                    onChange={(e) => setSettings({ voiceURI: e.target.value })}
                    className="w-full p-3 pr-10 rounded-xl bg-muted border-0 appearance-none cursor-pointer focus:ring-2 focus:ring-primary"
                  >
                    {availableVoices.length === 0 ? (
                      <option>Loading voices...</option>
                    ) : (
                      availableVoices.map((voice) => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                          {voice.name}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Using browser's built-in Text-to-Speech
                </p>
              </div>

              {/* Test Button */}
              <div className="pt-2">
                <button
                  onClick={testSound}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  Test Sound (say "ah")
                </button>
              </div>

              {/* ElevenLabs Premium Notice */}
              <div className="p-4 rounded-xl bg-token/10 border border-token/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-token/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✨</span>
                  </div>
                  <div>
                    <p className="font-medium text-token">Premium Voices</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ElevenLabs integration available for higher-quality phoneme pronunciation. 
                      Requires a paid ElevenLabs account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Phoneme Test Grid */}
              <div className="space-y-3">
                <p className="font-medium">Test Phonemes</p>
                <div className="grid grid-cols-4 gap-2">
                  {['a', 'e', 'i', 'o', 's', 'sh', 'th', 'ch', 'b', 'd', 'f', 'g', 'ee', 'oo', 'ar', 'or'].map((phoneme) => (
                    <button
                      key={phoneme}
                      onClick={() => speakPhoneme(phoneme)}
                      className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary text-center font-mono text-sm transition-colors"
                    >
                      {phoneme}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
