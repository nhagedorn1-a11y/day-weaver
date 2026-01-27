import { ReadingLesson, GraphemeCard, ReadingWord, DecodableSentence } from '@/types/reading';

// Core grapheme cards library
export const graphemeCards: Record<string, GraphemeCard> = {
  'm': { id: 'm', grapheme: 'm', phoneme: '/m/', isDigraph: false },
  's': { id: 's', grapheme: 's', phoneme: '/s/', isDigraph: false },
  't': { id: 't', grapheme: 't', phoneme: '/t/', isDigraph: false },
  'p': { id: 'p', grapheme: 'p', phoneme: '/p/', isDigraph: false },
  'a': { id: 'a', grapheme: 'a', phoneme: '/ă/', keyword: 'apple', isDigraph: false },
  'i': { id: 'i', grapheme: 'i', phoneme: '/ĭ/', keyword: 'itch', isDigraph: false },
  'n': { id: 'n', grapheme: 'n', phoneme: '/n/', isDigraph: false },
  'd': { id: 'd', grapheme: 'd', phoneme: '/d/', isDigraph: false },
  'o': { id: 'o', grapheme: 'o', phoneme: '/ŏ/', keyword: 'octopus', isDigraph: false },
  'c': { id: 'c', grapheme: 'c', phoneme: '/k/', isDigraph: false },
  'h': { id: 'h', grapheme: 'h', phoneme: '/h/', isDigraph: false },
  'sh': { id: 'sh', grapheme: 'sh', phoneme: '/sh/', isDigraph: true },
  'ch': { id: 'ch', grapheme: 'ch', phoneme: '/ch/', isDigraph: true },
};

// Lesson 1: CVC Short A
const lesson1Words: ReadingWord[] = [
  { id: 'mat', word: 'mat', phonemes: ['m', 'a', 't'], isSightWord: false },
  { id: 'sat', word: 'sat', phonemes: ['s', 'a', 't'], isSightWord: false },
  { id: 'map', word: 'map', phonemes: ['m', 'a', 'p'], isSightWord: false },
  { id: 'tap', word: 'tap', phonemes: ['t', 'a', 'p'], isSightWord: false },
  { id: 'pat', word: 'pat', phonemes: ['p', 'a', 't'], isSightWord: false },
  { id: 'Sam', word: 'Sam', phonemes: ['S', 'a', 'm'], isSightWord: false },
  { id: 'Pam', word: 'Pam', phonemes: ['P', 'a', 'm'], isSightWord: false },
  { id: 'sap', word: 'sap', phonemes: ['s', 'a', 'p'], isSightWord: false },
  { id: 'tam', word: 'tam', phonemes: ['t', 'a', 'm'], isSightWord: false },
  { id: 'pas', word: 'pas', phonemes: ['p', 'a', 's'], isSightWord: false },
];

// Lesson 2: CVC Short I
const lesson2Words: ReadingWord[] = [
  { id: 'sit', word: 'sit', phonemes: ['s', 'i', 't'], isSightWord: false },
  { id: 'pit', word: 'pit', phonemes: ['p', 'i', 't'], isSightWord: false },
  { id: 'tip', word: 'tip', phonemes: ['t', 'i', 'p'], isSightWord: false },
  { id: 'sip', word: 'sip', phonemes: ['s', 'i', 'p'], isSightWord: false },
  { id: 'mit', word: 'mit', phonemes: ['m', 'i', 't'], isSightWord: false },
  { id: 'Tim', word: 'Tim', phonemes: ['T', 'i', 'm'], isSightWord: false },
  { id: 'dim', word: 'dim', phonemes: ['d', 'i', 'm'], isSightWord: false },
  { id: 'did', word: 'did', phonemes: ['d', 'i', 'd'], isSightWord: false },
  { id: 'nip', word: 'nip', phonemes: ['n', 'i', 'p'], isSightWord: false },
  { id: 'pin', word: 'pin', phonemes: ['p', 'i', 'n'], isSightWord: false },
];

// Lesson 3: CVC Short O
const lesson3Words: ReadingWord[] = [
  { id: 'top', word: 'top', phonemes: ['t', 'o', 'p'], isSightWord: false },
  { id: 'pot', word: 'pot', phonemes: ['p', 'o', 't'], isSightWord: false },
  { id: 'mop', word: 'mop', phonemes: ['m', 'o', 'p'], isSightWord: false },
  { id: 'hot', word: 'hot', phonemes: ['h', 'o', 't'], isSightWord: false },
  { id: 'dot', word: 'dot', phonemes: ['d', 'o', 't'], isSightWord: false },
  { id: 'not', word: 'not', phonemes: ['n', 'o', 't'], isSightWord: false },
  { id: 'hop', word: 'hop', phonemes: ['h', 'o', 'p'], isSightWord: false },
  { id: 'cop', word: 'cop', phonemes: ['c', 'o', 'p'], isSightWord: false },
  { id: 'cot', word: 'cot', phonemes: ['c', 'o', 't'], isSightWord: false },
  { id: 'Tom', word: 'Tom', phonemes: ['T', 'o', 'm'], isSightWord: false },
];

// Lesson 4: Digraph SH
const lesson4Words: ReadingWord[] = [
  { id: 'ship', word: 'ship', phonemes: ['sh', 'i', 'p'], isSightWord: false },
  { id: 'shop', word: 'shop', phonemes: ['sh', 'o', 'p'], isSightWord: false },
  { id: 'shot', word: 'shot', phonemes: ['sh', 'o', 't'], isSightWord: false },
  { id: 'shim', word: 'shim', phonemes: ['sh', 'i', 'm'], isSightWord: false },
  { id: 'shin', word: 'shin', phonemes: ['sh', 'i', 'n'], isSightWord: false },
  { id: 'mash', word: 'mash', phonemes: ['m', 'a', 'sh'], isSightWord: false },
  { id: 'cash', word: 'cash', phonemes: ['c', 'a', 'sh'], isSightWord: false },
  { id: 'dash', word: 'dash', phonemes: ['d', 'a', 'sh'], isSightWord: false },
  { id: 'dish', word: 'dish', phonemes: ['d', 'i', 'sh'], isSightWord: false },
  { id: 'hash', word: 'hash', phonemes: ['h', 'a', 'sh'], isSightWord: false },
];

// Lesson 5: Digraph CH
const lesson5Words: ReadingWord[] = [
  { id: 'chip', word: 'chip', phonemes: ['ch', 'i', 'p'], isSightWord: false },
  { id: 'chop', word: 'chop', phonemes: ['ch', 'o', 'p'], isSightWord: false },
  { id: 'chat', word: 'chat', phonemes: ['ch', 'a', 't'], isSightWord: false },
  { id: 'chin', word: 'chin', phonemes: ['ch', 'i', 'n'], isSightWord: false },
  { id: 'chap', word: 'chap', phonemes: ['ch', 'a', 'p'], isSightWord: false },
  { id: 'much', word: 'much', phonemes: ['m', 'u', 'ch'], isSightWord: false },
  { id: 'such', word: 'such', phonemes: ['s', 'u', 'ch'], isSightWord: false },
  { id: 'rich', word: 'rich', phonemes: ['r', 'i', 'ch'], isSightWord: false },
  { id: 'inch', word: 'inch', phonemes: ['i', 'n', 'ch'], isSightWord: false },
  { id: 'chit', word: 'chit', phonemes: ['ch', 'i', 't'], isSightWord: false },
];

// Complete lesson library
export const readingLessons: ReadingLesson[] = [
  {
    id: 'lesson-1',
    title: 'Short A Words',
    conceptTag: 'cvc-short-a',
    order: 1,
    prerequisites: [],
    newGraphemes: [graphemeCards['a']],
    reviewGraphemes: ['m', 's', 't', 'p'],
    warmUpWords: ['mat', 'sat', 'tap'],
    wordList: lesson1Words,
    sentences: [
      { id: 's1-1', text: 'Sam sat.', targetWords: ['Sam', 'sat'] },
      { id: 's1-2', text: 'Pam sat on a mat.', targetWords: ['Pam', 'sat', 'mat'] },
    ],
    teachingScript: {
      introduction: "Today we'll learn the short /ă/ sound, like in 'apple'.",
      iDo: "Watch me. This letter says /ă/. When I see it in a word, I tap each sound: /m/ /ă/ /t/ — mat.",
      weDo: "Let's do it together. Point to each letter and say the sound with me.",
      youDo: "Your turn! Tap each sound, then blend them together.",
    },
  },
  {
    id: 'lesson-2',
    title: 'Short I Words',
    conceptTag: 'cvc-short-i',
    order: 2,
    prerequisites: ['cvc-short-a'],
    newGraphemes: [graphemeCards['i'], graphemeCards['n'], graphemeCards['d']],
    reviewGraphemes: ['m', 's', 't', 'p', 'a'],
    warmUpWords: ['sit', 'tip', 'pin'],
    wordList: lesson2Words,
    sentences: [
      { id: 's2-1', text: 'Tim did sit.', targetWords: ['Tim', 'did', 'sit'] },
      { id: 's2-2', text: 'I sip it.', targetWords: ['sip', 'it'] },
    ],
    teachingScript: {
      introduction: "Today we'll learn the short /ĭ/ sound, like in 'itch'.",
      iDo: "Watch me. This letter says /ĭ/. Let me tap this word: /s/ /ĭ/ /t/ — sit.",
      weDo: "Let's tap it together. /s/ /ĭ/ /t/ — sit. Great!",
      youDo: "Your turn! Tap each sound, blend, and say the word.",
    },
  },
  {
    id: 'lesson-3',
    title: 'Short O Words',
    conceptTag: 'cvc-short-o',
    order: 3,
    prerequisites: ['cvc-short-a', 'cvc-short-i'],
    newGraphemes: [graphemeCards['o'], graphemeCards['c'], graphemeCards['h']],
    reviewGraphemes: ['m', 's', 't', 'p', 'a', 'i', 'n', 'd'],
    warmUpWords: ['top', 'pot', 'hop'],
    wordList: lesson3Words,
    sentences: [
      { id: 's3-1', text: 'Tom is hot.', targetWords: ['Tom', 'hot'] },
      { id: 's3-2', text: 'Hop on top.', targetWords: ['Hop', 'top'] },
    ],
    teachingScript: {
      introduction: "Today we'll learn the short /ŏ/ sound, like in 'octopus'.",
      iDo: "Watch me. This letter says /ŏ/. Let me tap: /t/ /ŏ/ /p/ — top.",
      weDo: "Together now: /t/ /ŏ/ /p/ — top. Nice work!",
      youDo: "Now you try! Tap each sound and blend the word.",
    },
  },
  {
    id: 'lesson-4',
    title: 'The SH Sound',
    conceptTag: 'digraph-sh',
    order: 4,
    prerequisites: ['cvc-short-a', 'cvc-short-i', 'cvc-short-o'],
    newGraphemes: [graphemeCards['sh']],
    reviewGraphemes: ['m', 's', 't', 'p', 'a', 'i', 'o', 'n', 'd', 'c', 'h'],
    warmUpWords: ['ship', 'shop', 'mash'],
    wordList: lesson4Words,
    sentences: [
      { id: 's4-1', text: 'The ship is in the shop.', targetWords: ['ship', 'shop'] },
      { id: 's4-2', text: 'Dash to the dish.', targetWords: ['Dash', 'dish'] },
    ],
    teachingScript: {
      introduction: "Today we'll learn a special team: S and H work together to say /sh/.",
      iDo: "Watch me. These two letters together say /sh/. Ship: /sh/ /ĭ/ /p/ — ship.",
      weDo: "Let's say it together: /sh/. Now let's tap 'ship' together.",
      youDo: "Your turn! Remember, S-H is one sound: /sh/.",
    },
  },
  {
    id: 'lesson-5',
    title: 'The CH Sound',
    conceptTag: 'digraph-ch',
    order: 5,
    prerequisites: ['cvc-short-a', 'cvc-short-i', 'cvc-short-o', 'digraph-sh'],
    newGraphemes: [graphemeCards['ch']],
    reviewGraphemes: ['m', 's', 't', 'p', 'a', 'i', 'o', 'n', 'd', 'c', 'h', 'sh'],
    warmUpWords: ['chip', 'chop', 'chin'],
    wordList: lesson5Words,
    sentences: [
      { id: 's5-1', text: 'Chad has a chip.', targetWords: ['Chad', 'chip'] },
      { id: 's5-2', text: 'Chop it and chat.', targetWords: ['Chop', 'chat'] },
    ],
    teachingScript: {
      introduction: "Today we'll learn another letter team: C and H say /ch/.",
      iDo: "Watch me. C-H says /ch/, like at the start of 'chip': /ch/ /ĭ/ /p/ — chip.",
      weDo: "Together: /ch/. Now tap 'chip' with me: /ch/ /ĭ/ /p/.",
      youDo: "Your turn! Tap each sound. Remember, C-H is one sound.",
    },
  },
];

export const getLesson = (id: string): ReadingLesson | undefined => {
  return readingLessons.find(l => l.id === id);
};

export const getNextLesson = (currentId: string): ReadingLesson | undefined => {
  const current = readingLessons.find(l => l.id === currentId);
  if (!current) return readingLessons[0];
  return readingLessons.find(l => l.order === current.order + 1);
};
