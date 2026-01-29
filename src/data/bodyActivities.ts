import { BodyActivity, BreathingExercise, MicroBreak } from '@/types/activities';

export const BODY_LANES = [
  { id: 'feelings', name: 'Feelings Radar', emoji: '🎯', color: 'bg-calm' },
  { id: 'breathing', name: 'Breathing Arcade', emoji: '🫁', color: 'bg-primary' },
  { id: 'pressure', name: 'Pressure & Calm', emoji: '🤗', color: 'bg-token' },
  { id: 'energy', name: 'Energy Meter', emoji: '⚡', color: 'bg-next' },
  { id: 'sleep', name: 'Sleep & Winddown', emoji: '🌙', color: 'bg-secondary' },
] as const;

// Body areas for feelings radar
export const BODY_AREAS = [
  { id: 'head', name: 'Head', emoji: '🧠', position: { top: '5%', left: '50%' } },
  { id: 'shoulders', name: 'Shoulders', emoji: '💪', position: { top: '20%', left: '50%' } },
  { id: 'chest', name: 'Chest', emoji: '❤️', position: { top: '30%', left: '50%' } },
  { id: 'tummy', name: 'Tummy', emoji: '🦋', position: { top: '45%', left: '50%' } },
  { id: 'hands', name: 'Hands', emoji: '🖐️', position: { top: '55%', left: '25%' } },
  { id: 'legs', name: 'Legs', emoji: '🦵', position: { top: '70%', left: '50%' } },
];

// Feeling words mapped to needs
export const FEELINGS_MAP = [
  { feeling: 'tight', emoji: '😤', need: 'movement', suggestion: 'Try some stretches or movement' },
  { feeling: 'hot', emoji: '🥵', need: 'cool', suggestion: 'Get some water or fresh air' },
  { feeling: 'wiggly', emoji: '🐛', need: 'movement', suggestion: 'Time for a movement break!' },
  { feeling: 'heavy', emoji: '😴', need: 'rest', suggestion: 'Maybe rest or a quiet activity' },
  { feeling: 'buzzy', emoji: '⚡', need: 'calm', suggestion: 'Try deep breathing or pressure' },
  { feeling: 'cold', emoji: '🥶', need: 'warm', suggestion: 'Get a blanket or move around' },
  { feeling: 'hungry', emoji: '🍎', need: 'food', suggestion: 'Time for a healthy snack' },
  { feeling: 'thirsty', emoji: '💧', need: 'water', suggestion: 'Drink some water' },
  { feeling: 'uncomfortable', emoji: '😣', need: 'check', suggestion: 'Check your clothes, temperature' },
  { feeling: 'just right', emoji: '😊', need: 'none', suggestion: 'Your body feels good!' },
];

// 6 Breathing exercises
export const breathingExercises: BreathingExercise[] = [
  {
    id: 'balloon-breaths',
    title: 'Balloon Breaths',
    emoji: '🎈',
    description: 'Breathe in to blow up the balloon, breathe out to let air out slowly',
    pattern: { inhale: 4, exhale: 6 },
    visualType: 'balloon',
    difficulty: 1,
  },
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    emoji: '⬜',
    description: 'Breathe along the sides of the box: in, hold, out, hold',
    pattern: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    visualType: 'box',
    difficulty: 2,
  },
  {
    id: 'dragon-breath',
    title: 'Dragon Breath',
    emoji: '🐉',
    description: 'Breathe in deeply, then slowly breathe out like a dragon cooling lava',
    pattern: { inhale: 3, exhale: 8 },
    visualType: 'dragon',
    difficulty: 1,
  },
  {
    id: 'wave-breath',
    title: 'Ocean Waves',
    emoji: '🌊',
    description: 'Breathe with the waves - in as they come, out as they go',
    pattern: { inhale: 4, exhale: 4 },
    visualType: 'wave',
    difficulty: 1,
  },
  {
    id: 'flower-breath',
    title: 'Smell the Flower',
    emoji: '🌸',
    description: 'Breathe in to smell the flower, breathe out to blow a dandelion',
    pattern: { inhale: 3, exhale: 5 },
    visualType: 'flower',
    difficulty: 1,
  },
  {
    id: 'calm-countdown',
    title: 'Calm Countdown',
    emoji: '🔢',
    description: 'Count back from 5 with each breath, getting calmer each time',
    pattern: { inhale: 3, hold: 2, exhale: 4 },
    visualType: 'box',
    difficulty: 2,
  },
];

// 25 Micro-breaks (2-5 minutes)
export const microBreaks: MicroBreak[] = [
  // Calming breaks (9)
  {
    id: 'mb-wall-push',
    title: 'Wall Pushes',
    emoji: '🧱',
    duration: 60,
    instructions: ['Stand arm-length from wall', 'Push hard for 10 seconds', 'Rest and repeat 5 times'],
    energyType: 'calming',
    bodyFocus: ['arms', 'shoulders'],
    quietMode: true,
  },
  {
    id: 'mb-chair-squeeze',
    title: 'Chair Squeeze',
    emoji: '🪑',
    duration: 45,
    instructions: ['Sit in your chair', 'Push down on the seat with your hands', 'Hold for 10 seconds, repeat'],
    energyType: 'calming',
    bodyFocus: ['arms', 'core'],
    quietMode: true,
  },
  {
    id: 'mb-bear-hug',
    title: 'Bear Hug',
    emoji: '🐻',
    duration: 30,
    instructions: ['Cross your arms', 'Give yourself a big squeeze', 'Hold and breathe'],
    energyType: 'calming',
    bodyFocus: ['chest', 'arms'],
    quietMode: true,
  },
  {
    id: 'mb-pillow-squish',
    title: 'Pillow Squish',
    emoji: '🛋️',
    duration: 60,
    instructions: ['Grab a pillow', 'Squeeze it as tight as you can', 'Count to 10, release, repeat'],
    energyType: 'calming',
    bodyFocus: ['arms', 'hands'],
    quietMode: true,
  },
  {
    id: 'mb-turtle-shell',
    title: 'Turtle Shell',
    emoji: '🐢',
    duration: 45,
    instructions: ['Curl up in a ball', 'Hide like a turtle', 'Breathe slowly for 30 seconds'],
    energyType: 'calming',
    bodyFocus: ['whole body'],
    quietMode: true,
  },
  {
    id: 'mb-heavy-hands',
    title: 'Heavy Hands',
    emoji: '🤲',
    duration: 60,
    instructions: ['Put your hands on your thighs', 'Press down firmly', 'Feel the heaviness'],
    energyType: 'calming',
    bodyFocus: ['hands', 'legs'],
    quietMode: true,
  },
  {
    id: 'mb-shoulder-shrugs',
    title: 'Shoulder Shrugs',
    emoji: '🤷',
    duration: 45,
    instructions: ['Lift shoulders to your ears', 'Hold for 5 seconds', 'Drop and relax'],
    energyType: 'calming',
    bodyFocus: ['shoulders', 'neck'],
    quietMode: true,
  },
  {
    id: 'mb-ragdoll',
    title: 'Ragdoll Flop',
    emoji: '🧸',
    duration: 30,
    instructions: ['Stand up', 'Flop forward like a ragdoll', 'Hang and sway gently'],
    energyType: 'calming',
    bodyFocus: ['back', 'legs'],
    quietMode: true,
  },
  {
    id: 'mb-ice-cube',
    title: 'Ice Cube Melt',
    emoji: '🧊',
    duration: 60,
    instructions: ['Tense your whole body tight', 'Pretend youre a frozen ice cube', 'Slowly melt and relax everything'],
    energyType: 'calming',
    bodyFocus: ['whole body'],
    quietMode: true,
  },

  // Alerting breaks (8)
  {
    id: 'mb-jumping-jacks',
    title: 'Jumping Jacks',
    emoji: '⭐',
    duration: 60,
    instructions: ['Do 10 jumping jacks', 'Count out loud', 'Feel your heart pump!'],
    energyType: 'alerting',
    bodyFocus: ['whole body'],
    quietMode: false,
  },
  {
    id: 'mb-power-pose',
    title: 'Power Pose',
    emoji: '🦸',
    duration: 30,
    instructions: ['Stand like a superhero', 'Hands on hips, chest out', 'Hold for 30 seconds'],
    energyType: 'alerting',
    bodyFocus: ['chest', 'core'],
    quietMode: true,
  },
  {
    id: 'mb-shake-it',
    title: 'Shake It Out',
    emoji: '💃',
    duration: 45,
    instructions: ['Shake your hands', 'Shake your arms', 'Shake your whole body!'],
    energyType: 'alerting',
    bodyFocus: ['whole body'],
    quietMode: false,
  },
  {
    id: 'mb-march',
    title: 'March in Place',
    emoji: '🚶',
    duration: 60,
    instructions: ['March like a soldier', 'Lift those knees high', 'Swing your arms'],
    energyType: 'alerting',
    bodyFocus: ['legs', 'arms'],
    quietMode: false,
  },
  {
    id: 'mb-toe-touches',
    title: 'Toe Touches',
    emoji: '🦶',
    duration: 45,
    instructions: ['Reach for your toes', 'Touch and stand back up', 'Repeat 10 times'],
    energyType: 'alerting',
    bodyFocus: ['legs', 'back'],
    quietMode: true,
  },
  {
    id: 'mb-arm-circles',
    title: 'Arm Circles',
    emoji: '🔄',
    duration: 45,
    instructions: ['Stretch arms out wide', 'Make small circles', 'Make them bigger!'],
    energyType: 'alerting',
    bodyFocus: ['arms', 'shoulders'],
    quietMode: true,
  },
  {
    id: 'mb-hop-spot',
    title: 'Hop on Spot',
    emoji: '🐰',
    duration: 45,
    instructions: ['Hop in place like a bunny', 'Count to 20', 'Land softly'],
    energyType: 'alerting',
    bodyFocus: ['legs'],
    quietMode: false,
  },
  {
    id: 'mb-star-jumps',
    title: 'Star Jumps',
    emoji: '🌟',
    duration: 60,
    instructions: ['Jump and spread out like a star', 'Arms and legs wide', 'Do 10 star jumps'],
    energyType: 'alerting',
    bodyFocus: ['whole body'],
    quietMode: false,
  },

  // Organizing breaks (8)
  {
    id: 'mb-cross-crawl',
    title: 'Cross Crawl',
    emoji: '✖️',
    duration: 60,
    instructions: ['Touch right knee with left hand', 'Then left knee with right hand', 'Alternate 10 times each'],
    energyType: 'organizing',
    bodyFocus: ['whole body'],
    quietMode: true,
  },
  {
    id: 'mb-finger-maze',
    title: 'Finger Maze',
    emoji: '🤞',
    duration: 60,
    instructions: ['Touch thumb to each finger', 'Go forward and backward', 'Try with eyes closed'],
    energyType: 'organizing',
    bodyFocus: ['hands'],
    quietMode: true,
  },
  {
    id: 'mb-balance-statue',
    title: 'Balance Statue',
    emoji: '🧍',
    duration: 45,
    instructions: ['Stand on one foot', 'Be a statue for 15 seconds', 'Switch feet'],
    energyType: 'organizing',
    bodyFocus: ['legs', 'core'],
    quietMode: true,
  },
  {
    id: 'mb-slow-motion',
    title: 'Slow Motion',
    emoji: '🐌',
    duration: 60,
    instructions: ['Do everything in slow motion', 'Raise your arm super slowly', 'Move like youre in honey'],
    energyType: 'organizing',
    bodyFocus: ['whole body'],
    quietMode: true,
  },
  {
    id: 'mb-eye-track',
    title: 'Eye Tracking',
    emoji: '👀',
    duration: 45,
    instructions: ['Follow your thumb with your eyes', 'Move it left, right, up, down', 'Keep your head still'],
    energyType: 'organizing',
    bodyFocus: ['eyes'],
    quietMode: true,
  },
  {
    id: 'mb-toe-wiggle',
    title: 'Toe Wiggles',
    emoji: '🦶',
    duration: 30,
    instructions: ['Take off your shoes if you can', 'Wiggle each toe individually', 'Spread them wide'],
    energyType: 'organizing',
    bodyFocus: ['feet'],
    quietMode: true,
  },
  {
    id: 'mb-jaw-relax',
    title: 'Jaw Relaxer',
    emoji: '😮',
    duration: 30,
    instructions: ['Open your mouth wide', 'Move your jaw side to side', 'Massage your cheeks'],
    energyType: 'organizing',
    bodyFocus: ['face'],
    quietMode: true,
  },
  {
    id: 'mb-spine-twist',
    title: 'Gentle Twist',
    emoji: '🔄',
    duration: 45,
    instructions: ['Sit up straight', 'Slowly twist to look behind you', 'Hold, then switch sides'],
    energyType: 'organizing',
    bodyFocus: ['back', 'core'],
    quietMode: true,
  },
];

// 10 Longer routines (10-15 minutes)
export const longerRoutines = [
  {
    id: 'routine-morning-wake',
    title: 'Morning Wake-Up',
    emoji: '🌅',
    duration: 10,
    description: 'Gentle routine to start your day',
    steps: ['mb-arm-circles', 'mb-shoulder-shrugs', 'mb-cross-crawl', 'mb-power-pose', 'balloon-breaths'],
  },
  {
    id: 'routine-calm-down',
    title: 'Calm Down Sequence',
    emoji: '🧘',
    duration: 10,
    description: 'When feelings are big',
    steps: ['mb-bear-hug', 'dragon-breath', 'mb-turtle-shell', 'mb-ice-cube', 'box-breathing'],
  },
  {
    id: 'routine-energy-boost',
    title: 'Energy Boost',
    emoji: '⚡',
    duration: 10,
    description: 'When you need to wake up your body',
    steps: ['mb-jumping-jacks', 'mb-shake-it', 'mb-star-jumps', 'mb-march', 'wave-breath'],
  },
  {
    id: 'routine-focus-time',
    title: 'Focus Prep',
    emoji: '🎯',
    duration: 10,
    description: 'Before homework or learning',
    steps: ['mb-cross-crawl', 'mb-eye-track', 'box-breathing', 'mb-balance-statue', 'mb-finger-maze'],
  },
  {
    id: 'routine-bedtime',
    title: 'Bedtime Wind-Down',
    emoji: '🌙',
    duration: 15,
    description: 'Get ready for sleep',
    steps: ['mb-ragdoll', 'mb-shoulder-shrugs', 'mb-ice-cube', 'dragon-breath', 'wave-breath'],
  },
  {
    id: 'routine-anxiety-helper',
    title: 'Worry Helper',
    emoji: '💙',
    duration: 10,
    description: 'When worries feel big',
    steps: ['mb-wall-push', 'box-breathing', 'mb-bear-hug', 'mb-heavy-hands', 'calm-countdown'],
  },
  {
    id: 'routine-wiggles',
    title: 'Get the Wiggles Out',
    emoji: '🐛',
    duration: 10,
    description: 'When your body wont sit still',
    steps: ['mb-jumping-jacks', 'mb-hop-spot', 'mb-shake-it', 'mb-wall-push', 'mb-chair-squeeze'],
  },
  {
    id: 'routine-after-school',
    title: 'After School Reset',
    emoji: '🏠',
    duration: 10,
    description: 'Transition from school to home',
    steps: ['mb-shake-it', 'mb-pillow-squish', 'balloon-breaths', 'mb-ragdoll', 'mb-slow-motion'],
  },
  {
    id: 'routine-frustrated',
    title: 'Frustration Release',
    emoji: '😤',
    duration: 10,
    description: 'When things feel too hard',
    steps: ['mb-wall-push', 'mb-pillow-squish', 'dragon-breath', 'mb-shake-it', 'mb-bear-hug'],
  },
  {
    id: 'routine-sensory-diet',
    title: 'Sensory Snack',
    emoji: '🎪',
    duration: 15,
    description: 'A full sensory reset',
    steps: ['mb-spinning', 'mb-wall-push', 'mb-bear-hug', 'mb-slow-motion', 'mb-balance-statue', 'box-breathing'],
  },
];

// Energy level recommendations
export const energyRecommendations = {
  low: {
    breaks: microBreaks.filter(b => b.energyType === 'alerting').slice(0, 5),
    description: 'Alerting activities to wake up your body',
    color: 'bg-next',
  },
  'just-right': {
    breaks: microBreaks.filter(b => b.energyType === 'organizing').slice(0, 5),
    description: 'Organizing activities to stay focused',
    color: 'bg-calm',
  },
  high: {
    breaks: microBreaks.filter(b => b.energyType === 'calming').slice(0, 5),
    description: 'Calming activities to settle down',
    color: 'bg-primary',
  },
};

// Helper functions
export function getBreaksByType(type: 'calming' | 'alerting' | 'organizing'): MicroBreak[] {
  return microBreaks.filter(b => b.energyType === type);
}

export function getQuietBreaks(): MicroBreak[] {
  return microBreaks.filter(b => b.quietMode);
}

export function getBreathingById(id: string): BreathingExercise | undefined {
  return breathingExercises.find(b => b.id === id);
}

export function getBreakById(id: string): MicroBreak | undefined {
  return microBreaks.find(b => b.id === id);
}
