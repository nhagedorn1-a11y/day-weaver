import { useState, useMemo } from 'react';
import { MathProfile, MathProblem } from '@/types/academics';
import { getMathLesson, getTodaysMathLesson } from '@/data/mathLessonGenerator';
import { mathLessons } from '@/data/mathLessonGenerator';
import { ArrowLeft, Check, Star, X, Sparkles, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface MathSessionRunnerProps {
  profile: MathProfile;
  lessonId: string;
  onComplete: (tokensEarned: number, problemsCompleted: number) => void;
  onExit: () => void;
}

type SessionStep = 'warmup' | 'teach' | 'practice' | 'challenge' | 'finish';

export function MathSessionRunner({ profile, lessonId, onComplete, onExit }: MathSessionRunnerProps) {
  const lesson = useMemo(() => {
    // Check if it's a review lesson
    if (lessonId.startsWith('math-review-')) {
      const idx = mathLessons.findIndex(l => l.id === profile.currentLessonId);
      return getTodaysMathLesson(idx);
    }
    return getMathLesson(lessonId);
  }, [lessonId, profile.currentLessonId]);

  const [step, setStep] = useState<SessionStep>('warmup');
  const [problemIndex, setProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Lesson not found</p>
      </div>
    );
  }

  const currentProblems = step === 'warmup' ? lesson.warmUpProblems : lesson.practiceProblems;
  const currentProblem = currentProblems[problemIndex];
  const progress = ((problemIndex + 1) / currentProblems.length) * 100;

  const handleAnswer = (answer: string | number) => {
    setSelectedAnswer(answer);
    setTotalAttempts(prev => prev + 1);
    
    const correct = answer.toString() === currentProblem.answer.toString();
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(prev => prev + 1);
    }

    // Auto-advance after showing result
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);

      if (problemIndex < currentProblems.length - 1) {
        setProblemIndex(prev => prev + 1);
      } else {
        // Move to next step
        if (step === 'warmup') {
          // Skip teach step for review lessons (no new concepts)
          if (lesson.newConcepts.length === 0) {
            setStep('practice');
            setProblemIndex(0);
          } else {
            setStep('teach');
          }
        } else if (step === 'teach') {
          setStep('practice');
          setProblemIndex(0);
        } else if (step === 'practice') {
          setStep('finish');
        }
      }
    }, correct ? 1000 : 1500);
  };

  // Teaching step
  if (step === 'teach') {
    const concept = lesson.newConcepts[0];
    
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button onClick={onExit} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold">New Learning</h1>
            <span className="hw-label">{lesson.title}</span>
          </div>
        </header>

        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
          {concept && (
            <>
              <span className="text-8xl mb-6">{concept.emoji}</span>
              <h2 className="text-3xl font-bold mb-2">{concept.name}</h2>
              <p className="text-center text-muted-foreground mb-8 max-w-xs">
                {concept.description}
              </p>
            </>
          )}

          <div className="bg-card rounded-2xl p-6 mb-8 w-full max-w-sm">
            <p className="text-center text-lg">{lesson.teachingScript.iDo}</p>
          </div>

          <button
            onClick={() => {
              setStep('practice');
              setProblemIndex(0);
            }}
            className="giant-button bg-primary text-primary-foreground"
          >
            <Sparkles className="w-6 h-6" />
            <span>Let's Practice!</span>
          </button>
        </div>
      </div>
    );
  }

  // Finish step
  if (step === 'finish') {
    const tokensEarned = Math.ceil(score / 2);
    
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6 flex flex-col items-center justify-center min-h-screen">
          <span className="text-8xl mb-6">🎉</span>
          <h2 className="text-3xl font-bold mb-2">Amazing!</h2>
          <p className="text-muted-foreground mb-6">You completed today's math!</p>

          <div className="bg-card rounded-2xl p-6 mb-8 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Problems solved</span>
              <span className="font-bold text-xl">{totalAttempts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Correct answers</span>
              <span className="font-bold text-xl text-calm">{score}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tokens earned</span>
              <span className="font-bold text-xl text-token flex items-center gap-1">
                <Star className="w-5 h-5" fill="currentColor" />
                {tokensEarned}
              </span>
            </div>
          </div>

          <button
            onClick={() => onComplete(tokensEarned, totalAttempts)}
            className="giant-button bg-calm text-calm-foreground"
          >
            <Check className="w-6 h-6" />
            <span>All Done!</span>
          </button>
        </div>
      </div>
    );
  }

  // Problem view (warmup or practice)
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
        <button onClick={onExit} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold">{step === 'warmup' ? 'Warm-Up' : 'Practice'}</h1>
          <span className="hw-label">{problemIndex + 1} of {currentProblems.length}</span>
        </div>
        <div className="flex items-center gap-1 bg-token/20 px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 text-token" fill="currentColor" />
          <span className="font-mono font-bold text-token">{score}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-2 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6 flex flex-col items-center">
        {/* Visual cue */}
        <div className="text-6xl mb-4">{currentProblem.visualCue}</div>

        {/* Problem prompt */}
        <h2 className="text-2xl font-bold text-center mb-8">{currentProblem.prompt}</h2>

        {/* Concrete representation based on level */}
        {profile.level === 'concrete' && currentProblem.type === 'counting' && (
          <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-xs">
            {Array.from({ length: currentProblem.answer as number }, (_, i) => (
              <div key={i} className="w-10 h-10 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center text-xl">
                {currentProblem.visualCue}
              </div>
            ))}
          </div>
        )}

        {/* Answer options */}
        {currentProblem.options ? (
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {currentProblem.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isAnswer = option.toString() === currentProblem.answer.toString();
              
              return (
                <button
                  key={option.toString()}
                  onClick={() => !showResult && handleAnswer(option)}
                  disabled={showResult}
                  className={`py-4 rounded-2xl font-bold text-2xl transition-all ${
                    showResult && isAnswer
                      ? 'bg-calm text-calm-foreground scale-105'
                      : showResult && isSelected && !isAnswer
                        ? 'bg-destructive/20 text-destructive'
                        : isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border-2 border-border hover:border-primary/50'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          // Number pad for open response
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                onClick={() => !showResult && handleAnswer(num)}
                disabled={showResult}
                className="py-4 rounded-xl bg-card border-2 border-border font-bold text-xl hover:border-primary/50"
              >
                {num}
              </button>
            ))}
          </div>
        )}

        {/* Result feedback */}
        {showResult && (
          <div className={`mt-8 p-4 rounded-2xl flex items-center gap-3 ${
            isCorrect ? 'bg-calm/20' : 'bg-muted'
          }`}>
            {isCorrect ? (
              <>
                <Check className="w-6 h-6 text-calm" />
                <span className="font-semibold text-calm">Correct!</span>
              </>
            ) : (
              <>
                <span className="text-2xl">🤔</span>
                <span className="font-semibold">The answer is {currentProblem.answer}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
