// ============================================
// VISUAL ASSETS - Distinct images for each state/step in activities
// ============================================

// ===================
// SPACE / MOON PHASES
// ===================
export const MOON_PHASE_VISUALS = [
  { id: 'new', name: 'New Moon', emoji: '🌑', visual: '●', description: 'The Moon is dark - between Earth and Sun' },
  { id: 'waxing-crescent', name: 'Waxing Crescent', emoji: '🌒', visual: '🌒', description: 'A tiny sliver appears on the right' },
  { id: 'first-quarter', name: 'First Quarter', emoji: '🌓', visual: '🌓', description: 'Half the Moon is lit on the right' },
  { id: 'waxing-gibbous', name: 'Waxing Gibbous', emoji: '🌔', visual: '🌔', description: 'More than half is lit, growing bigger' },
  { id: 'full', name: 'Full Moon', emoji: '🌕', visual: '🌕', description: 'The whole Moon is bright!' },
  { id: 'waning-gibbous', name: 'Waning Gibbous', emoji: '🌖', visual: '🌖', description: 'More than half lit, getting smaller' },
  { id: 'last-quarter', name: 'Last Quarter', emoji: '🌗', visual: '🌗', description: 'Half the Moon is lit on the left' },
  { id: 'waning-crescent', name: 'Waning Crescent', emoji: '🌘', visual: '🌘', description: 'A tiny sliver on the left, almost gone' },
];

export const PLANET_VISUALS = [
  { id: 'sun', name: 'The Sun', emoji: '☀️', color: '#FFD700', size: 'giant', fact: 'A star at the center of our solar system!' },
  { id: 'mercury', name: 'Mercury', emoji: '⚫', color: '#8C8C8C', size: 'tiny', fact: 'Closest to the Sun, very hot and very cold!' },
  { id: 'venus', name: 'Venus', emoji: '🟠', color: '#E6A800', size: 'small', fact: 'Hottest planet - covered in thick clouds' },
  { id: 'earth', name: 'Earth', emoji: '🌍', color: '#4A90D9', size: 'small', fact: 'Our home! The only planet with liquid water' },
  { id: 'mars', name: 'Mars', emoji: '🔴', color: '#E57373', size: 'small', fact: 'The Red Planet - has the biggest volcano!' },
  { id: 'jupiter', name: 'Jupiter', emoji: '🟤', color: '#D4A574', size: 'huge', fact: 'Biggest planet - has a giant storm called the Great Red Spot' },
  { id: 'saturn', name: 'Saturn', emoji: '🪐', color: '#F4D03F', size: 'large', fact: 'Famous for its beautiful rings made of ice!' },
  { id: 'uranus', name: 'Uranus', emoji: '🔵', color: '#87CEEB', size: 'medium', fact: 'Spins on its side like a rolling ball' },
  { id: 'neptune', name: 'Neptune', emoji: '💙', color: '#4169E1', size: 'medium', fact: 'Farthest planet - super cold and windy' },
];

export const STAR_CONSTELLATION_VISUALS = [
  { id: 'big-dipper', name: 'Big Dipper', emoji: '⭐', pattern: '★ ★ ★ ★\n     ★\n       ★\n         ★', fact: 'Looks like a giant ladle or spoon!' },
  { id: 'orion', name: 'Orion', emoji: '🌟', pattern: '★   ★\n  ★★★\n★     ★', fact: 'A hunter - look for the three stars in his belt!' },
  { id: 'little-dipper', name: 'Little Dipper', emoji: '✨', pattern: '★\n  ★\n    ★★★★', fact: 'The North Star is at the tip of its handle!' },
];

// ===================
// CLOUD TYPES
// ===================
export const CLOUD_TYPE_VISUALS = [
  { id: 'cumulus', name: 'Cumulus', emoji: '☁️', shape: 'fluffy', visual: '☁️', description: 'Big, fluffy, cotton-ball clouds', weather: 'Usually nice weather!' },
  { id: 'stratus', name: 'Stratus', emoji: '🌫️', shape: 'flat', visual: '▬▬▬', description: 'Flat, gray blanket across the sky', weather: 'Might drizzle or be foggy' },
  { id: 'cirrus', name: 'Cirrus', emoji: '〰️', shape: 'wispy', visual: '〜〜〜', description: 'Thin, wispy, feathery streaks high up', weather: 'Fair weather, but might change' },
  { id: 'cumulonimbus', name: 'Cumulonimbus', emoji: '⛈️', shape: 'tower', visual: '🌩️', description: 'Giant tower clouds that bring storms', weather: 'Thunderstorms coming!' },
  { id: 'nimbus', name: 'Nimbus', emoji: '🌧️', shape: 'dark', visual: '🌧️', description: 'Dark gray rain clouds', weather: 'Rain or snow is falling' },
];

// ===================
// WEATHER SYMBOLS
// ===================
export const WEATHER_VISUALS = [
  { id: 'sunny', name: 'Sunny', emoji: '☀️', temperature: 'warm', clothes: ['t-shirt', 'shorts', 'sunglasses'] },
  { id: 'cloudy', name: 'Cloudy', emoji: '☁️', temperature: 'mild', clothes: ['long sleeves', 'pants'] },
  { id: 'rainy', name: 'Rainy', emoji: '🌧️', temperature: 'cool', clothes: ['raincoat', 'rain boots', 'umbrella'] },
  { id: 'stormy', name: 'Stormy', emoji: '⛈️', temperature: 'varies', clothes: ['stay inside!'] },
  { id: 'snowy', name: 'Snowy', emoji: '❄️', temperature: 'cold', clothes: ['winter coat', 'boots', 'gloves', 'hat'] },
  { id: 'windy', name: 'Windy', emoji: '💨', temperature: 'varies', clothes: ['jacket', 'tie hair back'] },
  { id: 'foggy', name: 'Foggy', emoji: '🌫️', temperature: 'cool', clothes: ['layers', 'be careful walking'] },
];

export const SEASON_VISUALS = [
  { id: 'spring', name: 'Spring', emoji: '🌸', colors: ['#98FB98', '#FFB6C1', '#FFFACD'], nature: 'Flowers bloom, baby animals born', clothes: ['light jacket', 'rain boots'] },
  { id: 'summer', name: 'Summer', emoji: '☀️', colors: ['#FFD700', '#87CEEB', '#228B22'], nature: 'Hot sun, long days, green leaves', clothes: ['shorts', 'sunscreen', 'swimsuit'] },
  { id: 'fall', name: 'Fall', emoji: '🍂', colors: ['#FF8C00', '#8B4513', '#FFD700'], nature: 'Leaves change color and fall', clothes: ['sweater', 'jeans', 'light jacket'] },
  { id: 'winter', name: 'Winter', emoji: '❄️', colors: ['#FFFFFF', '#B0C4DE', '#4682B4'], nature: 'Cold, bare trees, maybe snow', clothes: ['heavy coat', 'boots', 'hat', 'gloves'] },
];

// ===================
// BREATHING EXERCISE VISUALS
// ===================
export const BALLOON_BREATH_FRAMES = [
  { phase: 'rest', size: 20, emoji: '🎈', instruction: 'Get ready...' },
  { phase: 'inhale-1', size: 30, emoji: '🎈', instruction: 'Breathe in... 1' },
  { phase: 'inhale-2', size: 40, emoji: '🎈', instruction: 'Breathe in... 2' },
  { phase: 'inhale-3', size: 50, emoji: '🎈', instruction: 'Breathe in... 3' },
  { phase: 'inhale-4', size: 60, emoji: '🎈', instruction: 'Breathe in... 4' },
  { phase: 'exhale-1', size: 55, emoji: '🎈', instruction: 'Breathe out... 1' },
  { phase: 'exhale-2', size: 45, emoji: '🎈', instruction: 'Breathe out... 2' },
  { phase: 'exhale-3', size: 35, emoji: '🎈', instruction: 'Breathe out... 3' },
  { phase: 'exhale-4', size: 30, emoji: '🎈', instruction: 'Breathe out... 4' },
  { phase: 'exhale-5', size: 25, emoji: '🎈', instruction: 'Breathe out... 5' },
  { phase: 'exhale-6', size: 20, emoji: '🎈', instruction: 'Breathe out... 6' },
];

export const BOX_BREATH_FRAMES = [
  { phase: 'start', position: 'top-left', emoji: '⬛', instruction: 'Start at the corner' },
  { phase: 'inhale-1', position: 'top-25', emoji: '▶️', instruction: 'Breathe in... 1' },
  { phase: 'inhale-2', position: 'top-50', emoji: '▶️', instruction: 'Breathe in... 2' },
  { phase: 'inhale-3', position: 'top-75', emoji: '▶️', instruction: 'Breathe in... 3' },
  { phase: 'inhale-4', position: 'top-right', emoji: '⬛', instruction: 'Breathe in... 4' },
  { phase: 'hold-1', position: 'right-25', emoji: '🔽', instruction: 'Hold... 1' },
  { phase: 'hold-2', position: 'right-50', emoji: '🔽', instruction: 'Hold... 2' },
  { phase: 'hold-3', position: 'right-75', emoji: '🔽', instruction: 'Hold... 3' },
  { phase: 'hold-4', position: 'bottom-right', emoji: '⬛', instruction: 'Hold... 4' },
  { phase: 'exhale-1', position: 'bottom-75', emoji: '◀️', instruction: 'Breathe out... 1' },
  { phase: 'exhale-2', position: 'bottom-50', emoji: '◀️', instruction: 'Breathe out... 2' },
  { phase: 'exhale-3', position: 'bottom-25', emoji: '◀️', instruction: 'Breathe out... 3' },
  { phase: 'exhale-4', position: 'bottom-left', emoji: '⬛', instruction: 'Breathe out... 4' },
  { phase: 'hold2-1', position: 'left-75', emoji: '🔼', instruction: 'Hold... 1' },
  { phase: 'hold2-2', position: 'left-50', emoji: '🔼', instruction: 'Hold... 2' },
  { phase: 'hold2-3', position: 'left-25', emoji: '🔼', instruction: 'Hold... 3' },
  { phase: 'hold2-4', position: 'top-left', emoji: '⬛', instruction: 'Hold... 4' },
];

export const DRAGON_BREATH_FRAMES = [
  { phase: 'rest', emoji: '🐉', visual: 'dragon-calm', instruction: 'Dragon is calm...' },
  { phase: 'inhale-1', emoji: '🐉', visual: 'dragon-inhale-1', instruction: 'Dragon breathes in... 1' },
  { phase: 'inhale-2', emoji: '🐉', visual: 'dragon-inhale-2', instruction: 'Dragon breathes in... 2' },
  { phase: 'inhale-3', emoji: '🐉', visual: 'dragon-inhale-3', instruction: 'Dragon breathes in... 3 (full!)' },
  { phase: 'exhale-1', emoji: '🔥', visual: 'dragon-fire-1', instruction: 'Slow fire... 1' },
  { phase: 'exhale-2', emoji: '🔥', visual: 'dragon-fire-2', instruction: 'Slow fire... 2' },
  { phase: 'exhale-3', emoji: '🔥', visual: 'dragon-fire-3', instruction: 'Slow fire... 3' },
  { phase: 'exhale-4', emoji: '🔥', visual: 'dragon-fire-4', instruction: 'Slow fire... 4' },
  { phase: 'exhale-5', emoji: '💨', visual: 'dragon-smoke-1', instruction: 'Gentle smoke... 5' },
  { phase: 'exhale-6', emoji: '💨', visual: 'dragon-smoke-2', instruction: 'Gentle smoke... 6' },
  { phase: 'exhale-7', emoji: '💨', visual: 'dragon-smoke-3', instruction: 'Gentle smoke... 7' },
  { phase: 'exhale-8', emoji: '✨', visual: 'dragon-done', instruction: 'Dragon is calm... 8' },
];

export const WAVE_BREATH_FRAMES = [
  { phase: 'low', emoji: '🌊', height: 10, instruction: 'Wave is low...' },
  { phase: 'rising-1', emoji: '🌊', height: 25, instruction: 'Breathe in... wave rises' },
  { phase: 'rising-2', emoji: '🌊', height: 40, instruction: 'Breathe in... higher' },
  { phase: 'rising-3', emoji: '🌊', height: 55, instruction: 'Breathe in... almost there' },
  { phase: 'peak', emoji: '🌊', height: 70, instruction: 'Breathe in... at the top!' },
  { phase: 'falling-1', emoji: '🌊', height: 55, instruction: 'Breathe out... wave falls' },
  { phase: 'falling-2', emoji: '🌊', height: 40, instruction: 'Breathe out... lower' },
  { phase: 'falling-3', emoji: '🌊', height: 25, instruction: 'Breathe out... sinking' },
  { phase: 'rest', emoji: '🌊', height: 10, instruction: 'Breathe out... calm' },
];

export const FLOWER_BREATH_FRAMES = [
  { phase: 'rest', emoji: '🌸', visual: 'flower-closed', instruction: 'Flower is closed...' },
  { phase: 'inhale-1', emoji: '🌸', visual: 'flower-opening-1', instruction: 'Smell the flower... 1' },
  { phase: 'inhale-2', emoji: '🌷', visual: 'flower-opening-2', instruction: 'Smell the flower... 2' },
  { phase: 'inhale-3', emoji: '🌺', visual: 'flower-open', instruction: 'Smell the flower... 3 (Mmm!)' },
  { phase: 'switch', emoji: '🌻', visual: 'dandelion', instruction: 'Now a dandelion...' },
  { phase: 'exhale-1', emoji: '🌬️', visual: 'dandelion-blow-1', instruction: 'Blow gently... 1' },
  { phase: 'exhale-2', emoji: '🌬️', visual: 'dandelion-blow-2', instruction: 'Blow gently... 2' },
  { phase: 'exhale-3', emoji: '🌬️', visual: 'dandelion-blow-3', instruction: 'Blow gently... 3' },
  { phase: 'exhale-4', emoji: '✨', visual: 'seeds-flying', instruction: 'Seeds floating... 4' },
  { phase: 'exhale-5', emoji: '✨', visual: 'seeds-away', instruction: 'Seeds fly away... 5' },
];

// ===================
// BODY FEELINGS / ENERGY
// ===================
export const BODY_FEELING_VISUALS = [
  { id: 'tight', emoji: '😤', bodyImage: 'body-tight', color: '#FF6B6B', description: 'Muscles feel squeezed' },
  { id: 'hot', emoji: '🥵', bodyImage: 'body-hot', color: '#FF4500', description: 'Feeling warm or sweaty' },
  { id: 'wiggly', emoji: '🐛', bodyImage: 'body-wiggly', color: '#FFD93D', description: 'Hard to stay still' },
  { id: 'heavy', emoji: '😴', bodyImage: 'body-heavy', color: '#6C5B7B', description: 'Body feels tired or slow' },
  { id: 'buzzy', emoji: '⚡', bodyImage: 'body-buzzy', color: '#F9ED69', description: 'Lots of energy zooming around' },
  { id: 'cold', emoji: '🥶', bodyImage: 'body-cold', color: '#74B9FF', description: 'Feeling chilly' },
  { id: 'hungry', emoji: '🍎', bodyImage: 'body-hungry', color: '#E17055', description: 'Tummy feels empty' },
  { id: 'thirsty', emoji: '💧', bodyImage: 'body-thirsty', color: '#0984E3', description: 'Mouth feels dry' },
  { id: 'uncomfortable', emoji: '😣', bodyImage: 'body-uncomfortable', color: '#FDCB6E', description: 'Something feels off' },
  { id: 'just-right', emoji: '😊', bodyImage: 'body-just-right', color: '#00B894', description: 'Body feels good!' },
];

export const ENERGY_METER_VISUALS = [
  { level: 1, name: 'Very Low', emoji: '😴', color: '#6C5B7B', barFill: 10, description: 'Almost no energy' },
  { level: 2, name: 'Low', emoji: '🥱', color: '#9B59B6', barFill: 25, description: 'Feeling tired' },
  { level: 3, name: 'A Little Low', emoji: '😐', color: '#3498DB', barFill: 40, description: 'Could use a boost' },
  { level: 4, name: 'Just Right', emoji: '😊', color: '#2ECC71', barFill: 55, description: 'Perfect energy!' },
  { level: 5, name: 'Good', emoji: '🙂', color: '#27AE60', barFill: 65, description: 'Feeling good' },
  { level: 6, name: 'A Bit High', emoji: '😃', color: '#F1C40F', barFill: 75, description: 'Lots of energy' },
  { level: 7, name: 'High', emoji: '😄', color: '#E67E22', barFill: 85, description: 'Very energetic!' },
  { level: 8, name: 'Very High', emoji: '🤪', color: '#E74C3C', barFill: 95, description: 'Hard to stay calm' },
];

// ===================
// BRAVERY STORY ILLUSTRATIONS
// ===================
export const BRAVERY_STORY_VISUALS = {
  'story-leaving': {
    scenes: [
      { pageId: 'p1', emoji: '🌅', scene: 'morning-home', description: 'Sunny morning at home' },
      { pageId: 'p2', emoji: '🧱', scene: 'playing-blocks', description: 'Child playing with blocks' },
      { pageId: 'p3a', emoji: '😢', scene: 'sad-parent', description: 'Parent looking sad' },
      { pageId: 'p3b', emoji: '💨', scene: 'deep-breath', description: 'Child taking a deep breath' },
      { pageId: 'p4', emoji: '⏰', scene: 'timer', description: '5-minute timer' },
      { pageId: 'p5a', emoji: '😰', scene: 'stuck', description: 'Child feeling stuck' },
      { pageId: 'p5b', emoji: '✨', scene: 'blocks-away', description: 'Blocks put away neatly' },
      { pageId: 'p6', emoji: '🎉', scene: 'park-fun', description: 'Having fun at the park' },
    ],
  },
  'story-washing': {
    scenes: [
      { pageId: 'p1', emoji: '🚪', scene: 'doorknob', description: 'Hand on doorknob' },
      { pageId: 'p2', emoji: '🧼', scene: 'washing-hands', description: 'Washing hands with soap' },
      { pageId: 'p3', emoji: '🧠', scene: 'worry-brain', description: 'Worried thought bubble' },
      { pageId: 'p4a', emoji: '😰', scene: 'red-hands', description: 'Hands washed too much' },
      { pageId: 'p4b', emoji: '😤', scene: 'boss-brain', description: 'Being boss of worry' },
      { pageId: 'p5', emoji: '🦸', scene: 'superhero-pose', description: 'Standing like a superhero' },
      { pageId: 'p6', emoji: '⏰', scene: 'waiting', description: 'Waiting patiently' },
      { pageId: 'p7', emoji: '🎮', scene: 'playing-free', description: 'Free to play!' },
    ],
  },
  'story-bedtime': {
    scenes: [
      { pageId: 'p1', emoji: '🌙', scene: 'nighttime', description: 'Moon outside window' },
      { pageId: 'p2', emoji: '😟', scene: 'worried-bed', description: 'Worried in bed' },
      { pageId: 'p3', emoji: '🧸', scene: 'stuffed-animal', description: 'Hugging stuffed animal' },
      { pageId: 'p4', emoji: '💭', scene: 'happy-thought', description: 'Thinking happy thoughts' },
      { pageId: 'p5', emoji: '😌', scene: 'calm-face', description: 'Peaceful, calm face' },
      { pageId: 'p6', emoji: '💤', scene: 'sleeping', description: 'Sleeping peacefully' },
    ],
  },
  'story-plans': {
    scenes: [
      { pageId: 'p1', emoji: '📅', scene: 'calendar', description: 'Calendar with plans' },
      { pageId: 'p2', emoji: '❌', scene: 'cancelled', description: 'Plans crossed out' },
      { pageId: 'p3', emoji: '😤', scene: 'upset', description: 'Feeling upset' },
      { pageId: 'p4', emoji: '🤷', scene: 'shrug', description: 'Shrugging - its okay' },
      { pageId: 'p5', emoji: '🔄', scene: 'new-plan', description: 'Making a new plan' },
      { pageId: 'p6', emoji: '😊', scene: 'happy-new', description: 'Happy with new plan' },
    ],
  },
  'story-doctor': {
    scenes: [
      { pageId: 'p1', emoji: '🏥', scene: 'doctor-office', description: 'Doctor office building' },
      { pageId: 'p2', emoji: '😨', scene: 'nervous', description: 'Feeling nervous' },
      { pageId: 'p3', emoji: '🩺', scene: 'doctor-tools', description: 'Doctor tools' },
      { pageId: 'p4', emoji: '💪', scene: 'brave-face', description: 'Being brave' },
      { pageId: 'p5', emoji: '⭐', scene: 'sticker', description: 'Getting a sticker' },
      { pageId: 'p6', emoji: '🍦', scene: 'treat', description: 'Getting a treat after' },
    ],
  },
  'story-new-place': {
    scenes: [
      { pageId: 'p1', emoji: '🚗', scene: 'driving', description: 'Driving somewhere new' },
      { pageId: 'p2', emoji: '❓', scene: 'question', description: 'Wondering whats there' },
      { pageId: 'p3', emoji: '👀', scene: 'looking', description: 'Looking around carefully' },
      { pageId: 'p4', emoji: '🤝', scene: 'with-parent', description: 'Staying with parent' },
      { pageId: 'p5', emoji: '🔍', scene: 'exploring', description: 'Starting to explore' },
      { pageId: 'p6', emoji: '🎉', scene: 'fun', description: 'Having fun!' },
    ],
  },
};

// ===================
// MOTOR ACTIVITY VISUALS
// ===================
export const YOGA_POSE_VISUALS = [
  { id: 'tree', name: 'Tree Pose', emoji: '🌳', description: 'Stand on one leg, arms up like branches', visual: 'pose-tree' },
  { id: 'flamingo', name: 'Flamingo', emoji: '🦩', description: 'Stand on one leg, other leg bent back', visual: 'pose-flamingo' },
  { id: 'cat', name: 'Cat Stretch', emoji: '🐱', description: 'On hands and knees, arch your back up', visual: 'pose-cat' },
  { id: 'dog', name: 'Downward Dog', emoji: '🐕', description: 'Hands and feet on floor, bottom up high', visual: 'pose-dog' },
  { id: 'cobra', name: 'Cobra', emoji: '🐍', description: 'Lie on tummy, push chest up with arms', visual: 'pose-cobra' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', description: 'Sit with feet together, flap your knees', visual: 'pose-butterfly' },
];

export const BALANCE_ACTIVITY_VISUALS = [
  { id: 'hop', name: 'Hop', emoji: '🐰', description: 'Jump up and down', frame: 'balance-hop' },
  { id: 'march', name: 'March', emoji: '🚶', description: 'Lift knees high', frame: 'balance-march' },
  { id: 'reach-up', name: 'Reach Up', emoji: '🙆', description: 'Stretch arms to the sky', frame: 'balance-reach' },
  { id: 'squat', name: 'Squat', emoji: '🏋️', description: 'Bend knees, sit low', frame: 'balance-squat' },
  { id: 'balance', name: 'Balance', emoji: '🧘', description: 'Stand on one foot', frame: 'balance-one-foot' },
  { id: 'spin', name: 'Spin', emoji: '🌀', description: 'Turn around slowly', frame: 'balance-spin' },
];

// ===================
// MICRO-BREAK VISUALS
// ===================
export const MICRO_BREAK_STEP_VISUALS = {
  'mb-wall-push': [
    { step: 1, emoji: '🧍', instruction: 'Stand arm-length from wall', visual: 'wall-push-1' },
    { step: 2, emoji: '🤲', instruction: 'Hands flat on wall', visual: 'wall-push-2' },
    { step: 3, emoji: '💪', instruction: 'Push hard!', visual: 'wall-push-3' },
    { step: 4, emoji: '😌', instruction: 'Release and relax', visual: 'wall-push-4' },
  ],
  'mb-bear-hug': [
    { step: 1, emoji: '🙆', instruction: 'Arms out wide', visual: 'bear-hug-1' },
    { step: 2, emoji: '🤗', instruction: 'Cross arms over chest', visual: 'bear-hug-2' },
    { step: 3, emoji: '💪', instruction: 'Squeeze tight!', visual: 'bear-hug-3' },
    { step: 4, emoji: '😊', instruction: 'Hold and breathe', visual: 'bear-hug-4' },
  ],
  'mb-turtle-shell': [
    { step: 1, emoji: '🧎', instruction: 'Kneel on floor', visual: 'turtle-1' },
    { step: 2, emoji: '🐢', instruction: 'Curl into a ball', visual: 'turtle-2' },
    { step: 3, emoji: '🛡️', instruction: 'Tuck head down', visual: 'turtle-3' },
    { step: 4, emoji: '😌', instruction: 'Breathe slowly', visual: 'turtle-4' },
  ],
  'mb-power-pose': [
    { step: 1, emoji: '🧍', instruction: 'Stand tall', visual: 'power-1' },
    { step: 2, emoji: '🦸', instruction: 'Hands on hips', visual: 'power-2' },
    { step: 3, emoji: '💪', instruction: 'Chest out, chin up', visual: 'power-3' },
    { step: 4, emoji: '⭐', instruction: 'Feel strong!', visual: 'power-4' },
  ],
  'mb-jumping-jacks': [
    { step: 1, emoji: '🧍', instruction: 'Stand with feet together', visual: 'jacks-1' },
    { step: 2, emoji: '⭐', instruction: 'Jump! Arms and legs out', visual: 'jacks-2' },
    { step: 3, emoji: '🧍', instruction: 'Jump back together', visual: 'jacks-3' },
    { step: 4, emoji: '🔄', instruction: 'Repeat!', visual: 'jacks-4' },
  ],
  'mb-cross-crawl': [
    { step: 1, emoji: '🧍', instruction: 'Stand straight', visual: 'cross-1' },
    { step: 2, emoji: '✋', instruction: 'Right knee up', visual: 'cross-2' },
    { step: 3, emoji: '🤚', instruction: 'Touch with left hand', visual: 'cross-3' },
    { step: 4, emoji: '🔄', instruction: 'Switch sides!', visual: 'cross-4' },
  ],
};

// ===================
// ADL MISSION STEP VISUALS
// ===================
export const ADL_STEP_VISUALS = {
  'adl-socks': [
    { step: 0, emoji: '👀', visual: 'socks-find', description: 'Looking for matching socks' },
    { step: 1, emoji: '✊', visual: 'socks-scrunch', description: 'Scrunching sock into ball' },
    { step: 2, emoji: '🦶', visual: 'socks-toes', description: 'Toes going in first' },
    { step: 3, emoji: '⬆️', visual: 'socks-heel', description: 'Pulling over heel' },
    { step: 4, emoji: '✅', visual: 'socks-done', description: 'Sock all the way up!' },
  ],
  'adl-teeth': [
    { step: 0, emoji: '💧', visual: 'teeth-wet', description: 'Wetting toothbrush' },
    { step: 1, emoji: '🟢', visual: 'teeth-paste', description: 'Pea-size toothpaste' },
    { step: 2, emoji: '⬆️', visual: 'teeth-top', description: 'Brushing top teeth' },
    { step: 3, emoji: '⬇️', visual: 'teeth-bottom', description: 'Brushing bottom teeth' },
    { step: 4, emoji: '↔️', visual: 'teeth-chew', description: 'Brushing chewing surfaces' },
    { step: 5, emoji: '👅', visual: 'teeth-tongue', description: 'Brushing tongue' },
    { step: 6, emoji: '💦', visual: 'teeth-rinse', description: 'Rinse and spit' },
  ],
  'adl-shoes': [
    { step: 0, emoji: '❌', visual: 'shoe-cross', description: 'Crossing the laces' },
    { step: 1, emoji: '⬇️', visual: 'shoe-under', description: 'Pulling one under' },
    { step: 2, emoji: '↔️', visual: 'shoe-tight', description: 'Pulling both tight' },
    { step: 3, emoji: '🐰', visual: 'shoe-loop', description: 'Making bunny ear loop' },
    { step: 4, emoji: '🔄', visual: 'shoe-wrap', description: 'Wrapping other lace' },
    { step: 5, emoji: '➡️', visual: 'shoe-push', description: 'Pushing through hole' },
    { step: 6, emoji: '🎀', visual: 'shoe-done', description: 'Pulling loops tight - done!' },
  ],
  'adl-zipper': [
    { step: 0, emoji: '🧥', visual: 'zip-open', description: 'Holding jacket open' },
    { step: 1, emoji: '👀', visual: 'zip-find', description: 'Finding zipper end' },
    { step: 2, emoji: '📍', visual: 'zip-pin', description: 'Putting pin in slider' },
    { step: 3, emoji: '✊', visual: 'zip-hold', description: 'Holding the bottom' },
    { step: 4, emoji: '⬆️', visual: 'zip-up', description: 'Pulling zipper up!' },
  ],
};

// ===================
// SOCIAL STORY ILLUSTRATIONS
// ===================
export const SOCIAL_STORY_STEP_VISUALS = {
  'ss1': [ // Going to the store
    { step: 0, emoji: '🚗', scene: 'car-driving', description: 'Driving to the store' },
    { step: 1, emoji: '🧑‍🤝‍🧑', scene: 'staying-close', description: 'Staying close to parent' },
    { step: 2, emoji: '🛒', scene: 'helping-cart', description: 'Helping with the cart' },
    { step: 3, emoji: '🧍‍♂️', scene: 'waiting-line', description: 'Waiting in line' },
    { step: 4, emoji: '🏠', scene: 'going-home', description: 'Going home' },
  ],
  'ss2': [ // When plans change
    { step: 0, emoji: '📅', scene: 'plans', description: 'We had a plan' },
    { step: 1, emoji: '😟', scene: 'upset', description: 'Feeling upset' },
    { step: 2, emoji: '💚', scene: 'feelings-okay', description: 'Feelings are real and okay' },
    { step: 3, emoji: '💨', scene: 'deep-breath', description: 'Taking a deep breath' },
    { step: 4, emoji: '🆕', scene: 'new-plan', description: 'Making a new plan' },
    { step: 5, emoji: '💪', scene: 'handle-change', description: 'I can handle changes' },
  ],
};

// ===================
// HELPER FUNCTIONS
// ===================
export function getMoonPhaseVisual(phaseId: string) {
  return MOON_PHASE_VISUALS.find(p => p.id === phaseId);
}

export function getPlanetVisual(planetId: string) {
  return PLANET_VISUALS.find(p => p.id === planetId);
}

export function getCloudTypeVisual(cloudId: string) {
  return CLOUD_TYPE_VISUALS.find(c => c.id === cloudId);
}

export function getBreathingFrames(type: 'balloon' | 'box' | 'dragon' | 'wave' | 'flower') {
  switch (type) {
    case 'balloon': return BALLOON_BREATH_FRAMES;
    case 'box': return BOX_BREATH_FRAMES;
    case 'dragon': return DRAGON_BREATH_FRAMES;
    case 'wave': return WAVE_BREATH_FRAMES;
    case 'flower': return FLOWER_BREATH_FRAMES;
  }
}

export function getBodyFeelingVisual(feelingId: string) {
  return BODY_FEELING_VISUALS.find(f => f.id === feelingId);
}

export function getEnergyMeterVisual(level: number) {
  return ENERGY_METER_VISUALS.find(e => e.level === level);
}

export function getYogaPoseVisual(poseId: string) {
  return YOGA_POSE_VISUALS.find(p => p.id === poseId);
}

export function getMicroBreakSteps(breakId: string) {
  return MICRO_BREAK_STEP_VISUALS[breakId as keyof typeof MICRO_BREAK_STEP_VISUALS] || [];
}

export function getADLStepVisuals(missionId: string) {
  return ADL_STEP_VISUALS[missionId as keyof typeof ADL_STEP_VISUALS] || [];
}

export function getSocialStoryVisuals(storyId: string) {
  return SOCIAL_STORY_STEP_VISUALS[storyId as keyof typeof SOCIAL_STORY_STEP_VISUALS] || [];
}

export function getBraveryStoryScenes(storyId: string) {
  return BRAVERY_STORY_VISUALS[storyId as keyof typeof BRAVERY_STORY_VISUALS]?.scenes || [];
}
