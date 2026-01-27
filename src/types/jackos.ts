// Complete JackOS Type System

// === CORE TYPES ===
export interface Task {
  id: string;
  title: string;
  icon: string;
  duration?: number;
  completed: boolean;
  tokens: number;
  category: 'routine' | 'transition' | 'learning' | 'bravery' | 'calm' | 'motor' | 'social';
  oneStepInstruction?: string;
  visualCue?: string;
  scheduledTime?: string; // HH:MM format
}

// Schedule template for quick day building
export interface ScheduleTemplate {
  id: string;
  name: string;
  icon: string;
  tasks: Omit<Task, 'id' | 'completed'>[];
}

// Available task icons for the picker
export const TASK_ICONS = [
  { id: 'breakfast', emoji: '🍳', label: 'Breakfast' },
  { id: 'teeth', emoji: '🦷', label: 'Brush Teeth' },
  { id: 'dress', emoji: '👕', label: 'Get Dressed' },
  { id: 'backpack', emoji: '🎒', label: 'Backpack' },
  { id: 'reading', emoji: '📖', label: 'Reading' },
  { id: 'homework', emoji: '✏️', label: 'Homework' },
  { id: 'play', emoji: '🎮', label: 'Play Time' },
  { id: 'bath', emoji: '🛁', label: 'Bath' },
  { id: 'bed', emoji: '🌙', label: 'Bedtime' },
  { id: 'calm', emoji: '🧘', label: 'Calm Time' },
  { id: 'brave', emoji: '🦁', label: 'Bravery' },
  { id: 'snack', emoji: '🍎', label: 'Snack' },
  { id: 'walk', emoji: '🚶', label: 'Walk' },
  { id: 'music', emoji: '🎵', label: 'Music' },
  { id: 'art', emoji: '🎨', label: 'Art' },
  { id: 'outside', emoji: '🌳', label: 'Outside' },
  { id: 'lunch', emoji: '🥪', label: 'Lunch' },
  { id: 'dinner', emoji: '🍽️', label: 'Dinner' },
  { id: 'therapy', emoji: '💬', label: 'Therapy' },
  { id: 'exercise', emoji: '🏃', label: 'Exercise' },
  { id: 'screen', emoji: '📺', label: 'Screen Time' },
  { id: 'chores', emoji: '🧹', label: 'Chores' },
  { id: 'rest', emoji: '😴', label: 'Rest' },
  { id: 'social', emoji: '👋', label: 'Social' },
] as const;

export type UserMode = 'child' | 'parent';

// === TOKEN ECONOMY ===
export interface Reward {
  id: string;
  title: string;
  icon: string;
  cost: number;
  category: 'small' | 'medium' | 'big';
}

export interface PraisePhrase {
  id: string;
  phrase: string;
  category: 'effort' | 'persistence' | 'flexibility' | 'bravery' | 'trying';
}

// === EXECUTIVE FUNCTION ===
export type SelfTalkButton = 'first' | 'next' | 'check' | 'tryAgain';

export interface OneStepCard {
  id: string;
  instruction: string;
  visualCue: string;
  processingPause: number; // seconds
}

// === OCD / ANXIETY ===
export interface SupportiveStatement {
  id: string;
  type: 'validate' | 'confidence' | 'cope';
  text: string;
}

export interface BraveryStep {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  copingScript: string;
  completed: boolean;
  attempts: number;
  lastDistressRating?: 1 | 2 | 3;
}

// === SENSORY ===
export interface HeavyWorkActivity {
  id: string;
  title: string;
  icon: string;
  duration: number;
  description: string;
}

export interface InteroceptionCheck {
  id: string;
  area: 'water' | 'bathroom' | 'temperature' | 'hunger' | 'tired';
  icon: string;
  prompt: string;
}

// === MATH ===
export type MathLevel = 'concrete' | 'pictures' | 'tallies' | 'numbers';

export interface MathActivity {
  id: string;
  title: string;
  level: MathLevel;
  type: 'counting' | 'compare' | 'correspondence';
  targetNumber: number;
}

// === FINE MOTOR ===
export type WritingStage = 'trace' | 'dotToDot' | 'copy' | 'flashcard' | 'memory';

export interface LetterFormation {
  letter: string;
  currentStage: WritingStage;
  completedStages: WritingStage[];
}

export interface ADLRoutine {
  id: string;
  title: string;
  icon: string;
  microSteps: string[];
  currentStep: number;
  tokensPerStep: number;
}

// === SOCIAL ===
export interface SocialStory {
  id: string;
  title: string;
  situation: string;
  steps: string[];
  createdBy: 'parent';
}

export interface TurnTakingGame {
  id: string;
  title: string;
  turnDuration: number;
  currentTurn: 'child' | 'parent';
}

// === NAVIGATION ===
export type AppModule = 
  | 'today'
  | 'timers'
  | 'reading'
  | 'math'
  | 'motor'
  | 'sensory'
  | 'social'
  | 'bravery'
  | 'calm'
  | 'rewards';

export interface ModuleInfo {
  id: AppModule;
  title: string;
  icon: string;
  description: string;
  color: string;
}
