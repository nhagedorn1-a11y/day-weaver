import { ScienceActivity, LabCard } from '@/types/activities';

// 6 Science Lanes with 3 games each = 18 games
export const SCIENCE_LANES = [
  { id: 'nature', name: 'Nature Detective', emoji: '🌿', color: 'bg-calm' },
  { id: 'weather', name: 'Weather Station', emoji: '🌤️', color: 'bg-primary' },
  { id: 'space', name: 'Space Ops', emoji: '🚀', color: 'bg-next' },
  { id: 'chemistry', name: 'Kitchen Chemistry', emoji: '🧪', color: 'bg-token' },
  { id: 'build', name: 'Build & Test', emoji: '🔧', color: 'bg-secondary' },
  { id: 'micro', name: 'Micro Experiments', emoji: '🔬', color: 'bg-calm' },
] as const;

export const scienceActivities: ScienceActivity[] = [
  // === NATURE DETECTIVE ===
  {
    id: 'leaf-hunt',
    title: 'Leaf Hunt',
    lane: 'nature',
    icon: '🍂',
    durationOptions: [2, 5, 10],
    difficulty: 1,
    instructions: [
      'Look at the leaf shape',
      'Find the matching shadow',
      'Tap when you find it!'
    ],
    successCriteria: 'Match 5 leaves correctly',
    tokenReward: 2,
    accessibilityFlags: { reducedText: true },
    type: 'game',
    labCardId: 'lc-leaves'
  },
  {
    id: 'animal-tracks',
    title: 'Animal Track Match',
    lane: 'nature',
    icon: '🐾',
    durationOptions: [2, 5, 10],
    difficulty: 2,
    instructions: [
      'Look at the pawprint',
      'Which animal made it?',
      'Use hints if you need them'
    ],
    successCriteria: 'Match 5 tracks to animals',
    tokenReward: 2,
    accessibilityFlags: { reducedText: true },
    type: 'game',
    labCardId: 'lc-tracks'
  },
  {
    id: 'sound-safari',
    title: 'Sound Safari',
    lane: 'nature',
    icon: '🔊',
    durationOptions: [2, 5],
    difficulty: 2,
    instructions: [
      'Listen to the sound',
      'What animal is it?',
      'Tap the right picture'
    ],
    successCriteria: 'Identify 5 animal sounds',
    tokenReward: 2,
    accessibilityFlags: { audioRequired: true },
    type: 'game',
    labCardId: 'lc-sounds'
  },

  // === WEATHER STATION ===
  {
    id: 'dress-the-day',
    title: 'Dress the Day',
    lane: 'weather',
    icon: '👕',
    durationOptions: [2, 5],
    difficulty: 1,
    instructions: [
      'Look at the weather',
      'Choose the right clothes',
      'Drag them onto the person'
    ],
    successCriteria: 'Dress correctly for 3 weather types',
    tokenReward: 2,
    accessibilityFlags: { reducedText: true },
    type: 'game',
    labCardId: 'lc-weather-clothes'
  },
  {
    id: 'cloud-builder',
    title: 'Cloud Builder',
    lane: 'weather',
    icon: '☁️',
    durationOptions: [2, 5, 10],
    difficulty: 2,
    instructions: [
      'See the cloud name',
      'Drag pieces to build it',
      'Learn what each cloud means'
    ],
    successCriteria: 'Build 3 cloud types',
    tokenReward: 2,
    accessibilityFlags: {},
    type: 'game',
    labCardId: 'lc-clouds'
  },
  {
    id: 'storm-safety',
    title: 'Storm Safety Quest',
    lane: 'weather',
    icon: '⛈️',
    durationOptions: [5, 10],
    difficulty: 3,
    instructions: [
      'A storm is coming!',
      'Choose the safe action',
      'Stay safe and earn points'
    ],
    successCriteria: 'Make 5 safe choices',
    tokenReward: 3,
    accessibilityFlags: {},
    type: 'game',
    labCardId: 'lc-storm'
  },

  // === SPACE OPS ===
  {
    id: 'planet-order',
    title: 'Planet Order Docking',
    lane: 'space',
    icon: '🪐',
    durationOptions: [2, 5, 10],
    difficulty: 2,
    instructions: [
      'The planets are mixed up!',
      'Drag them into order',
      'Use the hint rocket if stuck'
    ],
    successCriteria: 'Order all 8 planets correctly',
    tokenReward: 3,
    accessibilityFlags: { reducedText: true },
    type: 'game',
    labCardId: 'lc-planets'
  },
  {
    id: 'moon-phases',
    title: 'Moon Phase Flipbook',
    lane: 'space',
    icon: '🌙',
    durationOptions: [2, 5],
    difficulty: 1,
    instructions: [
      'Tap to see the moon change',
      'Watch the phases',
      'Label each one'
    ],
    successCriteria: 'Identify 4 moon phases',
    tokenReward: 2,
    accessibilityFlags: { reducedText: true },
    type: 'explore',
    labCardId: 'lc-moon'
  },
  {
    id: 'asteroid-dodge',
    title: 'Asteroid Dodge',
    lane: 'space',
    icon: '☄️',
    durationOptions: [2, 5],
    difficulty: 3,
    instructions: [
      'Steer your spaceship',
      'Dodge the asteroids',
      'Collect the stars'
    ],
    successCriteria: 'Survive for 60 seconds',
    tokenReward: 2,
    accessibilityFlags: {},
    type: 'game',
    labCardId: 'lc-asteroid'
  },

  // === KITCHEN CHEMISTRY ===
  {
    id: 'mix-observe',
    title: 'Mix & Observe',
    lane: 'chemistry',
    icon: '🧫',
    durationOptions: [5, 10],
    difficulty: 2,
    instructions: [
      'Pick two ingredients',
      'Mix them together',
      'Watch what happens!'
    ],
    successCriteria: 'Try 3 different combinations',
    tokenReward: 2,
    accessibilityFlags: {},
    type: 'explore',
    materials: ['Virtual baking soda', 'Virtual vinegar', 'Virtual food coloring'],
    labCardId: 'lc-reactions'
  },
  {
    id: 'states-sort',
    title: 'States of Matter Sort',
    lane: 'chemistry',
    icon: '🧊',
    durationOptions: [2, 5],
    difficulty: 1,
    instructions: [
      'Look at each item',
      'Is it solid, liquid, or gas?',
      'Drag it to the right box'
    ],
    successCriteria: 'Sort 9 items correctly',
    tokenReward: 2,
    accessibilityFlags: { reducedText: true },
    type: 'game',
    labCardId: 'lc-states'
  },
  {
    id: 'temp-patrol',
    title: 'Temperature Patrol',
    lane: 'chemistry',
    icon: '🌡️',
    durationOptions: [2, 5],
    difficulty: 1,
    instructions: [
      'Is it hot or cold?',
      'Is it safe to touch?',
      'Make the right choice'
    ],
    successCriteria: 'Make 8 safe choices',
    tokenReward: 2,
    accessibilityFlags: { reducedText: true },
    type: 'game',
    labCardId: 'lc-temperature'
  },

  // === BUILD & TEST ===
  {
    id: 'bridge-builder',
    title: 'Bridge Builder Lite',
    lane: 'build',
    icon: '🌉',
    durationOptions: [5, 10, 15],
    difficulty: 3,
    instructions: [
      'Place blocks to make a bridge',
      'Connect both sides',
      'Test if the car can cross'
    ],
    successCriteria: 'Build a working bridge',
    tokenReward: 3,
    accessibilityFlags: {},
    type: 'game',
    labCardId: 'lc-bridge'
  },
  {
    id: 'ramp-racer',
    title: 'Ramp Racer',
    lane: 'build',
    icon: '🎢',
    durationOptions: [2, 5, 10],
    difficulty: 2,
    instructions: [
      'Adjust the ramp slope',
      'Predict how far the ball goes',
      'Test and see!'
    ],
    successCriteria: 'Hit the target 3 times',
    tokenReward: 2,
    accessibilityFlags: {},
    type: 'game',
    labCardId: 'lc-ramp'
  },
  {
    id: 'magnet-maze',
    title: 'Magnet Maze',
    lane: 'build',
    icon: '🧲',
    durationOptions: [2, 5, 10],
    difficulty: 2,
    instructions: [
      'Use the magnet to guide the ball',
      'Move through the maze',
      'Reach the goal'
    ],
    successCriteria: 'Complete 2 mazes',
    tokenReward: 2,
    accessibilityFlags: {},
    type: 'game',
    labCardId: 'lc-magnet'
  },

  // === MICRO EXPERIMENTS ===
  {
    id: 'paper-rainbow',
    title: 'Paper Towel Rainbow',
    lane: 'micro',
    icon: '🌈',
    durationOptions: [10, 15],
    difficulty: 2,
    instructions: [
      'Get your materials',
      'Dip the paper towel',
      'Watch the colors climb!'
    ],
    successCriteria: 'Complete the experiment',
    tokenReward: 3,
    accessibilityFlags: {},
    type: 'guided',
    materials: ['Paper towel', 'Markers', 'Cup of water'],
    prediction: 'What will happen to the colors?',
    observation: 'The colors traveled up!',
    labCardId: 'lc-rainbow'
  },
  {
    id: 'sink-float',
    title: 'Sink or Float',
    lane: 'micro',
    icon: '🛁',
    durationOptions: [5, 10],
    difficulty: 1,
    instructions: [
      'Pick an object',
      'Will it sink or float?',
      'Test it in water'
    ],
    successCriteria: 'Test 5 objects',
    tokenReward: 2,
    accessibilityFlags: { reducedText: true },
    type: 'guided',
    materials: ['Bowl of water', 'Small objects (coin, cork, leaf, marble, paper)'],
    labCardId: 'lc-sinkfloat'
  },
  {
    id: 'shadow-size',
    title: 'Shadow Size',
    lane: 'micro',
    icon: '👤',
    durationOptions: [5, 10],
    difficulty: 2,
    instructions: [
      'Shine a flashlight',
      'Move the object',
      'Watch the shadow change'
    ],
    successCriteria: 'Make 3 different shadow sizes',
    tokenReward: 2,
    accessibilityFlags: {},
    type: 'guided',
    materials: ['Flashlight', 'Small toy', 'Wall'],
    labCardId: 'lc-shadow'
  },
];

// 40 Lab Cards
export const labCards: LabCard[] = [
  // Nature (8 cards)
  { id: 'lc-leaves', title: 'Leaf Shapes', category: 'nature', emoji: '🍂', funFact: 'Trees use leaves to breathe! They take in air and let out fresh oxygen for us.', funFactAudio: 'Trees use leaves to breathe! They take in air and let out fresh oxygen for us.', imageDescription: 'Different leaf shapes', tryAgainChallenge: 'Can you find 3 different leaf shapes outside?', unlocked: false },
  { id: 'lc-tracks', title: 'Animal Tracks', category: 'nature', emoji: '🐾', funFact: 'Deer have two-toed hooves that leave heart-shaped prints in the mud!', funFactAudio: 'Deer have two-toed hooves that leave heart-shaped prints in the mud!', imageDescription: 'Various animal footprints', tryAgainChallenge: 'Look for tracks after it rains!', unlocked: false },
  { id: 'lc-sounds', title: 'Nature Sounds', category: 'nature', emoji: '🔊', funFact: 'Crickets chirp faster when its warmer outside. You can guess the temperature!', funFactAudio: 'Crickets chirp faster when its warmer outside. You can guess the temperature!', imageDescription: 'Animals making sounds', tryAgainChallenge: 'Close your eyes outside. How many sounds can you hear?', unlocked: false },
  { id: 'lc-bugs', title: 'Bug Life', category: 'nature', emoji: '🐛', funFact: 'Ladybugs can eat 50 aphids in one day. Thats like you eating 50 hamburgers!', funFactAudio: 'Ladybugs can eat 50 aphids in one day. Thats like you eating 50 hamburgers!', imageDescription: 'Colorful insects', tryAgainChallenge: 'Can you spot a ladybug outside?', unlocked: false },
  { id: 'lc-trees', title: 'Tree Types', category: 'nature', emoji: '🌲', funFact: 'The oldest tree in the world is over 5,000 years old!', funFactAudio: 'The oldest tree in the world is over 5,000 years old!', imageDescription: 'Different tree types', tryAgainChallenge: 'Hug a tree and feel the bark!', unlocked: false },
  { id: 'lc-birds', title: 'Bird Watching', category: 'nature', emoji: '🦜', funFact: 'Hummingbirds can fly backwards! Theyre the only birds that can do that.', funFactAudio: 'Hummingbirds can fly backwards! Theyre the only birds that can do that.', imageDescription: 'Various colorful birds', tryAgainChallenge: 'Sit quietly for 2 minutes and count the birds you see.', unlocked: false },
  { id: 'lc-flowers', title: 'Flower Power', category: 'nature', emoji: '🌸', funFact: 'Sunflowers actually turn to follow the sun across the sky!', funFactAudio: 'Sunflowers actually turn to follow the sun across the sky!', imageDescription: 'Blooming flowers', tryAgainChallenge: 'Can you name 3 different flower colors?', unlocked: false },
  { id: 'lc-rocks', title: 'Rock Collection', category: 'nature', emoji: '🪨', funFact: 'Some rocks are millions of years old. Older than the dinosaurs!', funFactAudio: 'Some rocks are millions of years old. Older than the dinosaurs!', imageDescription: 'Different rock types', tryAgainChallenge: 'Find 3 rocks that look different from each other.', unlocked: false },
  
  // Weather (7 cards)
  { id: 'lc-weather-clothes', title: 'Weather Wear', category: 'weather', emoji: '👕', funFact: 'Your body works hard to stay at 98.6 degrees. Clothes help it not work so hard!', funFactAudio: 'Your body works hard to stay at 98.6 degrees. Clothes help it not work so hard!', imageDescription: 'Weather-appropriate clothing', tryAgainChallenge: 'Check the weather before getting dressed tomorrow!', unlocked: false },
  { id: 'lc-clouds', title: 'Cloud Spotter', category: 'weather', emoji: '☁️', funFact: 'Clouds are made of tiny water droplets. A cloud can weigh as much as 100 elephants!', funFactAudio: 'Clouds are made of tiny water droplets. A cloud can weigh as much as 100 elephants!', imageDescription: 'Different cloud types', tryAgainChallenge: 'Lie on your back and watch clouds for 5 minutes.', unlocked: false },
  { id: 'lc-storm', title: 'Storm Safety', category: 'weather', emoji: '⛈️', funFact: 'Lightning is hotter than the surface of the sun!', funFactAudio: 'Lightning is hotter than the surface of the sun!', imageDescription: 'Storm safety tips', tryAgainChallenge: 'Ask a grown-up about your family storm plan.', unlocked: false },
  { id: 'lc-rain', title: 'Rain Cycle', category: 'weather', emoji: '🌧️', funFact: 'The same water has been on Earth for billions of years. You might drink dinosaur water!', funFactAudio: 'The same water has been on Earth for billions of years. You might drink dinosaur water!', imageDescription: 'Water cycle diagram', tryAgainChallenge: 'Draw the water cycle with a grown-up.', unlocked: false },
  { id: 'lc-wind', title: 'Wind Power', category: 'weather', emoji: '💨', funFact: 'The fastest wind ever recorded was 253 miles per hour. Thats faster than a race car!', funFactAudio: 'The fastest wind ever recorded was 253 miles per hour. Thats faster than a race car!', imageDescription: 'Wind effects', tryAgainChallenge: 'Make a pinwheel and test the wind!', unlocked: false },
  { id: 'lc-snow', title: 'Snowflake Science', category: 'weather', emoji: '❄️', funFact: 'Every single snowflake has 6 sides, but no two are exactly alike!', funFactAudio: 'Every single snowflake has 6 sides, but no two are exactly alike!', imageDescription: 'Snowflake patterns', tryAgainChallenge: 'Catch a snowflake on dark paper and look closely.', unlocked: false },
  { id: 'lc-rainbow', title: 'Rainbow Science', category: 'weather', emoji: '🌈', funFact: 'Rainbows always have the same color order: red, orange, yellow, green, blue, violet!', funFactAudio: 'Rainbows always have the same color order: red, orange, yellow, green, blue, violet!', imageDescription: 'Rainbow in the sky', tryAgainChallenge: 'Make a rainbow with a hose on a sunny day!', unlocked: false },

  // Space (8 cards)
  { id: 'lc-planets', title: 'Planet Parade', category: 'space', emoji: '🪐', funFact: 'Jupiter is so big that all the other planets could fit inside it!', funFactAudio: 'Jupiter is so big that all the other planets could fit inside it!', imageDescription: 'Solar system planets', tryAgainChallenge: 'Say the planets in order from the Sun.', unlocked: false },
  { id: 'lc-moon', title: 'Moon Magic', category: 'space', emoji: '🌙', funFact: 'The Moon is slowly moving away from Earth. About 1.5 inches every year!', funFactAudio: 'The Moon is slowly moving away from Earth. About 1.5 inches every year!', imageDescription: 'Moon phases', tryAgainChallenge: 'Look at the moon tonight. What phase is it?', unlocked: false },
  { id: 'lc-asteroid', title: 'Asteroid Adventure', category: 'space', emoji: '☄️', funFact: 'The asteroid belt has millions of asteroids, but theyre so spread out spacecraft fly right through!', funFactAudio: 'The asteroid belt has millions of asteroids, but theyre so spread out spacecraft fly right through!', imageDescription: 'Asteroids in space', tryAgainChallenge: 'Draw your own asteroid!', unlocked: false },
  { id: 'lc-sun', title: 'Sun Power', category: 'space', emoji: '☀️', funFact: 'The Sun is so big that 1 million Earths could fit inside it!', funFactAudio: 'The Sun is so big that 1 million Earths could fit inside it!', imageDescription: 'The Sun', tryAgainChallenge: 'Never look directly at the sun! Watch your shadow instead.', unlocked: false },
  { id: 'lc-stars', title: 'Star Gazer', category: 'space', emoji: '⭐', funFact: 'The stars you see at night are so far away, their light takes years to reach us!', funFactAudio: 'The stars you see at night are so far away, their light takes years to reach us!', imageDescription: 'Night sky with stars', tryAgainChallenge: 'Count the stars you can see from your window.', unlocked: false },
  { id: 'lc-rocket', title: 'Rocket Science', category: 'space', emoji: '🚀', funFact: 'Rockets have to go 25,000 miles per hour to escape Earths gravity!', funFactAudio: 'Rockets have to go 25,000 miles per hour to escape Earths gravity!', imageDescription: 'Rocket launching', tryAgainChallenge: 'Make a paper airplane and pretend its a rocket!', unlocked: false },
  { id: 'lc-astronaut', title: 'Astronaut Life', category: 'space', emoji: '👨‍🚀', funFact: 'Astronauts get taller in space! Their spines stretch without gravity.', funFactAudio: 'Astronauts get taller in space! Their spines stretch without gravity.', imageDescription: 'Astronaut in space', tryAgainChallenge: 'Try eating a snack while lying flat like in zero gravity!', unlocked: false },
  { id: 'lc-satellite', title: 'Satellite Watch', category: 'space', emoji: '🛰️', funFact: 'There are over 4,000 satellites orbiting Earth right now!', funFactAudio: 'There are over 4,000 satellites orbiting Earth right now!', imageDescription: 'Satellite in orbit', tryAgainChallenge: 'Look up at night - moving dots might be satellites!', unlocked: false },

  // Chemistry (6 cards)
  { id: 'lc-reactions', title: 'Reaction Time', category: 'chemistry', emoji: '🧫', funFact: 'When baking soda meets vinegar, they make carbon dioxide gas - thats the fizz!', funFactAudio: 'When baking soda meets vinegar, they make carbon dioxide gas - thats the fizz!', imageDescription: 'Chemical reaction', tryAgainChallenge: 'Make a mini volcano with a grown-up!', unlocked: false },
  { id: 'lc-states', title: 'Matter Matters', category: 'chemistry', emoji: '🧊', funFact: 'Ice, water, and steam are all the same thing - just in different states!', funFactAudio: 'Ice, water, and steam are all the same thing - just in different states!', imageDescription: 'Solid, liquid, gas', tryAgainChallenge: 'Find something solid, liquid, and gas in your house.', unlocked: false },
  { id: 'lc-temperature', title: 'Hot & Cold', category: 'chemistry', emoji: '🌡️', funFact: 'Water boils at 212°F but freezes at 32°F. Thats a big difference!', funFactAudio: 'Water boils at 212°F but freezes at 32°F. Thats a big difference!', imageDescription: 'Thermometer', tryAgainChallenge: 'Safely feel warm and cool water. Notice the difference!', unlocked: false },
  { id: 'lc-colors', title: 'Color Mixing', category: 'chemistry', emoji: '🎨', funFact: 'Red, blue, and yellow are primary colors. You can make any color from them!', funFactAudio: 'Red, blue, and yellow are primary colors. You can make any color from them!', imageDescription: 'Color wheel', tryAgainChallenge: 'Mix two colors together. What do you get?', unlocked: false },
  { id: 'lc-bubbles', title: 'Bubble Science', category: 'chemistry', emoji: '🫧', funFact: 'Bubbles are always round because thats the shape that uses the least energy!', funFactAudio: 'Bubbles are always round because thats the shape that uses the least energy!', imageDescription: 'Soap bubbles', tryAgainChallenge: 'Make bubbles and try to keep one floating as long as you can.', unlocked: false },
  { id: 'lc-dissolve', title: 'Dissolving', category: 'chemistry', emoji: '💧', funFact: 'Sugar dissolves in water because water molecules pull sugar apart!', funFactAudio: 'Sugar dissolves in water because water molecules pull sugar apart!', imageDescription: 'Sugar dissolving', tryAgainChallenge: 'Stir sugar into water. Where did it go?', unlocked: false },

  // Build (5 cards)
  { id: 'lc-bridge', title: 'Bridge Builder', category: 'build', emoji: '🌉', funFact: 'Triangles are the strongest shape! Thats why bridges use them.', funFactAudio: 'Triangles are the strongest shape! Thats why bridges use them.', imageDescription: 'Bridge structure', tryAgainChallenge: 'Build a bridge with blocks or LEGO!', unlocked: false },
  { id: 'lc-ramp', title: 'Ramp Physics', category: 'build', emoji: '🎢', funFact: 'The steeper the ramp, the faster things roll down. Gravity pulls them!', funFactAudio: 'The steeper the ramp, the faster things roll down. Gravity pulls them!', imageDescription: 'Ball on ramp', tryAgainChallenge: 'Make a ramp with a book. Roll different things down!', unlocked: false },
  { id: 'lc-magnet', title: 'Magnet Power', category: 'build', emoji: '🧲', funFact: 'Magnets can push or pull other magnets - even through your hand!', funFactAudio: 'Magnets can push or pull other magnets - even through your hand!', imageDescription: 'Magnet attracting metal', tryAgainChallenge: 'Test what a magnet sticks to around your house.', unlocked: false },
  { id: 'lc-balance', title: 'Balance Act', category: 'build', emoji: '⚖️', funFact: 'Everything has a balance point. Find it and anything can balance!', funFactAudio: 'Everything has a balance point. Find it and anything can balance!', imageDescription: 'Balance scale', tryAgainChallenge: 'Balance a ruler on your finger.', unlocked: false },
  { id: 'lc-gears', title: 'Gear Up', category: 'build', emoji: '⚙️', funFact: 'Big gears make small gears spin faster. Thats how bikes work!', funFactAudio: 'Big gears make small gears spin faster. Thats how bikes work!', imageDescription: 'Interlocking gears', tryAgainChallenge: 'Look for gears on a bike or toy!', unlocked: false },

  // Micro (6 cards)
  { id: 'lc-sinkfloat', title: 'Sink or Float', category: 'micro', emoji: '🛁', funFact: 'Things float if theyre less dense than water. A big ship floats because its full of air!', funFactAudio: 'Things float if theyre less dense than water. A big ship floats because its full of air!', imageDescription: 'Objects in water', tryAgainChallenge: 'Find 5 things and guess if they sink or float. Then test!', unlocked: false },
  { id: 'lc-shadow', title: 'Shadow Play', category: 'micro', emoji: '👤', funFact: 'Your shadow is shortest at noon when the sun is highest!', funFactAudio: 'Your shadow is shortest at noon when the sun is highest!', imageDescription: 'Shadow puppets', tryAgainChallenge: 'Make a shadow puppet show with your hands!', unlocked: false },
  { id: 'lc-static', title: 'Static Magic', category: 'micro', emoji: '⚡', funFact: 'When you rub a balloon on your hair, electrons jump - thats static electricity!', funFactAudio: 'When you rub a balloon on your hair, electrons jump - thats static electricity!', imageDescription: 'Static hair', tryAgainChallenge: 'Rub a balloon on your head and stick it to the wall!', unlocked: false },
  { id: 'lc-plants', title: 'Plant Growth', category: 'micro', emoji: '🌱', funFact: 'Plants eat sunlight! Its called photosynthesis.', funFactAudio: 'Plants eat sunlight! Its called photosynthesis.', imageDescription: 'Growing plant', tryAgainChallenge: 'Plant a seed and water it every day. Watch it grow!', unlocked: false },
  { id: 'lc-ice', title: 'Ice Experiments', category: 'micro', emoji: '🧊', funFact: 'Salt makes ice melt faster. Thats why we put salt on icy roads!', funFactAudio: 'Salt makes ice melt faster. Thats why we put salt on icy roads!', imageDescription: 'Melting ice', tryAgainChallenge: 'Race two ice cubes - one with salt, one without!', unlocked: false },
  { id: 'lc-density', title: 'Density Layers', category: 'micro', emoji: '🧪', funFact: 'Honey sinks below water because its denser. Oil floats because its less dense!', funFactAudio: 'Honey sinks below water because its denser. Oil floats because its less dense!', imageDescription: 'Liquid layers', tryAgainChallenge: 'With a grown-up, layer honey, water, and oil in a glass!', unlocked: false },
];

// Helper functions
export function getActivitiesByLane(lane: string): ScienceActivity[] {
  return scienceActivities.filter(a => a.lane === lane);
}

export function getLabCardsByCategory(category: string): LabCard[] {
  return labCards.filter(c => c.category === category);
}

export function getLabCardById(id: string): LabCard | undefined {
  return labCards.find(c => c.id === id);
}
