import { GraphemeCard } from '@/types/reading';

// Complete grapheme library with visual keyword cues for every letter
// Each grapheme has an emoji + keyword for multisensory phonetic association
export const graphemeCards: Record<string, GraphemeCard> = {
  // === CONSONANTS ===
  'b': { id: 'b', grapheme: 'b', phoneme: '/b/', keyword: 'bear', keywordEmoji: '🐻', isDigraph: false },
  'c': { id: 'c', grapheme: 'c', phoneme: '/k/', keyword: 'cat', keywordEmoji: '🐱', isDigraph: false },
  'd': { id: 'd', grapheme: 'd', phoneme: '/d/', keyword: 'dog', keywordEmoji: '🐕', isDigraph: false },
  'f': { id: 'f', grapheme: 'f', phoneme: '/f/', keyword: 'fish', keywordEmoji: '🐟', isDigraph: false },
  'g': { id: 'g', grapheme: 'g', phoneme: '/g/', keyword: 'goat', keywordEmoji: '🐐', isDigraph: false },
  'h': { id: 'h', grapheme: 'h', phoneme: '/h/', keyword: 'hat', keywordEmoji: '🎩', isDigraph: false },
  'j': { id: 'j', grapheme: 'j', phoneme: '/j/', keyword: 'jam', keywordEmoji: '🍯', isDigraph: false },
  'k': { id: 'k', grapheme: 'k', phoneme: '/k/', keyword: 'kite', keywordEmoji: '🪁', isDigraph: false },
  'l': { id: 'l', grapheme: 'l', phoneme: '/l/', keyword: 'lion', keywordEmoji: '🦁', isDigraph: false },
  'm': { id: 'm', grapheme: 'm', phoneme: '/m/', keyword: 'mouse', keywordEmoji: '🐭', isDigraph: false },
  'n': { id: 'n', grapheme: 'n', phoneme: '/n/', keyword: 'nest', keywordEmoji: '🪺', isDigraph: false },
  'p': { id: 'p', grapheme: 'p', phoneme: '/p/', keyword: 'pig', keywordEmoji: '🐷', isDigraph: false },
  'q': { id: 'q', grapheme: 'q', phoneme: '/kw/', keyword: 'queen', keywordEmoji: '👑', isDigraph: false },
  'r': { id: 'r', grapheme: 'r', phoneme: '/r/', keyword: 'rabbit', keywordEmoji: '🐰', isDigraph: false },
  's': { id: 's', grapheme: 's', phoneme: '/s/', keyword: 'snake', keywordEmoji: '🐍', isDigraph: false },
  't': { id: 't', grapheme: 't', phoneme: '/t/', keyword: 'turtle', keywordEmoji: '🐢', isDigraph: false },
  'v': { id: 'v', grapheme: 'v', phoneme: '/v/', keyword: 'van', keywordEmoji: '🚐', isDigraph: false },
  'w': { id: 'w', grapheme: 'w', phoneme: '/w/', keyword: 'wave', keywordEmoji: '🌊', isDigraph: false },
  'x': { id: 'x', grapheme: 'x', phoneme: '/ks/', keyword: 'fox', keywordEmoji: '🦊', isDigraph: false },
  'y': { id: 'y', grapheme: 'y', phoneme: '/y/', keyword: 'yo-yo', keywordEmoji: '🪀', isDigraph: false },
  'z': { id: 'z', grapheme: 'z', phoneme: '/z/', keyword: 'zebra', keywordEmoji: '🦓', isDigraph: false },

  // === SHORT VOWELS ===
  'a': { id: 'a', grapheme: 'a', phoneme: '/ă/', keyword: 'apple', keywordEmoji: '🍎', isDigraph: false },
  'e': { id: 'e', grapheme: 'e', phoneme: '/ĕ/', keyword: 'egg', keywordEmoji: '🥚', isDigraph: false },
  'i': { id: 'i', grapheme: 'i', phoneme: '/ĭ/', keyword: 'itch', keywordEmoji: '🦟', isDigraph: false },
  'o': { id: 'o', grapheme: 'o', phoneme: '/ŏ/', keyword: 'octopus', keywordEmoji: '🐙', isDigraph: false },
  'u': { id: 'u', grapheme: 'u', phoneme: '/ŭ/', keyword: 'umbrella', keywordEmoji: '☂️', isDigraph: false },

  // === DIGRAPHS (two letters, one sound) ===
  'sh': { id: 'sh', grapheme: 'sh', phoneme: '/sh/', keyword: 'ship', keywordEmoji: '🚢', isDigraph: true },
  'ch': { id: 'ch', grapheme: 'ch', phoneme: '/ch/', keyword: 'cheese', keywordEmoji: '🧀', isDigraph: true },
  'th': { id: 'th', grapheme: 'th', phoneme: '/th/', keyword: 'thumb', keywordEmoji: '👍', isDigraph: true },
  'wh': { id: 'wh', grapheme: 'wh', phoneme: '/wh/', keyword: 'whale', keywordEmoji: '🐋', isDigraph: true },
  'ck': { id: 'ck', grapheme: 'ck', phoneme: '/k/', keyword: 'duck', keywordEmoji: '🦆', isDigraph: true },
  'ng': { id: 'ng', grapheme: 'ng', phoneme: '/ng/', keyword: 'ring', keywordEmoji: '💍', isDigraph: true },
  'ph': { id: 'ph', grapheme: 'ph', phoneme: '/f/', keyword: 'phone', keywordEmoji: '📱', isDigraph: true },

  // === BLENDS (two sounds blended) ===
  'bl': { id: 'bl', grapheme: 'bl', phoneme: '/bl/', keyword: 'block', keywordEmoji: '🧱', isDigraph: false },
  'br': { id: 'br', grapheme: 'br', phoneme: '/br/', keyword: 'bread', keywordEmoji: '🍞', isDigraph: false },
  'cl': { id: 'cl', grapheme: 'cl', phoneme: '/cl/', keyword: 'clock', keywordEmoji: '⏰', isDigraph: false },
  'cr': { id: 'cr', grapheme: 'cr', phoneme: '/cr/', keyword: 'crab', keywordEmoji: '🦀', isDigraph: false },
  'dr': { id: 'dr', grapheme: 'dr', phoneme: '/dr/', keyword: 'drum', keywordEmoji: '🥁', isDigraph: false },
  'fl': { id: 'fl', grapheme: 'fl', phoneme: '/fl/', keyword: 'flag', keywordEmoji: '🚩', isDigraph: false },
  'fr': { id: 'fr', grapheme: 'fr', phoneme: '/fr/', keyword: 'frog', keywordEmoji: '🐸', isDigraph: false },
  'gl': { id: 'gl', grapheme: 'gl', phoneme: '/gl/', keyword: 'globe', keywordEmoji: '🌍', isDigraph: false },
  'gr': { id: 'gr', grapheme: 'gr', phoneme: '/gr/', keyword: 'grape', keywordEmoji: '🍇', isDigraph: false },
  'pl': { id: 'pl', grapheme: 'pl', phoneme: '/pl/', keyword: 'plane', keywordEmoji: '✈️', isDigraph: false },
  'pr': { id: 'pr', grapheme: 'pr', phoneme: '/pr/', keyword: 'pretzel', keywordEmoji: '🥨', isDigraph: false },
  'sc': { id: 'sc', grapheme: 'sc', phoneme: '/sk/', keyword: 'scarf', keywordEmoji: '🧣', isDigraph: false },
  'sk': { id: 'sk', grapheme: 'sk', phoneme: '/sk/', keyword: 'skate', keywordEmoji: '⛸️', isDigraph: false },
  'sl': { id: 'sl', grapheme: 'sl', phoneme: '/sl/', keyword: 'sled', keywordEmoji: '🛷', isDigraph: false },
  'sm': { id: 'sm', grapheme: 'sm', phoneme: '/sm/', keyword: 'smile', keywordEmoji: '😊', isDigraph: false },
  'sn': { id: 'sn', grapheme: 'sn', phoneme: '/sn/', keyword: 'snow', keywordEmoji: '❄️', isDigraph: false },
  'sp': { id: 'sp', grapheme: 'sp', phoneme: '/sp/', keyword: 'spider', keywordEmoji: '🕷️', isDigraph: false },
  'st': { id: 'st', grapheme: 'st', phoneme: '/st/', keyword: 'star', keywordEmoji: '⭐', isDigraph: false },
  'sw': { id: 'sw', grapheme: 'sw', phoneme: '/sw/', keyword: 'swan', keywordEmoji: '🦢', isDigraph: false },
  'tr': { id: 'tr', grapheme: 'tr', phoneme: '/tr/', keyword: 'tree', keywordEmoji: '🌳', isDigraph: false },
  'tw': { id: 'tw', grapheme: 'tw', phoneme: '/tw/', keyword: 'twins', keywordEmoji: '👯', isDigraph: false },

  // === LONG VOWELS (silent e pattern) ===
  'a_e': { id: 'a_e', grapheme: 'a_e', phoneme: '/ā/', keyword: 'cake', keywordEmoji: '🎂', isDigraph: false },
  'e_e': { id: 'e_e', grapheme: 'e_e', phoneme: '/ē/', keyword: 'eve', keywordEmoji: '🌙', isDigraph: false },
  'i_e': { id: 'i_e', grapheme: 'i_e', phoneme: '/ī/', keyword: 'bike', keywordEmoji: '🚲', isDigraph: false },
  'o_e': { id: 'o_e', grapheme: 'o_e', phoneme: '/ō/', keyword: 'bone', keywordEmoji: '🦴', isDigraph: false },
  'u_e': { id: 'u_e', grapheme: 'u_e', phoneme: '/ū/', keyword: 'cube', keywordEmoji: '🧊', isDigraph: false },

  // === VOWEL TEAMS ===
  'ai': { id: 'ai', grapheme: 'ai', phoneme: '/ā/', keyword: 'rain', keywordEmoji: '🌧️', isDigraph: true },
  'ay': { id: 'ay', grapheme: 'ay', phoneme: '/ā/', keyword: 'play', keywordEmoji: '🎮', isDigraph: true },
  'ea': { id: 'ea', grapheme: 'ea', phoneme: '/ē/', keyword: 'leaf', keywordEmoji: '🍃', isDigraph: true },
  'ee': { id: 'ee', grapheme: 'ee', phoneme: '/ē/', keyword: 'bee', keywordEmoji: '🐝', isDigraph: true },
  'oa': { id: 'oa', grapheme: 'oa', phoneme: '/ō/', keyword: 'boat', keywordEmoji: '⛵', isDigraph: true },
  'ow': { id: 'ow', grapheme: 'ow', phoneme: '/ō/', keyword: 'snow', keywordEmoji: '☃️', isDigraph: true },
  'oo': { id: 'oo', grapheme: 'oo', phoneme: '/oo/', keyword: 'moon', keywordEmoji: '🌙', isDigraph: true },
  'ou': { id: 'ou', grapheme: 'ou', phoneme: '/ou/', keyword: 'house', keywordEmoji: '🏠', isDigraph: true },
  'oi': { id: 'oi', grapheme: 'oi', phoneme: '/oi/', keyword: 'coin', keywordEmoji: '🪙', isDigraph: true },
  'oy': { id: 'oy', grapheme: 'oy', phoneme: '/oi/', keyword: 'toy', keywordEmoji: '🧸', isDigraph: true },
  'au': { id: 'au', grapheme: 'au', phoneme: '/aw/', keyword: 'sauce', keywordEmoji: '🥫', isDigraph: true },
  'aw': { id: 'aw', grapheme: 'aw', phoneme: '/aw/', keyword: 'paw', keywordEmoji: '🐾', isDigraph: true },

  // === R-CONTROLLED VOWELS ===
  'ar': { id: 'ar', grapheme: 'ar', phoneme: '/ar/', keyword: 'car', keywordEmoji: '🚗', isDigraph: true },
  'er': { id: 'er', grapheme: 'er', phoneme: '/er/', keyword: 'fern', keywordEmoji: '🌿', isDigraph: true },
  'ir': { id: 'ir', grapheme: 'ir', phoneme: '/er/', keyword: 'bird', keywordEmoji: '🐦', isDigraph: true },
  'or': { id: 'or', grapheme: 'or', phoneme: '/or/', keyword: 'corn', keywordEmoji: '🌽', isDigraph: true },
  'ur': { id: 'ur', grapheme: 'ur', phoneme: '/er/', keyword: 'turtle', keywordEmoji: '🐢', isDigraph: true },
};

// Get a grapheme card by ID
export const getGrapheme = (id: string): GraphemeCard | undefined => {
  return graphemeCards[id];
};

// Get all grapheme cards as an array
export const getAllGraphemes = (): GraphemeCard[] => {
  return Object.values(graphemeCards);
};

// Get graphemes by category
export const getConsonants = (): GraphemeCard[] => {
  const consonantIds = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
  return consonantIds.map(id => graphemeCards[id]).filter(Boolean);
};

export const getShortVowels = (): GraphemeCard[] => {
  const vowelIds = ['a', 'e', 'i', 'o', 'u'];
  return vowelIds.map(id => graphemeCards[id]).filter(Boolean);
};

export const getDigraphs = (): GraphemeCard[] => {
  const digraphIds = ['sh', 'ch', 'th', 'wh', 'ck', 'ng', 'ph'];
  return digraphIds.map(id => graphemeCards[id]).filter(Boolean);
};

export const getBlends = (): GraphemeCard[] => {
  const blendIds = ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'tr', 'tw'];
  return blendIds.map(id => graphemeCards[id]).filter(Boolean);
};
