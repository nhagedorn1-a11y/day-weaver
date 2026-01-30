import { MathProblem } from '@/types/academics';

// Complete math problem library organized by concept
// Each problem includes visual cues for concrete learning

export const mathProblems: Record<string, MathProblem[]> = {
  // === COUNTING 1-5 ===
  'count-1-5': [
    { id: 'c5-1', type: 'counting', prompt: 'Count the apples', visualCue: '🍎', answer: 3, difficulty: 1 },
    { id: 'c5-2', type: 'counting', prompt: 'Count the stars', visualCue: '⭐', answer: 5, difficulty: 1 },
    { id: 'c5-3', type: 'counting', prompt: 'Count the cats', visualCue: '🐱', answer: 2, difficulty: 1 },
    { id: 'c5-4', type: 'counting', prompt: 'Count the balls', visualCue: '⚽', answer: 4, difficulty: 1 },
    { id: 'c5-5', type: 'counting', prompt: 'Count the hearts', visualCue: '❤️', answer: 1, difficulty: 1 },
    { id: 'c5-6', type: 'counting', prompt: 'Count the fish', visualCue: '🐟', answer: 5, difficulty: 1 },
    { id: 'c5-7', type: 'counting', prompt: 'Count the flowers', visualCue: '🌸', answer: 3, difficulty: 1 },
    { id: 'c5-8', type: 'counting', prompt: 'Count the birds', visualCue: '🐦', answer: 4, difficulty: 1 },
  ],

  // === COUNTING 1-10 ===
  'count-1-10': [
    { id: 'c10-1', type: 'counting', prompt: 'Count the cookies', visualCue: '🍪', answer: 7, difficulty: 1 },
    { id: 'c10-2', type: 'counting', prompt: 'Count the cars', visualCue: '🚗', answer: 8, difficulty: 1 },
    { id: 'c10-3', type: 'counting', prompt: 'Count the trees', visualCue: '🌳', answer: 6, difficulty: 1 },
    { id: 'c10-4', type: 'counting', prompt: 'Count the bees', visualCue: '🐝', answer: 9, difficulty: 1 },
    { id: 'c10-5', type: 'counting', prompt: 'Count the blocks', visualCue: '🧱', answer: 10, difficulty: 1 },
    { id: 'c10-6', type: 'counting', prompt: 'Count the butterflies', visualCue: '🦋', answer: 7, difficulty: 1 },
    { id: 'c10-7', type: 'counting', prompt: 'Count the rockets', visualCue: '🚀', answer: 8, difficulty: 2 },
    { id: 'c10-8', type: 'counting', prompt: 'Count the dinosaurs', visualCue: '🦕', answer: 6, difficulty: 2 },
  ],

  // === MORE OR LESS ===
  'more-less': [
    { id: 'ml-1', type: 'comparison', prompt: 'Which has MORE?', visualCue: '🍎🍎🍎 vs 🍎🍎', answer: 'left', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-2', type: 'comparison', prompt: 'Which has LESS?', visualCue: '⭐⭐ vs ⭐⭐⭐⭐', answer: 'left', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-3', type: 'comparison', prompt: 'Which has MORE?', visualCue: '🐱🐱🐱🐱 vs 🐱🐱', answer: 'left', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-4', type: 'comparison', prompt: 'Are they the SAME?', visualCue: '🌸🌸🌸 vs 🌸🌸🌸', answer: 'same', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-5', type: 'comparison', prompt: 'Which has MORE?', visualCue: '🐟🐟 vs 🐟🐟🐟🐟🐟', answer: 'right', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-6', type: 'comparison', prompt: 'Which has LESS?', visualCue: '🚗🚗🚗🚗🚗 vs 🚗🚗🚗', answer: 'right', options: ['left', 'right', 'same'], difficulty: 2 },
  ],

  // === ONE TO ONE CORRESPONDENCE ===
  'one-to-one': [
    { id: 'oto-1', type: 'counting', prompt: 'Match each dog to a bone', visualCue: '🐕🦴', answer: 3, difficulty: 1 },
    { id: 'oto-2', type: 'counting', prompt: 'Give each kid a balloon', visualCue: '👧🎈', answer: 4, difficulty: 1 },
    { id: 'oto-3', type: 'counting', prompt: 'Put one apple on each plate', visualCue: '🍎🍽️', answer: 5, difficulty: 1 },
    { id: 'oto-4', type: 'counting', prompt: 'Match each bee to a flower', visualCue: '🐝🌸', answer: 4, difficulty: 2 },
  ],

  // === ADDITION WITHIN 5 ===
  'add-within-5': [
    { id: 'a5-1', type: 'addition', prompt: '1 + 1 = ?', visualCue: '🍎 + 🍎', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 'a5-2', type: 'addition', prompt: '2 + 1 = ?', visualCue: '🍎🍎 + 🍎', answer: 3, options: [2, 3, 4, 5], difficulty: 1 },
    { id: 'a5-3', type: 'addition', prompt: '2 + 2 = ?', visualCue: '⭐⭐ + ⭐⭐', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'a5-4', type: 'addition', prompt: '1 + 2 = ?', visualCue: '🐱 + 🐱🐱', answer: 3, options: [2, 3, 4, 5], difficulty: 1 },
    { id: 'a5-5', type: 'addition', prompt: '3 + 1 = ?', visualCue: '🌸🌸🌸 + 🌸', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'a5-6', type: 'addition', prompt: '2 + 3 = ?', visualCue: '🐟🐟 + 🐟🐟🐟', answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { id: 'a5-7', type: 'addition', prompt: '1 + 4 = ?', visualCue: '🚗 + 🚗🚗🚗🚗', answer: 5, options: [4, 5, 6, 7], difficulty: 2 },
    { id: 'a5-8', type: 'addition', prompt: '0 + 3 = ?', visualCue: '(empty) + 🌳🌳🌳', answer: 3, options: [0, 2, 3, 4], difficulty: 2 },
  ],

  // === ADDITION WITHIN 10 ===
  'add-within-10': [
    { id: 'a10-1', type: 'addition', prompt: '3 + 4 = ?', visualCue: '🍪🍪🍪 + 🍪🍪🍪🍪', answer: 7, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'a10-2', type: 'addition', prompt: '5 + 2 = ?', visualCue: '⭐⭐⭐⭐⭐ + ⭐⭐', answer: 7, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'a10-3', type: 'addition', prompt: '4 + 4 = ?', visualCue: '🐝🐝🐝🐝 + 🐝🐝🐝🐝', answer: 8, options: [7, 8, 9, 10], difficulty: 1 },
    { id: 'a10-4', type: 'addition', prompt: '6 + 3 = ?', visualCue: '🌸🌸🌸🌸🌸🌸 + 🌸🌸🌸', answer: 9, options: [8, 9, 10, 11], difficulty: 2 },
    { id: 'a10-5', type: 'addition', prompt: '5 + 5 = ?', visualCue: '✋ + ✋', answer: 10, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 'a10-6', type: 'addition', prompt: '7 + 2 = ?', visualCue: '🐦🐦🐦🐦🐦🐦🐦 + 🐦🐦', answer: 9, options: [8, 9, 10, 11], difficulty: 2 },
    { id: 'a10-7', type: 'addition', prompt: '4 + 6 = ?', visualCue: '🎈🎈🎈🎈 + 🎈🎈🎈🎈🎈🎈', answer: 10, options: [9, 10, 11, 12], difficulty: 2 },
    { id: 'a10-8', type: 'addition', prompt: '3 + 5 = ?', visualCue: '🚀🚀🚀 + 🚀🚀🚀🚀🚀', answer: 8, options: [7, 8, 9, 10], difficulty: 2 },
  ],

  // === SUBTRACTION WITHIN 5 ===
  'subtract-within-5': [
    { id: 's5-1', type: 'subtraction', prompt: '3 - 1 = ?', visualCue: '🍎🍎🍎 take away 🍎', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 's5-2', type: 'subtraction', prompt: '4 - 2 = ?', visualCue: '⭐⭐⭐⭐ take away ⭐⭐', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 's5-3', type: 'subtraction', prompt: '5 - 1 = ?', visualCue: '🐱🐱🐱🐱🐱 take away 🐱', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 's5-4', type: 'subtraction', prompt: '2 - 1 = ?', visualCue: '🌸🌸 take away 🌸', answer: 1, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 's5-5', type: 'subtraction', prompt: '5 - 3 = ?', visualCue: '🐟🐟🐟🐟🐟 take away 🐟🐟🐟', answer: 2, options: [1, 2, 3, 4], difficulty: 2 },
    { id: 's5-6', type: 'subtraction', prompt: '4 - 4 = ?', visualCue: '🚗🚗🚗🚗 take away 🚗🚗🚗🚗', answer: 0, options: [0, 1, 2, 4], difficulty: 2 },
  ],

  // === SUBTRACTION WITHIN 10 ===
  'subtract-within-10': [
    { id: 's10-1', type: 'subtraction', prompt: '7 - 3 = ?', visualCue: '🍪🍪🍪🍪🍪🍪🍪 take away 🍪🍪🍪', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 's10-2', type: 'subtraction', prompt: '8 - 2 = ?', visualCue: '🌳🌳🌳🌳🌳🌳🌳🌳 take away 🌳🌳', answer: 6, options: [5, 6, 7, 8], difficulty: 1 },
    { id: 's10-3', type: 'subtraction', prompt: '10 - 5 = ?', visualCue: '✋✋ take away ✋', answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { id: 's10-4', type: 'subtraction', prompt: '9 - 4 = ?', visualCue: '🐝🐝🐝🐝🐝🐝🐝🐝🐝 take away 🐝🐝🐝🐝', answer: 5, options: [4, 5, 6, 7], difficulty: 2 },
    { id: 's10-5', type: 'subtraction', prompt: '6 - 6 = ?', visualCue: '🦋🦋🦋🦋🦋🦋 take away 🦋🦋🦋🦋🦋🦋', answer: 0, options: [0, 1, 2, 6], difficulty: 2 },
    { id: 's10-6', type: 'subtraction', prompt: '10 - 7 = ?', visualCue: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈 take away 🎈🎈🎈🎈🎈🎈🎈', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
  ],

  // === SHAPES 2D ===
  'shapes-2d': [
    { id: 'sh-1', type: 'shapes', prompt: 'What shape is this?', visualCue: '⭕', answer: 'circle', options: ['circle', 'square', 'triangle'], difficulty: 1 },
    { id: 'sh-2', type: 'shapes', prompt: 'What shape is this?', visualCue: '⬛', answer: 'square', options: ['circle', 'square', 'triangle'], difficulty: 1 },
    { id: 'sh-3', type: 'shapes', prompt: 'What shape is this?', visualCue: '🔺', answer: 'triangle', options: ['circle', 'square', 'triangle'], difficulty: 1 },
    { id: 'sh-4', type: 'shapes', prompt: 'What shape is this?', visualCue: '▬', answer: 'rectangle', options: ['rectangle', 'square', 'oval'], difficulty: 1 },
    { id: 'sh-5', type: 'shapes', prompt: 'How many sides does a triangle have?', visualCue: '🔺', answer: 3, options: [2, 3, 4, 5], difficulty: 1 },
    { id: 'sh-6', type: 'shapes', prompt: 'How many corners does a square have?', visualCue: '⬛', answer: 4, options: [3, 4, 5, 6], difficulty: 2 },
  ],

  // === PATTERNS ===
  'patterns-ab': [
    { id: 'p-1', type: 'patterns', prompt: 'What comes next? 🔴🔵🔴🔵🔴?', visualCue: '🔴🔵🔴🔵🔴', answer: '🔵', options: ['🔴', '🔵'], difficulty: 1 },
    { id: 'p-2', type: 'patterns', prompt: 'What comes next? ⭐🌙⭐🌙⭐?', visualCue: '⭐🌙⭐🌙⭐', answer: '🌙', options: ['⭐', '🌙'], difficulty: 1 },
    { id: 'p-3', type: 'patterns', prompt: 'What comes next? 🐱🐕🐱🐕?', visualCue: '🐱🐕🐱🐕', answer: '🐱', options: ['🐱', '🐕'], difficulty: 1 },
    { id: 'p-4', type: 'patterns', prompt: 'What comes next? 🍎🍌🍎🍌🍎🍌?', visualCue: '🍎🍌🍎🍌🍎🍌', answer: '🍎', options: ['🍎', '🍌'], difficulty: 1 },
  ],

  'patterns-abc': [
    { id: 'p-5', type: 'patterns', prompt: 'What comes next? 🔴🔵🟢🔴🔵?', visualCue: '🔴🔵🟢🔴🔵', answer: '🟢', options: ['🔴', '🔵', '🟢'], difficulty: 2 },
    { id: 'p-6', type: 'patterns', prompt: 'What comes next? ⭐🌙☀️⭐🌙?', visualCue: '⭐🌙☀️⭐🌙', answer: '☀️', options: ['⭐', '🌙', '☀️'], difficulty: 2 },
    { id: 'p-7', type: 'patterns', prompt: 'What comes next? 🐱🐕🐰🐱🐕🐰🐱?', visualCue: '🐱🐕🐰🐱🐕🐰🐱', answer: '🐕', options: ['🐱', '🐕', '🐰'], difficulty: 2 },
  ],

  // === NUMBER BONDS ===
  'number-bonds': [
    { id: 'nb-1', type: 'addition', prompt: 'What + 2 = 5?', visualCue: '? + 🍎🍎 = 🍎🍎🍎🍎🍎', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 'nb-2', type: 'addition', prompt: 'What + 4 = 10?', visualCue: '? + 🌸🌸🌸🌸 = 10', answer: 6, options: [4, 5, 6, 7], difficulty: 2 },
    { id: 'nb-3', type: 'addition', prompt: '7 + what = 10?', visualCue: '🐝🐝🐝🐝🐝🐝🐝 + ? = 10', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 'nb-4', type: 'addition', prompt: 'What + 5 = 5?', visualCue: '? + ✋ = ✋', answer: 0, options: [0, 1, 5, 10], difficulty: 2 },
  ],

  // === NUMBER ORDER (before/after) ===
  'number-order': [
    { id: 'no-1', type: 'counting', prompt: 'What comes after 3?', visualCue: '1 ➡️ 2 ➡️ 3 ➡️ ?', answer: 4, options: [2, 3, 4, 5], difficulty: 1 },
    { id: 'no-2', type: 'counting', prompt: 'What comes before 5?', visualCue: '? ➡️ 5', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'no-3', type: 'counting', prompt: 'What comes after 7?', visualCue: '6 ➡️ 7 ➡️ ?', answer: 8, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'no-4', type: 'counting', prompt: 'What comes before 10?', visualCue: '? ➡️ 10', answer: 9, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 'no-5', type: 'counting', prompt: 'What number is between 4 and 6?', visualCue: '4 ➡️ ? ➡️ 6', answer: 5, options: [3, 4, 5, 6], difficulty: 2 },
    { id: 'no-6', type: 'counting', prompt: 'Put in order: 3, 1, 2', visualCue: '🔢', answer: '1, 2, 3', options: ['1, 2, 3', '2, 1, 3', '3, 2, 1'], difficulty: 2 },
  ],

  // === BEFORE/AFTER (separate concept) ===
  'before-after': [
    { id: 'ba-1', type: 'counting', prompt: 'What comes just before 2?', visualCue: '? ⬅️ 2', answer: 1, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 'ba-2', type: 'counting', prompt: 'What comes just after 6?', visualCue: '6 ➡️ ?', answer: 7, options: [5, 6, 7, 8], difficulty: 1 },
    { id: 'ba-3', type: 'counting', prompt: 'What comes just before 8?', visualCue: '? ⬅️ 8', answer: 7, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'ba-4', type: 'counting', prompt: 'What comes just after 9?', visualCue: '9 ➡️ ?', answer: 10, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 'ba-5', type: 'counting', prompt: 'What comes between 7 and 9?', visualCue: '7 ➡️ ? ➡️ 9', answer: 8, options: [6, 7, 8, 9], difficulty: 2 },
    { id: 'ba-6', type: 'counting', prompt: 'What comes just before 1?', visualCue: '? ⬅️ 1', answer: 0, options: [0, 1, 2, 3], difficulty: 2 },
  ],

  // === DOUBLES ===
  'add-doubles': [
    { id: 'd-1', type: 'addition', prompt: '1 + 1 = ?', visualCue: '🖐️ + 🖐️ (1 finger each)', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 'd-2', type: 'addition', prompt: '2 + 2 = ?', visualCue: '👀 + 👀', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'd-3', type: 'addition', prompt: '3 + 3 = ?', visualCue: '🍀 + 🍀 (3 leaves each)', answer: 6, options: [5, 6, 7, 8], difficulty: 1 },
    { id: 'd-4', type: 'addition', prompt: '4 + 4 = ?', visualCue: '🐙 legs! (4 + 4)', answer: 8, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'd-5', type: 'addition', prompt: '5 + 5 = ?', visualCue: '✋ + ✋', answer: 10, options: [8, 9, 10, 11], difficulty: 1 },
  ],

  // === MAKE TEN ===
  'make-ten': [
    { id: 'mt-1', type: 'addition', prompt: '9 + ? = 10', visualCue: '🔟 frame with 9 filled', answer: 1, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 'mt-2', type: 'addition', prompt: '8 + ? = 10', visualCue: '🔟 frame with 8 filled', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 'mt-3', type: 'addition', prompt: '7 + ? = 10', visualCue: '🔟 frame with 7 filled', answer: 3, options: [2, 3, 4, 5], difficulty: 1 },
    { id: 'mt-4', type: 'addition', prompt: '6 + ? = 10', visualCue: '🔟 frame with 6 filled', answer: 4, options: [3, 4, 5, 6], difficulty: 2 },
    { id: 'mt-5', type: 'addition', prompt: '5 + ? = 10', visualCue: '✋ + ?', answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { id: 'mt-6', type: 'addition', prompt: '4 + ? = 10', visualCue: '🔟 frame with 4 filled', answer: 6, options: [5, 6, 7, 8], difficulty: 2 },
  ],
};

// Get problems for a specific concept
export const getProblemsForConcept = (conceptTag: string): MathProblem[] => {
  return mathProblems[conceptTag] || [];
};

// Get random selection of problems from a concept
export const getRandomProblems = (conceptTag: string, count: number): MathProblem[] => {
  const problems = getProblemsForConcept(conceptTag);
  const shuffled = [...problems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get all available concept tags
export const getAvailableMathConcepts = (): string[] => {
  return Object.keys(mathProblems);
};
