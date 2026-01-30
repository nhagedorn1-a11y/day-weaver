import { AppModule, ModuleInfo } from '@/types/jackos';
import { 
  Clock, BookOpen, Calculator, Pencil, Microscope, 
  Hand, Brain, Users, Shield, Gift 
} from 'lucide-react';
import { ComponentType } from 'react';

// Lazy imports will be done at the component level
export interface ModuleConfig {
  id: AppModule;
  title: string;
  icon: string;
  emoji: string;
  description: string;
  color: string;
  enabled: boolean;
  awardsTokens: boolean; // Only Reading, Math, Writing award tokens
  requiresAuth: boolean;
  parentOnly: boolean;
  order: number;
}

// Centralized module registry
export const MODULE_REGISTRY: Record<AppModule, ModuleConfig> = {
  today: {
    id: 'today',
    title: 'Today',
    icon: 'Clock',
    emoji: '📅',
    description: 'Your daily schedule',
    color: 'primary',
    enabled: true,
    awardsTokens: false,
    requiresAuth: false,
    parentOnly: false,
    order: 0,
  },
  timers: {
    id: 'timers',
    title: 'Timers',
    icon: 'Clock',
    emoji: '⏱️',
    description: 'Visual countdown timers',
    color: 'secondary',
    enabled: true,
    awardsTokens: false,
    requiresAuth: false,
    parentOnly: false,
    order: 1,
  },
  reading: {
    id: 'reading',
    title: 'Reading Studio',
    icon: 'BookOpen',
    emoji: '📖',
    description: 'Phonics & decoding practice',
    color: 'calm',
    enabled: true,
    awardsTokens: true,
    requiresAuth: false,
    parentOnly: false,
    order: 2,
  },
  math: {
    id: 'math',
    title: 'Math Foundations',
    icon: 'Calculator',
    emoji: '🔢',
    description: 'Counting & number sense',
    color: 'token',
    enabled: true,
    awardsTokens: true,
    requiresAuth: false,
    parentOnly: false,
    order: 3,
  },
  writing: {
    id: 'writing',
    title: 'Writing Studio',
    icon: 'Pencil',
    emoji: '✏️',
    description: 'Letter formation practice',
    color: 'primary',
    enabled: true,
    awardsTokens: true,
    requiresAuth: false,
    parentOnly: false,
    order: 4,
  },
  science: {
    id: 'science',
    title: 'Science Lab',
    icon: 'Microscope',
    emoji: '🔬',
    description: 'Hands-on experiments',
    color: 'secondary',
    enabled: true,
    awardsTokens: false,
    requiresAuth: false,
    parentOnly: false,
    order: 5,
  },
  motor: {
    id: 'motor',
    title: 'Motor Skills',
    icon: 'Hand',
    emoji: '✋',
    description: 'Fine motor & daily living',
    color: 'muted',
    enabled: true,
    awardsTokens: false,
    requiresAuth: false,
    parentOnly: false,
    order: 6,
  },
  sensory: {
    id: 'sensory',
    title: 'Body & Sensory',
    icon: 'Brain',
    emoji: '🧠',
    description: 'Regulation & breaks',
    color: 'calm',
    enabled: true,
    awardsTokens: false,
    requiresAuth: false,
    parentOnly: false,
    order: 7,
  },
  social: {
    id: 'social',
    title: 'Social Skills',
    icon: 'Users',
    emoji: '👋',
    description: 'Turn-taking & social stories',
    color: 'secondary',
    enabled: true,
    awardsTokens: false,
    requiresAuth: false,
    parentOnly: false,
    order: 8,
  },
  bravery: {
    id: 'bravery',
    title: 'Bravery Ladder',
    icon: 'Shield',
    emoji: '🦁',
    description: 'Face fears step by step',
    color: 'token',
    enabled: true,
    awardsTokens: false,
    requiresAuth: false,
    parentOnly: false,
    order: 9,
  },
  calm: {
    id: 'calm',
    title: 'Calm Toolkit',
    icon: 'Brain',
    emoji: '🧘',
    description: 'Breathing & calming tools',
    color: 'calm',
    enabled: true,
    awardsTokens: false,
    requiresAuth: false,
    parentOnly: false,
    order: 10,
  },
  rewards: {
    id: 'rewards',
    title: 'Token Shop',
    icon: 'Gift',
    emoji: '🎁',
    description: 'Spend your earned tokens',
    color: 'token',
    enabled: true,
    awardsTokens: false,
    requiresAuth: false,
    parentOnly: false,
    order: 11,
  },
};

// Helper functions
export const getEnabledModules = (): ModuleConfig[] => {
  return Object.values(MODULE_REGISTRY)
    .filter(m => m.enabled)
    .sort((a, b) => a.order - b.order);
};

export const getTokenAwardingModules = (): ModuleConfig[] => {
  return Object.values(MODULE_REGISTRY).filter(m => m.awardsTokens);
};

export const getModuleConfig = (id: AppModule): ModuleConfig | undefined => {
  return MODULE_REGISTRY[id];
};

export const isModuleEnabled = (id: AppModule): boolean => {
  return MODULE_REGISTRY[id]?.enabled ?? false;
};

export const doesModuleAwardTokens = (id: AppModule): boolean => {
  return MODULE_REGISTRY[id]?.awardsTokens ?? false;
};

// Navigation modules (excludes 'today' and 'calm' which have special handling)
export const getNavigableModules = (): ModuleConfig[] => {
  return getEnabledModules().filter(
    m => m.id !== 'today' && m.id !== 'calm'
  );
};
