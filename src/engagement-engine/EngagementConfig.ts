// EngagementConfig — Types for granular per-mechanic controls
// All sliders 0-10. 0 = fully disabled/predictable. 10 = maximum engagement.

export interface EngagementSliders {
  /** Variable Ratio Reinforcement: 0=fixed every 10, 10=high variance avg 3-9 */
  vrr: number;
  /** Near-miss feedback: 0=none, 10=dramatic "SO CLOSE!" + animations */
  nearMiss: number;
  /** Streak intensity: 0=no streaks, 10=visible flame + shields */
  streak: number;
  /** Haptic feedback: 0=none, 10=strong vibration on every action */
  haptics: number;
  /** Particle/animation intensity: 0=none, 10=full confetti explosions */
  particles: number;
  /** Sound effects intensity: 0=silent, 10=rich layered audio */
  sounds: number;
  /** Auto-advance speed: 0=manual, 10=instant next task */
  autoAdvanceSpeed: number;
  /** Progression visuals: 0=basic XP text, 10=avatar evolutions + mastery explosions */
  progression: number;
}

export interface EngagementToggles {
  /** Global master switch — OFF disables ALL engagement mechanics */
  masterEnabled: boolean;
  /** XP multiplier surprises on VRR hits */
  multipliers: boolean;
  /** Effort badges (celebrate attempts, not perfection) — always safe, default ON */
  effortBadges: boolean;
  /** Zero-delay flow mode (instant next task) */
  zeroDelayMode: boolean;
  /** Special interest injection into content — always safe, default ON */
  specialInterests: boolean;
}

export interface SessionCapConfig {
  /** Daily session cap in minutes (10-60, default 25) */
  dailyCapMinutes: number;
  /** Whether to enforce a hard lock at cap (vs soft reminder) */
  hardLock: boolean;
  /** Break interval in minutes before nudge */
  breakIntervalMinutes: number;
}

export interface ParentLockConfig {
  /** Whether parent PIN is set */
  pinSet: boolean;
  /** SHA256 hash of PIN */
  pinHash: string | null;
  /** Slider threshold requiring PIN (changes above this level need PIN) */
  pinThreshold: number; // default 5
}

export interface EngagementConfig {
  sliders: EngagementSliders;
  toggles: EngagementToggles;
  sessionCap: SessionCapConfig;
  parentLock: ParentLockConfig;
  specialInterests: string[];
  /** Whether risk defaults have been applied */
  riskDefaultsApplied: boolean;
  /** Whether parent has reviewed and acknowledged engagement settings */
  parentAcknowledged: boolean;
}

// Factory: Safe defaults (everything off/low)
export function createSafeDefaults(): EngagementConfig {
  return {
    sliders: {
      vrr: 0,
      nearMiss: 0,
      streak: 0,
      haptics: 0,
      particles: 0,
      sounds: 0,
      autoAdvanceSpeed: 3,
      progression: 2,
    },
    toggles: {
      masterEnabled: false,
      multipliers: false,
      effortBadges: true, // Always safe — celebrates effort
      zeroDelayMode: false,
      specialInterests: true, // Always safe — non-gamified
    },
    sessionCap: {
      dailyCapMinutes: 25,
      hardLock: true,
      breakIntervalMinutes: 15,
    },
    parentLock: {
      pinSet: false,
      pinHash: null,
      pinThreshold: 5,
    },
    specialInterests: ['Poppy Playtime', 'Alphabet Lore', 'monsters', 'creepy toys'],
    riskDefaultsApplied: false,
    parentAcknowledged: false,
  };
}

// Moderate preset for when parent explicitly opts in
export function createModeratePreset(): Partial<EngagementConfig> {
  return {
    sliders: {
      vrr: 3,
      nearMiss: 2,
      streak: 3,
      haptics: 2,
      particles: 4,
      sounds: 3,
      autoAdvanceSpeed: 5,
      progression: 5,
    },
    toggles: {
      masterEnabled: true,
      multipliers: false,
      effortBadges: true,
      zeroDelayMode: false,
      specialInterests: true,
    },
  };
}

// Slider metadata for UI rendering
export interface SliderMeta {
  key: keyof EngagementSliders;
  label: string;
  emoji: string;
  lowDesc: string;
  highDesc: string;
  safetyNote?: string;
  /** Whether this slider requires PIN above threshold */
  requiresPin: boolean;
}

export const SLIDER_META: SliderMeta[] = [
  {
    key: 'vrr',
    label: 'Surprise Rewards',
    emoji: '🎰',
    lowDesc: 'Fixed, predictable rewards every ~10 tasks',
    highDesc: 'Variable surprises with rare big jackpots',
    safetyNote: 'Higher = more dopamine surprises. Monitor for overstimulation.',
    requiresPin: true,
  },
  {
    key: 'nearMiss',
    label: 'Encouragement on Mistakes',
    emoji: '🎯',
    lowDesc: 'Simple "try again" message',
    highDesc: 'Dramatic "SO CLOSE!" with animations + teasers',
    safetyNote: 'May increase persistence but also frustration for some children.',
    requiresPin: true,
  },
  {
    key: 'streak',
    label: 'Streak Tracking',
    emoji: '🔥',
    lowDesc: 'No streaks displayed',
    highDesc: 'Visible flame + streak shields + daily counter',
    safetyNote: 'Streaks pause, never reset. No punitive loss.',
    requiresPin: false,
  },
  {
    key: 'haptics',
    label: 'Haptic Feedback',
    emoji: '📳',
    lowDesc: 'No vibration',
    highDesc: 'Strong feedback on every interaction',
    safetyNote: 'May be overwhelming for sensory-sensitive children.',
    requiresPin: false,
  },
  {
    key: 'particles',
    label: 'Visual Effects',
    emoji: '✨',
    lowDesc: 'No particles or animations',
    highDesc: 'Full confetti explosions + glow effects',
    safetyNote: 'Reduce for children sensitive to visual stimulation.',
    requiresPin: false,
  },
  {
    key: 'sounds',
    label: 'Sound Effects',
    emoji: '🔊',
    lowDesc: 'Silent',
    highDesc: 'Rich layered audio on every action',
    requiresPin: false,
  },
  {
    key: 'autoAdvanceSpeed',
    label: 'Auto-Advance Speed',
    emoji: '⏩',
    lowDesc: 'Manual — tap to continue',
    highDesc: 'Instant next task, zero delay',
    requiresPin: false,
  },
  {
    key: 'progression',
    label: 'Progression Visuals',
    emoji: '📈',
    lowDesc: 'Basic XP text only',
    highDesc: 'Avatar evolution + mastery explosions',
    requiresPin: false,
  },
];

// Persistence
const CONFIG_KEY = 'jackos-engagement-config';

export function saveConfig(config: EngagementConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch { /* */ }
}

export function loadConfig(): EngagementConfig | null {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with safe defaults to handle new fields
      const defaults = createSafeDefaults();
      return {
        ...defaults,
        ...parsed,
        sliders: { ...defaults.sliders, ...parsed.sliders },
        toggles: { ...defaults.toggles, ...parsed.toggles },
        sessionCap: { ...defaults.sessionCap, ...parsed.sessionCap },
        parentLock: { ...defaults.parentLock, ...parsed.parentLock },
      };
    }
  } catch { /* */ }
  return null;
}
