// Common activity schema for all modules
export interface Activity {
  id: string;
  title: string;
  lane: string;
  icon: string;
  durationOptions: number[]; // in minutes: 2, 5, 10, 15
  difficulty: 1 | 2 | 3 | 4 | 5;
  instructions: string[];
  audioNarration?: string; // text for TTS
  successCriteria: string;
  tokenReward: number;
  accessibilityFlags: {
    reducedText?: boolean;
    highContrast?: boolean;
    audioRequired?: boolean;
  };
  type: 'game' | 'guided' | 'practice' | 'explore';
}

// Science Lab Card (collectible)
export interface LabCard {
  id: string;
  title: string;
  category: 'nature' | 'weather' | 'space' | 'chemistry' | 'build' | 'micro';
  emoji: string;
  funFact: string;
  funFactAudio: string;
  imageDescription: string;
  tryAgainChallenge: string;
  unlocked: boolean;
}

// Science activities
export interface ScienceActivity extends Activity {
  lane: 'nature' | 'weather' | 'space' | 'chemistry' | 'build' | 'micro';
  materials?: string[];
  prediction?: string;
  observation?: string;
  labCardId?: string;
  visualSteps?: Array<{
    emoji: string;
    phase?: string;
    planet?: string;
    label: string;
    size?: string;
  }>;
}

// Body/Regulation activities
export interface BodyActivity extends Activity {
  lane: 'feelings' | 'breathing' | 'pressure' | 'energy' | 'sleep';
  energyLevel?: 'low' | 'just-right' | 'high';
  bodyArea?: string[];
  quietMode?: boolean;
}

// Breathing exercise
export interface BreathingExercise {
  id: string;
  title: string;
  emoji: string;
  description: string;
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    holdAfter?: number;
  };
  visualType: 'balloon' | 'box' | 'dragon' | 'wave' | 'flower';
  difficulty: 1 | 2 | 3;
  visualFrames?: Array<{
    phase: string;
    emoji?: string;
    size?: number;
    color?: string;
    position?: { x: number; y: number };
    side?: string;
    progress?: number;
    state?: string;
    fireLevel?: number;
    flame?: string;
    chest?: string;
    height?: number;
    direction?: string;
    petalOpen?: number;
    seedsRemaining?: number;
    number?: number;
    calmLevel?: number;
  }>;
}

// Micro-break
export interface MicroBreak {
  id: string;
  title: string;
  emoji: string;
  duration: number; // seconds
  instructions: string[];
  energyType: 'calming' | 'alerting' | 'organizing';
  bodyFocus: string[];
  quietMode: boolean;
}

// Bravery ladder
export interface BraveryLadder {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'transitions' | 'reassurance' | 'checking' | 'contamination' | 'separation' | 'custom';
  steps: BraveryStep[];
  isTemplate: boolean;
  userId?: string;
}

export interface BraveryStep {
  id: string;
  description: string;
  kidFriendlyDescription: string;
  distressRating: number; // 1-10 SUDS
  timeGoal: number; // seconds
  copingToolIds: string[];
  completed: boolean;
  completedAt?: string;
  outcomeEmoji?: string;
  reflectionNote?: string;
}

// Bravery story (social narrative)
export interface BraveryStory {
  id: string;
  title: string;
  emoji: string;
  theme: string;
  pages: BraveryStoryPage[];
}

export interface BraveryStoryPage {
  id: string;
  text: string;
  emoji: string;
  choices?: {
    text: string;
    nextPageId: string;
    isBrave: boolean;
  }[];
}

// Motor activities
export interface MotorActivity extends Activity {
  lane: 'fine-motor' | 'handwriting' | 'adl' | 'balance' | 'bilateral';
  adaptiveSize?: boolean;
  speedOptions?: number[];
  stepByStep?: string[];
}

// ADL Mission
export interface ADLMission {
  id: string;
  title: string;
  emoji: string;
  category: 'dressing' | 'hygiene' | 'eating' | 'organizing';
  steps: {
    instruction: string;
    visualCue: string;
    completed: boolean;
  }[];
  tokenPerStep: number;
  totalTime: number; // minutes
}

// Fine motor game
export interface FineMotorGame {
  id: string;
  title: string;
  emoji: string;
  gameType: 'pinch' | 'trace' | 'cut' | 'drag' | 'tap';
  difficulty: 1 | 2 | 3 | 4 | 5;
  adaptiveDifficulty: boolean;
  instructions: string[];
}

// Parent config for modules
export interface ModuleParentConfig {
  enabledLanes: string[];
  dailyTimeCapMinutes: number;
  tokenPayoutRate: number; // multiplier
  coachPromptsEnabled: boolean;
  reduceTextMode: boolean;
}
