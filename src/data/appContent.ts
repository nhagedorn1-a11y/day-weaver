import { ModuleInfo, PraisePhrase, SupportiveStatement, HeavyWorkActivity, InteroceptionCheck, ADLRoutine } from '@/types/jackos';

export const appModules: ModuleInfo[] = [
  { id: 'today', title: 'Today', icon: '📋', description: 'Now / Next / Later', color: 'primary' },
  { id: 'timers', title: 'Timers', icon: '⏱️', description: 'Visual timers', color: 'next' },
  { id: 'reading', title: 'Reading', icon: '📖', description: 'OG Reading Studio', color: 'calm' },
  { id: 'math', title: 'Math', icon: '🔢', description: 'Number sense games', color: 'next' },
  { id: 'motor', title: 'Writing', icon: '✏️', description: 'Letters & ADLs', color: 'token' },
  { id: 'sensory', title: 'Body', icon: '🧘', description: 'Regulation & breaks', color: 'calm' },
  { id: 'social', title: 'Social', icon: '👋', description: 'Stories & play', color: 'next' },
  { id: 'bravery', title: 'Bravery', icon: '🦁', description: 'OCD ladder', color: 'token' },
  { id: 'rewards', title: 'Rewards', icon: '⭐', description: 'Token store', color: 'token' },
];

export const praiseLibrary: PraisePhrase[] = [
  // Effort
  { id: 'p1', phrase: "You worked so hard on that!", category: 'effort' },
  { id: 'p2', phrase: "I love how hard you tried!", category: 'effort' },
  { id: 'p3', phrase: "You really put in effort!", category: 'effort' },
  // Persistence
  { id: 'p4', phrase: "You kept going even when it was hard!", category: 'persistence' },
  { id: 'p5', phrase: "You didn't give up!", category: 'persistence' },
  { id: 'p6', phrase: "Wow, you stuck with it!", category: 'persistence' },
  // Flexibility
  { id: 'p7', phrase: "Great job being flexible!", category: 'flexibility' },
  { id: 'p8', phrase: "You handled that change so well!", category: 'flexibility' },
  { id: 'p9', phrase: "You went with the flow!", category: 'flexibility' },
  // Bravery
  { id: 'p10', phrase: "That was so brave!", category: 'bravery' },
  { id: 'p11', phrase: "You faced your worry!", category: 'bravery' },
  { id: 'p12', phrase: "You're getting braver every day!", category: 'bravery' },
  // Trying
  { id: 'p13', phrase: "You gave it a try!", category: 'trying' },
  { id: 'p14', phrase: "Starting is the hardest part, and you did it!", category: 'trying' },
  { id: 'p15', phrase: "You took the first step!", category: 'trying' },
];

export const supportiveStatements: SupportiveStatement[] = [
  // Validate
  { id: 's1', type: 'validate', text: "It makes sense you feel that way." },
  { id: 's2', type: 'validate', text: "I hear you. That's hard." },
  { id: 's3', type: 'validate', text: "Your feelings are real." },
  { id: 's4', type: 'validate', text: "I understand this is tricky for you." },
  // Confidence
  { id: 's5', type: 'confidence', text: "I believe you can handle this." },
  { id: 's6', type: 'confidence', text: "You've done hard things before." },
  { id: 's7', type: 'confidence', text: "You're stronger than you think." },
  { id: 's8', type: 'confidence', text: "I know you can get through this." },
  // Cope
  { id: 's9', type: 'cope', text: "Let's take a breath together." },
  { id: 's10', type: 'cope', text: "We can try a different way." },
  { id: 's11', type: 'cope', text: "This feeling will pass." },
  { id: 's12', type: 'cope', text: "What helped last time?" },
];

// Reassurance limiter script
export const reassuranceLimiterScript = 
  "I can't answer that again, but I can help you cope. Let's try something else.";

// Naughty Mr. Alien scripts (OCD externalization)
export const alienScripts = [
  "That's just Naughty Mr. Alien talking!",
  "Mr. Alien is being tricky again.",
  "We don't have to listen to Mr. Alien.",
  "Mr. Alien wants us to worry, but we're brave.",
  "Bye bye, Mr. Alien. We're not playing your game.",
];

export const heavyWorkActivities: HeavyWorkActivity[] = [
  { id: 'hw1', title: 'Wall Pushes', icon: '🧱', duration: 30, description: 'Push against the wall 10 times' },
  { id: 'hw2', title: 'Bear Walk', icon: '🐻', duration: 60, description: 'Walk like a bear across the room' },
  { id: 'hw3', title: 'Crab Walk', icon: '🦀', duration: 60, description: 'Walk like a crab across the room' },
  { id: 'hw4', title: 'Carry Laundry', icon: '🧺', duration: 120, description: 'Carry the laundry basket' },
  { id: 'hw5', title: 'Squeeze Ball', icon: '🔵', duration: 60, description: 'Squeeze the ball 20 times' },
  { id: 'hw6', title: 'Knead Dough', icon: '🍞', duration: 180, description: 'Knead playdough or bread dough' },
  { id: 'hw7', title: 'Push Chair', icon: '🪑', duration: 30, description: 'Push heavy chair across room' },
  { id: 'hw8', title: 'Wheelbarrow', icon: '🏃', duration: 60, description: 'Wheelbarrow walk with helper' },
];

export const interoceptionChecks: InteroceptionCheck[] = [
  { id: 'ic1', area: 'water', icon: '💧', prompt: 'Do you need water?' },
  { id: 'ic2', area: 'bathroom', icon: '🚽', prompt: 'Do you need the bathroom?' },
  { id: 'ic3', area: 'temperature', icon: '🌡️', prompt: 'Are you too hot or cold?' },
  { id: 'ic4', area: 'hunger', icon: '🍎', prompt: 'Is your tummy hungry?' },
  { id: 'ic5', area: 'tired', icon: '😴', prompt: 'Is your body tired?' },
];

export const adlRoutines: ADLRoutine[] = [
  {
    id: 'adl1',
    title: 'Button Shirt',
    icon: '👕',
    microSteps: [
      'Find the top button',
      'Hold the button',
      'Find the hole',
      'Push button through',
      'Pull it snug',
      'Move to next button',
    ],
    currentStep: 0,
    tokensPerStep: 1,
  },
  {
    id: 'adl2',
    title: 'Tie Shoes',
    icon: '👟',
    microSteps: [
      'Cross the laces',
      'Pull one under',
      'Pull tight',
      'Make a loop',
      'Wrap other lace',
      'Push through hole',
      'Pull both loops',
    ],
    currentStep: 0,
    tokensPerStep: 1,
  },
  {
    id: 'adl3',
    title: 'Zip Jacket',
    icon: '🧥',
    microSteps: [
      'Hold the jacket open',
      'Find the zipper end',
      'Put it in the slot',
      'Hold the bottom',
      'Pull the zipper up',
    ],
    currentStep: 0,
    tokensPerStep: 1,
  },
];

// Letter formation progression
export const letterOrder = 'ltiLITFEHocadgqmnhbprBPRDnskuyjfwzxvcWVXZQSCGJMAKNUYeOQ'.split('');

// Self-talk prompts
export const selfTalkPrompts = {
  first: { label: 'First', color: 'primary', prompt: 'What do I do first?' },
  next: { label: 'Next', color: 'next', prompt: 'What comes next?' },
  check: { label: 'Check', color: 'calm', prompt: 'Did I do it right?' },
  tryAgain: { label: 'Try Again', color: 'token', prompt: "That's okay, let's try again!" },
};
