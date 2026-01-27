// JackOS Type Definitions

export interface Task {
  id: string;
  title: string;
  icon: string;
  duration?: number; // minutes
  completed: boolean;
  tokens: number;
  category: 'routine' | 'transition' | 'learning' | 'bravery' | 'calm';
}

export interface DaySchedule {
  id: string;
  date: string;
  tasks: Task[];
  tokensEarned: number;
  tokensGoal: number;
}

export interface Reward {
  id: string;
  title: string;
  icon: string;
  cost: number;
  category: 'small' | 'medium' | 'big';
}

export interface CalmTool {
  id: string;
  title: string;
  icon: string;
  type: 'breathing' | 'sensory' | 'script' | 'body-check';
  duration?: number;
}

export interface BraveryStep {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  completed: boolean;
  attempts: number;
}

export type UserMode = 'child' | 'parent';

export interface AppState {
  mode: UserMode;
  currentTaskIndex: number;
  tokensEarned: number;
  isTransitioning: boolean;
  showCalmToolkit: boolean;
}
