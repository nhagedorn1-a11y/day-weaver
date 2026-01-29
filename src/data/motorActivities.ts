import { MotorActivity, ADLMission, FineMotorGame, ADLStep } from '@/types/activities';

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

// Helper to create ADL step with full visual data
function createStep(
  instruction: string, 
  visualCue: string, 
  visualEmoji: string, 
  description: string
): ADLStep {
  return { instruction, visualCue, visualEmoji, description, completed: false };
}

// ADL Missions (12) with detailed step visuals
export const adlMissions: ADLMission[] = [
  {
    id: 'adl-socks',
    title: 'Sock Quest',
    emoji: '🧦',
    category: 'dressing',
    tokenPerStep: 1,
    totalTime: 5,
    steps: [
      createStep('Find matching socks', '👀🧦🧦', '👀', 'Two eyes looking at two socks to find a matching pair'),
      createStep('Scrunch sock into a ball', '✊🧦', '✊', 'A hand squeezing the sock into a small ball shape'),
      createStep('Put toes in first', '🦶➡️🧦', '🦶', 'Toes pointing toward the opening of the scrunched sock'),
      createStep('Pull sock up over heel', '⬆️🦶', '⬆️', 'Arrow showing sock being pulled up over the heel'),
      createStep('Pull sock all the way up', '🧦✨', '✨', 'Sock fully on foot with sparkles showing success'),
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
      createStep('Wet your toothbrush', '💧🪥', '🚰', 'Running water from faucet wetting a toothbrush'),
      createStep('Put toothpaste on (pea size)', '🟢🪥', '🫛', 'Small pea-sized blob of toothpaste on brush bristles'),
      createStep('Brush top teeth outsides', '⬆️😁', '😁', 'Smiling mouth showing top teeth being brushed on outside'),
      createStep('Brush bottom teeth outsides', '⬇️😁', '🦷', 'Bottom teeth visible with toothbrush on outer surface'),
      createStep('Brush chewing surfaces', '↔️🦷', '🔲', 'Top-down view of teeth showing flat chewing surfaces'),
      createStep('Brush tongue gently', '👅', '👅', 'Tongue sticking out being gently brushed'),
      createStep('Rinse and spit', '💦😮', '💦', 'Water being spit into sink'),
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
      createStep('Get your checklist', '📋', '📋', 'Paper checklist with items to pack'),
      createStep('Find homework folder', '📂', '📂', 'Colorful homework folder on desk'),
      createStep('Put folder in big pocket', '📂➡️🎒', '🎒', 'Folder sliding into the main backpack pocket'),
      createStep('Find lunch box', '🥪', '🥪', 'Lunch box with sandwich visible'),
      createStep('Put lunch in bag', '🥪➡️🎒', '🍎', 'Lunch items going into backpack side pocket'),
      createStep('Check water bottle', '💧✅', '🍶', 'Water bottle with checkmark showing it is filled'),
      createStep('Zip it up!', '🤐🎒', '🔒', 'Backpack zipper being closed'),
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
      createStep('Find the top button', '👀🔘', '👔', 'Shirt collar with top button highlighted'),
      createStep('Hold button with one hand', '✊🔘', '🤏', 'Thumb and finger pinching button'),
      createStep('Find the buttonhole', '👀⭕', '⭕', 'Close-up of buttonhole opening in fabric'),
      createStep('Push button through hole', '🔘➡️⭕', '➡️', 'Button halfway through the buttonhole'),
      createStep('Pull button all the way', '🔘✅', '✅', 'Button fully through and fastened'),
      createStep('Move to next button', '⬇️🔘', '⬇️', 'Arrow pointing down to the next button'),
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
      createStep('Cross the laces (make an X)', '❌', '✖️', 'Two shoelaces crossed over each other forming an X shape'),
      createStep('Pull one lace under', '⬇️', '🔄', 'One lace being tucked under the X crossing'),
      createStep('Pull both ends tight', '↔️', '💪', 'Both hands pulling laces outward to tighten'),
      createStep('Make a bunny ear loop', '🐰👂', '🐰', 'One lace formed into a loop like a bunny ear'),
      createStep('Wrap other lace around', '🔄', '🌀', 'Second lace wrapping around the bunny ear loop'),
      createStep('Push through the hole', '➡️⭕', '👆', 'Finger pushing wrapped lace through the hole'),
      createStep('Pull both loops tight', '🎀✅', '🎀', 'Finished bow with both loops pulled tight'),
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
      createStep('Hold jacket open', '🧥↔️', '🧥', 'Jacket held open with both sides visible'),
      createStep('Find the zipper end', '👀🔽', '🔽', 'Bottom of zipper with the insertion pin'),
      createStep('Put pin in the slider', '📍➡️', '📍', 'Pin being inserted into the zipper slider'),
      createStep('Hold the bottom', '✊⬇️', '✊', 'Hand holding the bottom of the zipper steady'),
      createStep('Pull zipper up!', '⬆️✨', '⬆️', 'Zipper slider being pulled upward to close'),
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
      createStep('Hold the brush', '✊🪮', '🪮', 'Hand gripping a hairbrush handle'),
      createStep('Start at the ends', '⬇️🪮', '⬇️', 'Brush at the bottom tips of hair'),
      createStep('Work up to the top', '⬆️🪮', '⬆️', 'Brush moving higher up toward the scalp'),
      createStep('Brush the sides', '↔️🪮', '↔️', 'Brush going along the sides of the head'),
      createStep('Check the back', '🔙🪮', '🔙', 'Hand reaching to brush the back of the head'),
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
      createStep('Turn on warm water', '🚰💧', '🚰', 'Faucet handle being turned with water flowing'),
      createStep('Wet your hands', '🙌💧', '🙌', 'Hands under running water getting wet'),
      createStep('Splash water on face', '💦😊', '💦', 'Water splashing onto a smiling face'),
      createStep('Put soap on hands', '🧴🙌', '🧴', 'Soap bottle dispensing onto palms'),
      createStep('Gently rub face', '🔄😊', '🔄', 'Hands making circular motions on cheeks'),
      createStep('Rinse face well', '💦😊', '🌊', 'Water washing soap off the face'),
      createStep('Pat dry with towel', '🧣✅', '🧣', 'Soft towel patting face dry'),
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
      createStep('Hold fork in left hand', '🍴←', '🍴', 'Left hand holding fork with tines down'),
      createStep('Hold knife in right hand', '🔪→', '🔪', 'Right hand gripping knife handle'),
      createStep('Press fork down to hold food', '⬇️🍴', '⬇️', 'Fork pressing into food to hold it steady'),
      createStep('Saw with knife gently', '↔️🔪', '↔️', 'Knife making back-and-forth sawing motion'),
      createStep('Cut a small piece', '✂️🍖', '✂️', 'Small bite-sized piece being cut from food'),
      createStep('Bring fork to mouth', '🍴➡️😋', '😋', 'Fork with food being raised toward smiling mouth'),
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
      createStep('Put cup on flat surface', '🥤⬇️', '🥤', 'Empty cup placed on stable table surface'),
      createStep('Hold bottle with two hands', '✊🍼✊', '🍼', 'Both hands gripping bottle securely'),
      createStep('Tip slowly toward cup', '↘️🥤', '↘️', 'Bottle tilting at gentle angle toward cup'),
      createStep('Watch the level', '👀📊', '👀', 'Eyes watching the liquid level rise in cup'),
      createStep('Stop before overflow', '✋🛑', '🛑', 'Hand stopping pour before cup overflows'),
      createStep('Set bottle down', '🍼⬇️', '⬇️', 'Bottle being set back down upright'),
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
      createStep('Put pencils in cup', '✏️➡️🥤', '✏️', 'Pencils being placed into a pencil holder cup'),
      createStep('Stack papers neatly', '📄📄📄', '📄', 'Papers being tapped into an even stack'),
      createStep('Put books on shelf', '📚➡️📖', '📚', 'Books being slid onto a bookshelf'),
      createStep('Throw away trash', '🗑️', '🗑️', 'Crumpled paper going into trash bin'),
      createStep('Wipe desk surface', '🧹✨', '🧽', 'Cloth wiping across clean desk surface'),
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
      createStep('Pull sheet flat', '↔️🛏️', '🛏️', 'Hands pulling sheet across the mattress'),
      createStep('Tuck sheet at bottom', '⬇️📦', '📦', 'Sheet being tucked under mattress at foot'),
      createStep('Pull blanket up', '⬆️🛏️', '⬆️', 'Blanket being pulled up toward pillows'),
      createStep('Smooth out bumps', '👋🛏️', '👋', 'Hand smoothing wrinkles from blanket'),
      createStep('Put pillow at top', '🛋️⬆️', '🛋️', 'Pillow being placed at head of bed'),
      createStep('Add stuffed animal', '🧸✨', '🧸', 'Teddy bear placed on top of made bed'),
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
