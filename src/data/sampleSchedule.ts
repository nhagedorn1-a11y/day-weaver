import { Task, Reward } from '@/types/jackos';

export interface CalmTool {
  id: string;
  title: string;
  icon: string;
  type: 'breathing' | 'sensory' | 'script' | 'body-check';
  duration?: number;
}

export const morningRoutine: Task[] = [
  {
    id: '1',
    title: 'Wake Up & Stretch',
    icon: 'calm',
    duration: 5,
    completed: false,
    tokens: 1,
    category: 'routine',
  },
  {
    id: '2',
    title: 'Breakfast Time',
    icon: 'breakfast',
    duration: 15,
    completed: false,
    tokens: 2,
    category: 'routine',
  },
  {
    id: '3',
    title: 'Brush Teeth',
    icon: 'teeth',
    duration: 3,
    completed: false,
    tokens: 1,
    category: 'routine',
  },
  {
    id: '4',
    title: 'Get Dressed',
    icon: 'dress',
    duration: 10,
    completed: false,
    tokens: 2,
    category: 'routine',
  },
  {
    id: '5',
    title: 'Pack Backpack',
    icon: 'backpack',
    duration: 5,
    completed: false,
    tokens: 1,
    category: 'routine',
  },
];

export const afterSchoolRoutine: Task[] = [
  {
    id: '6',
    title: 'Snack Break',
    icon: 'snack',
    duration: 10,
    completed: false,
    tokens: 1,
    category: 'routine',
  },
  {
    id: '7',
    title: 'Reading Time',
    icon: 'reading',
    duration: 15,
    completed: false,
    tokens: 3,
    category: 'learning',
  },
  {
    id: '8',
    title: 'Homework',
    icon: 'homework',
    duration: 20,
    completed: false,
    tokens: 3,
    category: 'learning',
  },
  {
    id: '9',
    title: 'Free Play',
    icon: 'play',
    duration: 30,
    completed: false,
    tokens: 1,
    category: 'routine',
  },
];

export const bedtimeRoutine: Task[] = [
  {
    id: '10',
    title: 'Bath Time',
    icon: 'bath',
    duration: 15,
    completed: false,
    tokens: 2,
    category: 'routine',
  },
  {
    id: '11',
    title: 'Pajamas On',
    icon: 'dress',
    duration: 5,
    completed: false,
    tokens: 1,
    category: 'routine',
  },
  {
    id: '12',
    title: 'Brush Teeth',
    icon: 'teeth',
    duration: 3,
    completed: false,
    tokens: 1,
    category: 'routine',
  },
  {
    id: '13',
    title: 'Story Time',
    icon: 'reading',
    duration: 10,
    completed: false,
    tokens: 2,
    category: 'routine',
  },
  {
    id: '14',
    title: 'Goodnight',
    icon: 'bed',
    duration: 5,
    completed: false,
    tokens: 1,
    category: 'routine',
  },
];

export const rewards: Reward[] = [
  { id: 'r1', title: '10 min screen time', icon: '📱', cost: 5, category: 'small' },
  { id: 'r2', title: 'Extra story', icon: '📚', cost: 3, category: 'small' },
  { id: 'r3', title: 'Choose dinner', icon: '🍕', cost: 10, category: 'medium' },
  { id: 'r4', title: 'Park trip', icon: '🏞️', cost: 15, category: 'medium' },
  { id: 'r5', title: 'Movie night', icon: '🎬', cost: 20, category: 'big' },
];

export const calmTools: CalmTool[] = [
  { id: 'c1', title: 'Balloon Breath', icon: '🎈', type: 'breathing', duration: 60 },
  { id: 'c2', title: 'Squeeze Ball', icon: '🔵', type: 'sensory' },
  { id: 'c3', title: 'Heavy Work', icon: '💪', type: 'sensory' },
  { id: 'c4', title: 'Body Check', icon: '🧘', type: 'body-check' },
];
