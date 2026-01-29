import { useState, useCallback } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

interface BlendBoxesProps {
  phonemes: string[];
  word: string;
  onComplete?: () => void;
  showWord?: boolean;
}

export function BlendBoxes({ phonemes, word, onComplete, showWord = false }: BlendBoxesProps) {
  const [tappedPhonemes, setTappedPhonemes] = useState<Set<number>>(new Set());
  const [currentExpected, setCurrentExpected] = useState(0);
  const [isBlending, setIsBlending] = useState(false);
  const [blendProgress, setBlendProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showError, setShowError] = useState(false);
  const { playTap, playBlend, playComplete } = useSound();

  const allTapped = tappedPhonemes.size === phonemes.length;

  const handlePhoneTap = useCallback((index: number) => {
    if (isBlending || isComplete) return;

    // Must tap in sequence for OG method
    if (index === currentExpected) {
      playTap(); // Play tap sound on correct tap
      const newTapped = new Set(tappedPhonemes);
      newTapped.add(index);
      setTappedPhonemes(newTapped);
      setCurrentExpected(prev => prev + 1);
      setShowError(false);
    } else if (index !== currentExpected) {
      // Wrong order - show gentle feedback
      setShowError(true);
      setTimeout(() => setShowError(false), 800);
    }
  }, [currentExpected, tappedPhonemes, isBlending, isComplete, playTap]);

  const handleBlend = useCallback(() => {
    setIsBlending(true);
    playBlend(); // Play blend swoosh sound
    
    // Animate the blend - sweep through each phoneme
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setBlendProgress(progress);
      
      if (progress >= phonemes.length * 10) {
        clearInterval(interval);
        setIsComplete(true);
        playComplete(); // Play completion sound
        onComplete?.();
      }
    }, 50);
  }, [phonemes.length, onComplete, playBlend, playComplete]);

  const handleReset = useCallback(() => {
    setTappedPhonemes(new Set());
    setCurrentExpected(0);
    setIsBlending(false);
    setBlendProgress(0);
    setIsComplete(false);
    setShowError(false);
  }, []);

  // Calculate which phoneme is highlighted during blend
  const blendingPhonemeIndex = isBlending 
    ? Math.min(Math.floor(blendProgress / 10), phonemes.length - 1) 
    : -1;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Instruction */}
      {!allTapped && !isComplete && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Hand className="w-4 h-4" />
          <span>Tap each sound in order: {currentExpected + 1} of {phonemes.length}</span>
        </div>
      )}

      {/* Error message */}
      {showError && (
        <div className="text-sm text-destructive animate-fade-in">
          Tap them in order — start from the left!
        </div>
      )}

      {/* Phoneme boxes */}
      <div className="flex items-center gap-2">
        {phonemes.map((phoneme, index) => {
          const isTapped = tappedPhonemes.has(index);
          const isCurrent = index === currentExpected && !allTapped;
          const isBlendingThis = blendingPhonemeIndex === index;
          
          return (
            <button
              key={index}
              onClick={() => handlePhoneTap(index)}
              disabled={isBlending || isComplete || isTapped}
              className={`
                relative w-20 h-24 rounded-2xl border-4 
                flex items-center justify-center
                font-display text-3xl font-bold
                transition-all duration-200
                ${isBlendingThis 
                  ? 'bg-calm text-calm-foreground border-calm scale-110 shadow-lg z-10' 
                  : isTapped 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : isCurrent
                      ? 'bg-card border-primary border-dashed hover:scale-105 cursor-pointer'
                      : 'bg-card border-border opacity-60'
                }
              `}
            >
              <span className={phoneme.length > 1 ? 'tracking-tighter' : ''}>
                {phoneme}
              </span>
              
              {/* Tap indicator */}
              {isTapped && !isBlending && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-calm flex items-center justify-center">
                  <Check className="w-3 h-3 text-calm-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Blend button - only shows when all tapped */}
      {allTapped && !isBlending && !isComplete && (
        <button
          onClick={handleBlend}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-calm text-calm-foreground font-bold text-lg hover:scale-105 active:scale-100 transition-transform animate-fade-in"
        >
          <span>Blend the sounds!</span>
          <ArrowRight className="w-6 h-6" />
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

// Hand icon component
function Hand({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}
