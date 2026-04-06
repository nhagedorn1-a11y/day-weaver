import { MathProblem } from '@/types/academics';

// Complete math problem library organized by concept
// Each concept has 15-20 problems for session variety via random selection

const EMOJIS = ['🍎','⭐','🐱','⚽','❤️','🐟','🌸','🐦','🍪','🚗','🌳','🐝','🧱','🦋','🚀','🦕','🎈','🐙','🌻','🦊'];

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
    { id: 'c5-9', type: 'counting', prompt: 'Count the cookies', visualCue: '🍪', answer: 2, difficulty: 1 },
    { id: 'c5-10', type: 'counting', prompt: 'Count the trees', visualCue: '🌳', answer: 5, difficulty: 1 },
    { id: 'c5-11', type: 'counting', prompt: 'Count the bees', visualCue: '🐝', answer: 3, difficulty: 1 },
    { id: 'c5-12', type: 'counting', prompt: 'Count the rockets', visualCue: '🚀', answer: 1, difficulty: 1 },
    { id: 'c5-13', type: 'counting', prompt: 'Count the butterflies', visualCue: '🦋', answer: 4, difficulty: 1 },
    { id: 'c5-14', type: 'counting', prompt: 'Count the foxes', visualCue: '🦊', answer: 2, difficulty: 1 },
    { id: 'c5-15', type: 'counting', prompt: 'Count the cars', visualCue: '🚗', answer: 5, difficulty: 1 },
    { id: 'c5-16', type: 'counting', prompt: 'Count the sunflowers', visualCue: '🌻', answer: 4, difficulty: 1 },
    { id: 'c5-17', type: 'counting', prompt: 'Count the blocks', visualCue: '🧱', answer: 3, difficulty: 1 },
    { id: 'c5-18', type: 'counting', prompt: 'Count the balloons', visualCue: '🎈', answer: 1, difficulty: 1 },
    { id: 'c5-19', type: 'counting', prompt: 'Count the dinosaurs', visualCue: '🦕', answer: 2, difficulty: 1 },
    { id: 'c5-20', type: 'counting', prompt: 'Count the octopus arms', visualCue: '🐙', answer: 4, difficulty: 1 },
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
    { id: 'c10-9', type: 'counting', prompt: 'Count the apples', visualCue: '🍎', answer: 9, difficulty: 1 },
    { id: 'c10-10', type: 'counting', prompt: 'Count the fish', visualCue: '🐟', answer: 10, difficulty: 1 },
    { id: 'c10-11', type: 'counting', prompt: 'Count the flowers', visualCue: '🌸', answer: 7, difficulty: 1 },
    { id: 'c10-12', type: 'counting', prompt: 'Count the hearts', visualCue: '❤️', answer: 8, difficulty: 1 },
    { id: 'c10-13', type: 'counting', prompt: 'Count the foxes', visualCue: '🦊', answer: 6, difficulty: 2 },
    { id: 'c10-14', type: 'counting', prompt: 'Count the cats', visualCue: '🐱', answer: 9, difficulty: 1 },
    { id: 'c10-15', type: 'counting', prompt: 'Count the balloons', visualCue: '🎈', answer: 10, difficulty: 2 },
    { id: 'c10-16', type: 'counting', prompt: 'Count the stars', visualCue: '⭐', answer: 7, difficulty: 1 },
    { id: 'c10-17', type: 'counting', prompt: 'Count the sunflowers', visualCue: '🌻', answer: 8, difficulty: 2 },
    { id: 'c10-18', type: 'counting', prompt: 'Count the birds', visualCue: '🐦', answer: 6, difficulty: 1 },
    { id: 'c10-19', type: 'counting', prompt: 'Count the balls', visualCue: '⚽', answer: 9, difficulty: 2 },
    { id: 'c10-20', type: 'counting', prompt: 'Count the octopuses', visualCue: '🐙', answer: 10, difficulty: 2 },
  ],

  // === MORE OR LESS ===
  'more-less': [
    { id: 'ml-1', type: 'comparison', prompt: 'Which has MORE?', visualCue: '🍎🍎🍎 vs 🍎🍎', answer: 'left', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-2', type: 'comparison', prompt: 'Which has LESS?', visualCue: '⭐⭐ vs ⭐⭐⭐⭐', answer: 'left', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-3', type: 'comparison', prompt: 'Which has MORE?', visualCue: '🐱🐱🐱🐱 vs 🐱🐱', answer: 'left', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-4', type: 'comparison', prompt: 'Are they the SAME?', visualCue: '🌸🌸🌸 vs 🌸🌸🌸', answer: 'same', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-5', type: 'comparison', prompt: 'Which has MORE?', visualCue: '🐟🐟 vs 🐟🐟🐟🐟🐟', answer: 'right', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-6', type: 'comparison', prompt: 'Which has LESS?', visualCue: '🚗🚗🚗🚗🚗 vs 🚗🚗🚗', answer: 'right', options: ['left', 'right', 'same'], difficulty: 2 },
    { id: 'ml-7', type: 'comparison', prompt: 'Which has MORE?', visualCue: '🍪🍪🍪🍪🍪 vs 🍪🍪🍪', answer: 'left', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-8', type: 'comparison', prompt: 'Are they the SAME?', visualCue: '🦋🦋🦋🦋 vs 🦋🦋🦋🦋', answer: 'same', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-9', type: 'comparison', prompt: 'Which has LESS?', visualCue: '🐝🐝 vs 🐝🐝🐝🐝🐝🐝', answer: 'left', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-10', type: 'comparison', prompt: 'Which has MORE?', visualCue: '🌳🌳🌳🌳🌳🌳 vs 🌳🌳🌳🌳', answer: 'left', options: ['left', 'right', 'same'], difficulty: 2 },
    { id: 'ml-11', type: 'comparison', prompt: 'Which has LESS?', visualCue: '🎈🎈🎈 vs 🎈🎈🎈🎈🎈', answer: 'left', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-12', type: 'comparison', prompt: 'Are they the SAME?', visualCue: '🦊🦊 vs 🦊🦊', answer: 'same', options: ['left', 'right', 'same'], difficulty: 1 },
    { id: 'ml-13', type: 'comparison', prompt: 'Which has MORE?', visualCue: '🚀🚀 vs 🚀🚀🚀🚀🚀🚀', answer: 'right', options: ['left', 'right', 'same'], difficulty: 2 },
    { id: 'ml-14', type: 'comparison', prompt: 'Which has LESS?', visualCue: '🦕🦕🦕🦕 vs 🦕🦕', answer: 'right', options: ['left', 'right', 'same'], difficulty: 2 },
    { id: 'ml-15', type: 'comparison', prompt: 'Which has MORE?', visualCue: '🐙🐙🐙 vs 🐙🐙🐙🐙🐙🐙🐙', answer: 'right', options: ['left', 'right', 'same'], difficulty: 2 },
  ],

  // === ONE TO ONE CORRESPONDENCE ===
  'one-to-one': [
    { id: 'oto-1', type: 'counting', prompt: 'Match each dog to a bone', visualCue: '🐕🦴', answer: 3, difficulty: 1 },
    { id: 'oto-2', type: 'counting', prompt: 'Give each kid a balloon', visualCue: '👧🎈', answer: 4, difficulty: 1 },
    { id: 'oto-3', type: 'counting', prompt: 'Put one apple on each plate', visualCue: '🍎🍽️', answer: 5, difficulty: 1 },
    { id: 'oto-4', type: 'counting', prompt: 'Match each bee to a flower', visualCue: '🐝🌸', answer: 4, difficulty: 2 },
    { id: 'oto-5', type: 'counting', prompt: 'Give each cat a fish', visualCue: '🐱🐟', answer: 3, difficulty: 1 },
    { id: 'oto-6', type: 'counting', prompt: 'Match each bird to a nest', visualCue: '🐦🪺', answer: 5, difficulty: 1 },
    { id: 'oto-7', type: 'counting', prompt: 'Give each fox a berry', visualCue: '🦊🫐', answer: 2, difficulty: 1 },
    { id: 'oto-8', type: 'counting', prompt: 'Put one star on each flag', visualCue: '⭐🚩', answer: 4, difficulty: 1 },
    { id: 'oto-9', type: 'counting', prompt: 'Match each butterfly to a flower', visualCue: '🦋🌺', answer: 3, difficulty: 2 },
    { id: 'oto-10', type: 'counting', prompt: 'Give each monkey a banana', visualCue: '🐵🍌', answer: 5, difficulty: 1 },
    { id: 'oto-11', type: 'counting', prompt: 'Match each car to a road', visualCue: '🚗🛣️', answer: 2, difficulty: 1 },
    { id: 'oto-12', type: 'counting', prompt: 'Give each bear a honey pot', visualCue: '🐻🍯', answer: 4, difficulty: 2 },
    { id: 'oto-13', type: 'counting', prompt: 'Put one hat on each head', visualCue: '🎩👤', answer: 3, difficulty: 1 },
    { id: 'oto-14', type: 'counting', prompt: 'Match each turtle to a pond', visualCue: '🐢💧', answer: 5, difficulty: 2 },
    { id: 'oto-15', type: 'counting', prompt: 'Give each rabbit a carrot', visualCue: '🐰🥕', answer: 4, difficulty: 1 },
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
    { id: 'a5-9', type: 'addition', prompt: '3 + 2 = ?', visualCue: '🐝🐝🐝 + 🐝🐝', answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { id: 'a5-10', type: 'addition', prompt: '4 + 1 = ?', visualCue: '🦋🦋🦋🦋 + 🦋', answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { id: 'a5-11', type: 'addition', prompt: '1 + 3 = ?', visualCue: '🎈 + 🎈🎈🎈', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'a5-12', type: 'addition', prompt: '0 + 5 = ?', visualCue: '(empty) + 🌻🌻🌻🌻🌻', answer: 5, options: [4, 5, 6, 0], difficulty: 2 },
    { id: 'a5-13', type: 'addition', prompt: '0 + 1 = ?', visualCue: '(empty) + 🐙', answer: 1, options: [0, 1, 2, 3], difficulty: 2 },
    { id: 'a5-14', type: 'addition', prompt: '4 + 0 = ?', visualCue: '🦊🦊🦊🦊 + (empty)', answer: 4, options: [3, 4, 5, 0], difficulty: 2 },
    { id: 'a5-15', type: 'addition', prompt: '2 + 2 = ?', visualCue: '🚀🚀 + 🚀🚀', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'a5-16', type: 'addition', prompt: '1 + 1 = ?', visualCue: '🐦 + 🐦', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 'a5-17', type: 'addition', prompt: '3 + 0 = ?', visualCue: '🍪🍪🍪 + (empty)', answer: 3, options: [2, 3, 4, 0], difficulty: 2 },
    { id: 'a5-18', type: 'addition', prompt: '0 + 4 = ?', visualCue: '(empty) + 🧱🧱🧱🧱', answer: 4, options: [3, 4, 5, 0], difficulty: 2 },
    { id: 'a5-19', type: 'addition', prompt: '0 + 2 = ?', visualCue: '(empty) + 🦕🦕', answer: 2, options: [0, 1, 2, 3], difficulty: 2 },
    { id: 'a5-20', type: 'addition', prompt: '5 + 0 = ?', visualCue: '❤️❤️❤️❤️❤️ + (empty)', answer: 5, options: [4, 5, 6, 0], difficulty: 2 },
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
    { id: 'a10-9', type: 'addition', prompt: '6 + 2 = ?', visualCue: '🐱🐱🐱🐱🐱🐱 + 🐱🐱', answer: 8, options: [7, 8, 9, 10], difficulty: 1 },
    { id: 'a10-10', type: 'addition', prompt: '4 + 3 = ?', visualCue: '🦋🦋🦋🦋 + 🦋🦋🦋', answer: 7, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'a10-11', type: 'addition', prompt: '2 + 6 = ?', visualCue: '🍎🍎 + 🍎🍎🍎🍎🍎🍎', answer: 8, options: [7, 8, 9, 10], difficulty: 1 },
    { id: 'a10-12', type: 'addition', prompt: '8 + 1 = ?', visualCue: '🐟🐟🐟🐟🐟🐟🐟🐟 + 🐟', answer: 9, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 'a10-13', type: 'addition', prompt: '1 + 9 = ?', visualCue: '🌳 + 🌳🌳🌳🌳🌳🌳🌳🌳🌳', answer: 10, options: [9, 10, 11, 12], difficulty: 2 },
    { id: 'a10-14', type: 'addition', prompt: '3 + 6 = ?', visualCue: '🦊🦊🦊 + 🦊🦊🦊🦊🦊🦊', answer: 9, options: [8, 9, 10, 11], difficulty: 2 },
    { id: 'a10-15', type: 'addition', prompt: '5 + 4 = ?', visualCue: '🌻🌻🌻🌻🌻 + 🌻🌻🌻🌻', answer: 9, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 'a10-16', type: 'addition', prompt: '7 + 3 = ?', visualCue: '🍪🍪🍪🍪🍪🍪🍪 + 🍪🍪🍪', answer: 10, options: [9, 10, 11, 12], difficulty: 2 },
    { id: 'a10-17', type: 'addition', prompt: '2 + 8 = ?', visualCue: '🐝🐝 + 🐝🐝🐝🐝🐝🐝🐝🐝', answer: 10, options: [9, 10, 11, 12], difficulty: 2 },
    { id: 'a10-18', type: 'addition', prompt: '6 + 1 = ?', visualCue: '❤️❤️❤️❤️❤️❤️ + ❤️', answer: 7, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'a10-19', type: 'addition', prompt: '3 + 3 = ?', visualCue: '🧱🧱🧱 + 🧱🧱🧱', answer: 6, options: [5, 6, 7, 8], difficulty: 1 },
    { id: 'a10-20', type: 'addition', prompt: '4 + 5 = ?', visualCue: '🦕🦕🦕🦕 + 🦕🦕🦕🦕🦕', answer: 9, options: [8, 9, 10, 11], difficulty: 1 },
  ],

  // === SUBTRACTION WITHIN 5 ===
  'subtract-within-5': [
    { id: 's5-1', type: 'subtraction', prompt: '3 - 1 = ?', visualCue: '🍎🍎🍎 take away 🍎', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 's5-2', type: 'subtraction', prompt: '4 - 2 = ?', visualCue: '⭐⭐⭐⭐ take away ⭐⭐', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 's5-3', type: 'subtraction', prompt: '5 - 1 = ?', visualCue: '🐱🐱🐱🐱🐱 take away 🐱', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 's5-4', type: 'subtraction', prompt: '2 - 1 = ?', visualCue: '🌸🌸 take away 🌸', answer: 1, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 's5-5', type: 'subtraction', prompt: '5 - 3 = ?', visualCue: '🐟🐟🐟🐟🐟 take away 🐟🐟🐟', answer: 2, options: [1, 2, 3, 4], difficulty: 2 },
    { id: 's5-6', type: 'subtraction', prompt: '4 - 4 = ?', visualCue: '🚗🚗🚗🚗 take away 🚗🚗🚗🚗', answer: 0, options: [0, 1, 2, 4], difficulty: 2 },
    { id: 's5-7', type: 'subtraction', prompt: '5 - 2 = ?', visualCue: '🍪🍪🍪🍪🍪 take away 🍪🍪', answer: 3, options: [2, 3, 4, 5], difficulty: 1 },
    { id: 's5-8', type: 'subtraction', prompt: '3 - 2 = ?', visualCue: '🐝🐝🐝 take away 🐝🐝', answer: 1, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 's5-9', type: 'subtraction', prompt: '4 - 1 = ?', visualCue: '🦋🦋🦋🦋 take away 🦋', answer: 3, options: [2, 3, 4, 5], difficulty: 1 },
    { id: 's5-10', type: 'subtraction', prompt: '5 - 4 = ?', visualCue: '🎈🎈🎈🎈🎈 take away 🎈🎈🎈🎈', answer: 1, options: [0, 1, 2, 3], difficulty: 2 },
    { id: 's5-11', type: 'subtraction', prompt: '3 - 3 = ?', visualCue: '🌳🌳🌳 take away 🌳🌳🌳', answer: 0, options: [0, 1, 2, 3], difficulty: 2 },
    { id: 's5-12', type: 'subtraction', prompt: '5 - 5 = ?', visualCue: '🚀🚀🚀🚀🚀 take away 🚀🚀🚀🚀🚀', answer: 0, options: [0, 1, 5, 10], difficulty: 2 },
    { id: 's5-13', type: 'subtraction', prompt: '4 - 3 = ?', visualCue: '🦊🦊🦊🦊 take away 🦊🦊🦊', answer: 1, options: [0, 1, 2, 3], difficulty: 2 },
    { id: 's5-14', type: 'subtraction', prompt: '2 - 2 = ?', visualCue: '🐦🐦 take away 🐦🐦', answer: 0, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 's5-15', type: 'subtraction', prompt: '1 - 1 = ?', visualCue: '🌻 take away 🌻', answer: 0, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 's5-16', type: 'subtraction', prompt: '5 - 0 = ?', visualCue: '🐙🐙🐙🐙🐙 take away (none)', answer: 5, options: [0, 3, 4, 5], difficulty: 2 },
    { id: 's5-17', type: 'subtraction', prompt: '3 - 0 = ?', visualCue: '🧱🧱🧱 take away (none)', answer: 3, options: [0, 1, 2, 3], difficulty: 2 },
    { id: 's5-18', type: 'subtraction', prompt: '1 - 0 = ?', visualCue: '❤️ take away (none)', answer: 1, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 's5-19', type: 'subtraction', prompt: '4 - 0 = ?', visualCue: '🦕🦕🦕🦕 take away (none)', answer: 4, options: [0, 2, 3, 4], difficulty: 2 },
    { id: 's5-20', type: 'subtraction', prompt: '2 - 0 = ?', visualCue: '⚽⚽ take away (none)', answer: 2, options: [0, 1, 2, 3], difficulty: 1 },
  ],

  // === SUBTRACTION WITHIN 10 ===
  'subtract-within-10': [
    { id: 's10-1', type: 'subtraction', prompt: '7 - 3 = ?', visualCue: '🍪🍪🍪🍪🍪🍪🍪 take away 🍪🍪🍪', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 's10-2', type: 'subtraction', prompt: '8 - 2 = ?', visualCue: '🌳🌳🌳🌳🌳🌳🌳🌳 take away 🌳🌳', answer: 6, options: [5, 6, 7, 8], difficulty: 1 },
    { id: 's10-3', type: 'subtraction', prompt: '10 - 5 = ?', visualCue: '✋✋ take away ✋', answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { id: 's10-4', type: 'subtraction', prompt: '9 - 4 = ?', visualCue: '🐝🐝🐝🐝🐝🐝🐝🐝🐝 take away 🐝🐝🐝🐝', answer: 5, options: [4, 5, 6, 7], difficulty: 2 },
    { id: 's10-5', type: 'subtraction', prompt: '6 - 6 = ?', visualCue: '🦋🦋🦋🦋🦋🦋 take away 🦋🦋🦋🦋🦋🦋', answer: 0, options: [0, 1, 2, 6], difficulty: 2 },
    { id: 's10-6', type: 'subtraction', prompt: '10 - 7 = ?', visualCue: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈 take away 🎈🎈🎈🎈🎈🎈🎈', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 's10-7', type: 'subtraction', prompt: '9 - 3 = ?', visualCue: '🐱🐱🐱🐱🐱🐱🐱🐱🐱 take away 🐱🐱🐱', answer: 6, options: [5, 6, 7, 8], difficulty: 1 },
    { id: 's10-8', type: 'subtraction', prompt: '8 - 5 = ?', visualCue: '⭐⭐⭐⭐⭐⭐⭐⭐ take away ⭐⭐⭐⭐⭐', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 's10-9', type: 'subtraction', prompt: '7 - 2 = ?', visualCue: '🍎🍎🍎🍎🍎🍎🍎 take away 🍎🍎', answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { id: 's10-10', type: 'subtraction', prompt: '6 - 4 = ?', visualCue: '🐟🐟🐟🐟🐟🐟 take away 🐟🐟🐟🐟', answer: 2, options: [1, 2, 3, 4], difficulty: 2 },
    { id: 's10-11', type: 'subtraction', prompt: '10 - 3 = ?', visualCue: '🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸 take away 🌸🌸🌸', answer: 7, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 's10-12', type: 'subtraction', prompt: '8 - 4 = ?', visualCue: '🚗🚗🚗🚗🚗🚗🚗🚗 take away 🚗🚗🚗🚗', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 's10-13', type: 'subtraction', prompt: '9 - 6 = ?', visualCue: '🦊🦊🦊🦊🦊🦊🦊🦊🦊 take away 🦊🦊🦊🦊🦊🦊', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 's10-14', type: 'subtraction', prompt: '10 - 8 = ?', visualCue: '🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 take away 🚀🚀🚀🚀🚀🚀🚀🚀', answer: 2, options: [1, 2, 3, 4], difficulty: 2 },
    { id: 's10-15', type: 'subtraction', prompt: '7 - 7 = ?', visualCue: '🐦🐦🐦🐦🐦🐦🐦 take away 🐦🐦🐦🐦🐦🐦🐦', answer: 0, options: [0, 1, 7, 14], difficulty: 2 },
    { id: 's10-16', type: 'subtraction', prompt: '6 - 1 = ?', visualCue: '🌻🌻🌻🌻🌻🌻 take away 🌻', answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { id: 's10-17', type: 'subtraction', prompt: '10 - 1 = ?', visualCue: '🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙 take away 🐙', answer: 9, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 's10-18', type: 'subtraction', prompt: '8 - 8 = ?', visualCue: '🧱🧱🧱🧱🧱🧱🧱🧱 take away all', answer: 0, options: [0, 1, 2, 8], difficulty: 2 },
    { id: 's10-19', type: 'subtraction', prompt: '9 - 1 = ?', visualCue: '🦕🦕🦕🦕🦕🦕🦕🦕🦕 take away 🦕', answer: 8, options: [7, 8, 9, 10], difficulty: 1 },
    { id: 's10-20', type: 'subtraction', prompt: '10 - 2 = ?', visualCue: '❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️ take away ❤️❤️', answer: 8, options: [7, 8, 9, 10], difficulty: 1 },
  ],

  // === SHAPES 2D ===
  'shapes-2d': [
    { id: 'sh-1', type: 'shapes', prompt: 'What shape is this?', visualCue: '⭕', answer: 'circle', options: ['circle', 'square', 'triangle'], difficulty: 1 },
    { id: 'sh-2', type: 'shapes', prompt: 'What shape is this?', visualCue: '⬛', answer: 'square', options: ['circle', 'square', 'triangle'], difficulty: 1 },
    { id: 'sh-3', type: 'shapes', prompt: 'What shape is this?', visualCue: '🔺', answer: 'triangle', options: ['circle', 'square', 'triangle'], difficulty: 1 },
    { id: 'sh-4', type: 'shapes', prompt: 'What shape is this?', visualCue: '▬', answer: 'rectangle', options: ['rectangle', 'square', 'oval'], difficulty: 1 },
    { id: 'sh-5', type: 'shapes', prompt: 'How many sides does a triangle have?', visualCue: '🔺', answer: 3, options: [2, 3, 4, 5], difficulty: 1 },
    { id: 'sh-6', type: 'shapes', prompt: 'How many corners does a square have?', visualCue: '⬛', answer: 4, options: [3, 4, 5, 6], difficulty: 2 },
    { id: 'sh-7', type: 'shapes', prompt: 'How many sides does a rectangle have?', visualCue: '▬', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'sh-8', type: 'shapes', prompt: 'What shape has no corners?', visualCue: '🤔', answer: 'circle', options: ['circle', 'square', 'triangle'], difficulty: 1 },
    { id: 'sh-9', type: 'shapes', prompt: 'What shape has 3 sides?', visualCue: '🤔', answer: 'triangle', options: ['circle', 'square', 'triangle'], difficulty: 1 },
    { id: 'sh-10', type: 'shapes', prompt: 'How many corners does a circle have?', visualCue: '⭕', answer: 0, options: [0, 1, 2, 4], difficulty: 2 },
    { id: 'sh-11', type: 'shapes', prompt: 'Which shape can roll?', visualCue: '🤔', answer: 'circle', options: ['circle', 'square', 'triangle'], difficulty: 1 },
    { id: 'sh-12', type: 'shapes', prompt: 'What has 4 equal sides?', visualCue: '🤔', answer: 'square', options: ['rectangle', 'square', 'triangle'], difficulty: 2 },
    { id: 'sh-13', type: 'shapes', prompt: 'What shape is a pizza slice?', visualCue: '🍕', answer: 'triangle', options: ['circle', 'square', 'triangle'], difficulty: 1 },
    { id: 'sh-14', type: 'shapes', prompt: 'What shape is a clock?', visualCue: '🕐', answer: 'circle', options: ['circle', 'square', 'triangle'], difficulty: 1 },
    { id: 'sh-15', type: 'shapes', prompt: 'What shape is a door?', visualCue: '🚪', answer: 'rectangle', options: ['rectangle', 'square', 'circle'], difficulty: 2 },
  ],

  // === PATTERNS AB ===
  'patterns-ab': [
    { id: 'p-1', type: 'patterns', prompt: 'What comes next? 🔴🔵🔴🔵🔴?', visualCue: '🔴🔵🔴🔵🔴', answer: '🔵', options: ['🔴', '🔵'], difficulty: 1 },
    { id: 'p-2', type: 'patterns', prompt: 'What comes next? ⭐🌙⭐🌙⭐?', visualCue: '⭐🌙⭐🌙⭐', answer: '🌙', options: ['⭐', '🌙'], difficulty: 1 },
    { id: 'p-3', type: 'patterns', prompt: 'What comes next? 🐱🐕🐱🐕?', visualCue: '🐱🐕🐱🐕', answer: '🐱', options: ['🐱', '🐕'], difficulty: 1 },
    { id: 'p-4', type: 'patterns', prompt: 'What comes next? 🍎🍌🍎🍌🍎🍌?', visualCue: '🍎🍌🍎🍌🍎🍌', answer: '🍎', options: ['🍎', '🍌'], difficulty: 1 },
    { id: 'p-5', type: 'patterns', prompt: 'What comes next? 🌸🌻🌸🌻🌸?', visualCue: '🌸🌻🌸🌻🌸', answer: '🌻', options: ['🌸', '🌻'], difficulty: 1 },
    { id: 'p-6', type: 'patterns', prompt: 'What comes next? 🐸🐢🐸🐢?', visualCue: '🐸🐢🐸🐢', answer: '🐸', options: ['🐸', '🐢'], difficulty: 1 },
    { id: 'p-7', type: 'patterns', prompt: 'What comes next? ☀️🌧️☀️🌧️☀️?', visualCue: '☀️🌧️☀️🌧️☀️', answer: '🌧️', options: ['☀️', '🌧️'], difficulty: 1 },
    { id: 'p-8', type: 'patterns', prompt: 'What comes next? 🚗🚌🚗🚌🚗🚌?', visualCue: '🚗🚌🚗🚌🚗🚌', answer: '🚗', options: ['🚗', '🚌'], difficulty: 1 },
    { id: 'p-9', type: 'patterns', prompt: 'What comes next? 🔵🟢🔵🟢?', visualCue: '🔵🟢🔵🟢', answer: '🔵', options: ['🔵', '🟢'], difficulty: 1 },
    { id: 'p-10', type: 'patterns', prompt: 'What comes next? 🎵🎶🎵🎶🎵?', visualCue: '🎵🎶🎵🎶🎵', answer: '🎶', options: ['🎵', '🎶'], difficulty: 1 },
    { id: 'p-11', type: 'patterns', prompt: 'What comes next? 🐝🦋🐝🦋🐝?', visualCue: '🐝🦋🐝🦋🐝', answer: '🦋', options: ['🐝', '🦋'], difficulty: 1 },
    { id: 'p-12', type: 'patterns', prompt: 'What comes next? 🍕🌮🍕🌮?', visualCue: '🍕🌮🍕🌮', answer: '🍕', options: ['🍕', '🌮'], difficulty: 1 },
    { id: 'p-13', type: 'patterns', prompt: 'What comes next? 🧊🔥🧊🔥🧊?', visualCue: '🧊🔥🧊🔥🧊', answer: '🔥', options: ['🧊', '🔥'], difficulty: 1 },
    { id: 'p-14', type: 'patterns', prompt: 'What comes next? 🐟🐙🐟🐙🐟🐙?', visualCue: '🐟🐙🐟🐙🐟🐙', answer: '🐟', options: ['🐟', '🐙'], difficulty: 1 },
    { id: 'p-15', type: 'patterns', prompt: 'What comes next? 🌈☁️🌈☁️?', visualCue: '🌈☁️🌈☁️', answer: '🌈', options: ['🌈', '☁️'], difficulty: 1 },
  ],

  // === PATTERNS ABC ===
  'patterns-abc': [
    { id: 'pa-1', type: 'patterns', prompt: 'What comes next? 🔴🔵🟢🔴🔵?', visualCue: '🔴🔵🟢🔴🔵', answer: '🟢', options: ['🔴', '🔵', '🟢'], difficulty: 2 },
    { id: 'pa-2', type: 'patterns', prompt: 'What comes next? ⭐🌙☀️⭐🌙?', visualCue: '⭐🌙☀️⭐🌙', answer: '☀️', options: ['⭐', '🌙', '☀️'], difficulty: 2 },
    { id: 'pa-3', type: 'patterns', prompt: 'What comes next? 🐱🐕🐰🐱🐕🐰🐱?', visualCue: '🐱🐕🐰🐱🐕🐰🐱', answer: '🐕', options: ['🐱', '🐕', '🐰'], difficulty: 2 },
    { id: 'pa-4', type: 'patterns', prompt: 'What comes next? 🍎🍌🍇🍎🍌?', visualCue: '🍎🍌🍇🍎🍌', answer: '🍇', options: ['🍎', '🍌', '🍇'], difficulty: 2 },
    { id: 'pa-5', type: 'patterns', prompt: 'What comes next? 🚗🚌🚂🚗🚌🚂🚗?', visualCue: '🚗🚌🚂🚗🚌🚂🚗', answer: '🚌', options: ['🚗', '🚌', '🚂'], difficulty: 2 },
    { id: 'pa-6', type: 'patterns', prompt: 'What comes next? 🌸🌺🌻🌸🌺?', visualCue: '🌸🌺🌻🌸🌺', answer: '🌻', options: ['🌸', '🌺', '🌻'], difficulty: 2 },
    { id: 'pa-7', type: 'patterns', prompt: 'What comes next? 🐸🐢🐍🐸🐢🐍🐸🐢?', visualCue: '🐸🐢🐍🐸🐢🐍🐸🐢', answer: '🐍', options: ['🐸', '🐢', '🐍'], difficulty: 2 },
    { id: 'pa-8', type: 'patterns', prompt: 'What comes next? ❤️💛💙❤️💛?', visualCue: '❤️💛💙❤️💛', answer: '💙', options: ['❤️', '💛', '💙'], difficulty: 2 },
    { id: 'pa-9', type: 'patterns', prompt: 'What comes next? 🎵🎶🎸🎵🎶🎸🎵?', visualCue: '🎵🎶🎸🎵🎶🎸🎵', answer: '🎶', options: ['🎵', '🎶', '🎸'], difficulty: 2 },
    { id: 'pa-10', type: 'patterns', prompt: 'What comes next? 🍕🌮🍔🍕🌮?', visualCue: '🍕🌮🍔🍕🌮', answer: '🍔', options: ['🍕', '🌮', '🍔'], difficulty: 2 },
    { id: 'pa-11', type: 'patterns', prompt: 'What comes next? 🐝🦋🐞🐝🦋🐞🐝?', visualCue: '🐝🦋🐞🐝🦋🐞🐝', answer: '🦋', options: ['🐝', '🦋', '🐞'], difficulty: 2 },
    { id: 'pa-12', type: 'patterns', prompt: 'What comes next? 🔵🟢🟡🔵🟢🟡🔵🟢?', visualCue: '🔵🟢🟡🔵🟢🟡🔵🟢', answer: '🟡', options: ['🔵', '🟢', '🟡'], difficulty: 2 },
    { id: 'pa-13', type: 'patterns', prompt: 'What comes next? 🌈☁️⛈️🌈☁️?', visualCue: '🌈☁️⛈️🌈☁️', answer: '⛈️', options: ['🌈', '☁️', '⛈️'], difficulty: 2 },
    { id: 'pa-14', type: 'patterns', prompt: 'What comes next? 🐟🐙🦀🐟🐙🦀🐟?', visualCue: '🐟🐙🦀🐟🐙🦀🐟', answer: '🐙', options: ['🐟', '🐙', '🦀'], difficulty: 2 },
    { id: 'pa-15', type: 'patterns', prompt: 'What comes next? 🧊🔥💧🧊🔥?', visualCue: '🧊🔥💧🧊🔥', answer: '💧', options: ['🧊', '🔥', '💧'], difficulty: 2 },
  ],

  // === NUMBER BONDS ===
  'number-bonds': [
    { id: 'nb-1', type: 'addition', prompt: 'What + 2 = 5?', visualCue: '? + 🍎🍎 = 🍎🍎🍎🍎🍎', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 'nb-2', type: 'addition', prompt: 'What + 4 = 10?', visualCue: '? + 🌸🌸🌸🌸 = 10', answer: 6, options: [4, 5, 6, 7], difficulty: 2 },
    { id: 'nb-3', type: 'addition', prompt: '7 + what = 10?', visualCue: '🐝🐝🐝🐝🐝🐝🐝 + ? = 10', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 'nb-4', type: 'addition', prompt: 'What + 5 = 5?', visualCue: '? + ✋ = ✋', answer: 0, options: [0, 1, 5, 10], difficulty: 2 },
    { id: 'nb-5', type: 'addition', prompt: 'What + 3 = 7?', visualCue: '? + 🐱🐱🐱 = 🐱🐱🐱🐱🐱🐱🐱', answer: 4, options: [3, 4, 5, 6], difficulty: 2 },
    { id: 'nb-6', type: 'addition', prompt: '6 + what = 9?', visualCue: '🦋🦋🦋🦋🦋🦋 + ? = 9', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 'nb-7', type: 'addition', prompt: 'What + 1 = 8?', visualCue: '? + ⭐ = ⭐⭐⭐⭐⭐⭐⭐⭐', answer: 7, options: [6, 7, 8, 9], difficulty: 2 },
    { id: 'nb-8', type: 'addition', prompt: '8 + what = 10?', visualCue: '🐟🐟🐟🐟🐟🐟🐟🐟 + ? = 10', answer: 2, options: [1, 2, 3, 4], difficulty: 2 },
    { id: 'nb-9', type: 'addition', prompt: 'What + 6 = 10?', visualCue: '? + 🚗🚗🚗🚗🚗🚗 = 10', answer: 4, options: [3, 4, 5, 6], difficulty: 2 },
    { id: 'nb-10', type: 'addition', prompt: '4 + what = 7?', visualCue: '🌳🌳🌳🌳 + ? = 7', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 'nb-11', type: 'addition', prompt: 'What + 8 = 10?', visualCue: '? + 🍪🍪🍪🍪🍪🍪🍪🍪 = 10', answer: 2, options: [1, 2, 3, 4], difficulty: 2 },
    { id: 'nb-12', type: 'addition', prompt: '5 + what = 8?', visualCue: '🎈🎈🎈🎈🎈 + ? = 8', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 'nb-13', type: 'addition', prompt: 'What + 7 = 9?', visualCue: '? + 🚀🚀🚀🚀🚀🚀🚀 = 9', answer: 2, options: [1, 2, 3, 4], difficulty: 2 },
    { id: 'nb-14', type: 'addition', prompt: '3 + what = 6?', visualCue: '🌻🌻🌻 + ? = 6', answer: 3, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 'nb-15', type: 'addition', prompt: 'What + 9 = 10?', visualCue: '? + 🐦🐦🐦🐦🐦🐦🐦🐦🐦 = 10', answer: 1, options: [0, 1, 2, 3], difficulty: 2 },
  ],

  // === NUMBER ORDER ===
  'number-order': [
    { id: 'no-1', type: 'counting', prompt: 'What comes after 3?', visualCue: '1 ➡️ 2 ➡️ 3 ➡️ ?', answer: 4, options: [2, 3, 4, 5], difficulty: 1 },
    { id: 'no-2', type: 'counting', prompt: 'What comes before 5?', visualCue: '? ➡️ 5', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'no-3', type: 'counting', prompt: 'What comes after 7?', visualCue: '6 ➡️ 7 ➡️ ?', answer: 8, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'no-4', type: 'counting', prompt: 'What comes before 10?', visualCue: '? ➡️ 10', answer: 9, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 'no-5', type: 'counting', prompt: 'What number is between 4 and 6?', visualCue: '4 ➡️ ? ➡️ 6', answer: 5, options: [3, 4, 5, 6], difficulty: 2 },
    { id: 'no-6', type: 'counting', prompt: 'Put in order: 3, 1, 2', visualCue: '🔢', answer: '1, 2, 3', options: ['1, 2, 3', '2, 1, 3', '3, 2, 1'], difficulty: 2 },
    { id: 'no-7', type: 'counting', prompt: 'What comes after 1?', visualCue: '1 ➡️ ?', answer: 2, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 'no-8', type: 'counting', prompt: 'What comes after 9?', visualCue: '8 ➡️ 9 ➡️ ?', answer: 10, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 'no-9', type: 'counting', prompt: 'What comes before 3?', visualCue: '? ➡️ 3', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 'no-10', type: 'counting', prompt: 'What number is between 7 and 9?', visualCue: '7 ➡️ ? ➡️ 9', answer: 8, options: [6, 7, 8, 9], difficulty: 2 },
    { id: 'no-11', type: 'counting', prompt: 'What comes before 8?', visualCue: '? ➡️ 8', answer: 7, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'no-12', type: 'counting', prompt: 'What comes after 5?', visualCue: '4 ➡️ 5 ➡️ ?', answer: 6, options: [4, 5, 6, 7], difficulty: 1 },
    { id: 'no-13', type: 'counting', prompt: 'What number is between 2 and 4?', visualCue: '2 ➡️ ? ➡️ 4', answer: 3, options: [1, 2, 3, 4], difficulty: 2 },
    { id: 'no-14', type: 'counting', prompt: 'What comes before 7?', visualCue: '? ➡️ 7', answer: 6, options: [5, 6, 7, 8], difficulty: 1 },
    { id: 'no-15', type: 'counting', prompt: 'What comes after 0?', visualCue: '0 ➡️ ?', answer: 1, options: [0, 1, 2, 3], difficulty: 2 },
  ],

  // === BEFORE/AFTER ===
  'before-after': [
    { id: 'ba-1', type: 'counting', prompt: 'What comes just before 2?', visualCue: '? ⬅️ 2', answer: 1, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 'ba-2', type: 'counting', prompt: 'What comes just after 6?', visualCue: '6 ➡️ ?', answer: 7, options: [5, 6, 7, 8], difficulty: 1 },
    { id: 'ba-3', type: 'counting', prompt: 'What comes just before 8?', visualCue: '? ⬅️ 8', answer: 7, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'ba-4', type: 'counting', prompt: 'What comes just after 9?', visualCue: '9 ➡️ ?', answer: 10, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 'ba-5', type: 'counting', prompt: 'What comes between 7 and 9?', visualCue: '7 ➡️ ? ➡️ 9', answer: 8, options: [6, 7, 8, 9], difficulty: 2 },
    { id: 'ba-6', type: 'counting', prompt: 'What comes just before 1?', visualCue: '? ⬅️ 1', answer: 0, options: [0, 1, 2, 3], difficulty: 2 },
    { id: 'ba-7', type: 'counting', prompt: 'What comes just after 3?', visualCue: '3 ➡️ ?', answer: 4, options: [2, 3, 4, 5], difficulty: 1 },
    { id: 'ba-8', type: 'counting', prompt: 'What comes just before 5?', visualCue: '? ⬅️ 5', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'ba-9', type: 'counting', prompt: 'What comes just after 0?', visualCue: '0 ➡️ ?', answer: 1, options: [0, 1, 2, 3], difficulty: 2 },
    { id: 'ba-10', type: 'counting', prompt: 'What comes between 3 and 5?', visualCue: '3 ➡️ ? ➡️ 5', answer: 4, options: [2, 3, 4, 5], difficulty: 2 },
    { id: 'ba-11', type: 'counting', prompt: 'What comes just before 10?', visualCue: '? ⬅️ 10', answer: 9, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 'ba-12', type: 'counting', prompt: 'What comes just after 7?', visualCue: '7 ➡️ ?', answer: 8, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'ba-13', type: 'counting', prompt: 'What comes between 1 and 3?', visualCue: '1 ➡️ ? ➡️ 3', answer: 2, options: [0, 1, 2, 3], difficulty: 2 },
    { id: 'ba-14', type: 'counting', prompt: 'What comes just before 6?', visualCue: '? ⬅️ 6', answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { id: 'ba-15', type: 'counting', prompt: 'What comes between 5 and 7?', visualCue: '5 ➡️ ? ➡️ 7', answer: 6, options: [4, 5, 6, 7], difficulty: 2 },
  ],

  // === DOUBLES ===
  'add-doubles': [
    { id: 'd-1', type: 'addition', prompt: '1 + 1 = ?', visualCue: '🖐️ + 🖐️ (1 finger each)', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 'd-2', type: 'addition', prompt: '2 + 2 = ?', visualCue: '👀 + 👀', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'd-3', type: 'addition', prompt: '3 + 3 = ?', visualCue: '🍀 + 🍀 (3 leaves each)', answer: 6, options: [5, 6, 7, 8], difficulty: 1 },
    { id: 'd-4', type: 'addition', prompt: '4 + 4 = ?', visualCue: '🐙 legs! (4 + 4)', answer: 8, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'd-5', type: 'addition', prompt: '5 + 5 = ?', visualCue: '✋ + ✋', answer: 10, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 'd-6', type: 'addition', prompt: '0 + 0 = ?', visualCue: '(empty) + (empty)', answer: 0, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 'd-7', type: 'addition', prompt: '1 + 1 = ?', visualCue: '🐱 + 🐱', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 'd-8', type: 'addition', prompt: '2 + 2 = ?', visualCue: '🐟🐟 + 🐟🐟', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'd-9', type: 'addition', prompt: '3 + 3 = ?', visualCue: '🌸🌸🌸 + 🌸🌸🌸', answer: 6, options: [5, 6, 7, 8], difficulty: 1 },
    { id: 'd-10', type: 'addition', prompt: '4 + 4 = ?', visualCue: '⭐⭐⭐⭐ + ⭐⭐⭐⭐', answer: 8, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'd-11', type: 'addition', prompt: '5 + 5 = ?', visualCue: '🐦🐦🐦🐦🐦 + 🐦🐦🐦🐦🐦', answer: 10, options: [8, 9, 10, 11], difficulty: 1 },
    { id: 'd-12', type: 'addition', prompt: '2 + 2 = ?', visualCue: '🍪🍪 + 🍪🍪', answer: 4, options: [3, 4, 5, 6], difficulty: 1 },
    { id: 'd-13', type: 'addition', prompt: '3 + 3 = ?', visualCue: '🎈🎈🎈 + 🎈🎈🎈', answer: 6, options: [5, 6, 7, 8], difficulty: 1 },
    { id: 'd-14', type: 'addition', prompt: '4 + 4 = ?', visualCue: '🦋🦋🦋🦋 + 🦋🦋🦋🦋', answer: 8, options: [6, 7, 8, 9], difficulty: 1 },
    { id: 'd-15', type: 'addition', prompt: '1 + 1 = ?', visualCue: '🚀 + 🚀', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
  ],

  // === MAKE TEN ===
  'make-ten': [
    { id: 'mt-1', type: 'addition', prompt: '9 + ? = 10', visualCue: '🔟 frame with 9 filled', answer: 1, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 'mt-2', type: 'addition', prompt: '8 + ? = 10', visualCue: '🔟 frame with 8 filled', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 'mt-3', type: 'addition', prompt: '7 + ? = 10', visualCue: '🔟 frame with 7 filled', answer: 3, options: [2, 3, 4, 5], difficulty: 1 },
    { id: 'mt-4', type: 'addition', prompt: '6 + ? = 10', visualCue: '🔟 frame with 6 filled', answer: 4, options: [3, 4, 5, 6], difficulty: 2 },
    { id: 'mt-5', type: 'addition', prompt: '5 + ? = 10', visualCue: '✋ + ?', answer: 5, options: [4, 5, 6, 7], difficulty: 1 },
    { id: 'mt-6', type: 'addition', prompt: '4 + ? = 10', visualCue: '🔟 frame with 4 filled', answer: 6, options: [5, 6, 7, 8], difficulty: 2 },
    { id: 'mt-7', type: 'addition', prompt: '3 + ? = 10', visualCue: '🔟 frame with 3 filled', answer: 7, options: [6, 7, 8, 9], difficulty: 2 },
    { id: 'mt-8', type: 'addition', prompt: '2 + ? = 10', visualCue: '🔟 frame with 2 filled', answer: 8, options: [7, 8, 9, 10], difficulty: 2 },
    { id: 'mt-9', type: 'addition', prompt: '1 + ? = 10', visualCue: '🔟 frame with 1 filled', answer: 9, options: [8, 9, 10, 11], difficulty: 2 },
    { id: 'mt-10', type: 'addition', prompt: '10 + ? = 10', visualCue: '🔟 frame fully filled', answer: 0, options: [0, 1, 10, 20], difficulty: 2 },
    { id: 'mt-11', type: 'addition', prompt: '0 + ? = 10', visualCue: '🔟 frame empty', answer: 10, options: [8, 9, 10, 11], difficulty: 2 },
    { id: 'mt-12', type: 'addition', prompt: '? + 9 = 10', visualCue: '? + 🍎🍎🍎🍎🍎🍎🍎🍎🍎 = 10', answer: 1, options: [0, 1, 2, 3], difficulty: 1 },
    { id: 'mt-13', type: 'addition', prompt: '? + 8 = 10', visualCue: '? + ⭐⭐⭐⭐⭐⭐⭐⭐ = 10', answer: 2, options: [1, 2, 3, 4], difficulty: 1 },
    { id: 'mt-14', type: 'addition', prompt: '? + 6 = 10', visualCue: '? + 🐱🐱🐱🐱🐱🐱 = 10', answer: 4, options: [3, 4, 5, 6], difficulty: 2 },
    { id: 'mt-15', type: 'addition', prompt: '? + 7 = 10', visualCue: '? + 🌸🌸🌸🌸🌸🌸🌸 = 10', answer: 3, options: [2, 3, 4, 5], difficulty: 1 },
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
