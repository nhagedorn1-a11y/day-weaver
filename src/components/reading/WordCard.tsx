import { useState } from 'react';
import { Check, Eye, Ear, Hand } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

interface WordCardProps {
  word: string;
  phonemes: string[];
  onComplete?: () => void;
  showCorrection?: boolean;
  onCorrection?: () => void;
}

type CorrectionStep = 'myTurn' | 'together' | 'yourTurn';

export function WordCard({ 
  word, 
  phonemes, 
  onComplete,
  showCorrection = true,
  onCorrection,
}: WordCardProps) {
  const [phase, setPhase] = useState<'hidden' | 'revealed' | 'tapping' | 'done'>('hidden');
  const [tappedPhonemes, setTappedPhonemes] = useState<Set<number>>(new Set());
  const [showingCorrection, setShowingCorrection] = useState(false);
  const [correctionStep, setCorrectionStep] = useState<CorrectionStep>('myTurn');
  const { playTap, playReveal, playCorrect, playComplete } = useSound();

  const handleReveal = () => {
    playReveal(); // Play reveal sound
    setPhase('revealed');
  };

  const handleStartTapping = () => {
    setPhase('tapping');
  };

  const handlePhonemeTap = (index: number) => {
    if (!tappedPhonemes.has(index)) {
      playTap(); // Play tap sound
      const newTapped = new Set(tappedPhonemes);
      newTapped.add(index);
      setTappedPhonemes(newTapped);
    }
  };

  const allPhonemesTapped = tappedPhonemes.size === phonemes.length;

  const handleCorrect = () => {
    playCorrect(); // Play success sound
    setPhase('done');
    onComplete?.();
  };

  const handleNeedsHelp = () => {
    setShowingCorrection(true);
    onCorrection?.();
  };

  const handleCorrectionNext = () => {
    playTap(); // Play tap sound for progression
    if (correctionStep === 'myTurn') {
      setCorrectionStep('together');
    } else if (correctionStep === 'together') {
      setCorrectionStep('yourTurn');
    } else {
      // Finished correction - mark as complete
      playComplete(); // Play completion sound
      setShowingCorrection(false);
      setCorrectionStep('myTurn');
      setPhase('done');
      onComplete?.();
    }
  };

  // OG Error Correction: My Turn → Together → Your Turn
  if (showingCorrection) {
    const correctionContent = {
      myTurn: {
        icon: <Eye className="w-5 h-5" />,
        label: "My Turn",
        instruction: "Parent: Say the word clearly, pointing to each sound",
        display: word,
        sublabel: "Watch and listen",
      },
      together: {
        icon: <Ear className="w-5 h-5" />,
        label: "Together",
        instruction: "Say it together while pointing to the sounds",
        display: word,
        sublabel: "Let's say it together",
      },
      yourTurn: {
        icon: <Hand className="w-5 h-5" />,
        label: "Your Turn",
        instruction: "Now you try — point and say each sound",
        display: word,
        sublabel: "You've got this!",
      },
    };

    const content = correctionContent[correctionStep];

    return (
      <div className="bg-muted/50 rounded-3xl p-6 text-center animate-fade-in">
        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-4">
          {(['myTurn', 'together', 'yourTurn'] as CorrectionStep[]).map((step, idx) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === correctionStep 
                  ? 'bg-primary text-primary-foreground' 
                  : idx < ['myTurn', 'together', 'yourTurn'].indexOf(correctionStep)
                    ? 'bg-calm text-calm-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full mb-3">
          {content.icon}
          <span className="text-sm font-medium">{content.label}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">{content.instruction}</p>
        
        {/* Word with phoneme boxes */}
        <div className="flex justify-center gap-2 mb-4">
          {phonemes.map((phoneme, idx) => (
            <div 
              key={idx}
              className="w-14 h-16 rounded-xl bg-card border-2 border-primary flex items-center justify-center font-display text-2xl font-bold"
            >
              {phoneme}
            </div>
          ))}
        </div>
        
        <div className="text-3xl font-display font-bold mb-4">{content.display}</div>
        <p className="text-sm text-muted-foreground mb-4">{content.sublabel}</p>
        
        <button
          onClick={handleCorrectionNext}
          className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
        >
          {correctionStep === 'yourTurn' ? 'Done!' : 'Next'}
        </button>
      </div>
    );
  }

  return (
    <div className={`
      rounded-3xl p-6 text-center transition-all
      ${phase === 'done' ? 'bg-calm/20 border-2 border-calm' : 'bg-card border-2 border-border'}
    `}>
      {/* Hidden state - tap to reveal */}
      {phase === 'hidden' && (
        <button
          onClick={handleReveal}
          className="w-full py-12 rounded-2xl bg-muted hover:bg-muted/80 transition-colors"
        >
          <Eye className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <span className="text-lg text-muted-foreground">Tap to show word</span>
        </button>
      )}

      {/* Revealed state - see word, can start tapping */}
      {phase === 'revealed' && (
        <div className="animate-fade-in">
          <div className="font-display text-5xl font-bold mb-4">{word}</div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Tap the sounds, then blend them together
          </p>

          <button
            onClick={handleStartTapping}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            Tap the Sounds
          </button>
        </div>
      )}

      {/* Tapping state - interactive phoneme boxes */}
      {phase === 'tapping' && (
        <div className="animate-fade-in space-y-4">
          {/* Phoneme boxes */}
          <div className="flex justify-center gap-2">
            {phonemes.map((phoneme, idx) => {
              const isTapped = tappedPhonemes.has(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handlePhonemeTap(idx)}
                  disabled={isTapped}
                  className={`
                    w-16 h-20 rounded-xl border-3 font-display text-2xl font-bold
                    transition-all duration-150
                    ${isTapped 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-card border-border hover:border-primary/50 hover:scale-105'
                    }
                  `}
                >
                  {phoneme}
                </button>
              );
            })}
          </div>

          {/* Word display */}
          <div className="font-display text-4xl font-bold">{word}</div>

          {/* Action buttons - only show when all tapped */}
          {allPhonemesTapped && (
            <div className="flex gap-3 justify-center animate-fade-in pt-2">
              {showCorrection && (
                <button
                  onClick={handleNeedsHelp}
                  className="flex-1 max-w-32 py-3 px-4 rounded-xl bg-muted text-muted-foreground font-medium hover:bg-muted/80"
                >
                  Need help
                </button>
              )}
              <button
                onClick={handleCorrect}
                className="flex-1 max-w-40 py-3 px-4 rounded-xl bg-calm text-calm-foreground font-semibold flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>Got it!</span>
              </button>
            </div>
          )}

          {!allPhonemesTapped && (
            <p className="text-sm text-muted-foreground">
              Tap each sound box while saying it
            </p>
          )}
        </div>
      )}

      {/* Success state */}
      {phase === 'done' && (
        <div className="animate-fade-in py-4">
          <div className="font-display text-4xl font-bold mb-3">{word}</div>
          <div className="flex items-center justify-center gap-2 text-calm">
            <Check className="w-5 h-5" />
            <span className="font-medium">Great reading!</span>
          </div>
        </div>
      )}
    </div>
  );
}
