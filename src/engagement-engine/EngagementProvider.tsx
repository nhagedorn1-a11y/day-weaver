import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import {
  EngagementConfig,
  EngagementSliders,
  createSafeDefaults,
  saveConfig,
  loadConfig,
} from './EngagementConfig';
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
import {
  SensoryOutput,
  computeSensoryOutput,
  triggerHaptic,
  getVRRParams,
} from './SensoryManager';
import { applyRiskDefaults, detectRiskSignals, getSliderWarning, RiskSignals } from './RiskDefaults';

interface EngagementContextType {
  // Config (all controls)
  config: EngagementConfig;
  updateSlider: (key: keyof EngagementSliders, value: number) => string | null; // returns warning or null
  toggleMaster: (enabled: boolean) => void;
  toggleSetting: (key: keyof EngagementConfig['toggles'], value: boolean) => void;
  setDailyCap: (minutes: number) => void;
  setBreakInterval: (minutes: number) => void;
  setSpecialInterests: (interests: string[]) => void;
  
  // Parent lock
  setPIN: (pin: string) => void;
  verifyPIN: (pin: string) => boolean;
  isPinRequired: (sliderKey: keyof EngagementSliders, newValue: number) => boolean;
  
  // Computed sensory output
  sensory: SensoryOutput;
  
  // Reward engine
  engineState: RewardEngineState;
  spin: (wasCorrect: boolean) => SpinResult;
  nearMiss: (accuracy: number) => { message: string; emoji: string; partialXP: number };
  
  // Active celebration state
  activeSurprise: SurpriseReward | null;
  activeBadge: EffortBadge | null;
  dismissCelebration: () => void;
  
  // Session tracking
  sessionMinutes: number;
  dailyMinutes: number;
  isSessionLocked: boolean; // Hard lock when cap exceeded
  shouldTakeBreak: boolean; // Soft break reminder
  acknowledgeBreak: () => void;
  
  // Risk
  riskSignals: RiskSignals;
  
  // Presets
  applyPreset: (preset: 'safe' | 'moderate') => void;
}

const EngagementContext = createContext<EngagementContextType | null>(null);

export function EngagementProvider({ children }: { children: ReactNode }) {
  // Load config with risk defaults
  const [config, setConfig] = useState<EngagementConfig>(() => {
    const saved = loadConfig();
    if (saved && saved.riskDefaultsApplied) return saved;
    const defaults = createSafeDefaults();
    const withRisk = applyRiskDefaults(defaults);
    saveConfig(withRisk);
    return withRisk;
  });

  const [engineState, setEngineState] = useState<RewardEngineState>(() => {
    return loadState() ?? createInitialState();
  });

  const [activeSurprise, setActiveSurprise] = useState<SurpriseReward | null>(null);
  const [activeBadge, setActiveBadge] = useState<EffortBadge | null>(null);

  // Session timing
  const sessionStartRef = useRef(Date.now());
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [dailyMinutes, setDailyMinutes] = useState(0);
  const [breakAcknowledged, setBreakAcknowledged] = useState(false);

  const riskSignals = detectRiskSignals();
  const sensory = computeSensoryOutput(config.sliders, config.toggles.masterEnabled);

  // Update streak on mount
  useEffect(() => {
    setEngineState(prev => {
      const updated = updateStreak(prev);
      saveState(updated);
      return updated;
    });
  }, []);

  // Track session time + enforce hard cap
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 60000);
      setSessionMinutes(elapsed);

      const today = new Date().toISOString().split('T')[0];
      const dailyKey = `jackos-daily-minutes-${today}`;
      const savedDaily = parseInt(localStorage.getItem(dailyKey) || '0', 10);
      setDailyMinutes(savedDaily + elapsed);
    }, 15000);

    return () => {
      const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 60000);
      const today = new Date().toISOString().split('T')[0];
      const dailyKey = `jackos-daily-minutes-${today}`;
      const savedDaily = parseInt(localStorage.getItem(dailyKey) || '0', 10);
      localStorage.setItem(dailyKey, String(savedDaily + elapsed));
      clearInterval(interval);
    };
  }, []);

  // Persist config changes
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  // --- Config Setters ---
  
  const updateSlider = useCallback((key: keyof EngagementSliders, value: number): string | null => {
    const clamped = Math.max(0, Math.min(10, Math.round(value)));
    setConfig(prev => ({
      ...prev,
      sliders: { ...prev.sliders, [key]: clamped },
    }));
    triggerHaptic(sensory.hapticLevel);
    return getSliderWarning(key, clamped, riskSignals);
  }, [sensory.hapticLevel, riskSignals]);

  const toggleMaster = useCallback((enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      toggles: { ...prev.toggles, masterEnabled: enabled },
    }));
  }, []);

  const toggleSetting = useCallback((key: keyof EngagementConfig['toggles'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      toggles: { ...prev.toggles, [key]: value },
    }));
  }, []);

  const setDailyCap = useCallback((minutes: number) => {
    setConfig(prev => ({
      ...prev,
      sessionCap: { ...prev.sessionCap, dailyCapMinutes: Math.max(10, Math.min(60, minutes)) },
    }));
  }, []);

  const setBreakInterval = useCallback((minutes: number) => {
    setConfig(prev => ({
      ...prev,
      sessionCap: { ...prev.sessionCap, breakIntervalMinutes: Math.max(5, Math.min(30, minutes)) },
    }));
  }, []);

  const setSpecialInterests = useCallback((interests: string[]) => {
    setConfig(prev => ({ ...prev, specialInterests: interests }));
  }, []);

  // --- Parent Lock ---
  
  const setPIN = useCallback((pin: string) => {
    // Simple hash for client-side PIN (not security-critical — just UX barrier)
    const hash = btoa(pin);
    setConfig(prev => ({
      ...prev,
      parentLock: { ...prev.parentLock, pinSet: true, pinHash: hash },
    }));
  }, []);

  const verifyPIN = useCallback((pin: string): boolean => {
    if (!config.parentLock.pinSet || !config.parentLock.pinHash) return true;
    return btoa(pin) === config.parentLock.pinHash;
  }, [config.parentLock]);

  const isPinRequired = useCallback((sliderKey: keyof EngagementSliders, newValue: number): boolean => {
    if (!config.parentLock.pinSet) return false;
    const meta = (await import('./EngagementConfig')).SLIDER_META;
    // Dynamic import won't work here — check inline
    return newValue > config.parentLock.pinThreshold;
  }, [config.parentLock]);

  // --- Reward Engine ---

  const spin = useCallback((wasCorrect: boolean): SpinResult => {
    // If master disabled, return no-op
    if (!config.toggles.masterEnabled) {
      // Fixed-ratio fallback: every 10 correct = small reward
      const newState = { ...engineState, totalSpins: engineState.totalSpins + 1, totalAttempts: engineState.totalAttempts + 1 };
      setEngineState(newState);
      saveState(newState);
      return { surprise: null, newBadge: null, streakUpdated: false, newState };
    }

    let result: SpinResult = { surprise: null, newBadge: null, streakUpdated: false, newState: engineState };

    setEngineState(prev => {
      result = processSpin(prev, wasCorrect);
      saveState(result.newState);

      // Only show celebrations if particles/sensory allows
      if (result.surprise && sensory.showParticles) {
        setActiveSurprise(result.surprise);
        setTimeout(() => setActiveSurprise(null), sensory.celebrationDuration + 500);
      }
      if (result.newBadge && sensory.showEffortBadges) {
        const delay = result.surprise && sensory.showParticles ? sensory.celebrationDuration + 200 : 0;
        setTimeout(() => {
          setActiveBadge(result.newBadge);
          setTimeout(() => setActiveBadge(null), sensory.celebrationDuration + 500);
        }, delay);
      }

      if (sensory.hapticLevel !== 'none') {
        triggerHaptic(wasCorrect ? sensory.hapticLevel : 'light');
      }

      return result.newState;
    });

    return result;
  }, [config.toggles.masterEnabled, engineState, sensory]);

  const nearMiss = useCallback((accuracy: number) => {
    if (!sensory.showNearMiss) {
      return { message: 'Try again!', emoji: '🌱', partialXP: 0.1 };
    }
    return getNearMissEncouragement(accuracy);
  }, [sensory.showNearMiss]);

  const dismissCelebration = useCallback(() => {
    setActiveSurprise(null);
    setActiveBadge(null);
  }, []);

  // --- Session Cap ---
  
  const isSessionLocked = config.sessionCap.hardLock && dailyMinutes >= config.sessionCap.dailyCapMinutes;
  
  const shouldTakeBreak = !breakAcknowledged && !isSessionLocked &&
    sessionMinutes >= config.sessionCap.breakIntervalMinutes;

  const acknowledgeBreak = useCallback(() => {
    setBreakAcknowledged(true);
    sessionStartRef.current = Date.now();
    setSessionMinutes(0);
    setTimeout(() => setBreakAcknowledged(false), config.sessionCap.breakIntervalMinutes * 60 * 1000);
  }, [config.sessionCap.breakIntervalMinutes]);

  // --- Presets ---
  
  const applyPreset = useCallback((preset: 'safe' | 'moderate') => {
    if (preset === 'safe') {
      const safe = createSafeDefaults();
      safe.riskDefaultsApplied = true;
      setConfig(safe);
    } else {
      setConfig(prev => {
        const moderate = {
          ...prev,
          sliders: { vrr: 3, nearMiss: 2, streak: 3, haptics: 2, particles: 4, sounds: 3, autoAdvanceSpeed: 5, progression: 5 },
          toggles: { ...prev.toggles, masterEnabled: true, multipliers: false },
        };
        return applyRiskDefaults(moderate);
      });
    }
  }, []);

  return (
    <EngagementContext.Provider
      value={{
        config,
        updateSlider,
        toggleMaster,
        toggleSetting,
        setDailyCap,
        setBreakInterval,
        setSpecialInterests,
        setPIN,
        verifyPIN,
        isPinRequired: (key, val) => config.parentLock.pinSet && val > config.parentLock.pinThreshold,
        sensory,
        engineState,
        spin,
        nearMiss,
        activeSurprise,
        activeBadge,
        dismissCelebration,
        sessionMinutes,
        dailyMinutes,
        isSessionLocked,
        shouldTakeBreak,
        acknowledgeBreak,
        riskSignals,
        applyPreset,
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
