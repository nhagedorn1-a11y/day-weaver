import { MotorActivity, ADLMission, FineMotorGame } from '@/types/activities';

export const MOTOR_LANES = [
  { id: 'fine-motor', name: 'Fine Motor Forge', emoji: '✋', color: 'bg-token' },
  { id: 'handwriting', name: 'Handwriting Helpers', emoji: '✏️', color: 'bg-primary' },
  { id: 'adl', name: 'ADL Missions', emoji: '👕', color: 'bg-calm' },
  { id: 'balance', name: 'Balance & Coordination', emoji: '🤸', color: 'bg-next' },
  { id: 'bilateral', name: 'Bilateral Skills', emoji: '👐', color: 'bg-secondary' },
] as const;

// Fine motor games (10)
export const fineMotorGames: FineMotorGame[] = [
  {
    id: 'fm-pinch-gems',
    title: 'Pinch & Place Gems',
    emoji: '💎',
    gameType: 'pinch',
    difficulty: 1,
    adaptiveDifficulty: true,
    instructions: ['Pick up the gem', 'Place it in the matching slot', 'Use your pointer finger and thumb'],
  },
  {
    id: 'fm-trace-trails',
    title: 'Trace Trails',
    emoji: '🛤️',
    gameType: 'trace',
    difficulty: 2,
    adaptiveDifficulty: true,
    instructions: ['Put your finger on the start', 'Follow the path', 'Try not to go off the trail'],
  },
  {
    id: 'fm-scissors-sim',
    title: 'Snip Snip',
    emoji: '✂️',
    gameType: 'cut',
    difficulty: 2,
    adaptiveDifficulty: true,
    instructions: ['Tap along the dotted line', 'Cut the shape out', 'Stay on the dots'],
  },
  {
    id: 'fm-bead-string',
    title: 'Bead Stringer',
    emoji: '📿',
    gameType: 'drag',
    difficulty: 2,
    adaptiveDifficulty: true,
    instructions: ['Drag the bead to the string', 'Thread it through the hole', 'Make a pattern'],
  },
  {
    id: 'fm-peg-board',
    title: 'Peg Board Fun',
    emoji: '🔘',
    gameType: 'pinch',
    difficulty: 1,
    adaptiveDifficulty: true,
    instructions: ['Pick up the peg', 'Put it in the hole', 'Copy the pattern'],
  },
  {
    id: 'fm-sticker-place',
    title: 'Sticker Spots',
    emoji: '⭐',
    gameType: 'drag',
    difficulty: 1,
    adaptiveDifficulty: true,
    instructions: ['Drag the sticker', 'Put it on the outline', 'Fill in the picture'],
  },
  {
    id: 'fm-maze-finger',
    title: 'Finger Maze',
    emoji: '🌀',
    gameType: 'trace',
    difficulty: 3,
    adaptiveDifficulty: true,
    instructions: ['Start at the beginning', 'Find your way through', 'Dont hit the walls'],
  },
  {
    id: 'fm-dot-connect',
    title: 'Dot to Dot',
    emoji: '🔢',
    gameType: 'trace',
    difficulty: 2,
    adaptiveDifficulty: true,
    instructions: ['Start at number 1', 'Connect to number 2', 'See the picture appear'],
  },
  {
    id: 'fm-coin-drop',
    title: 'Coin Drop',
    emoji: '🪙',
    gameType: 'pinch',
    difficulty: 2,
    adaptiveDifficulty: true,
    instructions: ['Pick up the coin', 'Drop it in the slot', 'Use pincer grip'],
  },
  {
    id: 'fm-button-push',
    title: 'Button Pusher',
    emoji: '🔴',
    gameType: 'tap',
    difficulty: 1,
    adaptiveDifficulty: true,
    instructions: ['Push the button', 'Watch what happens', 'Try different buttons'],
  },
];

// ADL Missions (12)
export const adlMissions: ADLMission[] = [
  {
    id: 'adl-socks',
    title: 'Sock Quest',
    emoji: '🧦',
    category: 'dressing',
    tokenPerStep: 1,
    totalTime: 5,
    steps: [
      { instruction: 'Find matching socks', visualCue: '👀🧦🧦', completed: false },
      { instruction: 'Scrunch sock into a ball', visualCue: '✊🧦', completed: false },
      { instruction: 'Put toes in first', visualCue: '🦶➡️🧦', completed: false },
      { instruction: 'Pull sock up over heel', visualCue: '⬆️🦶', completed: false },
      { instruction: 'Pull sock all the way up', visualCue: '🧦✨', completed: false },
    ],
  },
  {
    id: 'adl-teeth',
    title: 'Brush Teeth Run',
    emoji: '🪥',
    category: 'hygiene',
    tokenPerStep: 1,
    totalTime: 3,
    steps: [
      { instruction: 'Wet your toothbrush', visualCue: '💧🪥', completed: false },
      { instruction: 'Put toothpaste on (pea size)', visualCue: '🟢🪥', completed: false },
      { instruction: 'Brush top teeth outsides', visualCue: '⬆️😁', completed: false },
      { instruction: 'Brush bottom teeth outsides', visualCue: '⬇️😁', completed: false },
      { instruction: 'Brush chewing surfaces', visualCue: '↔️🦷', completed: false },
      { instruction: 'Brush tongue gently', visualCue: '👅', completed: false },
      { instruction: 'Rinse and spit', visualCue: '💦😮', completed: false },
    ],
  },
  {
    id: 'adl-backpack',
    title: 'Backpack Pack',
    emoji: '🎒',
    category: 'organizing',
    tokenPerStep: 1,
    totalTime: 5,
    steps: [
      { instruction: 'Get your checklist', visualCue: '📋', completed: false },
      { instruction: 'Find homework folder', visualCue: '📂', completed: false },
      { instruction: 'Put folder in big pocket', visualCue: '📂➡️🎒', completed: false },
      { instruction: 'Find lunch box', visualCue: '🥪', completed: false },
      { instruction: 'Put lunch in bag', visualCue: '🥪➡️🎒', completed: false },
      { instruction: 'Check water bottle', visualCue: '💧✅', completed: false },
      { instruction: 'Zip it up!', visualCue: '🤐🎒', completed: false },
    ],
  },
  {
    id: 'adl-buttons',
    title: 'Button Master',
    emoji: '👔',
    category: 'dressing',
    tokenPerStep: 1,
    totalTime: 5,
    steps: [
      { instruction: 'Find the top button', visualCue: '👀🔘', completed: false },
      { instruction: 'Hold button with one hand', visualCue: '✊🔘', completed: false },
      { instruction: 'Find the buttonhole', visualCue: '👀⭕', completed: false },
      { instruction: 'Push button through hole', visualCue: '🔘➡️⭕', completed: false },
      { instruction: 'Pull button all the way', visualCue: '🔘✅', completed: false },
      { instruction: 'Move to next button', visualCue: '⬇️🔘', completed: false },
    ],
  },
  {
    id: 'adl-shoes',
    title: 'Shoe Tie Challenge',
    emoji: '👟',
    category: 'dressing',
    tokenPerStep: 1,
    totalTime: 5,
    steps: [
      { instruction: 'Cross the laces (make an X)', visualCue: '❌', completed: false },
      { instruction: 'Pull one lace under', visualCue: '⬇️', completed: false },
      { instruction: 'Pull both ends tight', visualCue: '↔️', completed: false },
      { instruction: 'Make a bunny ear loop', visualCue: '🐰👂', completed: false },
      { instruction: 'Wrap other lace around', visualCue: '🔄', completed: false },
      { instruction: 'Push through the hole', visualCue: '➡️⭕', completed: false },
      { instruction: 'Pull both loops tight', visualCue: '🎀✅', completed: false },
    ],
  },
  {
    id: 'adl-zipper',
    title: 'Zipper Hero',
    emoji: '🧥',
    category: 'dressing',
    tokenPerStep: 1,
    totalTime: 3,
    steps: [
      { instruction: 'Hold jacket open', visualCue: '🧥↔️', completed: false },
      { instruction: 'Find the zipper end', visualCue: '👀🔽', completed: false },
      { instruction: 'Put pin in the slider', visualCue: '📍➡️', completed: false },
      { instruction: 'Hold the bottom', visualCue: '✊⬇️', completed: false },
      { instruction: 'Pull zipper up!', visualCue: '⬆️✨', completed: false },
    ],
  },
  {
    id: 'adl-hair',
    title: 'Hair Brush Pro',
    emoji: '💇',
    category: 'hygiene',
    tokenPerStep: 1,
    totalTime: 3,
    steps: [
      { instruction: 'Hold the brush', visualCue: '✊🪮', completed: false },
      { instruction: 'Start at the ends', visualCue: '⬇️🪮', completed: false },
      { instruction: 'Work up to the top', visualCue: '⬆️🪮', completed: false },
      { instruction: 'Brush the sides', visualCue: '↔️🪮', completed: false },
      { instruction: 'Check the back', visualCue: '🔙🪮', completed: false },
    ],
  },
  {
    id: 'adl-wash-face',
    title: 'Face Wash',
    emoji: '🧼',
    category: 'hygiene',
    tokenPerStep: 1,
    totalTime: 3,
    steps: [
      { instruction: 'Turn on warm water', visualCue: '🚰💧', completed: false },
      { instruction: 'Wet your hands', visualCue: '🙌💧', completed: false },
      { instruction: 'Splash water on face', visualCue: '💦😊', completed: false },
      { instruction: 'Put soap on hands', visualCue: '🧴🙌', completed: false },
      { instruction: 'Gently rub face', visualCue: '🔄😊', completed: false },
      { instruction: 'Rinse face well', visualCue: '💦😊', completed: false },
      { instruction: 'Pat dry with towel', visualCue: '🧣✅', completed: false },
    ],
  },
  {
    id: 'adl-utensils',
    title: 'Fork & Knife Skills',
    emoji: '🍽️',
    category: 'eating',
    tokenPerStep: 1,
    totalTime: 5,
    steps: [
      { instruction: 'Hold fork in left hand', visualCue: '🍴←', completed: false },
      { instruction: 'Hold knife in right hand', visualCue: '🔪→', completed: false },
      { instruction: 'Press fork down to hold food', visualCue: '⬇️🍴', completed: false },
      { instruction: 'Saw with knife gently', visualCue: '↔️🔪', completed: false },
      { instruction: 'Cut a small piece', visualCue: '✂️🍖', completed: false },
      { instruction: 'Bring fork to mouth', visualCue: '🍴➡️😋', completed: false },
    ],
  },
  {
    id: 'adl-pouring',
    title: 'Pour Perfect',
    emoji: '🥛',
    category: 'eating',
    tokenPerStep: 1,
    totalTime: 3,
    steps: [
      { instruction: 'Put cup on flat surface', visualCue: '🥤⬇️', completed: false },
      { instruction: 'Hold bottle with two hands', visualCue: '✊🍼✊', completed: false },
      { instruction: 'Tip slowly toward cup', visualCue: '↘️🥤', completed: false },
      { instruction: 'Watch the level', visualCue: '👀📊', completed: false },
      { instruction: 'Stop before overflow', visualCue: '✋🛑', completed: false },
      { instruction: 'Set bottle down', visualCue: '🍼⬇️', completed: false },
    ],
  },
  {
    id: 'adl-desk-tidy',
    title: 'Desk Tidy-Up',
    emoji: '📚',
    category: 'organizing',
    tokenPerStep: 1,
    totalTime: 5,
    steps: [
      { instruction: 'Put pencils in cup', visualCue: '✏️➡️🥤', completed: false },
      { instruction: 'Stack papers neatly', visualCue: '📄📄📄', completed: false },
      { instruction: 'Put books on shelf', visualCue: '📚➡️📖', completed: false },
      { instruction: 'Throw away trash', visualCue: '🗑️', completed: false },
      { instruction: 'Wipe desk surface', visualCue: '🧹✨', completed: false },
    ],
  },
  {
    id: 'adl-bed-make',
    title: 'Bed Making',
    emoji: '🛏️',
    category: 'organizing',
    tokenPerStep: 1,
    totalTime: 5,
    steps: [
      { instruction: 'Pull sheet flat', visualCue: '↔️🛏️', completed: false },
      { instruction: 'Tuck sheet at bottom', visualCue: '⬇️📦', completed: false },
      { instruction: 'Pull blanket up', visualCue: '⬆️🛏️', completed: false },
      { instruction: 'Smooth out bumps', visualCue: '👋🛏️', completed: false },
      { instruction: 'Put pillow at top', visualCue: '🛋️⬆️', completed: false },
      { instruction: 'Add stuffed animal', visualCue: '🧸✨', completed: false },
    ],
  },
];

// Balance & coordination activities (8)
export const balanceActivities = [
  {
    id: 'bal-leader',
    title: 'Follow the Leader',
    emoji: '🚶',
    instructions: ['Copy the moves you see', 'Hop, march, reach!', 'Try to keep up'],
    difficulty: 2,
    moves: ['hop', 'march', 'reach up', 'squat', 'balance', 'spin'],
  },
  {
    id: 'bal-rhythm',
    title: 'Rhythm Tap',
    emoji: '🥁',
    instructions: ['Listen to the beat', 'Tap when you hear it', 'Keep the rhythm going'],
    difficulty: 2,
    speedLevels: [60, 90, 120], // BPM
  },
  {
    id: 'bal-arrows',
    title: 'Left/Right Spacewalk',
    emoji: '🚀',
    instructions: ['See the arrow direction', 'Move that way', 'Dont fall off the spaceship!'],
    difficulty: 1,
  },
  {
    id: 'bal-statue',
    title: 'Freeze Dance',
    emoji: '🕺',
    instructions: ['Dance when music plays', 'Freeze when it stops', 'Hold your pose!'],
    difficulty: 1,
  },
  {
    id: 'bal-obstacle',
    title: 'Floor Obstacle Course',
    emoji: '🏃',
    instructions: ['Step over pillows', 'Walk on the tape line', 'Crawl under the blanket tent'],
    difficulty: 3,
  },
  {
    id: 'bal-yoga',
    title: 'Animal Yoga',
    emoji: '🐻',
    instructions: ['Pose like a tree', 'Stand like a flamingo', 'Stretch like a cat'],
    difficulty: 2,
    poses: ['tree', 'flamingo', 'cat', 'dog', 'cobra', 'butterfly'],
  },
  {
    id: 'bal-catch',
    title: 'Balloon Tap',
    emoji: '🎈',
    instructions: ['Keep balloon in the air', 'Tap it gently', 'Dont let it touch the ground'],
    difficulty: 2,
  },
  {
    id: 'bal-target',
    title: 'Bean Bag Toss',
    emoji: '🎯',
    instructions: ['Aim for the target', 'Toss underhand', 'Score points for hitting zones'],
    difficulty: 2,
  },
];

// Bilateral coordination activities (4)
export const bilateralActivities = [
  {
    id: 'bi-hold-drag',
    title: 'Two-Hand Build',
    emoji: '🧱',
    instructions: ['Hold with one finger', 'Drag with the other', 'Build together!'],
    difficulty: 2,
  },
  {
    id: 'bi-clap',
    title: 'Clap Patterns',
    emoji: '👏',
    instructions: ['Watch the pattern', 'Copy the claps', 'Get faster each round'],
    difficulty: 2,
    patterns: ['clap clap', 'clap clap pause', 'clap pause clap clap', 'clap snap clap snap'],
  },
  {
    id: 'bi-cross',
    title: 'Cross the Midline',
    emoji: '✖️',
    instructions: ['Touch right knee with left hand', 'Touch left knee with right hand', 'Keep alternating'],
    difficulty: 2,
  },
  {
    id: 'bi-drums',
    title: 'Hand Drums',
    emoji: '🥁',
    instructions: ['Left hand taps left', 'Right hand taps right', 'Both hands together'],
    difficulty: 1,
  },
];

// All motor activities combined
export const allMotorActivities = [
  ...fineMotorGames.map(g => ({
    id: g.id,
    title: g.title,
    lane: 'fine-motor' as const,
    icon: g.emoji,
    durationOptions: [2, 5, 10],
    difficulty: g.difficulty,
    instructions: g.instructions,
    successCriteria: 'Complete the activity',
    tokenReward: 2,
    accessibilityFlags: {},
    type: 'game' as const,
  })),
  ...adlMissions.map(m => ({
    id: m.id,
    title: m.title,
    lane: 'adl' as const,
    icon: m.emoji,
    durationOptions: [m.totalTime],
    difficulty: 2 as const,
    instructions: m.steps.map(s => s.instruction),
    successCriteria: 'Complete all steps',
    tokenReward: m.steps.length * m.tokenPerStep,
    accessibilityFlags: {},
    type: 'practice' as const,
  })),
];

// Helper functions
export function getGamesByLane(lane: string) {
  if (lane === 'fine-motor') return fineMotorGames;
  if (lane === 'adl') return adlMissions;
  if (lane === 'balance') return balanceActivities;
  if (lane === 'bilateral') return bilateralActivities;
  return [];
}

export function getADLMissionById(id: string): ADLMission | undefined {
  return adlMissions.find(m => m.id === id);
}

export function getFineMotorGameById(id: string): FineMotorGame | undefined {
  return fineMotorGames.find(g => g.id === id);
}
