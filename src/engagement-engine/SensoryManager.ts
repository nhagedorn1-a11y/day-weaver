// SensoryManager — Scales haptics/sound/particles based on engagement config sliders.
// Provides computed intensities for UI components to consume.

import { EngagementSliders } from './EngagementConfig';

export interface SensoryOutput {
  /** Particle count multiplier (0-1) */
  particleMultiplier: number;
  /** Animation duration scale (0.5-2.0, lower = faster) */
  animationScale: number;
  /** Whether to show particle effects at all */
  showParticles: boolean;
  /** Sound volume multiplier (0-1) */
  soundMultiplier: number;
  /** Whether to play sound effects */
  soundEnabled: boolean;
  /** Haptic pattern: 'none' | 'light' | 'medium' | 'strong' */
  hapticLevel: 'none' | 'light' | 'medium' | 'strong';
  /** Auto-advance delay in ms (0 = instant, 3000 = slow) */
  autoAdvanceMs: number;
  /** Celebration card display duration in ms */
  celebrationDuration: number;
  /** Whether to show near-miss UI */
  showNearMiss: boolean;
  /** Near-miss animation intensity (0-1) */
  nearMissIntensity: number;
  /** Whether to show streak UI */
  showStreak: boolean;
  /** Whether to show effort badges */
  showEffortBadges: boolean;
  /** Progression visual level */
  progressionLevel: 'none' | 'basic' | 'moderate' | 'full';
}

/**
 * Compute sensory outputs from slider values.
 * All scaling is smooth — no jarring jumps.
 */
export function computeSensoryOutput(
  sliders: EngagementSliders,
  masterEnabled: boolean,
): SensoryOutput {
  if (!masterEnabled) {
    return {
      particleMultiplier: 0,
      animationScale: 1.5,
      showParticles: false,
      soundMultiplier: 0,
      soundEnabled: false,
      hapticLevel: 'none',
      autoAdvanceMs: 2000,
      celebrationDuration: 0,
      showNearMiss: false,
      nearMissIntensity: 0,
      showStreak: false,
      showEffortBadges: true, // Always safe
      progressionLevel: 'basic',
    };
  }

  return {
    particleMultiplier: sliders.particles / 10,
    animationScale: 2.0 - (sliders.particles / 10) * 1.5, // 2.0 at 0, 0.5 at 10
    showParticles: sliders.particles > 0,
    soundMultiplier: sliders.sounds / 10,
    soundEnabled: sliders.sounds > 0,
    hapticLevel:
      sliders.haptics === 0 ? 'none'
      : sliders.haptics <= 3 ? 'light'
      : sliders.haptics <= 7 ? 'medium'
      : 'strong',
    autoAdvanceMs: Math.round(3000 - (sliders.autoAdvanceSpeed / 10) * 2800), // 3000ms at 0, 200ms at 10
    celebrationDuration:
      sliders.particles === 0 ? 0
      : Math.round(1000 + (sliders.particles / 10) * 2000), // 1s-3s
    showNearMiss: sliders.nearMiss > 0,
    nearMissIntensity: sliders.nearMiss / 10,
    showStreak: sliders.streak > 0,
    showEffortBadges: true, // Always on — safe mechanic
    progressionLevel:
      sliders.progression === 0 ? 'none'
      : sliders.progression <= 3 ? 'basic'
      : sliders.progression <= 7 ? 'moderate'
      : 'full',
  };
}

/**
 * Trigger haptic feedback if available and enabled.
 */
export function triggerHaptic(level: SensoryOutput['hapticLevel']): void {
  if (level === 'none' || !('vibrate' in navigator)) return;
  
  try {
    const patterns: Record<string, number[]> = {
      light: [10],
      medium: [20, 10, 20],
      strong: [30, 15, 30, 15, 30],
    };
    navigator.vibrate(patterns[level] || []);
  } catch {
    // Silent fail — haptics not available
  }
}

/**
 * Get VRR parameters based on slider value.
 * 0 = fixed every 10. 10 = high variance avg 3-9.
 */
export function getVRRParams(sliderValue: number): {
  minInterval: number;
  maxInterval: number;
  isFixed: boolean;
} {
  if (sliderValue === 0) {
    return { minInterval: 10, maxInterval: 10, isFixed: true };
  }
  
  // Scale: slider 1 = avg 9-10, slider 10 = avg 3-9
  const baseMin = Math.max(3, Math.round(10 - sliderValue * 0.7));
  const baseMax = Math.max(baseMin + 1, Math.round(10 - sliderValue * 0.1));
  
  return {
    minInterval: baseMin,
    maxInterval: baseMax,
    isFixed: false,
  };
}
