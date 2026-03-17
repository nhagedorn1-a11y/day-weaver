export { EngagementProvider, useEngagement } from './EngagementProvider';
export { CelebrationOverlay, NearMissEncouragement } from './CelebrationOverlay';
export { StreakFlame } from './StreakFlame';
export { BreakReminder } from './BreakReminder';
export { EffortBadges } from './EffortBadges';
export { EngagementControls } from './EngagementControls';
export {
  processSpin,
  updateStreak,
  getNearMissEncouragement,
  createInitialState,
} from './RewardEngine';
export type { SurpriseReward, EffortBadge, SpinResult, RewardEngineState } from './RewardEngine';
export type { EngagementConfig, EngagementSliders } from './EngagementConfig';
export { computeSensoryOutput, triggerHaptic, getVRRParams } from './SensoryManager';
export type { SensoryOutput } from './SensoryManager';
