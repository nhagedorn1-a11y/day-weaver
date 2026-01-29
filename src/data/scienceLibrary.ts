import { ScienceConcept, ScienceActivity } from '@/types/academics';

// Science concept library with visual cues
// Organized by domain: Life, Earth, Physical, Space

export const scienceConcepts: Record<string, ScienceConcept> = {
  // === LIFE SCIENCE ===
  'living-nonliving': { id: 'living-nonliving', name: 'Living vs Non-Living', emoji: '🌱🪨', category: 'life', description: 'Things that are alive need food, water, air, and grow' },
  'plant-parts': { id: 'plant-parts', name: 'Parts of a Plant', emoji: '🌻', category: 'life', description: 'Roots, stem, leaves, flower, seeds' },
  'plant-needs': { id: 'plant-needs', name: 'What Plants Need', emoji: '☀️💧', category: 'life', description: 'Plants need sun, water, air, and soil to grow' },
  'animal-needs': { id: 'animal-needs', name: 'What Animals Need', emoji: '🐕🍖', category: 'life', description: 'Animals need food, water, air, and shelter' },
  'animal-homes': { id: 'animal-homes', name: 'Animal Homes', emoji: '🏠🐦', category: 'life', description: 'Where different animals live: nests, dens, burrows' },
  'life-cycles': { id: 'life-cycles', name: 'Life Cycles', emoji: '🐛🦋', category: 'life', description: 'How living things grow and change' },
  'body-parts': { id: 'body-parts', name: 'Body Parts', emoji: '👀👂', category: 'life', description: 'Eyes, ears, nose, hands, feet and what they do' },
  'five-senses': { id: 'five-senses', name: 'Five Senses', emoji: '👁️👂👃👅🖐️', category: 'life', description: 'See, hear, smell, taste, touch' },

  // === EARTH SCIENCE ===
  'weather': { id: 'weather', name: 'Weather', emoji: '☀️🌧️', category: 'earth', description: 'Sunny, cloudy, rainy, snowy, windy' },
  'seasons': { id: 'seasons', name: 'Seasons', emoji: '🌸🌻🍂❄️', category: 'earth', description: 'Spring, summer, fall, winter' },
  'day-night': { id: 'day-night', name: 'Day and Night', emoji: '🌞🌙', category: 'earth', description: 'When the sun is up and when it sets' },
  'water-cycle': { id: 'water-cycle', name: 'Water Cycle', emoji: '💧☁️🌧️', category: 'earth', description: 'How water moves: evaporate, cloud, rain' },
  'rocks-soil': { id: 'rocks-soil', name: 'Rocks and Soil', emoji: '🪨🌱', category: 'earth', description: 'Different types of rocks and what soil is made of' },
  'landforms': { id: 'landforms', name: 'Landforms', emoji: '🏔️🏖️', category: 'earth', description: 'Mountains, hills, valleys, rivers, lakes, oceans' },

  // === PHYSICAL SCIENCE ===
  'matter-states': { id: 'matter-states', name: 'States of Matter', emoji: '🧊💧💨', category: 'physical', description: 'Solid, liquid, gas' },
  'push-pull': { id: 'push-pull', name: 'Push and Pull', emoji: '👐', category: 'physical', description: 'Forces that make things move' },
  'magnets': { id: 'magnets', name: 'Magnets', emoji: '🧲', category: 'physical', description: 'What magnets attract and repel' },
  'sink-float': { id: 'sink-float', name: 'Sink or Float', emoji: '🚢⚓', category: 'physical', description: 'Why some things sink and some float' },
  'light-shadow': { id: 'light-shadow', name: 'Light and Shadows', emoji: '💡👤', category: 'physical', description: 'How light makes shadows' },
  'sound': { id: 'sound', name: 'Sound', emoji: '🔊👂', category: 'physical', description: 'How sounds are made and travel' },

  // === SPACE SCIENCE ===
  'sun-moon': { id: 'sun-moon', name: 'Sun and Moon', emoji: '☀️🌙', category: 'space', description: 'The sun gives light and heat, the moon reflects light' },
  'stars': { id: 'stars', name: 'Stars', emoji: '⭐✨', category: 'space', description: 'Stars are far away suns' },
  'planets': { id: 'planets', name: 'Planets', emoji: '🪐🌍', category: 'space', description: 'Earth and other planets orbit the sun' },
};

// Science activities library
export const scienceActivities: Record<string, ScienceActivity[]> = {
  'living-nonliving': [
    { id: 'ln-1', title: 'Sort Living Things', conceptId: 'living-nonliving', type: 'classify', prompt: 'Sort these into living and non-living groups', visualCue: '🐕🪨🌺🚗' },
    { id: 'ln-2', title: 'Does it Grow?', conceptId: 'living-nonliving', type: 'observe', prompt: 'Which things can grow bigger?', visualCue: '🌱👶' },
    { id: 'ln-3', title: 'Find Living Things', conceptId: 'living-nonliving', type: 'observe', prompt: 'Look around. What living things do you see?', visualCue: '🔍🌿' },
  ],

  'plant-parts': [
    { id: 'pp-1', title: 'Name the Parts', conceptId: 'plant-parts', type: 'observe', prompt: 'Point to: roots, stem, leaves, flower', visualCue: '🌻' },
    { id: 'pp-2', title: 'What Do Roots Do?', conceptId: 'plant-parts', type: 'predict', prompt: 'What do you think roots do for the plant?', visualCue: '🌱' },
  ],

  'weather': [
    { id: 'w-1', title: 'Weather Watch', conceptId: 'weather', type: 'observe', prompt: "Look outside! What's the weather today?", visualCue: '🌤️' },
    { id: 'w-2', title: 'Weather Sort', conceptId: 'weather', type: 'classify', prompt: 'Sort these activities by weather', visualCue: '☔🏖️' },
    { id: 'w-3', title: 'What to Wear?', conceptId: 'weather', type: 'predict', prompt: 'What would you wear in this weather?', visualCue: '👕🧥' },
  ],

  'five-senses': [
    { id: 'fs-1', title: 'I Spy with My Eyes', conceptId: 'five-senses', type: 'observe', prompt: 'What can you SEE around you?', visualCue: '👁️' },
    { id: 'fs-2', title: 'Listen Carefully', conceptId: 'five-senses', type: 'observe', prompt: 'Close your eyes. What sounds do you HEAR?', visualCue: '👂' },
    { id: 'fs-3', title: 'Texture Hunt', conceptId: 'five-senses', type: 'experiment', prompt: 'Find something soft, rough, smooth', visualCue: '🖐️' },
    { id: 'fs-4', title: 'Smell Test', conceptId: 'five-senses', type: 'classify', prompt: 'Sort smells: good smell or stinky?', visualCue: '👃' },
  ],

  'push-pull': [
    { id: 'pp-1', title: 'Push or Pull?', conceptId: 'push-pull', type: 'classify', prompt: 'Is opening a door a push or pull?', visualCue: '🚪' },
    { id: 'pp-2', title: 'Make It Move', conceptId: 'push-pull', type: 'experiment', prompt: 'How can you make a ball move?', visualCue: '⚽' },
  ],

  'sink-float': [
    { id: 'sf-1', title: 'Predict: Sink or Float', conceptId: 'sink-float', type: 'predict', prompt: 'Will this sink or float?', visualCue: '🪨🍎' },
    { id: 'sf-2', title: 'Test It!', conceptId: 'sink-float', type: 'experiment', prompt: 'Put it in water. What happens?', visualCue: '🛁', materials: ['water', 'objects to test'] },
  ],

  'matter-states': [
    { id: 'ms-1', title: 'Solid, Liquid, Gas Hunt', conceptId: 'matter-states', type: 'classify', prompt: 'Find examples of solid, liquid, gas', visualCue: '🧊💧💨' },
    { id: 'ms-2', title: 'Ice Cube Watch', conceptId: 'matter-states', type: 'observe', prompt: 'Watch the ice cube. What happens?', visualCue: '🧊→💧' },
  ],
};

// Get concept by ID
export const getScienceConcept = (id: string): ScienceConcept | undefined => {
  return scienceConcepts[id];
};

// Get all concepts
export const getAllScienceConcepts = (): ScienceConcept[] => {
  return Object.values(scienceConcepts);
};

// Get concepts by category
export const getConceptsByCategory = (category: 'life' | 'earth' | 'physical' | 'space'): ScienceConcept[] => {
  return Object.values(scienceConcepts).filter(c => c.category === category);
};

// Get activities for a concept
export const getActivitiesForConcept = (conceptId: string): ScienceActivity[] => {
  return scienceActivities[conceptId] || [];
};

// Get random activities
export const getRandomActivities = (conceptId: string, count: number): ScienceActivity[] => {
  const activities = getActivitiesForConcept(conceptId);
  const shuffled = [...activities].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
