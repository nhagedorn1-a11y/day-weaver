// ============================================
// TIERED REWARD SYSTEM - iPad is Premium-Only
// ============================================

export interface TierReward {
  id: string;
  title: string;
  emoji: string;
  description: string;
  category: 'screen' | 'sensory' | 'activity' | 'autonomy' | 'collectible' | 'food' | 'praise';
  duration?: number; // minutes, if applicable
  requiresParent?: boolean;
  isIPad?: boolean; // Track iPad rewards specifically
}

export interface RewardTier {
  tier: 1 | 2 | 3 | 4 | 5;
  name: string;
  subtitle: string;
  emoji: string;
  tokenCost: number;
  frequency: 'instant' | 'very-common' | 'common' | 'uncommon' | 'rare';
  color: string;
  rewards: TierReward[];
}

// Tier 1 — Micro rewards (INSTANT, no token cost - given for immediate positive feedback)
const tier1Rewards: TierReward[] = [
  { id: 't1-token', title: 'Token Earned!', emoji: '🪙', description: 'Add to your collection', category: 'collectible' },
  { id: 't1-sticker', title: 'Sticker', emoji: '⭐', description: 'Pick a sticker for your chart', category: 'collectible' },
  { id: 't1-wall-push', title: 'Wall Pushups', emoji: '💪', description: '1-minute energy burst', category: 'sensory', duration: 1 },
  { id: 't1-sprint', title: 'Hallway Sprint', emoji: '🏃', description: 'Run and back!', category: 'sensory', duration: 1 },
  { id: 't1-trampoline', title: 'Trampoline Burst', emoji: '🤸', description: '1 minute of bouncing', category: 'sensory', duration: 1 },
  { id: 't1-squeeze-hug', title: 'Squeeze Hug', emoji: '🤗', description: 'Big pressure hug', category: 'sensory' },
  { id: 't1-victory-card', title: 'Victory Card', emoji: '🏆', description: 'Collect a small printed card', category: 'collectible' },
  { id: 't1-praise', title: 'Specific Praise', emoji: '🌟', description: '"You transitioned on the first ask!"', category: 'praise' },
];

// Tier 2 — Small rewards (3 tokens, VERY COMMON)
const tier2Rewards: TierReward[] = [
  { id: 't2-popcorn', title: 'Popcorn', emoji: '🍿', description: 'Snack upgrade!', category: 'food' },
  { id: 't2-hot-cocoa', title: 'Hot Chocolate', emoji: '☕', description: 'Warm & cozy drink', category: 'food' },
  { id: 't2-popsicle', title: 'Popsicle', emoji: '🧊', description: 'Frozen treat', category: 'food' },
  { id: 't2-spooky-snack', title: 'Spooky Snack Plate', emoji: '👻', description: 'Themed snack arrangement', category: 'food' },
  { id: 't2-order-pick', title: 'Pick the Order', emoji: '📋', description: '"Bath then PJs or PJs then bath?"', category: 'autonomy' },
  { id: 't2-mini-figure', title: 'Mini Figure', emoji: '🧟', description: 'Tiny monster collectible', category: 'collectible' },
  { id: 't2-sticker-pack', title: 'Monster Sticker', emoji: '👹', description: 'Special creepy sticker', category: 'collectible' },
  { id: 't2-trading-card', title: 'Trading Card', emoji: '🃏', description: 'Add to your collection', category: 'collectible' },
  { id: 't2-stamp', title: 'Stamp Collection', emoji: '📮', description: 'New stamp for your book', category: 'collectible' },
  { id: 't2-lego-5', title: '5 Min Legos', emoji: '🧱', description: '5 minutes of building', category: 'activity', duration: 5 },
  { id: 't2-magnatiles', title: '5 Min Magnatiles', emoji: '🔷', description: '5 minutes of creating', category: 'activity', duration: 5 },
  { id: 't2-cars', title: '5 Min Cars', emoji: '🚗', description: '5 minutes of racing', category: 'activity', duration: 5 },
  { id: 't2-drawing', title: '5 Min Drawing', emoji: '✏️', description: '5 minutes of art', category: 'activity', duration: 5 },
];

// Tier 3 — Medium rewards (6 tokens, COMMON)
const tier3Rewards: TierReward[] = [
  { id: 't3-spy-mission', title: 'Spy Mission', emoji: '🕵️', description: '10-15 min 1:1 spy game with parent', category: 'activity', duration: 15, requiresParent: true },
  { id: 't3-scavenger', title: 'Scavenger Hunt', emoji: '🔍', description: '10-15 min hunt around the house', category: 'activity', duration: 15, requiresParent: true },
  { id: 't3-fort', title: 'Fort Building', emoji: '🏰', description: 'Build an epic blanket fort', category: 'activity', duration: 15, requiresParent: true },
  { id: 't3-nerf', title: 'Nerf Target Practice', emoji: '🎯', description: '10-15 min shooting gallery', category: 'activity', duration: 15, requiresParent: true },
  { id: 't3-burrito', title: 'Burrito Blanket', emoji: '🌯', description: 'Big sensory wrap-up', category: 'sensory', duration: 10 },
  { id: 't3-steamroller', title: 'Steamroller Squish', emoji: '🛞', description: 'Deep pressure rolling', category: 'sensory', duration: 10 },
  { id: 't3-massage', title: 'Back Massage', emoji: '💆', description: 'Relaxing pressure massage', category: 'sensory', duration: 10, requiresParent: true },
  { id: 't3-weighted', title: 'Weighted Blanket Time', emoji: '🛏️', description: 'Cozy calming time', category: 'sensory', duration: 15 },
  { id: 't3-dinner-pick', title: 'Choose Dinner Side', emoji: '🍽️', description: 'Pick tonight\'s side dish', category: 'autonomy' },
  { id: 't3-dessert-pick', title: 'Choose Dessert', emoji: '🍨', description: 'Pick tonight\'s dessert', category: 'autonomy' },
  { id: 't3-monster-art', title: 'Design a Monster', emoji: '👾', description: 'Markers + monster challenge', category: 'activity', duration: 15 },
  { id: 't3-music-control', title: 'DJ Control', emoji: '🎵', description: 'Pick music for the next activity', category: 'autonomy' },
  { id: 't3-lights-control', title: 'Lighting Control', emoji: '💡', description: 'Control the mood lighting', category: 'autonomy' },
];

// Tier 4 — Big rewards (10 tokens, UNCOMMON) — FIRST iPad tier
const tier4Rewards: TierReward[] = [
  { id: 't4-ipad-10', title: '10 Min iPad', emoji: '📱', description: 'Pick 1 app from the menu', category: 'screen', duration: 10, isIPad: true },
  { id: 't4-ipad-15', title: '15 Min iPad', emoji: '📱', description: 'Pick 1 app from the menu', category: 'screen', duration: 15, isIPad: true },
  { id: 't4-creepy-vault', title: 'Creepy Vault Pick', emoji: '🗝️', description: 'Choose 1 stored creepy toy for 24 hours', category: 'activity', requiresParent: true },
  { id: 't4-movie-pick', title: 'Pick Family Movie', emoji: '🎬', description: 'Choose from pre-approved list', category: 'autonomy', requiresParent: true },
  { id: 't4-spooky-short', title: 'Spooky Short', emoji: '👻', description: 'Pick a spooky short video', category: 'screen', requiresParent: true },
  { id: 't4-late-bed', title: 'Late Bedtime +10', emoji: '🌙', description: '+10 minutes before bed (if it works)', category: 'autonomy', requiresParent: true },
];

// Tier 5 — Pinnacle rewards (15 tokens, RARE)
const tier5Rewards: TierReward[] = [
  { id: 't5-ipad-30', title: '30 Min iPad', emoji: '📱', description: 'The ultimate screen reward', category: 'screen', duration: 30, isIPad: true },
  { id: 't5-new-creepy', title: 'New Creepy Toy', emoji: '🎁', description: 'Weekly "boss level" only', category: 'collectible', requiresParent: true },
];

// Complete tier system
export const REWARD_TIERS: RewardTier[] = [
  {
    tier: 1,
    name: 'Micro',
    subtitle: 'Instant wins',
    emoji: '⚡',
    tokenCost: 0, // These are immediate, no cost
    frequency: 'instant',
    color: 'bg-muted',
    rewards: tier1Rewards,
  },
  {
    tier: 2,
    name: 'Small',
    subtitle: 'Quick rewards',
    emoji: '🌟',
    tokenCost: 3,
    frequency: 'very-common',
    color: 'bg-calm',
    rewards: tier2Rewards,
  },
  {
    tier: 3,
    name: 'Medium',
    subtitle: 'Good stuff',
    emoji: '🎯',
    tokenCost: 6,
    frequency: 'common',
    color: 'bg-next',
    rewards: tier3Rewards,
  },
  {
    tier: 4,
    name: 'Big',
    subtitle: 'iPad eligible',
    emoji: '📱',
    tokenCost: 10,
    frequency: 'uncommon',
    color: 'bg-primary',
    rewards: tier4Rewards,
  },
  {
    tier: 5,
    name: 'Pinnacle',
    subtitle: 'Boss level',
    emoji: '👑',
    tokenCost: 15,
    frequency: 'rare',
    color: 'bg-token',
    rewards: tier5Rewards,
  },
];

// iPad ending ritual steps
export const IPAD_END_RITUAL = [
  { step: 1, instruction: 'Timer starts immediately', emoji: '⏱️' },
  { step: 2, instruction: '2-minute warning', emoji: '⚠️', timeBeforeEnd: 2 },
  { step: 3, instruction: 'Save your game/show', emoji: '💾' },
  { step: 4, instruction: 'Screen off', emoji: '📴' },
  { step: 5, instruction: 'High five!', emoji: '🖐️' },
  { step: 6, instruction: 'Move to next step', emoji: '➡️' },
];

// Bonus token for clean iPad ending
export const IPAD_CLEAN_END_BONUS = 1;

// Helper functions
export function getTierByTokens(tokens: number): RewardTier | null {
  // Return the highest tier the user can afford
  const affordable = REWARD_TIERS.filter(t => t.tokenCost <= tokens && t.tokenCost > 0);
  if (affordable.length === 0) return null;
  return affordable.reduce((max, t) => t.tier > max.tier ? t : max);
}

export function getNextTier(tokens: number): { tier: RewardTier; tokensNeeded: number } | null {
  const nextTier = REWARD_TIERS.find(t => t.tokenCost > tokens);
  if (!nextTier) return null;
  return { tier: nextTier, tokensNeeded: nextTier.tokenCost - tokens };
}

export function getTierProgress(tokens: number): { 
  currentTier: number;
  nextTier: number;
  progress: number;
  tokensToNext: number;
} {
  if (tokens >= 15) {
    return { currentTier: 5, nextTier: 5, progress: 100, tokensToNext: 0 };
  }
  if (tokens >= 10) {
    return { currentTier: 4, nextTier: 5, progress: ((tokens - 10) / 5) * 100, tokensToNext: 15 - tokens };
  }
  if (tokens >= 6) {
    return { currentTier: 3, nextTier: 4, progress: ((tokens - 6) / 4) * 100, tokensToNext: 10 - tokens };
  }
  if (tokens >= 3) {
    return { currentTier: 2, nextTier: 3, progress: ((tokens - 3) / 3) * 100, tokensToNext: 6 - tokens };
  }
  return { currentTier: 1, nextTier: 2, progress: (tokens / 3) * 100, tokensToNext: 3 - tokens };
}

export function getIPadRewards(): TierReward[] {
  return REWARD_TIERS
    .flatMap(t => t.rewards)
    .filter(r => r.isIPad);
}

export function isIPadReward(rewardId: string): boolean {
  return getIPadRewards().some(r => r.id === rewardId);
}

// Get rewards by tier
export function getRewardsByTier(tier: 1 | 2 | 3 | 4 | 5): TierReward[] {
  const tierData = REWARD_TIERS.find(t => t.tier === tier);
  return tierData?.rewards || [];
}

// Token milestones for visual progress
export const TOKEN_MILESTONES = [
  { tokens: 3, tier: 2, label: 'Tier 2', emoji: '🌟' },
  { tokens: 6, tier: 3, label: 'Tier 3', emoji: '🎯' },
  { tokens: 10, tier: 4, label: 'iPad!', emoji: '📱' },
  { tokens: 15, tier: 5, label: 'Boss Level', emoji: '👑' },
];
