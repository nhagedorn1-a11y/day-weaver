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
  difficulty: 1 | 2 | 3;
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

// Key Hunt levels — progressive difficulty
export const KEY_HUNT_LEVELS: KeyHuntLevel[] = [
  // Full hint (key highlighted + row + hand)
  { id: 'kh1', targetKey: 'a', hint: 'full', emoji: '🍎', keyword: 'Apple' },
  { id: 'kh2', targetKey: 's', hint: 'full', emoji: '🌟', keyword: 'Star' },
  { id: 'kh3', targetKey: 'd', hint: 'full', emoji: '🐕', keyword: 'Dog' },
  { id: 'kh4', targetKey: 'f', hint: 'full', emoji: '🐸', keyword: 'Frog' },
  { id: 'kh5', targetKey: 'j', hint: 'full', emoji: '🃏', keyword: 'Joker' },
  { id: 'kh6', targetKey: 'k', hint: 'full', emoji: '🪁', keyword: 'Kite' },
  { id: 'kh7', targetKey: 'l', hint: 'full', emoji: '🦁', keyword: 'Lion' },
  // Row hint only
  { id: 'kh8', targetKey: 'b', hint: 'row', emoji: '🐻', keyword: 'Bear' },
  { id: 'kh9', targetKey: 'c', hint: 'row', emoji: '🐱', keyword: 'Cat' },
  { id: 'kh10', targetKey: 'e', hint: 'row', emoji: '🐘', keyword: 'Elephant' },
  { id: 'kh11', targetKey: 'g', hint: 'row', emoji: '🦒', keyword: 'Giraffe' },
  { id: 'kh12', targetKey: 'h', hint: 'row', emoji: '🐴', keyword: 'Horse' },
  { id: 'kh13', targetKey: 'm', hint: 'row', emoji: '🐵', keyword: 'Monkey' },
  { id: 'kh14', targetKey: 'n', hint: 'row', emoji: '🥜', keyword: 'Nut' },
  // Hand hint only
  { id: 'kh15', targetKey: 'o', hint: 'hand', emoji: '🐙', keyword: 'Octopus' },
  { id: 'kh16', targetKey: 'p', hint: 'hand', emoji: '🐧', keyword: 'Penguin' },
  { id: 'kh17', targetKey: 'r', hint: 'hand', emoji: '🌈', keyword: 'Rainbow' },
  { id: 'kh18', targetKey: 't', hint: 'hand', emoji: '🐯', keyword: 'Tiger' },
  { id: 'kh19', targetKey: 'w', hint: 'hand', emoji: '🐋', keyword: 'Whale' },
  { id: 'kh20', targetKey: 'x', hint: 'hand', emoji: '❌', keyword: 'X-ray' },
  // No hint
  { id: 'kh21', targetKey: 'i', hint: 'none', emoji: '🍦', keyword: 'Ice cream' },
  { id: 'kh22', targetKey: 'u', hint: 'none', emoji: '☂️', keyword: 'Umbrella' },
  { id: 'kh23', targetKey: 'v', hint: 'none', emoji: '🌋', keyword: 'Volcano' },
  { id: 'kh24', targetKey: 'y', hint: 'none', emoji: '🪀', keyword: 'Yo-yo' },
  { id: 'kh25', targetKey: 'z', hint: 'none', emoji: '🦓', keyword: 'Zebra' },
  { id: 'kh26', targetKey: 'q', hint: 'none', emoji: '👑', keyword: 'Queen' },
];

// Word Builder words
export const WORD_BUILDER_WORDS: WordBuilderWord[] = [
  // 3-letter
  { id: 'wb1', word: 'cat', emoji: '🐱', difficulty: 1 },
  { id: 'wb2', word: 'dog', emoji: '🐕', difficulty: 1 },
  { id: 'wb3', word: 'sun', emoji: '☀️', difficulty: 1 },
  { id: 'wb4', word: 'hat', emoji: '🎩', difficulty: 1 },
  { id: 'wb5', word: 'bug', emoji: '🐛', difficulty: 1 },
  { id: 'wb6', word: 'cup', emoji: '☕', difficulty: 1 },
  { id: 'wb7', word: 'pen', emoji: '🖊️', difficulty: 1 },
  { id: 'wb8', word: 'fox', emoji: '🦊', difficulty: 1 },
  // 4-letter
  { id: 'wb9', word: 'frog', emoji: '🐸', difficulty: 2 },
  { id: 'wb10', word: 'duck', emoji: '🦆', difficulty: 2 },
  { id: 'wb11', word: 'fish', emoji: '🐟', difficulty: 2 },
  { id: 'wb12', word: 'lamp', emoji: '💡', difficulty: 2 },
  { id: 'wb13', word: 'star', emoji: '⭐', difficulty: 2 },
  { id: 'wb14', word: 'moon', emoji: '🌙', difficulty: 2 },
  // 5-letter
  { id: 'wb15', word: 'apple', emoji: '🍎', difficulty: 3 },
  { id: 'wb16', word: 'train', emoji: '🚂', difficulty: 3 },
  { id: 'wb17', word: 'happy', emoji: '😊', difficulty: 3 },
  { id: 'wb18', word: 'cloud', emoji: '☁️', difficulty: 3 },
];

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
