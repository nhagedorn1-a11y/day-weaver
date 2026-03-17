// RewardEngine — Variable-Ratio Reinforcement (Clinically Safe)
// No punitive mechanics. No loss aversion. Pure positive reinforcement.
// Rewards effort and persistence, not accuracy.

export type SurpriseReward = {
  type: 'xp_multiplier' | 'rare_badge' | 'bonus_tokens' | 'streak_shield' | 'knowledge_explosion';
  label: string;
  emoji: string;
  multiplier?: number;
  bonusTokens?: number;
  badgeId?: string;
  description: string;
};

export type EffortBadge = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  earnedAt: number; // timestamp
};

// Variable ratio: rewards on average every 5-9 micro-tasks (never fixed)
const VR_MIN = 4;
const VR_MAX = 9;

// Surprise reward pool — weighted by rarity
const SURPRISE_POOL: Array<{ reward: Omit<SurpriseReward, 'label'>; weight: number }> = [
  {
    reward: { type: 'xp_multiplier', emoji: '⚡', multiplier: 2, description: 'Double power!' },
    weight: 30,
  },
  {
    reward: { type: 'xp_multiplier', emoji: '🔥', multiplier: 3, description: 'Triple power!' },
    weight: 15,
  },
  {
    reward: { type: 'xp_multiplier', emoji: '💥', multiplier: 5, description: 'MEGA power!' },
    weight: 5,
  },
  {
    reward: { type: 'bonus_tokens', emoji: '🌟', bonusTokens: 1, description: 'Bonus token!' },
    weight: 25,
  },
  {
    reward: { type: 'bonus_tokens', emoji: '✨', bonusTokens: 2, description: 'Double bonus!' },
    weight: 10,
  },
  {
    reward: { type: 'rare_badge', emoji: '🏅', badgeId: 'perseverance', description: 'You kept going!' },
    weight: 8,
  },
  {
    reward: { type: 'knowledge_explosion', emoji: '🧠', description: 'Brain power up!' },
    weight: 7,
  },
];

// Effort badges — earned for persistence, not perfection
const EFFORT_BADGE_THRESHOLDS: Array<{ attempts: number; badge: EffortBadge }> = [
  { attempts: 3, badge: { id: 'first-tries', title: 'Getting Started', emoji: '🌱', description: 'You tried 3 times!', earnedAt: 0 } },
  { attempts: 10, badge: { id: 'determined', title: 'Determined', emoji: '💪', description: '10 attempts — wow!', earnedAt: 0 } },
  { attempts: 25, badge: { id: 'unstoppable', title: 'Unstoppable', emoji: '🚀', description: '25 attempts and counting!', earnedAt: 0 } },
  { attempts: 50, badge: { id: 'legend', title: 'Legend', emoji: '👑', description: '50 attempts — incredible!', earnedAt: 0 } },
  { attempts: 100, badge: { id: 'master', title: 'Grand Master', emoji: '⭐', description: '100 attempts — you are amazing!', earnedAt: 0 } },
];

export interface RewardEngineState {
  spinsSinceLastReward: number;
  nextRewardAt: number; // The VR target for this cycle
  totalSpins: number;
  totalAttempts: number; // Includes incorrect — effort tracking
  earnedBadges: EffortBadge[];
  streakDays: number;
  streakLastDate: string | null; // ISO date string
  streakShields: number;
  lifetimeSurprises: number;
}

export function createInitialState(): RewardEngineState {
  return {
    spinsSinceLastReward: 0,
    nextRewardAt: randomVR(),
    totalSpins: 0,
    totalAttempts: 0,
    earnedBadges: [],
    streakDays: 0,
    streakLastDate: null,
    streakShields: 0,
    lifetimeSurprises: 0,
  };
}

function randomVR(): number {
  return VR_MIN + Math.floor(Math.random() * (VR_MAX - VR_MIN + 1));
}

function weightedRandom(pool: typeof SURPRISE_POOL): SurpriseReward {
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;
  
  for (const item of pool) {
    roll -= item.weight;
    if (roll <= 0) {
      const labels: Record<SurpriseReward['type'], string> = {
        xp_multiplier: `${item.reward.multiplier}× Power!`,
        rare_badge: 'Rare Badge!',
        bonus_tokens: `+${item.reward.bonusTokens} Bonus!`,
        streak_shield: 'Streak Shield!',
        knowledge_explosion: 'Knowledge Explosion!',
      };
      return { ...item.reward, label: labels[item.reward.type] };
    }
  }
  
  // Fallback
  return { ...pool[0].reward, label: '2× Power!' };
}

export interface SpinResult {
  surprise: SurpriseReward | null;
  newBadge: EffortBadge | null;
  streakUpdated: boolean;
  newState: RewardEngineState;
}

/**
 * Process a single "spin" — any micro-task completion (correct OR incorrect attempt).
 * Every action feeds the engine. Effort counts.
 */
export function processSpin(
  state: RewardEngineState,
  wasCorrect: boolean,
): SpinResult {
  const newState = { ...state };
  newState.totalSpins += 1;
  newState.totalAttempts += 1;
  newState.spinsSinceLastReward += 1;

  let surprise: SurpriseReward | null = null;
  let newBadge: EffortBadge | null = null;

  // Variable ratio check — reward on effort, not just accuracy
  // Correct answers always count. Incorrect count too (effort!) but at 50% rate
  const shouldCheck = wasCorrect || Math.random() > 0.5;
  
  if (shouldCheck && newState.spinsSinceLastReward >= newState.nextRewardAt) {
    surprise = weightedRandom(SURPRISE_POOL);
    newState.spinsSinceLastReward = 0;
    newState.nextRewardAt = randomVR();
    newState.lifetimeSurprises += 1;

    // Streak shields are rare bonus from consistency
    if (surprise.type === 'rare_badge' && newState.streakDays >= 3) {
      newState.streakShields = Math.min(newState.streakShields + 1, 3);
    }
  }

  // Check effort badge thresholds
  for (const threshold of EFFORT_BADGE_THRESHOLDS) {
    if (
      newState.totalAttempts >= threshold.attempts &&
      !newState.earnedBadges.some(b => b.id === threshold.badge.id)
    ) {
      newBadge = { ...threshold.badge, earnedAt: Date.now() };
      newState.earnedBadges = [...newState.earnedBadges, newBadge];
      break; // One badge per spin max
    }
  }

  return { surprise, newBadge, streakUpdated: false, newState };
}

/**
 * Update the daily streak. Gentle: streaks PAUSE, never die.
 * Missing a day uses a shield if available, otherwise pauses (no reset).
 */
export function updateStreak(state: RewardEngineState): RewardEngineState {
  const today = new Date().toISOString().split('T')[0];
  const newState = { ...state };

  if (state.streakLastDate === today) {
    return newState; // Already counted today
  }

  if (state.streakLastDate) {
    const lastDate = new Date(state.streakLastDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day — grow streak
      newState.streakDays += 1;
    } else if (diffDays > 1 && newState.streakShields > 0) {
      // Missed days but have shield — use it, keep streak
      newState.streakShields -= 1;
      newState.streakDays += 1;
    }
    // If diffDays > 1 and no shield: streak PAUSES (stays same value, doesn't reset)
  } else {
    // First ever day
    newState.streakDays = 1;
  }

  newState.streakLastDate = today;
  return newState;
}

/**
 * Near-miss encouragement — returns a supportive message + partial credit percentage.
 * No punitive language. Pure encouragement.
 */
export function getNearMissEncouragement(accuracy: number): {
  message: string;
  emoji: string;
  partialXP: number; // 0-1 scale of partial credit
} {
  if (accuracy >= 0.9) {
    return { message: 'SO close! Almost perfect!', emoji: '🔥', partialXP: 0.75 };
  }
  if (accuracy >= 0.7) {
    return { message: 'Great effort! Getting there!', emoji: '💪', partialXP: 0.5 };
  }
  if (accuracy >= 0.5) {
    return { message: 'Good try! Keep going!', emoji: '🌟', partialXP: 0.3 };
  }
  return { message: 'You tried! That takes courage!', emoji: '🌱', partialXP: 0.2 };
}

// Persistence helpers
const STORAGE_KEY = 'jackos-engagement-state';

export function saveState(state: RewardEngineState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silent fail on storage issues
  }
}

export function loadState(): RewardEngineState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Silent fail
  }
  return null;
}
