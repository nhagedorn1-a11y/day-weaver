import { LetterCard } from '@/types/academics';

// Complete letter library with visual cues for handwriting
// Every letter has a keyword + emoji for visual-motor association

export const letterCards: Record<string, LetterCard> = {
  // === UPPERCASE LETTERS ===
  'A': { id: 'A', letter: 'A', isUppercase: true, strokeOrder: ['down-left', 'down-right', 'across'], keyword: 'Apple', keywordEmoji: '🍎', formationTip: 'Start at the top, slide down left, slide down right, bridge across' },
  'B': { id: 'B', letter: 'B', isUppercase: true, strokeOrder: ['down', 'bump', 'bump'], keyword: 'Bear', keywordEmoji: '🐻', formationTip: 'Start at the top, slide down, bump out twice' },
  'C': { id: 'C', letter: 'C', isUppercase: true, strokeOrder: ['curve'], keyword: 'Cat', keywordEmoji: '🐱', formationTip: 'Start at the top, curve around like a cat curling up' },
  'D': { id: 'D', letter: 'D', isUppercase: true, strokeOrder: ['down', 'big-bump'], keyword: 'Dog', keywordEmoji: '🐕', formationTip: 'Start at the top, slide down, big bump out' },
  'E': { id: 'E', letter: 'E', isUppercase: true, strokeOrder: ['down', 'across', 'across', 'across'], keyword: 'Egg', keywordEmoji: '🥚', formationTip: 'Start at the top, slide down, three lines out' },
  'F': { id: 'F', letter: 'F', isUppercase: true, strokeOrder: ['down', 'across', 'across'], keyword: 'Fish', keywordEmoji: '🐟', formationTip: 'Start at the top, slide down, two lines out' },
  'G': { id: 'G', letter: 'G', isUppercase: true, strokeOrder: ['curve', 'in'], keyword: 'Goat', keywordEmoji: '🐐', formationTip: 'C shape then tuck in' },
  'H': { id: 'H', letter: 'H', isUppercase: true, strokeOrder: ['down', 'down', 'across'], keyword: 'Hat', keywordEmoji: '🎩', formationTip: 'Two tall slides down, bridge across the middle' },
  'I': { id: 'I', letter: 'I', isUppercase: true, strokeOrder: ['across', 'down', 'across'], keyword: 'Ice cream', keywordEmoji: '🍦', formationTip: 'Line across top, slide down, line across bottom' },
  'J': { id: 'J', letter: 'J', isUppercase: true, strokeOrder: ['across', 'down-hook'], keyword: 'Jam', keywordEmoji: '🍯', formationTip: 'Line across top, slide down and hook left' },
  'K': { id: 'K', letter: 'K', isUppercase: true, strokeOrder: ['down', 'slant-in', 'slant-out'], keyword: 'Kite', keywordEmoji: '🪁', formationTip: 'Slide down, kick in, kick out' },
  'L': { id: 'L', letter: 'L', isUppercase: true, strokeOrder: ['down', 'across'], keyword: 'Lion', keywordEmoji: '🦁', formationTip: 'Slide down, line across the bottom' },
  'M': { id: 'M', letter: 'M', isUppercase: true, strokeOrder: ['down', 'slant-down', 'slant-up', 'down'], keyword: 'Mouse', keywordEmoji: '🐭', formationTip: 'Down, mountain peaks, down' },
  'N': { id: 'N', letter: 'N', isUppercase: true, strokeOrder: ['down', 'slant', 'up'], keyword: 'Nest', keywordEmoji: '🪺', formationTip: 'Down, slide diagonal, up' },
  'O': { id: 'O', letter: 'O', isUppercase: true, strokeOrder: ['circle'], keyword: 'Octopus', keywordEmoji: '🐙', formationTip: 'Start at the top, curve all the way around' },
  'P': { id: 'P', letter: 'P', isUppercase: true, strokeOrder: ['down', 'bump'], keyword: 'Pig', keywordEmoji: '🐷', formationTip: 'Slide down, bump out at the top' },
  'Q': { id: 'Q', letter: 'Q', isUppercase: true, strokeOrder: ['circle', 'tail'], keyword: 'Queen', keywordEmoji: '👑', formationTip: 'Make an O, add a little tail' },
  'R': { id: 'R', letter: 'R', isUppercase: true, strokeOrder: ['down', 'bump', 'kick'], keyword: 'Rabbit', keywordEmoji: '🐰', formationTip: 'Slide down, bump out, kick out' },
  'S': { id: 'S', letter: 'S', isUppercase: true, strokeOrder: ['curve-curve'], keyword: 'Snake', keywordEmoji: '🐍', formationTip: 'Curve one way, then curve the other like a slithering snake' },
  'T': { id: 'T', letter: 'T', isUppercase: true, strokeOrder: ['across', 'down'], keyword: 'Turtle', keywordEmoji: '🐢', formationTip: 'Line across the top, slide down the middle' },
  'U': { id: 'U', letter: 'U', isUppercase: true, strokeOrder: ['down-curve-up'], keyword: 'Umbrella', keywordEmoji: '☂️', formationTip: 'Down, curve, up like an umbrella handle' },
  'V': { id: 'V', letter: 'V', isUppercase: true, strokeOrder: ['slant-down', 'slant-up'], keyword: 'Van', keywordEmoji: '🚐', formationTip: 'Slide down to a point, slide back up' },
  'W': { id: 'W', letter: 'W', isUppercase: true, strokeOrder: ['slant', 'slant', 'slant', 'slant'], keyword: 'Wave', keywordEmoji: '🌊', formationTip: 'Down up down up like waves' },
  'X': { id: 'X', letter: 'X', isUppercase: true, strokeOrder: ['slant-right', 'slant-left'], keyword: 'X-ray', keywordEmoji: '🩻', formationTip: 'Cross two lines' },
  'Y': { id: 'Y', letter: 'Y', isUppercase: true, strokeOrder: ['slant-in', 'slant-in', 'down'], keyword: 'Yo-yo', keywordEmoji: '🪀', formationTip: 'Two slants meet, then slide down' },
  'Z': { id: 'Z', letter: 'Z', isUppercase: true, strokeOrder: ['across', 'slant', 'across'], keyword: 'Zebra', keywordEmoji: '🦓', formationTip: 'Across, zig down, across' },

  // === LOWERCASE LETTERS ===
  'a': { id: 'a', letter: 'a', isUppercase: false, strokeOrder: ['circle', 'down'], keyword: 'apple', keywordEmoji: '🍎', formationTip: 'Circle around, slide down' },
  'b': { id: 'b', letter: 'b', isUppercase: false, strokeOrder: ['down', 'bump'], keyword: 'ball', keywordEmoji: '⚽', formationTip: 'Tall slide down, bump out at the bottom' },
  'c': { id: 'c', letter: 'c', isUppercase: false, strokeOrder: ['curve'], keyword: 'cat', keywordEmoji: '🐱', formationTip: 'Little curve like a curled cat' },
  'd': { id: 'd', letter: 'd', isUppercase: false, strokeOrder: ['circle', 'tall-down'], keyword: 'duck', keywordEmoji: '🦆', formationTip: 'Circle around, tall slide down' },
  'e': { id: 'e', letter: 'e', isUppercase: false, strokeOrder: ['across', 'curve'], keyword: 'egg', keywordEmoji: '🥚', formationTip: 'Line across the middle, curve around' },
  'f': { id: 'f', letter: 'f', isUppercase: false, strokeOrder: ['curve', 'down', 'across'], keyword: 'fish', keywordEmoji: '🐟', formationTip: 'Hook at top, slide down, cross' },
  'g': { id: 'g', letter: 'g', isUppercase: false, strokeOrder: ['circle', 'down-hook'], keyword: 'goat', keywordEmoji: '🐐', formationTip: 'Circle around, down and hook' },
  'h': { id: 'h', letter: 'h', isUppercase: false, strokeOrder: ['down', 'hump'], keyword: 'hat', keywordEmoji: '🎩', formationTip: 'Tall slide down, hump over' },
  'i': { id: 'i', letter: 'i', isUppercase: false, strokeOrder: ['down', 'dot'], keyword: 'igloo', keywordEmoji: '🏠', formationTip: 'Short slide down, dot on top' },
  'j': { id: 'j', letter: 'j', isUppercase: false, strokeOrder: ['down-hook', 'dot'], keyword: 'jam', keywordEmoji: '🍯', formationTip: 'Slide down and hook, dot on top' },
  'k': { id: 'k', letter: 'k', isUppercase: false, strokeOrder: ['down', 'kick-in', 'kick-out'], keyword: 'kite', keywordEmoji: '🪁', formationTip: 'Tall down, kick in and out' },
  'l': { id: 'l', letter: 'l', isUppercase: false, strokeOrder: ['down'], keyword: 'lion', keywordEmoji: '🦁', formationTip: 'Tall slide straight down' },
  'm': { id: 'm', letter: 'm', isUppercase: false, strokeOrder: ['down', 'hump', 'hump'], keyword: 'mouse', keywordEmoji: '🐭', formationTip: 'Down, hump, hump' },
  'n': { id: 'n', letter: 'n', isUppercase: false, strokeOrder: ['down', 'hump'], keyword: 'nest', keywordEmoji: '🪺', formationTip: 'Down, one hump over' },
  'o': { id: 'o', letter: 'o', isUppercase: false, strokeOrder: ['circle'], keyword: 'orange', keywordEmoji: '🍊', formationTip: 'All the way around' },
  'p': { id: 'p', letter: 'p', isUppercase: false, strokeOrder: ['down', 'bump'], keyword: 'pig', keywordEmoji: '🐷', formationTip: 'Slide down below the line, bump up' },
  'q': { id: 'q', letter: 'q', isUppercase: false, strokeOrder: ['circle', 'tail'], keyword: 'queen', keywordEmoji: '👑', formationTip: 'Circle around, tail goes down' },
  'r': { id: 'r', letter: 'r', isUppercase: false, strokeOrder: ['down', 'curve'], keyword: 'rabbit', keywordEmoji: '🐰', formationTip: 'Down, little curve at top' },
  's': { id: 's', letter: 's', isUppercase: false, strokeOrder: ['curve-curve'], keyword: 'snake', keywordEmoji: '🐍', formationTip: 'Little snake wiggle' },
  't': { id: 't', letter: 't', isUppercase: false, strokeOrder: ['down', 'across'], keyword: 'turtle', keywordEmoji: '🐢', formationTip: 'Slide down, cross near the top' },
  'u': { id: 'u', letter: 'u', isUppercase: false, strokeOrder: ['down-curve-up', 'down'], keyword: 'umbrella', keywordEmoji: '☂️', formationTip: 'Down, curve up, slide down' },
  'v': { id: 'v', letter: 'v', isUppercase: false, strokeOrder: ['slant-down', 'slant-up'], keyword: 'van', keywordEmoji: '🚐', formationTip: 'Slant down, slant up' },
  'w': { id: 'w', letter: 'w', isUppercase: false, strokeOrder: ['down', 'up', 'down', 'up'], keyword: 'wave', keywordEmoji: '🌊', formationTip: 'Down up down up' },
  'x': { id: 'x', letter: 'x', isUppercase: false, strokeOrder: ['slant', 'slant'], keyword: 'box', keywordEmoji: '📦', formationTip: 'Cross two lines' },
  'y': { id: 'y', letter: 'y', isUppercase: false, strokeOrder: ['slant', 'slant-down'], keyword: 'yo-yo', keywordEmoji: '🪀', formationTip: 'Slant in, long slant down' },
  'z': { id: 'z', letter: 'z', isUppercase: false, strokeOrder: ['across', 'slant', 'across'], keyword: 'zebra', keywordEmoji: '🦓', formationTip: 'Across, zig down, across' },
};

// Get letter card by ID
export const getLetterCard = (id: string): LetterCard | undefined => {
  return letterCards[id];
};

// Get all uppercase letters
export const getUppercaseLetters = (): LetterCard[] => {
  return Object.values(letterCards).filter(l => l.isUppercase);
};

// Get all lowercase letters
export const getLowercaseLetters = (): LetterCard[] => {
  return Object.values(letterCards).filter(l => !l.isUppercase);
};

// Get letter pair (upper and lower)
export const getLetterPair = (letter: string): { upper: LetterCard; lower: LetterCard } | undefined => {
  const upper = letterCards[letter.toUpperCase()];
  const lower = letterCards[letter.toLowerCase()];
  if (upper && lower) {
    return { upper, lower };
  }
  return undefined;
};

// Basic stroke patterns for warm-up
export const basicStrokes = [
  { id: 'vertical', name: 'Slide Down', pattern: '|', tip: 'Top to bottom, straight line' },
  { id: 'horizontal', name: 'Slide Across', pattern: '—', tip: 'Left to right, straight line' },
  { id: 'slant-right', name: 'Slant Right', pattern: '\\', tip: 'Top left to bottom right' },
  { id: 'slant-left', name: 'Slant Left', pattern: '/', tip: 'Top right to bottom left' },
  { id: 'curve-left', name: 'Curve Left', pattern: 'C', tip: 'Start at top, curve around left' },
  { id: 'curve-right', name: 'Curve Right', pattern: ')', tip: 'Start at top, curve around right' },
  { id: 'hump', name: 'Hump', pattern: 'n', tip: 'Up and over like a hill' },
  { id: 'bump', name: 'Bump', pattern: 'o', tip: 'Small round bump' },
];
