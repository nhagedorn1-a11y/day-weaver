import { useState, useCallback, useMemo } from 'react';
import { ReadingLesson, SessionStep } from '@/types/reading';
import { ProgressRail } from './ProgressRail';
import { GraphemeCard } from './GraphemeCard';
import { BlendBoxes } from './BlendBoxes';
import { WordCard } from './WordCard';
import { TracePad } from './TracePad';
import { graphemeCards } from '@/data/readingLessons';
import { ArrowRight, Book, Star, Hand, Eye, Ear } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

interface SessionRunnerProps {
  lesson: ReadingLesson;
  sessionMinutes: number;
  onComplete: (tokensEarned: number, durationSeconds: number) => void;
  onExit: () => void;
}

// OG-aligned step structure with proper pacing
const STEPS: SessionStep[] = ['warmup', 'review', 'teach', 'practice', 'sentence', 'finish'];

export function SessionRunner({ 
  lesson, 
  sessionMinutes, 
  onComplete, 
  onExit 
}: SessionRunnerProps) {
  const [currentStep, setCurrentStep] = useState<SessionStep>('warmup');
  const [completedSteps, setCompletedSteps] = useState<SessionStep[]>([]);
  const [itemIndex, setItemIndex] = useState(0);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [startTime] = useState(Date.now());
  
  // Teaching step state
  const [teachPhase, setTeachPhase] = useState<'intro' | 'iDo' | 'weDo' | 'youDo' | 'trace'>('intro');
  
  // Error tracking for adaptive pacing
  const [errorCount, setErrorCount] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  
  // Sound effects
  const { playComplete, playTokenEarned, playTap, playCorrect } = useSound();

  // Calculate items for each step
  const stepItems = useMemo(() => ({
    warmup: lesson.warmUpWords.slice(0, 3),
    review: lesson.reviewGraphemes.slice(0, 6).map(g => graphemeCards[g]).filter(Boolean),
    practice: lesson.wordList.slice(0, Math.min(6, lesson.wordList.length)),
    sentence: lesson.sentences.slice(0, 2),
  }), [lesson]);

  const handleNextStep = useCallback(() => {
    const currentIndex = STEPS.indexOf(currentStep);
    
    if (currentIndex < STEPS.length - 1) {
      playComplete(); // Play step complete sound
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(STEPS[currentIndex + 1]);
      setItemIndex(0);
      setTeachPhase('intro');
      setConsecutiveCorrect(0);
    } else {
      // Session complete
      playComplete(); // Final completion sound
      playTokenEarned(); // Token earned celebration
      const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
      const bonusTokens = errorCount === 0 ? 2 : 1; // Perfect score bonus
      onComplete(tokensEarned + bonusTokens, durationSeconds);
    }
  }, [currentStep, tokensEarned, startTime, onComplete, errorCount, playComplete, playTokenEarned]);

  const handleItemComplete = useCallback((wasCorrect: boolean = true) => {
    if (wasCorrect) {
      playCorrect(); // Play success sound for correct item
      setConsecutiveCorrect(prev => prev + 1);
      setTokensEarned(prev => prev + 0.5);
    } else {
      setErrorCount(prev => prev + 1);
      setConsecutiveCorrect(0);
    }
    setItemIndex(prev => prev + 1);
  }, [playCorrect]);

  const handleTeachPhaseNext = useCallback(() => {
    playTap(); // Play tap sound for phase progression
    const phases: typeof teachPhase[] = ['intro', 'iDo', 'weDo', 'youDo', 'trace'];
    const currentIdx = phases.indexOf(teachPhase);
    if (currentIdx < phases.length - 1) {
      setTeachPhase(phases[currentIdx + 1]);
    }
  }, [teachPhase, playTap]);

  // Check if step is complete
  const isStepComplete = useMemo(() => {
    switch (currentStep) {
      case 'warmup':
        return itemIndex >= stepItems.warmup.length;
      case 'review':
        return itemIndex >= stepItems.review.length;
      case 'teach':
        return teachPhase === 'trace' && itemIndex >= 1;
      case 'practice':
        return itemIndex >= stepItems.practice.length;
      case 'sentence':
        return itemIndex >= stepItems.sentence.length;
      case 'finish':
        return true;
      default:
        return false;
    }
  }, [currentStep, itemIndex, teachPhase, stepItems]);

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'warmup':
        return <WarmupStep 
          words={stepItems.warmup}
          wordList={lesson.wordList}
          currentIndex={itemIndex}
          onItemComplete={handleItemComplete}
          isComplete={isStepComplete}
        />;

      case 'review':
        return <ReviewStep
          graphemes={stepItems.review}
          currentIndex={itemIndex}
          onItemComplete={() => handleItemComplete(true)}
          isComplete={isStepComplete}
        />;

      case 'teach':
        return <TeachStep
          lesson={lesson}
          phase={teachPhase}
          onPhaseNext={handleTeachPhaseNext}
          onTraceComplete={() => {
            setItemIndex(1);
            handleItemComplete(true);
          }}
          isComplete={isStepComplete}
        />;

      case 'practice':
        return <PracticeStep
          words={stepItems.practice}
          currentIndex={itemIndex}
          onItemComplete={handleItemComplete}
          isComplete={isStepComplete}
        />;

      case 'sentence':
        return <SentenceStep
          sentences={stepItems.sentence}
          currentIndex={itemIndex}
          onItemComplete={() => handleItemComplete(true)}
          isComplete={isStepComplete}
        />;

      case 'finish':
        return <FinishStep
          tokensEarned={tokensEarned}
          errorCount={errorCount}
          lesson={lesson}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with progress */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-4 border-b border-border safe-top">
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

      {/* Main content - scrollable */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderStepContent()}
      </div>

      {/* Footer with Next button */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm p-4 border-t border-border safe-bottom">
        <button
          onClick={handleNextStep}
          disabled={!isStepComplete}
          className={`
            w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3
            transition-all duration-200
            ${isStepComplete 
              ? 'bg-primary text-primary-foreground active:scale-[0.98]' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          <span>{currentStep === 'finish' ? 'Done!' : 'Next Step'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// === Step Components ===

interface WarmupStepProps {
  words: string[];
  wordList: { word: string; phonemes: string[] }[];
  currentIndex: number;
  onItemComplete: (wasCorrect: boolean) => void;
  isComplete: boolean;
}

function WarmupStep({ words, wordList, currentIndex, onItemComplete, isComplete }: WarmupStepProps) {
  const currentWord = words[currentIndex];
  const wordData = wordList.find(w => w.word === currentWord);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-token/10 rounded-full mb-3">
          <span className="text-sm font-medium text-token">Warm-Up</span>
        </div>
        <h3 className="text-xl font-semibold mb-1">Blend These Sounds</h3>
        <p className="text-muted-foreground text-sm">Tap each sound, then blend them together</p>
      </div>
      
      {!isComplete && wordData ? (
        <BlendBoxes
          phonemes={wordData.phonemes}
          word={currentWord}
          onComplete={() => onItemComplete(true)}
        />
      ) : isComplete ? (
        <div className="text-center py-8 animate-fade-in">
          <div className="text-6xl mb-4">🔥</div>
          <p className="text-lg font-medium text-calm">Warm-up complete!</p>
          <p className="text-sm text-muted-foreground mt-1">Your brain is ready to learn</p>
        </div>
      ) : null}

      {/* Progress indicator */}
      {!isComplete && (
        <div className="flex justify-center gap-2">
          {words.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx < currentIndex ? 'bg-calm' : idx === currentIndex ? 'bg-primary scale-125' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReviewStepProps {
  graphemes: { id: string; grapheme: string; phoneme: string; keyword?: string; keywordEmoji?: string; isDigraph: boolean }[];
  currentIndex: number;
  onItemComplete: () => void;
  isComplete: boolean;
}

function ReviewStep({ graphemes, currentIndex, onItemComplete, isComplete }: ReviewStepProps) {
  const [tappedCards, setTappedCards] = useState<Set<number>>(new Set());

  const handleCardTap = (index: number) => {
    if (!tappedCards.has(index)) {
      const newTapped = new Set(tappedCards);
      newTapped.add(index);
      setTappedCards(newTapped);
      
      // Check if this completes a "round" of expected taps
      if (index === currentIndex || newTapped.size > currentIndex) {
        onItemComplete();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-calm/10 rounded-full mb-3">
          <span className="text-sm font-medium text-calm">Review</span>
        </div>
        <h3 className="text-xl font-semibold mb-1">Tap & Say Each Sound</h3>
        <p className="text-muted-foreground text-sm">Tap the card, say the sound out loud</p>
      </div>
      
      <div className="grid grid-cols-3 gap-3 justify-items-center max-w-sm mx-auto">
        {graphemes.map((card, idx) => (
          <GraphemeCard
            key={card.id}
            grapheme={card.grapheme}
            phoneme={card.phoneme}
            keyword={card.keyword}
            keywordEmoji={card.keywordEmoji}
            isDigraph={card.isDigraph}
            size="medium"
            isActive={tappedCards.has(idx)}
            showKeyword={true}
            onTap={() => handleCardTap(idx)}
          />
        ))}
      </div>

      {isComplete && (
        <div className="text-center animate-fade-in">
          <div className="text-4xl mb-2">✨</div>
          <p className="text-calm font-medium">Great reviewing!</p>
        </div>
      )}
    </div>
  );
}

interface TeachStepProps {
  lesson: ReadingLesson;
  phase: 'intro' | 'iDo' | 'weDo' | 'youDo' | 'trace';
  onPhaseNext: () => void;
  onTraceComplete: () => void;
  isComplete: boolean;
}

function TeachStep({ lesson, phase, onPhaseNext, onTraceComplete, isComplete }: TeachStepProps) {
  const newGrapheme = lesson.newGraphemes[0];
  
  const phaseContent = {
    intro: {
      icon: <Book className="w-6 h-6" />,
      title: 'New Sound',
      description: lesson.teachingScript.introduction,
      buttonText: 'Show Me',
    },
    iDo: {
      icon: <Eye className="w-6 h-6" />,
      title: 'Watch & Listen',
      description: lesson.teachingScript.iDo,
      buttonText: 'Got It',
    },
    weDo: {
      icon: <Ear className="w-6 h-6" />,
      title: 'Together',
      description: lesson.teachingScript.weDo,
      buttonText: 'Ready',
    },
    youDo: {
      icon: <Hand className="w-6 h-6" />,
      title: 'Your Turn',
      description: lesson.teachingScript.youDo,
      buttonText: 'Now Trace It',
    },
    trace: {
      icon: <Hand className="w-6 h-6" />,
      title: 'Trace the Letter',
      description: 'Use your finger to trace the letter while saying the sound',
      buttonText: '',
    },
  };

  const content = phaseContent[phase];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-3">
          <span className="text-sm font-medium text-primary">New Learning</span>
        </div>
        <h3 className="text-xl font-semibold mb-1">{content.title}</h3>
      </div>

      {/* Large grapheme card */}
      <div className="flex justify-center">
        <GraphemeCard
          grapheme={newGrapheme.grapheme}
          phoneme={newGrapheme.phoneme}
          keyword={newGrapheme.keyword}
          keywordEmoji={newGrapheme.keywordEmoji}
          isDigraph={newGrapheme.isDigraph}
          size="large"
          showPhoneme={phase !== 'intro'}
          showKeyword={true}
          isActive={phase === 'youDo' || phase === 'trace'}
        />
      </div>

      {/* Phase-specific content */}
      {phase !== 'trace' ? (
        <div className="bg-muted/50 rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            {content.icon}
            <span className="text-xs font-mono uppercase">{phase.replace('Do', ' do')}</span>
          </div>
          <p className="text-foreground">{content.description}</p>
          
          <button
            onClick={onPhaseNext}
            className="mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            {content.buttonText}
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <TracePad 
            letter={newGrapheme.grapheme} 
            onComplete={onTraceComplete}
            size={200}
          />
        </div>
      )}

      {/* Multisensory reminder */}
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> See</span>
        <span className="flex items-center gap-1"><Ear className="w-3 h-3" /> Hear</span>
        <span className="flex items-center gap-1"><Hand className="w-3 h-3" /> Trace</span>
      </div>
    </div>
  );
}

interface PracticeStepProps {
  words: { word: string; phonemes: string[]; isSightWord: boolean }[];
  currentIndex: number;
  onItemComplete: (wasCorrect: boolean) => void;
  isComplete: boolean;
}

function PracticeStep({ words, currentIndex, onItemComplete, isComplete }: PracticeStepProps) {
  const currentWord = words[currentIndex];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full mb-3">
          <span className="text-sm font-medium">Practice</span>
        </div>
        <h3 className="text-xl font-semibold mb-1">Read These Words</h3>
        <p className="text-muted-foreground text-sm">Tap to reveal, sound out, then blend</p>
      </div>

      {!isComplete && currentWord ? (
        <WordCard
          word={currentWord.word}
          phonemes={currentWord.phonemes}
          onComplete={() => onItemComplete(true)}
          onCorrection={() => onItemComplete(false)}
          showCorrection={true}
        />
      ) : isComplete ? (
        <div className="text-center py-8 animate-fade-in">
          <div className="text-6xl mb-4">🌟</div>
          <p className="text-lg font-medium text-calm">All words complete!</p>
          <p className="text-sm text-muted-foreground mt-1">Great decoding work</p>
        </div>
      ) : null}

      {/* Progress dots */}
      {!isComplete && (
        <div className="flex justify-center gap-2">
          {words.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx < currentIndex ? 'bg-calm' : idx === currentIndex ? 'bg-primary scale-125' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SentenceStepProps {
  sentences: { id: string; text: string; targetWords: string[] }[];
  currentIndex: number;
  onItemComplete: () => void;
  isComplete: boolean;
}

function SentenceStep({ sentences, currentIndex, onItemComplete, isComplete }: SentenceStepProps) {
  const currentSentence = sentences[currentIndex];
  const [hasRead, setHasRead] = useState(false);

  const handleRead = () => {
    setHasRead(true);
  };

  const handleConfirm = () => {
    setHasRead(false);
    onItemComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-token/10 rounded-full mb-3">
          <Book className="w-4 h-4 text-token" />
          <span className="text-sm font-medium text-token">Sentences</span>
        </div>
        <h3 className="text-xl font-semibold mb-1">Read the Sentence</h3>
        <p className="text-muted-foreground text-sm">Sound out each word, then read it smoothly</p>
      </div>

      {!isComplete && currentSentence ? (
        <div className="bg-card rounded-3xl p-8 border-2 border-border text-center">
          <p className="text-3xl font-display font-medium leading-relaxed mb-6">
            {currentSentence.text.split(' ').map((word, idx) => {
              const isTarget = currentSentence.targetWords.some(
                tw => tw.toLowerCase() === word.toLowerCase().replace(/[.,!?]/g, '')
              );
              return (
                <span 
                  key={idx} 
                  className={isTarget ? 'text-primary font-bold' : ''}
                >
                  {word}{' '}
                </span>
              );
            })}
          </p>
          
          {!hasRead ? (
            <button
              onClick={handleRead}
              className="px-8 py-3 rounded-xl bg-muted text-muted-foreground font-medium hover:bg-muted/80"
            >
              Tap when ready to read
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="px-8 py-3 rounded-xl bg-calm text-calm-foreground font-semibold"
            >
              I read it! ✓
            </button>
          )}
        </div>
      ) : isComplete ? (
        <div className="text-center py-8 animate-fade-in">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-lg font-medium text-calm">Great sentence reading!</p>
        </div>
      ) : null}

      {/* Progress */}
      {!isComplete && (
        <div className="flex justify-center gap-2">
          {sentences.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full ${
                idx < currentIndex ? 'bg-calm' : idx === currentIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FinishStepProps {
  tokensEarned: number;
  errorCount: number;
  lesson: ReadingLesson;
}

function FinishStep({ tokensEarned, errorCount, lesson }: FinishStepProps) {
  const totalTokens = Math.floor(tokensEarned) + (errorCount === 0 ? 2 : 1);
  
  return (
    <div className="text-center py-8 space-y-6">
      <div className="text-7xl animate-float">🎉</div>
      
      <div>
        <h2 className="text-3xl font-bold mb-2">You Did It!</h2>
        <p className="text-muted-foreground">Amazing reading practice today!</p>
      </div>
      
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-token/20 rounded-full">
        <Star className="w-6 h-6 text-token" />
        <span className="text-xl font-bold text-token">+{totalTokens} tokens</span>
      </div>

      {errorCount === 0 && (
        <div className="bg-calm/10 rounded-2xl p-4 max-w-xs mx-auto">
          <p className="text-calm font-medium">🌟 Perfect session bonus!</p>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Tomorrow we'll practice more with "{lesson.newGraphemes[0]?.grapheme}"
      </p>
    </div>
  );
}
