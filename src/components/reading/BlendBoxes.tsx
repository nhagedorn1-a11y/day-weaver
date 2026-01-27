import { useState, useCallback } from 'react';
import { Volume2, ArrowRight } from 'lucide-react';

interface BlendBoxesProps {
  phonemes: string[];
  word: string;
  onComplete?: () => void;
  showWord?: boolean;
}

export function BlendBoxes({ phonemes, word, onComplete, showWord = false }: BlendBoxesProps) {
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const [tappedAll, setTappedAll] = useState(false);
  const [isBlending, setIsBlending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handlePhoneTap = useCallback((index: number) => {
    setTappedIndex(index);
    
    // Check if all have been tapped
    setTimeout(() => {
      if (index === phonemes.length - 1) {
        setTappedAll(true);
      }
      setTappedIndex(null);
    }, 400);
  }, [phonemes.length]);

  const handleBlend = useCallback(() => {
    setIsBlending(true);
    setTimeout(() => {
      setIsComplete(true);
      onComplete?.();
    }, 800);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Phoneme boxes */}
      <div className="flex items-center gap-3">
        {phonemes.map((phoneme, index) => (
          <button
            key={index}
            onClick={() => handlePhoneTap(index)}
            disabled={isBlending || isComplete}
            className={`
              w-20 h-24 rounded-2xl border-4 
              flex items-center justify-center
              font-display text-3xl font-bold
              transition-all duration-200
              ${tappedIndex === index 
                ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-lg' 
                : 'bg-card border-border hover:border-primary/50'
              }
              ${isBlending ? 'animate-pulse' : ''}
            `}
          >
            {phoneme}
          </button>
        ))}
      </div>

      {/* Blend arrow */}
      {!isComplete && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm">Tap each sound</span>
          </div>
          
          {tappedAll && (
            <button
              onClick={handleBlend}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-calm text-calm-foreground font-semibold hover:scale-105 transition-transform"
            >
              <span>Blend!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Blended word result */}
      {(isComplete || showWord) && (
        <div className="flex flex-col items-center gap-2 animate-scale-in">
          <div className="px-8 py-4 rounded-2xl bg-calm/20 border-2 border-calm">
            <span className="font-display text-4xl font-bold text-calm">
              {word}
            </span>
          </div>
          {isComplete && (
            <span className="text-calm text-sm font-medium">Great blending! ✨</span>
          )}
        </div>
      )}
    </div>
  );
}
