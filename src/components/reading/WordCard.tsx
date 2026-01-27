import { useState } from 'react';
import { Volume2, Check, RefreshCw } from 'lucide-react';

interface WordCardProps {
  word: string;
  phonemes: string[];
  onComplete?: () => void;
  showCorrection?: boolean;
  onCorrection?: () => void;
}

export function WordCard({ 
  word, 
  phonemes, 
  onComplete,
  showCorrection = true,
  onCorrection,
}: WordCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showingCorrection, setShowingCorrection] = useState(false);
  const [correctionStep, setCorrectionStep] = useState<'myTurn' | 'together' | 'yourTurn'>('myTurn');

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleCorrect = () => {
    setIsCorrect(true);
    onComplete?.();
  };

  const handleNeedsHelp = () => {
    setShowingCorrection(true);
    setIsCorrect(false);
    onCorrection?.();
  };

  const handleCorrectionNext = () => {
    if (correctionStep === 'myTurn') {
      setCorrectionStep('together');
    } else if (correctionStep === 'together') {
      setCorrectionStep('yourTurn');
    } else {
      // Finished correction
      setShowingCorrection(false);
      setCorrectionStep('myTurn');
      setIsCorrect(true);
      onComplete?.();
    }
  };

  // Error correction flow
  if (showingCorrection) {
    const correctionScripts = {
      myTurn: {
        label: "My turn",
        instruction: "Parent says the word clearly",
        action: `"${word}"`,
      },
      together: {
        label: "Together",
        instruction: "Say it together",
        action: `"${word}"`,
      },
      yourTurn: {
        label: "Your turn",
        instruction: "Child says the word",
        action: "Great effort!",
      },
    };

    const current = correctionScripts[correctionStep];

    return (
      <div className="bg-secondary/50 rounded-3xl p-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full mb-4">
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">{current.label}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3">{current.instruction}</p>
        
        <div className="text-4xl font-display font-bold mb-6">{current.action}</div>
        
        <button
          onClick={handleCorrectionNext}
          className="px-8 py-3 rounded-xl bg-calm text-calm-foreground font-semibold"
        >
          {correctionStep === 'yourTurn' ? 'Done!' : 'Next'}
        </button>
      </div>
    );
  }

  return (
    <div className={`
      rounded-3xl p-6 text-center transition-all
      ${isCorrect === true ? 'bg-calm/20 border-2 border-calm' : 'bg-card border-2 border-border'}
    `}>
      {/* Word display */}
      <div className="relative mb-6">
        {!revealed ? (
          <button
            onClick={handleReveal}
            className="w-full py-8 rounded-2xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <span className="text-2xl text-muted-foreground">Tap to show word</span>
          </button>
        ) : (
          <div className="py-4">
            <div className="font-display text-5xl font-bold mb-2">{word}</div>
            {/* Phoneme breakdown (subtle) */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              {phonemes.map((p, i) => (
                <span key={i} className="font-mono text-sm">
                  {p}{i < phonemes.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Response buttons */}
      {revealed && isCorrect === null && (
        <div className="flex gap-3">
          {showCorrection && (
            <button
              onClick={handleNeedsHelp}
              className="flex-1 py-3 px-4 rounded-xl bg-muted text-muted-foreground font-medium hover:bg-muted/80"
            >
              Need help
            </button>
          )}
          <button
            onClick={handleCorrect}
            className="flex-1 py-3 px-4 rounded-xl bg-calm text-calm-foreground font-semibold flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>Got it!</span>
          </button>
        </div>
      )}

      {/* Success state */}
      {isCorrect === true && (
        <div className="flex items-center justify-center gap-2 text-calm">
          <Check className="w-5 h-5" />
          <span className="font-medium">Great reading!</span>
        </div>
      )}
    </div>
  );
}
