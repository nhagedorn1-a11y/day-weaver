// RiskDefaults — Auto-applies safe defaults based on user profile risk signals.
// Priority #1: Never exploit. Default OFF for all risky mechanics.

import { childProfile, SENSORY_DEFAULTS } from '@/data/childProfile';
import { EngagementConfig, EngagementSliders, createSafeDefaults } from './EngagementConfig';

export interface RiskSignals {
  isChild: boolean; // age < 13
  hasAutism: boolean;
  hasADHD: boolean;
  hasAnxiety: boolean;
  hasOCD: boolean;
  sensorySensitive: boolean;
  workingMemoryDeficit: boolean;
  averageDailyMinutes: number; // rolling average
  maxedSessionsLast7Days: number; // days where cap was hit
}

/**
 * Detect risk signals from the child's profile.
 * In production, some of these would come from onboarding questionnaire.
 */
export function detectRiskSignals(): RiskSignals {
  return {
    isChild: childProfile.age < 13,
    hasAutism: childProfile.diagnoses.autism.level >= 1,
    hasADHD: !!childProfile.diagnoses.adhd,
    hasAnxiety: childProfile.diagnoses.anxiety,
    hasOCD: childProfile.diagnoses.ocd.active,
    sensorySensitive: childProfile.sensory.noiseHypersensitive,
    workingMemoryDeficit: childProfile.cognition.workingMemory === 'weakness',
    averageDailyMinutes: getAverageDailyMinutes(),
    maxedSessionsLast7Days: getMaxedSessionCount(),
  };
}

/**
 * Apply risk-based defaults to engagement config.
 * Called on first launch and whenever risk signals change.
 */
export function applyRiskDefaults(config: EngagementConfig): EngagementConfig {
  const risks = detectRiskSignals();
  const result = { ...config };

  // Child < 13: Everything OFF
  if (risks.isChild) {
    result.toggles = {
      ...result.toggles,
      masterEnabled: false,
      multipliers: false,
      zeroDelayMode: false,
    };
    result.sliders = clampAllSliders(result.sliders, 0);
    // Keep safe mechanics
    result.toggles.effortBadges = true;
    result.toggles.specialInterests = true;
    result.sliders.progression = 2; // Minimal but visible progress
  }

  // Sensory sensitivity: Force sensory sliders low
  if (risks.sensorySensitive) {
    result.sliders.haptics = Math.min(result.sliders.haptics, 2);
    result.sliders.particles = Math.min(result.sliders.particles, 2);
    result.sliders.sounds = Math.min(result.sliders.sounds, 2);
  }

  // OCD: Near-miss and streak mechanics can trigger compulsive loops
  if (risks.hasOCD) {
    result.sliders.nearMiss = Math.min(result.sliders.nearMiss, 1);
    result.sliders.streak = Math.min(result.sliders.streak, 2);
  }

  // Anxiety: Reduce loss-aversion-adjacent mechanics
  if (risks.hasAnxiety) {
    result.sliders.streak = Math.min(result.sliders.streak, 3);
    result.sliders.nearMiss = Math.min(result.sliders.nearMiss, 2);
  }

  // High usage patterns: Auto-throttle
  if (risks.averageDailyMinutes > 25 || risks.maxedSessionsLast7Days >= 3) {
    result.sliders.vrr = Math.min(result.sliders.vrr, 3);
    result.sliders.autoAdvanceSpeed = Math.min(result.sliders.autoAdvanceSpeed, 4);
    result.sessionCap.dailyCapMinutes = Math.min(result.sessionCap.dailyCapMinutes, 30);
  }

  // Working memory deficit: Slower auto-advance
  if (risks.workingMemoryDeficit) {
    result.sliders.autoAdvanceSpeed = Math.min(result.sliders.autoAdvanceSpeed, 4);
  }

  result.riskDefaultsApplied = true;
  return result;
}

/**
 * Check if a slider change requires elevated confirmation.
 * Returns a warning message or null.
 */
export function getSliderWarning(
  key: keyof EngagementSliders,
  newValue: number,
  risks: RiskSignals,
): string | null {
  if (newValue <= 5) return null;

  const warnings: Partial<Record<keyof EngagementSliders, string>> = {
    vrr: 'High surprise rewards increase dopamine spikes. Monitor for overstimulation or compulsive use.',
    nearMiss: 'Dramatic near-miss feedback may increase frustration or compulsive retry loops.',
    streak: 'Visible streaks can cause anxiety about "breaking" them, even though ours pause.',
    haptics: risks.sensorySensitive
      ? '⚠️ This child has sensory sensitivity. High haptics may cause distress.'
      : 'Strong haptic feedback may be distracting.',
    particles: risks.sensorySensitive
      ? '⚠️ This child has sensory sensitivity. Intense visuals may cause overload.'
      : 'Intense visual effects may be distracting.',
    sounds: risks.sensorySensitive
      ? '⚠️ This child has noise hypersensitivity. High sound effects may cause distress.'
      : null,
  };

  return warnings[key] ?? null;
}

/**
 * Check if engagement config is "safe" — all within risk-appropriate bounds.
 */
export function isConfigSafe(config: EngagementConfig): boolean {
  const risks = detectRiskSignals();
  if (risks.isChild && config.toggles.masterEnabled) {
    // Child profile: check all sliders are within bounds
    const maxSafe = risks.sensorySensitive ? 3 : 5;
    return Object.values(config.sliders).every(v => v <= maxSafe);
  }
  return true;
}

// --- Helpers ---

function clampAllSliders(sliders: EngagementSliders, max: number): EngagementSliders {
  const result = { ...sliders };
  for (const key of Object.keys(result) as Array<keyof EngagementSliders>) {
    result[key] = Math.min(result[key], max);
  }
  return result;
}

function getAverageDailyMinutes(): number {
  try {
    const today = new Date();
    let total = 0;
    let days = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = `jackos-daily-minutes-${date.toISOString().split('T')[0]}`;
      const val = parseInt(localStorage.getItem(key) || '0', 10);
      if (val > 0) {
        total += val;
        days++;
      }
    }
    return days > 0 ? Math.round(total / days) : 0;
  } catch {
    return 0;
  }
}

function getMaxedSessionCount(): number {
  try {
    const today = new Date();
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = `jackos-daily-minutes-${date.toISOString().split('T')[0]}`;
      const val = parseInt(localStorage.getItem(key) || '0', 10);
      if (val >= 25) count++;
    }
    return count;
  } catch {
    return 0;
  }
}
