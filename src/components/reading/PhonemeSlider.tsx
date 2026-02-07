import { useState, useCallback, useEffect, useRef } from 'react';
import { Check, Volume2 } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { Slider } from '@/components/ui/slider';

interface PhonemeSliderProps {
  phonemes: string[];
  word: string;
  onComplete?: () => void;
  showWord?: boolean;
  /** 'warmup' uses blend-then-confirm flow; 'practice' uses slider-only flow */
  mode?: 'warmup' | 'practice';
}

export function PhonemeSlider({ 
  phonemes, 
  word, 
  onComplete, 
  showWord = false,
  mode = 'warmup',
}: PhonemeSliderProps) {
  const [sliderValue, setSliderValue] = useState(0);
  const [visitedPhonemes, setVisitedPhonemes] = useState<Set<number>>(new Set([0]));
  const [isBlending, setIsBlending] = useState(false);
  const [blendProgress, setBlendProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { speakPhoneme, speakWord, playBlend, playComplete } = useSound();
  const lastSpokenRef = useRef<number>(-1);

  // Reset state when word changes
  useEffect(() => {
    setSliderValue(0);
    setVisitedPhonemes(new Set([0]));
    setIsBlending(false);
    setBlendProgress(0);
    setIsComplete(false);
    lastSpokenRef.current = -1;
  }, [word]);

  // Speak phoneme when slider changes position
  useEffect(() => {
    if (isBlending || isComplete) return;
    
    const phonemeIndex = sliderValue;
    if (phonemeIndex !== lastSpokenRef.current && phonemeIndex < phonemes.length) {
      speakPhoneme(phonemes[phonemeIndex]);
      lastSpokenRef.current = phonemeIndex;
    }
  }, [sliderValue, phonemes, speakPhoneme, isBlending, isComplete]);

  const allVisited = visitedPhonemes.size === phonemes.length;

  const handleSliderChange = useCallback((value: number[]) => {
    if (isBlending || isComplete) return;
    const idx = value[0];
    setSliderValue(idx);
    setVisitedPhonemes(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, [isBlending, isComplete]);

  const handleBlend = useCallback(() => {
    setIsBlending(true);
    playBlend();
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setBlendProgress(progress);
      setSliderValue(Math.min(Math.floor(progress / 10), phonemes.length - 1));
      
      if (progress >= phonemes.length * 10) {
        clearInterval(interval);
        setIsComplete(true);
        playComplete();
        speakWord(word);
        onComplete?.();
      }
    }, 50);
  }, [phonemes.length, word, onComplete, playBlend, playComplete, speakWord]);

  const handleReset = useCallback(() => {
    setSliderValue(0);
    setVisitedPhonemes(new Set([0]));
    setIsBlending(false);
    setBlendProgress(0);
    setIsComplete(false);
    lastSpokenRef.current = -1;
  }, []);

  // For the blend animation highlight
  const blendingPhonemeIndex = isBlending 
    ? Math.min(Math.floor(blendProgress / 10), phonemes.length - 1) 
    : -1;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Instruction */}
      {!allVisited && !isComplete && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Volume2 className="w-4 h-4" />
          <span>Slide through each sound</span>
        </div>
      )}

      {/* Phoneme boxes - all visible, active one highlighted */}
      <div className="flex items-center gap-2">
        {phonemes.map((phoneme, index) => {
          const isActive = sliderValue === index && !isComplete;
          const isVisited = visitedPhonemes.has(index);
          const isBlendingThis = blendingPhonemeIndex === index;
          
          return (
            <button
              key={index}
              onClick={() => {
                if (!isBlending && !isComplete) {
                  handleSliderChange([index]);
                }
              }}
              className={`
                relative w-20 h-24 rounded-2xl border-4 
                flex items-center justify-center
                font-display text-3xl font-bold
                transition-all duration-200
                ${isBlendingThis 
                  ? 'bg-calm text-calm-foreground border-calm scale-110 shadow-lg z-10' 
                  : isActive 
                    ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-lg z-10' 
                    : isVisited 
                      ? 'bg-primary/20 text-primary border-primary/40' 
                      : 'bg-card border-border opacity-60'
                }
              `}
            >
              <span className={phoneme.length > 1 ? 'tracking-tighter' : ''}>
                {phoneme}
              </span>
              
              {/* Visit indicator */}
              {isVisited && !isActive && !isBlending && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-calm flex items-center justify-center">
                  <Check className="w-3 h-3 text-calm-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Slider control */}
      {!isComplete && !isBlending && phonemes.length > 1 && (
        <div className="w-full max-w-xs px-4">
          <Slider
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            min={0}
            max={phonemes.length - 1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-1 px-1">
            {phonemes.map((_, idx) => (
              <div 
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  visitedPhonemes.has(idx) ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Blend button - only when all phonemes visited */}
      {allVisited && !isBlending && !isComplete && (
        <button
          onClick={handleBlend}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-calm text-calm-foreground font-bold text-lg hover:scale-105 active:scale-100 transition-transform animate-fade-in"
        >
          <span>Blend the sounds!</span>
          <Volume2 className="w-5 h-5" />
        </button>
      )}

      {/* Blending animation */}
      {isBlending && !isComplete && (
        <div className="text-center animate-pulse">
          <span className="text-lg text-muted-foreground">Blending...</span>
        </div>
      )}

      {/* Blended word result */}
      {(isComplete || showWord) && (
        <div className="flex flex-col items-center gap-3 animate-scale-in">
          <div className="px-10 py-5 rounded-3xl bg-calm/20 border-3 border-calm">
            <span className="font-display text-5xl font-bold text-calm">
              {word}
            </span>
          </div>
          <div className="flex items-center gap-2 text-calm">
            <Check className="w-5 h-5" />
            <span className="font-medium">Great blending!</span>
          </div>
        </div>
      )}

      {/* Reset button when complete */}
      {isComplete && (
        <button
          onClick={handleReset}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Try again
        </button>
      )}
    </div>
  );
}
