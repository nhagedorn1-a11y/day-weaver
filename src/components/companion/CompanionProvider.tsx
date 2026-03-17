import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { LittleGuy } from './LittleGuy';
import { ThoughtBubble } from './ThoughtBubble';
import { getParallelTalk, getTalkSequence, TalkContext, ParallelTalkOptions } from './ParallelTalk';

type Mood = 'neutral' | 'encouraging' | 'celebrating' | 'calm' | 'curious' | 'sleeping';

interface CompanionState {
  mood: Mood;
  message: string | null;
  isVisible: boolean;
}

interface CompanionContextType {
  state: CompanionState;
  setMood: (mood: Mood) => void;
  say: (message: string, duration?: number) => void;
  celebrate: (message?: string) => void;
  encourage: (message?: string) => void;
  calm: (message?: string) => void;
  hide: () => void;
  show: () => void;
  /** Parallel talk: say a contextually appropriate simplified message */
  parallelTalk: (context: TalkContext, options?: ParallelTalkOptions) => void;
  /** Parallel talk sequence for a full micro-interaction (start → working → resolution) */
  playTalkSequence: (subject: string, wasCorrect: boolean) => void;
}

const CompanionContext = createContext<CompanionContextType | null>(null);

const defaultMessages = {
  celebrating: [
    "Look at all those stars! ✨",
    "You made that happen.",
    "Done. Just like that.",
    "See? You did it.",
  ],
  encouraging: [
    "This one feels big, huh?",
    "What if we just... look at it?",
    "One small step.",
    "You've done hard things before.",
  ],
  calm: [
    "We're safe here.",
    "Take your time.",
    "Breathe with me.",
    "This feeling will pass.",
  ],
};

export function CompanionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CompanionState>({
    mood: 'neutral',
    message: null,
    isVisible: true,
  });

  const setMood = useCallback((mood: Mood) => {
    setState(prev => ({ ...prev, mood }));
  }, []);

  const say = useCallback((message: string, duration = 4000) => {
    setState(prev => ({ ...prev, message }));
    if (duration > 0) {
      setTimeout(() => {
        setState(prev => ({ ...prev, message: null }));
      }, duration);
    }
  }, []);

  const celebrate = useCallback((message?: string) => {
    const msg = message || defaultMessages.celebrating[Math.floor(Math.random() * defaultMessages.celebrating.length)];
    setState(prev => ({ ...prev, mood: 'celebrating', message: msg }));
    setTimeout(() => {
      setState(prev => ({ ...prev, mood: 'neutral', message: null }));
    }, 4000);
  }, []);

  const encourage = useCallback((message?: string) => {
    const msg = message || defaultMessages.encouraging[Math.floor(Math.random() * defaultMessages.encouraging.length)];
    setState(prev => ({ ...prev, mood: 'encouraging', message: msg }));
    setTimeout(() => {
      setState(prev => ({ ...prev, mood: 'neutral', message: null }));
    }, 5000);
  }, []);

  const calm = useCallback((message?: string) => {
    const msg = message || defaultMessages.calm[Math.floor(Math.random() * defaultMessages.calm.length)];
    setState(prev => ({ ...prev, mood: 'calm', message: msg }));
  }, []);

  const hide = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false }));
  }, []);

  const show = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: true }));
  }, []);

  // Parallel talk — simplified language scaffolding
  const parallelTalk = useCallback((context: TalkContext, options?: ParallelTalkOptions) => {
    const msg = getParallelTalk(context, options);
    const moodMap: Partial<Record<TalkContext, Mood>> = {
      task_correct: 'celebrating',
      task_incorrect: 'encouraging',
      struggling: 'encouraging',
      waiting: 'calm',
      break_time: 'calm',
      choosing: 'curious',
      returning: 'celebrating',
    };
    const mood = moodMap[context] ?? 'neutral';
    setState(prev => ({ ...prev, mood, message: msg }));
    setTimeout(() => {
      setState(prev => ({ ...prev, mood: 'neutral', message: null }));
    }, 5000);
  }, []);

  const playTalkSequence = useCallback((subject: string, wasCorrect: boolean) => {
    const [start, working, resolution] = getTalkSequence(subject, wasCorrect);
    // Drip-feed messages: start → 3s → working → 6s → resolution
    setState(prev => ({ ...prev, mood: 'curious', message: start }));
    setTimeout(() => {
      setState(prev => ({ ...prev, mood: 'neutral', message: working }));
    }, 3000);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        mood: wasCorrect ? 'celebrating' : 'encouraging',
        message: resolution,
      }));
    }, 6000);
    setTimeout(() => {
      setState(prev => ({ ...prev, mood: 'neutral', message: null }));
    }, 9000);
  }, []);

  return (
    <CompanionContext.Provider value={{ state, setMood, say, celebrate, encourage, calm, hide, show, parallelTalk, playTalkSequence }}>
      {children}
      
      {/* Floating companion */}
      {state.isVisible && (
        <div className="fixed bottom-24 right-4 z-40 safe-bottom">
          <div className="relative">
            <LittleGuy mood={state.mood} size="lg" />
            {state.message && (
              <ThoughtBubble 
                message={state.message} 
                position="left"
                duration={0}
              />
            )}
          </div>
        </div>
      )}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const context = useContext(CompanionContext);
  if (!context) {
    throw new Error('useCompanion must be used within a CompanionProvider');
  }
  return context;
}
