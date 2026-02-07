import { useState, useCallback, useEffect, useRef } from 'react';
import { Check, Eye, Ear, Hand } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { Slider } from '@/components/ui/slider';

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
  const [sliderValue, setSliderValue] = useState(0);
  const [visitedPhonemes, setVisitedPhonemes] = useState<Set<number>>(new Set());
  const [showingCorrection, setShowingCorrection] = useState(false);
  const [correctionStep, setCorrectionStep] = useState<CorrectionStep>('myTurn');
  const { speakPhoneme, speakWord, playReveal, playCorrect, playComplete, playTap } = useSound();
  const lastSpokenRef = useRef<number>(-1);

  // Reset when word changes
  useEffect(() => {
    setPhase('hidden');
    setSliderValue(0);
    setVisitedPhonemes(new Set());
    setShowingCorrection(false);
    setCorrectionStep('myTurn');
    lastSpokenRef.current = -1;
  }, [word]);

  // Speak phoneme when slider changes
  useEffect(() => {
    if (phase !== 'tapping') return;
    
    const phonemeIndex = sliderValue;
    if (phonemeIndex !== lastSpokenRef.current && phonemeIndex < phonemes.length) {
      speakPhoneme(phonemes[phonemeIndex]);
      lastSpokenRef.current = phonemeIndex;
    }
  }, [sliderValue, phonemes, speakPhoneme, phase]);

  const allVisited = visitedPhonemes.size === phonemes.length;

  const handleReveal = () => {
    playReveal();
    setPhase('revealed');
  };

  const handleStartTapping = () => {
    setPhase('tapping');
    setSliderValue(0);
    setVisitedPhonemes(new Set([0]));
    lastSpokenRef.current = -1;
  };

  const handleSliderChange = useCallback((value: number[]) => {
    const idx = value[0];
    setSliderValue(idx);
    setVisitedPhonemes(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  const handleCorrect = () => {
    playCorrect();
    setPhase('done');
    onComplete?.();
  };

  const handleNeedsHelp = () => {
    setShowingCorrection(true);
    onCorrection?.();
  };

  const handleCorrectionNext = () => {
    playTap();
    if (correctionStep === 'myTurn') {
      setCorrectionStep('together');
    } else if (correctionStep === 'together') {
      setCorrectionStep('yourTurn');
    } else {
      playComplete();
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
          <button 
            onClick={() => speakWord(word)}
            className="font-display text-5xl font-bold mb-4 hover:text-primary transition-colors"
            aria-label={`Hear the word ${word}`}
          >
            {word}
          </button>
          
          <p className="text-sm text-muted-foreground mb-4">
            Tap the word to hear it, then slide through the sounds
          </p>

          <button
            onClick={handleStartTapping}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            Slide the Sounds
          </button>
        </div>
      )}

      {/* Tapping/Sliding state - interactive phoneme slider */}
      {phase === 'tapping' && (
        <div className="animate-fade-in space-y-4">
          {/* Phoneme boxes - highlighted by slider */}
          <div className="flex justify-center gap-2">
            {phonemes.map((phoneme, idx) => {
              const isActive = sliderValue === idx;
              const isVisited = visitedPhonemes.has(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleSliderChange([idx])}
                  className={`
                    relative w-16 h-20 rounded-xl border-3 font-display text-2xl font-bold
                    transition-all duration-150
                    ${isActive 
                      ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-lg z-10' 
                      : isVisited
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'bg-card border-border'
                    }
                  `}
                >
                  {phoneme}
                  {isVisited && !isActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-calm flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-calm-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Slider control */}
          {phonemes.length > 1 && (
            <div className="w-full max-w-xs mx-auto px-4">
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

          {/* Word display - tap to hear the whole word */}
          <button 
            onClick={() => speakWord(word)}
            className="font-display text-4xl font-bold hover:text-primary transition-colors"
            aria-label={`Hear the word ${word}`}
          >
            {word}
          </button>

          {/* Action buttons - show when all visited */}
          {allVisited && (
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

          {!allVisited && (
            <p className="text-sm text-muted-foreground">
              Slide to hear each sound, then blend
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
