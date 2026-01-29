import { useState, useCallback, useEffect } from 'react';

interface AmbientState {
  isCalm: boolean;
  tokensEarned: number;
  currentModule: string;
  mood: 'neutral' | 'focused' | 'celebrating' | 'transitioning';
  timeOfDay: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
}

export function useAmbientState() {
  const [state, setState] = useState<AmbientState>({
    isCalm: false,
    tokensEarned: 0,
    currentModule: 'today',
    mood: 'focused',
    timeOfDay: 'morning',
  });

  // Update time of day
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      let timeOfDay: AmbientState['timeOfDay'];
      
      if (hour >= 5 && hour < 9) timeOfDay = 'dawn';
      else if (hour >= 9 && hour < 12) timeOfDay = 'morning';
      else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17 && hour < 20) timeOfDay = 'evening';
      else timeOfDay = 'night';
      
      setState(prev => ({ ...prev, timeOfDay }));
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const setCalm = useCallback((isCalm: boolean) => {
    setState(prev => ({ ...prev, isCalm, mood: isCalm ? 'neutral' : prev.mood }));
  }, []);

  const setTokens = useCallback((tokensEarned: number) => {
    setState(prev => ({ ...prev, tokensEarned }));
  }, []);

  const setModule = useCallback((currentModule: string) => {
    setState(prev => ({ ...prev, currentModule }));
  }, []);

  const setMood = useCallback((mood: AmbientState['mood']) => {
    setState(prev => ({ ...prev, mood }));
  }, []);

  const celebrate = useCallback(() => {
    setState(prev => ({ ...prev, mood: 'celebrating' }));
    setTimeout(() => {
      setState(prev => ({ ...prev, mood: 'focused' }));
    }, 3000);
  }, []);

  return {
    state,
    setCalm,
    setTokens,
    setModule,
    setMood,
    celebrate,
  };
}
