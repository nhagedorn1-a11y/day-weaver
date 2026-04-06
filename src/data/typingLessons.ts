// Keyboard Pilot lesson data

export interface KeyHuntLevel {
  id: string;
  targetKey: string;
  hint: 'full' | 'row' | 'hand' | 'none';
  emoji: string;
  keyword: string;
}

export interface WordBuilderWord {
  id: string;
  word: string;
  emoji: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface HomeRowLesson {
  id: string;
  title: string;
  keys: string[];
  hand: 'left' | 'right' | 'both';
  fingerMap: Record<string, string>;
}

export interface PCControlLesson {
  id: string;
  title: string;
  key: string;
  emoji: string;
  explanation: string;
  tryItPrompt: string;
}

// QWERTY layout data
export const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

// Which hand each key belongs to
export const HAND_MAP: Record<string, 'left' | 'right'> = {
  q: 'left', w: 'left', e: 'left', r: 'left', t: 'left',
  a: 'left', s: 'left', d: 'left', f: 'left', g: 'left',
  z: 'left', x: 'left', c: 'left', v: 'left', b: 'left',
  y: 'right', u: 'right', i: 'right', o: 'right', p: 'right',
  h: 'right', j: 'right', k: 'right', l: 'right',
  n: 'right', m: 'right',
};

// Which row each key belongs to (0=top, 1=home, 2=bottom)
export const ROW_MAP: Record<string, number> = {};
KEYBOARD_ROWS.forEach((row, i) => row.forEach(k => { ROW_MAP[k] = i; }));

// Home row keys
export const HOME_ROW_KEYS = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];

// Finger assignments for home row
export const FINGER_MAP: Record<string, string> = {
  a: 'Left Pinky', s: 'Left Ring', d: 'Left Middle', f: 'Left Index',
  g: 'Left Index', h: 'Right Index', j: 'Right Index', k: 'Right Middle',
  l: 'Right Ring',
};

// Key Hunt — full alphabet available at every hint tier for variety
// Each letter has an emoji + keyword association
const KEY_LETTER_DATA: Record<string, { emoji: string; keyword: string }> = {
  a: { emoji: '🍎', keyword: 'Apple' }, b: { emoji: '🐻', keyword: 'Bear' },
  c: { emoji: '🐱', keyword: 'Cat' }, d: { emoji: '🐕', keyword: 'Dog' },
  e: { emoji: '🐘', keyword: 'Elephant' }, f: { emoji: '🐸', keyword: 'Frog' },
  g: { emoji: '🦒', keyword: 'Giraffe' }, h: { emoji: '🐴', keyword: 'Horse' },
  i: { emoji: '🍦', keyword: 'Ice cream' }, j: { emoji: '🃏', keyword: 'Joker' },
  k: { emoji: '🪁', keyword: 'Kite' }, l: { emoji: '🦁', keyword: 'Lion' },
  m: { emoji: '🐵', keyword: 'Monkey' }, n: { emoji: '🥜', keyword: 'Nut' },
  o: { emoji: '🐙', keyword: 'Octopus' }, p: { emoji: '🐧', keyword: 'Penguin' },
  q: { emoji: '👑', keyword: 'Queen' }, r: { emoji: '🌈', keyword: 'Rainbow' },
  s: { emoji: '🌟', keyword: 'Star' }, t: { emoji: '🐯', keyword: 'Tiger' },
  u: { emoji: '☂️', keyword: 'Umbrella' }, v: { emoji: '🌋', keyword: 'Volcano' },
  w: { emoji: '🐋', keyword: 'Whale' }, x: { emoji: '❌', keyword: 'X-ray' },
  y: { emoji: '🪀', keyword: 'Yo-yo' }, z: { emoji: '🦓', keyword: 'Zebra' },
};

const ALL_LETTERS = Object.keys(KEY_LETTER_DATA);

// Build full pool: every letter at every hint level
export const KEY_HUNT_LEVELS: KeyHuntLevel[] = (['full', 'row', 'hand', 'none'] as const).flatMap(
  (hint, hintIdx) => ALL_LETTERS.map((key, i) => ({
    id: `kh-${hint}-${key}`,
    targetKey: key,
    hint,
    emoji: KEY_LETTER_DATA[key].emoji,
    keyword: KEY_LETTER_DATA[key].keyword,
  }))
);

/** Key Hunt difficulty tier metadata */
export const KEY_HUNT_TIERS = [
  { hint: 'full' as const, label: 'Easy', emoji: '🟢', desc: 'Key is highlighted for you' },
  { hint: 'row' as const, label: 'Medium', emoji: '🟡', desc: 'You know which row' },
  { hint: 'hand' as const, label: 'Hard', emoji: '🟠', desc: 'You know which hand' },
  { hint: 'none' as const, label: 'Expert', emoji: '🔴', desc: 'No hints at all!' },
];

/** Get random Key Hunt levels for a specific hint tier */
export function getRandomKeyHuntLevels(hint: 'full' | 'row' | 'hand' | 'none', count: number): KeyHuntLevel[] {
  const pool = KEY_HUNT_LEVELS.filter(l => l.hint === hint);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Word Builder words — 5 difficulty tiers, 20+ words each
export const WORD_BUILDER_WORDS: WordBuilderWord[] = [
  // ── Level 1: 2-3 letter CVC / simple words ──
  { id: 'wb1',  word: 'cat', emoji: '🐱', difficulty: 1 },
  { id: 'wb2',  word: 'dog', emoji: '🐕', difficulty: 1 },
  { id: 'wb3',  word: 'sun', emoji: '☀️', difficulty: 1 },
  { id: 'wb4',  word: 'hat', emoji: '🎩', difficulty: 1 },
  { id: 'wb5',  word: 'bug', emoji: '🐛', difficulty: 1 },
  { id: 'wb6',  word: 'cup', emoji: '☕', difficulty: 1 },
  { id: 'wb7',  word: 'pen', emoji: '🖊️', difficulty: 1 },
  { id: 'wb8',  word: 'fox', emoji: '🦊', difficulty: 1 },
  { id: 'wb9',  word: 'bed', emoji: '🛏️', difficulty: 1 },
  { id: 'wb10', word: 'pig', emoji: '🐷', difficulty: 1 },
  { id: 'wb11', word: 'hen', emoji: '🐔', difficulty: 1 },
  { id: 'wb12', word: 'jam', emoji: '🍯', difficulty: 1 },
  { id: 'wb13', word: 'map', emoji: '🗺️', difficulty: 1 },
  { id: 'wb14', word: 'net', emoji: '🥅', difficulty: 1 },
  { id: 'wb15', word: 'pot', emoji: '🍲', difficulty: 1 },
  { id: 'wb16', word: 'rug', emoji: '🧶', difficulty: 1 },
  { id: 'wb17', word: 'van', emoji: '🚐', difficulty: 1 },
  { id: 'wb18', word: 'zip', emoji: '🤐', difficulty: 1 },
  { id: 'wb19', word: 'log', emoji: '🪵', difficulty: 1 },
  { id: 'wb20', word: 'mug', emoji: '☕', difficulty: 1 },
  { id: 'wb21', word: 'bat', emoji: '🦇', difficulty: 1 },
  { id: 'wb22', word: 'fin', emoji: '🦈', difficulty: 1 },

  // ── Level 2: 4-letter words ──
  { id: 'wb30', word: 'frog', emoji: '🐸', difficulty: 2 },
  { id: 'wb31', word: 'duck', emoji: '🦆', difficulty: 2 },
  { id: 'wb32', word: 'fish', emoji: '🐟', difficulty: 2 },
  { id: 'wb33', word: 'lamp', emoji: '💡', difficulty: 2 },
  { id: 'wb34', word: 'star', emoji: '⭐', difficulty: 2 },
  { id: 'wb35', word: 'moon', emoji: '🌙', difficulty: 2 },
  { id: 'wb36', word: 'tree', emoji: '🌳', difficulty: 2 },
  { id: 'wb37', word: 'bear', emoji: '🐻', difficulty: 2 },
  { id: 'wb38', word: 'cake', emoji: '🎂', difficulty: 2 },
  { id: 'wb39', word: 'drum', emoji: '🥁', difficulty: 2 },
  { id: 'wb40', word: 'flag', emoji: '🚩', difficulty: 2 },
  { id: 'wb41', word: 'gift', emoji: '🎁', difficulty: 2 },
  { id: 'wb42', word: 'ship', emoji: '🚢', difficulty: 2 },
  { id: 'wb43', word: 'kite', emoji: '🪁', difficulty: 2 },
  { id: 'wb44', word: 'nest', emoji: '🪺', difficulty: 2 },
  { id: 'wb45', word: 'ring', emoji: '💍', difficulty: 2 },
  { id: 'wb46', word: 'bell', emoji: '🔔', difficulty: 2 },
  { id: 'wb47', word: 'bone', emoji: '🦴', difficulty: 2 },
  { id: 'wb48', word: 'corn', emoji: '🌽', difficulty: 2 },
  { id: 'wb49', word: 'hand', emoji: '✋', difficulty: 2 },
  { id: 'wb50', word: 'leaf', emoji: '🍃', difficulty: 2 },
  { id: 'wb51', word: 'sock', emoji: '🧦', difficulty: 2 },

  // ── Level 3: 5-letter words ──
  { id: 'wb60', word: 'apple', emoji: '🍎', difficulty: 3 },
  { id: 'wb61', word: 'train', emoji: '🚂', difficulty: 3 },
  { id: 'wb62', word: 'happy', emoji: '😊', difficulty: 3 },
  { id: 'wb63', word: 'cloud', emoji: '☁️', difficulty: 3 },
  { id: 'wb64', word: 'house', emoji: '🏠', difficulty: 3 },
  { id: 'wb65', word: 'mouse', emoji: '🐭', difficulty: 3 },
  { id: 'wb66', word: 'plant', emoji: '🌱', difficulty: 3 },
  { id: 'wb67', word: 'earth', emoji: '🌍', difficulty: 3 },
  { id: 'wb68', word: 'lemon', emoji: '🍋', difficulty: 3 },
  { id: 'wb69', word: 'piano', emoji: '🎹', difficulty: 3 },
  { id: 'wb70', word: 'robot', emoji: '🤖', difficulty: 3 },
  { id: 'wb71', word: 'tiger', emoji: '🐯', difficulty: 3 },
  { id: 'wb72', word: 'whale', emoji: '🐋', difficulty: 3 },
  { id: 'wb73', word: 'zebra', emoji: '🦓', difficulty: 3 },
  { id: 'wb74', word: 'smile', emoji: '😄', difficulty: 3 },
  { id: 'wb75', word: 'bread', emoji: '🍞', difficulty: 3 },
  { id: 'wb76', word: 'chair', emoji: '🪑', difficulty: 3 },
  { id: 'wb77', word: 'ghost', emoji: '👻', difficulty: 3 },
  { id: 'wb78', word: 'queen', emoji: '👑', difficulty: 3 },
  { id: 'wb79', word: 'sheep', emoji: '🐑', difficulty: 3 },
  { id: 'wb80', word: 'storm', emoji: '⛈️', difficulty: 3 },

  // ── Level 4: 6-letter words ──
  { id: 'wb90',  word: 'banana', emoji: '🍌', difficulty: 4 },
  { id: 'wb91',  word: 'castle', emoji: '🏰', difficulty: 4 },
  { id: 'wb92',  word: 'dinner', emoji: '🍽️', difficulty: 4 },
  { id: 'wb93',  word: 'flower', emoji: '🌸', difficulty: 4 },
  { id: 'wb94',  word: 'garden', emoji: '🌻', difficulty: 4 },
  { id: 'wb95',  word: 'jungle', emoji: '🌴', difficulty: 4 },
  { id: 'wb96',  word: 'kitten', emoji: '🐈', difficulty: 4 },
  { id: 'wb97',  word: 'monkey', emoji: '🐵', difficulty: 4 },
  { id: 'wb98',  word: 'pencil', emoji: '✏️', difficulty: 4 },
  { id: 'wb99',  word: 'rabbit', emoji: '🐰', difficulty: 4 },
  { id: 'wb100', word: 'rocket', emoji: '🚀', difficulty: 4 },
  { id: 'wb101', word: 'spider', emoji: '🕷️', difficulty: 4 },
  { id: 'wb102', word: 'sunset', emoji: '🌅', difficulty: 4 },
  { id: 'wb103', word: 'turtle', emoji: '🐢', difficulty: 4 },
  { id: 'wb104', word: 'winter', emoji: '❄️', difficulty: 4 },
  { id: 'wb105', word: 'bottle', emoji: '🍶', difficulty: 4 },
  { id: 'wb106', word: 'candle', emoji: '🕯️', difficulty: 4 },
  { id: 'wb107', word: 'dragon', emoji: '🐉', difficulty: 4 },
  { id: 'wb108', word: 'island', emoji: '🏝️', difficulty: 4 },
  { id: 'wb109', word: 'pillow', emoji: '🛌', difficulty: 4 },
  { id: 'wb110', word: 'bridge', emoji: '🌉', difficulty: 4 },

  // ── Level 5: 7+ letter words ──
  { id: 'wb120', word: 'airplane', emoji: '✈️', difficulty: 5 },
  { id: 'wb121', word: 'birthday', emoji: '🎂', difficulty: 5 },
  { id: 'wb122', word: 'elephant', emoji: '🐘', difficulty: 5 },
  { id: 'wb123', word: 'dinosaur', emoji: '🦕', difficulty: 5 },
  { id: 'wb124', word: 'football', emoji: '🏈', difficulty: 5 },
  { id: 'wb125', word: 'mountain', emoji: '⛰️', difficulty: 5 },
  { id: 'wb126', word: 'sandwich', emoji: '🥪', difficulty: 5 },
  { id: 'wb127', word: 'umbrella', emoji: '☂️', difficulty: 5 },
  { id: 'wb128', word: 'treasure', emoji: '💎', difficulty: 5 },
  { id: 'wb129', word: 'penguin', emoji: '🐧', difficulty: 5 },
  { id: 'wb130', word: 'rainbow', emoji: '🌈', difficulty: 5 },
  { id: 'wb131', word: 'blanket', emoji: '🧣', difficulty: 5 },
  { id: 'wb132', word: 'chicken', emoji: '🐔', difficulty: 5 },
  { id: 'wb133', word: 'dolphin', emoji: '🐬', difficulty: 5 },
  { id: 'wb134', word: 'feather', emoji: '🪶', difficulty: 5 },
  { id: 'wb135', word: 'giraffe', emoji: '🦒', difficulty: 5 },
  { id: 'wb136', word: 'kitchen', emoji: '🍳', difficulty: 5 },
  { id: 'wb137', word: 'pumpkin', emoji: '🎃', difficulty: 5 },
  { id: 'wb138', word: 'volcano', emoji: '🌋', difficulty: 5 },
  { id: 'wb139', word: 'snowman', emoji: '⛄', difficulty: 5 },
  { id: 'wb140', word: 'popcorn', emoji: '🍿', difficulty: 5 },
];

/** Difficulty tiers metadata */
export const WORD_BUILDER_LEVELS = [
  { difficulty: 1 as const, label: '2–3 Letters', emoji: '🌱', desc: 'Simple short words' },
  { difficulty: 2 as const, label: '4 Letters', emoji: '🌿', desc: 'A little longer' },
  { difficulty: 3 as const, label: '5 Letters', emoji: '🌳', desc: 'Growing words' },
  { difficulty: 4 as const, label: '6 Letters', emoji: '🏔️', desc: 'Bigger challenge' },
  { difficulty: 5 as const, label: '7+ Letters', emoji: '🚀', desc: 'Word master!' },
];

/** Get a shuffled random selection of words for a given difficulty */
export function getRandomWords(difficulty: 1 | 2 | 3 | 4 | 5, count: number): WordBuilderWord[] {
  const pool = WORD_BUILDER_WORDS.filter(w => w.difficulty === difficulty);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Home Row lessons
export const HOME_ROW_LESSONS: HomeRowLesson[] = [
  {
    id: 'hr1',
    title: 'Left Hand Home',
    keys: ['a', 's', 'd', 'f'],
    hand: 'left',
    fingerMap: { a: 'Pinky', s: 'Ring', d: 'Middle', f: 'Index' },
  },
  {
    id: 'hr2',
    title: 'Right Hand Home',
    keys: ['j', 'k', 'l'],
    hand: 'right',
    fingerMap: { j: 'Index', k: 'Middle', l: 'Ring' },
  },
  {
    id: 'hr3',
    title: 'Both Hands Together',
    keys: HOME_ROW_KEYS,
    hand: 'both',
    fingerMap: FINGER_MAP,
  },
];

// PC Control lessons
export const PC_CONTROL_LESSONS: PCControlLesson[] = [
  {
    id: 'pc1',
    title: 'The Spacebar',
    key: 'space',
    emoji: '👐',
    explanation: 'The big bar at the bottom adds a space between words. Use your thumbs!',
    tryItPrompt: 'Press the big bar at the bottom!',
  },
  {
    id: 'pc2',
    title: 'Enter Key',
    key: 'enter',
    emoji: '↵',
    explanation: 'Enter moves to a new line, like pressing "go" or "done". It\'s on the right side.',
    tryItPrompt: 'Find and press Enter!',
  },
  {
    id: 'pc3',
    title: 'Backspace',
    key: 'backspace',
    emoji: '⌫',
    explanation: 'Backspace erases the last letter you typed. It\'s like an undo button for typing!',
    tryItPrompt: 'Type a letter, then press Backspace to erase it!',
  },
  {
    id: 'pc4',
    title: 'Shift Key',
    key: 'shift',
    emoji: '⬆️',
    explanation: 'Hold Shift and press a letter to make it BIG (uppercase). Shift is on both sides!',
    tryItPrompt: 'Hold Shift and press a letter to make it big!',
  },
  {
    id: 'pc5',
    title: 'Arrow Keys',
    key: 'arrows',
    emoji: '🏹',
    explanation: 'The arrow keys move around: up, down, left, right. They\'re at the bottom right!',
    tryItPrompt: 'Press the arrow keys to move around!',
  },
];
