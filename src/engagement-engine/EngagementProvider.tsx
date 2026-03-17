import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import {
  RewardEngineState,
  SurpriseReward,
  EffortBadge,
  SpinResult,
  createInitialState,
  processSpin,
  updateStreak,
  getNearMissEncouragement,
  saveState,
  loadState,
} from './RewardEngine';

export type VibeMode = 'calm' | 'balanced' | 'energized';

interface VibeSettings {
  mode: VibeMode;
  particleIntensity: number; // 0-1
  soundIntensity: number; // 0-1
  celebrationDuration: number; // ms
  showEncouragement: boolean;
  specialInterests: string[];
}

interface EngagementContextType {
  // Reward engine
  state: RewardEngineState;
  spin: (wasCorrect: boolean) => SpinResult;
  nearMiss: (accuracy: number) => { message: string; emoji: string; partialXP: number };
  
  // Active celebration state (for overlay)
  activeSurprise: SurpriseReward | null;
  activeBadge: EffortBadge | null;
  dismissCelebration: () => void;
  
  // Streak
  streakDays: number;
  streakShields: number;
  
  // Vibe controls
  vibe: VibeSettings;
  setVibeMode: (mode: VibeMode) => void;
  setParticleIntensity: (v: number) => void;
  setSoundIntensity: (v: number) => void;
  setSpecialInterests: (interests: string[]) => void;
  
  // Session tracking (ethical guardrails)
  sessionMinutes: number;
  dailyMinutes: number;
  shouldTakeBreak: boolean;
  acknowledgeBreak: () => void;
}

const EngagementContext = createContext<EngagementContextType | null>(null);

const DEFAULT_VIBE: VibeSettings = {
  mode: 'calm', // Default calm for this profile
  particleIntensity: 0.3,
  soundIntensity: 0.3,
  celebrationDuration: 2000,
  showEncouragement: true,
  specialInterests: ['Poppy Playtime', 'Alphabet Lore', 'monsters', 'creepy toys'],
};

const VIBE_PRESETS: Record<VibeMode, Partial<VibeSettings>> = {
  calm: { particleIntensity: 0.2, soundIntensity: 0.2, celebrationDuration: 1500 },
  balanced: { particleIntensity: 0.5, soundIntensity: 0.5, celebrationDuration: 2000 },
  energized: { particleIntensity: 0.8, soundIntensity: 0.8, celebrationDuration: 3000 },
};

// Ethical guardrails
const BREAK_INTERVAL_MINUTES = 25; // Suggest break every 25 min
const DAILY_CAP_MINUTES = 90; // Hard daily cap

export function EngagementProvider({ children }: { children: ReactNode }) {
  const [engineState, setEngineState] = useState<RewardEngineState>(() => {
    return loadState() ?? createInitialState();
  });
  
  const [activeSurprise, setActiveSurprise] = useState<SurpriseReward | null>(null);
  const [activeBadge, setActiveBadge] = useState<EffortBadge | null>(null);
  const [vibe, setVibe] = useState<VibeSettings>(() => {
    try {
      const saved = localStorage.getItem('jackos-vibe');
      if (saved) return { ...DEFAULT_VIBE, ...JSON.parse(saved) };
    } catch { /* */ }
    return DEFAULT_VIBE;
  });
  
  // Session timing
  const sessionStartRef = useRef(Date.now());
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [dailyMinutes, setDailyMinutes] = useState(0);
  const [breakAcknowledged, setBreakAcknowledged] = useState(false);
  
  // Update streak on mount
  useEffect(() => {
    setEngineState(prev => {
      const updated = updateStreak(prev);
      saveState(updated);
      return updated;
    });
  }, []);
  
  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 60000);
      setSessionMinutes(elapsed);
      
      // Load daily total
      const today = new Date().toISOString().split('T')[0];
      const dailyKey = `jackos-daily-minutes-${today}`;
      const savedDaily = parseInt(localStorage.getItem(dailyKey) || '0', 10);
      const total = savedDaily + elapsed;
      setDailyMinutes(total);
    }, 30000); // Check every 30 seconds
    
    return () => {
      // Save session time on unmount
      const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 60000);
      const today = new Date().toISOString().split('T')[0];
      const dailyKey = `jackos-daily-minutes-${today}`;
      const savedDaily = parseInt(localStorage.getItem(dailyKey) || '0', 10);
      localStorage.setItem(dailyKey, String(savedDaily + elapsed));
      clearInterval(interval);
    };
  }, []);
  
  // Persist vibe settings
  useEffect(() => {
    try { localStorage.setItem('jackos-vibe', JSON.stringify(vibe)); } catch { /* */ }
  }, [vibe]);

  const spin = useCallback((wasCorrect: boolean): SpinResult => {
    let result: SpinResult = { surprise: null, newBadge: null, streakUpdated: false, newState: engineState };
    
    setEngineState(prev => {
      result = processSpin(prev, wasCorrect);
      saveState(result.newState);
      
      if (result.surprise) {
        setActiveSurprise(result.surprise);
        // Auto-dismiss after celebration duration
        setTimeout(() => setActiveSurprise(null), vibe.celebrationDuration + 500);
      }
      if (result.newBadge) {
        // Show badge after surprise (if both)
        const delay = result.surprise ? vibe.celebrationDuration + 200 : 0;
        setTimeout(() => {
          setActiveBadge(result.newBadge);
          setTimeout(() => setActiveBadge(null), vibe.celebrationDuration + 500);
        }, delay);
      }
      
      return result.newState;
    });
    
    return result;
  }, [engineState, vibe.celebrationDuration]);

  const nearMiss = useCallback((accuracy: number) => {
    return getNearMissEncouragement(accuracy);
  }, []);

  const dismissCelebration = useCallback(() => {
    setActiveSurprise(null);
    setActiveBadge(null);
  }, []);

  const setVibeMode = useCallback((mode: VibeMode) => {
    setVibe(prev => ({ ...prev, mode, ...VIBE_PRESETS[mode] }));
  }, []);

  const setParticleIntensity = useCallback((v: number) => {
    setVibe(prev => ({ ...prev, particleIntensity: v }));
  }, []);

  const setSoundIntensity = useCallback((v: number) => {
    setVibe(prev => ({ ...prev, soundIntensity: v }));
  }, []);

  const setSpecialInterests = useCallback((interests: string[]) => {
    setVibe(prev => ({ ...prev, specialInterests: interests }));
  }, []);

  const shouldTakeBreak = !breakAcknowledged && (
    sessionMinutes >= BREAK_INTERVAL_MINUTES || dailyMinutes >= DAILY_CAP_MINUTES
  );

  const acknowledgeBreak = useCallback(() => {
    setBreakAcknowledged(true);
    sessionStartRef.current = Date.now(); // Reset session timer
    setSessionMinutes(0);
    // Re-enable after next interval
    setTimeout(() => setBreakAcknowledged(false), BREAK_INTERVAL_MINUTES * 60 * 1000);
  }, []);

  return (
    <EngagementContext.Provider
      value={{
        state: engineState,
        spin,
        nearMiss,
        activeSurprise,
        activeBadge,
        dismissCelebration,
        streakDays: engineState.streakDays,
        streakShields: engineState.streakShields,
        vibe,
        setVibeMode,
        setParticleIntensity,
        setSoundIntensity,
        setSpecialInterests,
        sessionMinutes,
        dailyMinutes,
        shouldTakeBreak,
        acknowledgeBreak,
      }}
    >
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement() {
  const context = useContext(EngagementContext);
  if (!context) {
    throw new Error('useEngagement must be used within EngagementProvider');
  }
  return context;
}
