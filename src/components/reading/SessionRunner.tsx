import { useState, useEffect, useCallback } from 'react';
import { ReadingLesson, SessionStep, SessionState } from '@/types/reading';
import { ProgressRail } from './ProgressRail';
import { GraphemeCard } from './GraphemeCard';
import { BlendBoxes } from './BlendBoxes';
import { WordCard } from './WordCard';
import { TracePad } from './TracePad';
import { VisualTimer } from '@/components/VisualTimer';
import { graphemeCards } from '@/data/readingLessons';
import { ArrowRight, Book, Volume2, Star, MessageSquare } from 'lucide-react';

interface SessionRunnerProps {
  lesson: ReadingLesson;
  sessionMinutes: number;
  onComplete: (tokensEarned: number, durationSeconds: number) => void;
  onExit: () => void;
}

const STEP_DURATIONS: Record<SessionStep, number> = {
  warmup: 90,
  review: 180,
  teach: 120,
  practice: 180,
  sentence: 120,
  finish: 20,
};

export function SessionRunner({ 
  lesson, 
  sessionMinutes, 
  onComplete, 
  onExit 
}: SessionRunnerProps) {
  const [currentStep, setCurrentStep] = useState<SessionStep>('warmup');
  const [completedSteps, setCompletedSteps] = useState<SessionStep[]>([]);
  const [itemIndex, setItemIndex] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [startTime] = useState(Date.now());

  const steps: SessionStep[] = ['warmup', 'review', 'teach', 'practice', 'sentence', 'finish'];

  const handleNextStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(steps[currentIndex + 1]);
      setItemIndex(0);
    } else {
      // Session complete
      const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
      onComplete(tokensEarned + 2, durationSeconds); // +2 for completion
    }
  }, [currentStep, steps, tokensEarned, startTime, onComplete]);

  const handleItemComplete = useCallback(() => {
    setItemIndex(prev => prev + 1);
    setTokensEarned(prev => prev + 0.5); // Half token per item
  }, []);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'warmup':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Warm-Up: Blend These Sounds</h3>
              <p className="text-muted-foreground">Tap each sound, then blend!</p>
            </div>
            
            {itemIndex < lesson.warmUpWords.length ? (
              <BlendBoxes
                phonemes={lesson.wordList.find(w => w.word === lesson.warmUpWords[itemIndex])?.phonemes || ['?']}
                word={lesson.warmUpWords[itemIndex]}
                onComplete={handleItemComplete}
              />
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🔥</div>
                <p className="text-lg font-medium text-calm">Warm-up complete!</p>
              </div>
            )}
          </div>
        );

      case 'review':
        const reviewCards = lesson.reviewGraphemes.slice(0, 8).map(g => graphemeCards[g]).filter(Boolean);
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Review: Tap & Say</h3>
              <p className="text-muted-foreground">Tap each card and say the sound</p>
            </div>
            
            <div className="grid grid-cols-4 gap-3 justify-items-center">
              {reviewCards.map((card, idx) => (
                <GraphemeCard
                  key={card.id}
                  grapheme={card.grapheme}
                  phoneme={card.phoneme}
                  isDigraph={card.isDigraph}
                  size="small"
                  onTap={() => {
                    if (idx >= itemIndex) {
                      setItemIndex(prev => Math.max(prev, idx + 1));
                    }
                  }}
                />
              ))}
            </div>

            {itemIndex >= reviewCards.length && (
              <div className="text-center">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-calm font-medium">Great reviewing!</p>
              </div>
            )}
          </div>
        );

      case 'teach':
        const newGrapheme = lesson.newGraphemes[0];
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">New Learning</h3>
              <p className="text-muted-foreground">{lesson.teachingScript.introduction}</p>
            </div>

            {/* Big grapheme card */}
            <div className="flex justify-center">
              <GraphemeCard
                grapheme={newGrapheme.grapheme}
                phoneme={newGrapheme.phoneme}
                isDigraph={newGrapheme.isDigraph}
                size="large"
                showPhoneme
              />
            </div>

            {/* Teaching script toggle */}
            <button
              onClick={() => setShowScript(!showScript)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-secondary/50 rounded-xl"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showScript ? 'Hide' : 'Show'} Teaching Script
              </span>
            </button>

            {showScript && (
              <div className="space-y-3 bg-muted rounded-2xl p-4">
                <div>
                  <span className="text-xs font-mono text-muted-foreground">I DO:</span>
                  <p className="text-sm">{lesson.teachingScript.iDo}</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-muted-foreground">WE DO:</span>
                  <p className="text-sm">{lesson.teachingScript.weDo}</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-muted-foreground">YOU DO:</span>
                  <p className="text-sm">{lesson.teachingScript.youDo}</p>
                </div>
              </div>
            )}

            {/* Trace the letter */}
            <div className="flex justify-center">
              <TracePad 
                letter={newGrapheme.grapheme} 
                onComplete={() => setItemIndex(1)}
                size={180}
              />
            </div>
          </div>
        );

      case 'practice':
        const practiceWords = lesson.wordList.slice(0, 6);
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Practice: Read These Words</h3>
              <p className="text-muted-foreground">Tap, sound out, blend, read!</p>
            </div>

            {itemIndex < practiceWords.length ? (
              <WordCard
                word={practiceWords[itemIndex].word}
                phonemes={practiceWords[itemIndex].phonemes}
                onComplete={handleItemComplete}
              />
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🌟</div>
                <p className="text-lg font-medium text-calm">All words complete!</p>
              </div>
            )}

            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {practiceWords.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx < itemIndex ? 'bg-calm' : idx === itemIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        );

      case 'sentence':
        const sentences = lesson.sentences;
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Read the Sentence</h3>
              <p className="text-muted-foreground">Sound out each word, then read smoothly</p>
            </div>

            {itemIndex < sentences.length ? (
              <div className="bg-card rounded-3xl p-8 border-2 border-border text-center">
                <Book className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-3xl font-display font-medium leading-relaxed">
                  {sentences[itemIndex].text}
                </p>
                
                <button
                  onClick={handleItemComplete}
                  className="mt-6 px-8 py-3 rounded-xl bg-calm text-calm-foreground font-semibold"
                >
                  I read it!
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">📚</div>
                <p className="text-lg font-medium text-calm">Great sentence reading!</p>
              </div>
            )}
          </div>
        );

      case 'finish':
        return (
          <div className="text-center py-8 space-y-6">
            <div className="text-7xl animate-float">🎉</div>
            <div>
              <h2 className="text-3xl font-bold mb-2">You Did It!</h2>
              <p className="text-muted-foreground">Amazing reading practice today!</p>
            </div>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-token/20 rounded-full">
              <Star className="w-6 h-6 text-token" />
              <span className="text-xl font-bold text-token">+{Math.floor(tokensEarned) + 2} tokens</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Tomorrow we'll practice more with "{lesson.newGraphemes[0]?.grapheme}"
            </p>
          </div>
        );
    }
  };

  // Check if ready to advance
  const canAdvance = () => {
    switch (currentStep) {
      case 'warmup':
        return itemIndex >= lesson.warmUpWords.length;
      case 'review':
        return itemIndex >= Math.min(lesson.reviewGraphemes.length, 8);
      case 'teach':
        return itemIndex >= 1; // Traced the letter
      case 'practice':
        return itemIndex >= Math.min(lesson.wordList.length, 6);
      case 'sentence':
        return itemIndex >= lesson.sentences.length;
      case 'finish':
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with progress */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium"
          >
            Exit
          </button>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-token" />
            <span className="font-mono font-bold">{Math.floor(tokensEarned)}</span>
          </div>
        </div>
        <ProgressRail currentStep={currentStep} completedSteps={completedSteps} />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderStepContent()}
      </div>

      {/* Footer with Next button */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm p-4 border-t border-border safe-bottom">
        <button
          onClick={handleNextStep}
          disabled={!canAdvance()}
          className={`
            w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3
            transition-all
            ${canAdvance() 
              ? 'bg-primary text-primary-foreground hover:scale-[1.02] active:scale-100' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          <span>{currentStep === 'finish' ? 'Done!' : 'Next'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
