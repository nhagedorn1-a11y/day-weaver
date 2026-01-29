import { ReadingWord } from '@/types/reading';

// Complete word library organized by phonetic pattern
// Each word includes phoneme breakdown for segmenting/blending practice

export const wordLibrary: Record<string, ReadingWord[]> = {
  // === CVC SHORT VOWEL WORDS ===
  'cvc-short-a': [
    { id: 'mat', word: 'mat', phonemes: ['m', 'a', 't'], isSightWord: false },
    { id: 'sat', word: 'sat', phonemes: ['s', 'a', 't'], isSightWord: false },
    { id: 'map', word: 'map', phonemes: ['m', 'a', 'p'], isSightWord: false },
    { id: 'tap', word: 'tap', phonemes: ['t', 'a', 'p'], isSightWord: false },
    { id: 'pat', word: 'pat', phonemes: ['p', 'a', 't'], isSightWord: false },
    { id: 'Sam', word: 'Sam', phonemes: ['S', 'a', 'm'], isSightWord: false },
    { id: 'Pam', word: 'Pam', phonemes: ['P', 'a', 'm'], isSightWord: false },
    { id: 'sap', word: 'sap', phonemes: ['s', 'a', 'p'], isSightWord: false },
    { id: 'cap', word: 'cap', phonemes: ['c', 'a', 'p'], isSightWord: false },
    { id: 'can', word: 'can', phonemes: ['c', 'a', 'n'], isSightWord: false },
    { id: 'cat', word: 'cat', phonemes: ['c', 'a', 't'], isSightWord: false },
    { id: 'bat', word: 'bat', phonemes: ['b', 'a', 't'], isSightWord: false },
    { id: 'bag', word: 'bag', phonemes: ['b', 'a', 'g'], isSightWord: false },
    { id: 'rag', word: 'rag', phonemes: ['r', 'a', 'g'], isSightWord: false },
    { id: 'wag', word: 'wag', phonemes: ['w', 'a', 'g'], isSightWord: false },
    { id: 'fan', word: 'fan', phonemes: ['f', 'a', 'n'], isSightWord: false },
    { id: 'van', word: 'van', phonemes: ['v', 'a', 'n'], isSightWord: false },
    { id: 'ran', word: 'ran', phonemes: ['r', 'a', 'n'], isSightWord: false },
    { id: 'Dan', word: 'Dan', phonemes: ['D', 'a', 'n'], isSightWord: false },
    { id: 'lap', word: 'lap', phonemes: ['l', 'a', 'p'], isSightWord: false },
  ],

  'cvc-short-e': [
    { id: 'bed', word: 'bed', phonemes: ['b', 'e', 'd'], isSightWord: false },
    { id: 'red', word: 'red', phonemes: ['r', 'e', 'd'], isSightWord: false },
    { id: 'wet', word: 'wet', phonemes: ['w', 'e', 't'], isSightWord: false },
    { id: 'pet', word: 'pet', phonemes: ['p', 'e', 't'], isSightWord: false },
    { id: 'net', word: 'net', phonemes: ['n', 'e', 't'], isSightWord: false },
    { id: 'set', word: 'set', phonemes: ['s', 'e', 't'], isSightWord: false },
    { id: 'let', word: 'let', phonemes: ['l', 'e', 't'], isSightWord: false },
    { id: 'get', word: 'get', phonemes: ['g', 'e', 't'], isSightWord: false },
    { id: 'jet', word: 'jet', phonemes: ['j', 'e', 't'], isSightWord: false },
    { id: 'hen', word: 'hen', phonemes: ['h', 'e', 'n'], isSightWord: false },
    { id: 'ten', word: 'ten', phonemes: ['t', 'e', 'n'], isSightWord: false },
    { id: 'pen', word: 'pen', phonemes: ['p', 'e', 'n'], isSightWord: false },
    { id: 'men', word: 'men', phonemes: ['m', 'e', 'n'], isSightWord: false },
    { id: 'Ben', word: 'Ben', phonemes: ['B', 'e', 'n'], isSightWord: false },
    { id: 'leg', word: 'leg', phonemes: ['l', 'e', 'g'], isSightWord: false },
    { id: 'beg', word: 'beg', phonemes: ['b', 'e', 'g'], isSightWord: false },
    { id: 'peg', word: 'peg', phonemes: ['p', 'e', 'g'], isSightWord: false },
    { id: 'fed', word: 'fed', phonemes: ['f', 'e', 'd'], isSightWord: false },
    { id: 'Ted', word: 'Ted', phonemes: ['T', 'e', 'd'], isSightWord: false },
    { id: 'wed', word: 'wed', phonemes: ['w', 'e', 'd'], isSightWord: false },
  ],

  'cvc-short-i': [
    { id: 'sit', word: 'sit', phonemes: ['s', 'i', 't'], isSightWord: false },
    { id: 'pit', word: 'pit', phonemes: ['p', 'i', 't'], isSightWord: false },
    { id: 'tip', word: 'tip', phonemes: ['t', 'i', 'p'], isSightWord: false },
    { id: 'sip', word: 'sip', phonemes: ['s', 'i', 'p'], isSightWord: false },
    { id: 'dip', word: 'dip', phonemes: ['d', 'i', 'p'], isSightWord: false },
    { id: 'hip', word: 'hip', phonemes: ['h', 'i', 'p'], isSightWord: false },
    { id: 'rip', word: 'rip', phonemes: ['r', 'i', 'p'], isSightWord: false },
    { id: 'zip', word: 'zip', phonemes: ['z', 'i', 'p'], isSightWord: false },
    { id: 'Tim', word: 'Tim', phonemes: ['T', 'i', 'm'], isSightWord: false },
    { id: 'dim', word: 'dim', phonemes: ['d', 'i', 'm'], isSightWord: false },
    { id: 'him', word: 'him', phonemes: ['h', 'i', 'm'], isSightWord: false },
    { id: 'rim', word: 'rim', phonemes: ['r', 'i', 'm'], isSightWord: false },
    { id: 'did', word: 'did', phonemes: ['d', 'i', 'd'], isSightWord: false },
    { id: 'kid', word: 'kid', phonemes: ['k', 'i', 'd'], isSightWord: false },
    { id: 'lid', word: 'lid', phonemes: ['l', 'i', 'd'], isSightWord: false },
    { id: 'big', word: 'big', phonemes: ['b', 'i', 'g'], isSightWord: false },
    { id: 'dig', word: 'dig', phonemes: ['d', 'i', 'g'], isSightWord: false },
    { id: 'fig', word: 'fig', phonemes: ['f', 'i', 'g'], isSightWord: false },
    { id: 'pig', word: 'pig', phonemes: ['p', 'i', 'g'], isSightWord: false },
    { id: 'wig', word: 'wig', phonemes: ['w', 'i', 'g'], isSightWord: false },
  ],

  'cvc-short-o': [
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
    { id: 'mom', word: 'mom', phonemes: ['m', 'o', 'm'], isSightWord: false },
    { id: 'job', word: 'job', phonemes: ['j', 'o', 'b'], isSightWord: false },
    { id: 'rob', word: 'rob', phonemes: ['r', 'o', 'b'], isSightWord: false },
    { id: 'Bob', word: 'Bob', phonemes: ['B', 'o', 'b'], isSightWord: false },
    { id: 'sob', word: 'sob', phonemes: ['s', 'o', 'b'], isSightWord: false },
    { id: 'log', word: 'log', phonemes: ['l', 'o', 'g'], isSightWord: false },
    { id: 'dog', word: 'dog', phonemes: ['d', 'o', 'g'], isSightWord: false },
    { id: 'fog', word: 'fog', phonemes: ['f', 'o', 'g'], isSightWord: false },
    { id: 'hog', word: 'hog', phonemes: ['h', 'o', 'g'], isSightWord: false },
    { id: 'jog', word: 'jog', phonemes: ['j', 'o', 'g'], isSightWord: false },
  ],

  'cvc-short-u': [
    { id: 'cup', word: 'cup', phonemes: ['c', 'u', 'p'], isSightWord: false },
    { id: 'pup', word: 'pup', phonemes: ['p', 'u', 'p'], isSightWord: false },
    { id: 'up', word: 'up', phonemes: ['u', 'p'], isSightWord: false },
    { id: 'bus', word: 'bus', phonemes: ['b', 'u', 's'], isSightWord: false },
    { id: 'us', word: 'us', phonemes: ['u', 's'], isSightWord: false },
    { id: 'but', word: 'but', phonemes: ['b', 'u', 't'], isSightWord: false },
    { id: 'cut', word: 'cut', phonemes: ['c', 'u', 't'], isSightWord: false },
    { id: 'nut', word: 'nut', phonemes: ['n', 'u', 't'], isSightWord: false },
    { id: 'hut', word: 'hut', phonemes: ['h', 'u', 't'], isSightWord: false },
    { id: 'rut', word: 'rut', phonemes: ['r', 'u', 't'], isSightWord: false },
    { id: 'bun', word: 'bun', phonemes: ['b', 'u', 'n'], isSightWord: false },
    { id: 'fun', word: 'fun', phonemes: ['f', 'u', 'n'], isSightWord: false },
    { id: 'gun', word: 'gun', phonemes: ['g', 'u', 'n'], isSightWord: false },
    { id: 'run', word: 'run', phonemes: ['r', 'u', 'n'], isSightWord: false },
    { id: 'sun', word: 'sun', phonemes: ['s', 'u', 'n'], isSightWord: false },
    { id: 'bug', word: 'bug', phonemes: ['b', 'u', 'g'], isSightWord: false },
    { id: 'dug', word: 'dug', phonemes: ['d', 'u', 'g'], isSightWord: false },
    { id: 'hug', word: 'hug', phonemes: ['h', 'u', 'g'], isSightWord: false },
    { id: 'jug', word: 'jug', phonemes: ['j', 'u', 'g'], isSightWord: false },
    { id: 'mug', word: 'mug', phonemes: ['m', 'u', 'g'], isSightWord: false },
    { id: 'rug', word: 'rug', phonemes: ['r', 'u', 'g'], isSightWord: false },
    { id: 'tub', word: 'tub', phonemes: ['t', 'u', 'b'], isSightWord: false },
    { id: 'sub', word: 'sub', phonemes: ['s', 'u', 'b'], isSightWord: false },
    { id: 'rub', word: 'rub', phonemes: ['r', 'u', 'b'], isSightWord: false },
    { id: 'cub', word: 'cub', phonemes: ['c', 'u', 'b'], isSightWord: false },
  ],

  // === DIGRAPHS ===
  'digraph-sh': [
    { id: 'ship', word: 'ship', phonemes: ['sh', 'i', 'p'], isSightWord: false },
    { id: 'shop', word: 'shop', phonemes: ['sh', 'o', 'p'], isSightWord: false },
    { id: 'shot', word: 'shot', phonemes: ['sh', 'o', 't'], isSightWord: false },
    { id: 'shut', word: 'shut', phonemes: ['sh', 'u', 't'], isSightWord: false },
    { id: 'shed', word: 'shed', phonemes: ['sh', 'e', 'd'], isSightWord: false },
    { id: 'shin', word: 'shin', phonemes: ['sh', 'i', 'n'], isSightWord: false },
    { id: 'mash', word: 'mash', phonemes: ['m', 'a', 'sh'], isSightWord: false },
    { id: 'cash', word: 'cash', phonemes: ['c', 'a', 'sh'], isSightWord: false },
    { id: 'dash', word: 'dash', phonemes: ['d', 'a', 'sh'], isSightWord: false },
    { id: 'dish', word: 'dish', phonemes: ['d', 'i', 'sh'], isSightWord: false },
    { id: 'fish', word: 'fish', phonemes: ['f', 'i', 'sh'], isSightWord: false },
    { id: 'wish', word: 'wish', phonemes: ['w', 'i', 'sh'], isSightWord: false },
    { id: 'hush', word: 'hush', phonemes: ['h', 'u', 'sh'], isSightWord: false },
    { id: 'rush', word: 'rush', phonemes: ['r', 'u', 'sh'], isSightWord: false },
    { id: 'bush', word: 'bush', phonemes: ['b', 'u', 'sh'], isSightWord: false },
  ],

  'digraph-ch': [
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
    { id: 'chug', word: 'chug', phonemes: ['ch', 'u', 'g'], isSightWord: false },
  ],

  'digraph-th': [
    { id: 'this', word: 'this', phonemes: ['th', 'i', 's'], isSightWord: false },
    { id: 'that', word: 'that', phonemes: ['th', 'a', 't'], isSightWord: false },
    { id: 'them', word: 'them', phonemes: ['th', 'e', 'm'], isSightWord: false },
    { id: 'then', word: 'then', phonemes: ['th', 'e', 'n'], isSightWord: false },
    { id: 'thin', word: 'thin', phonemes: ['th', 'i', 'n'], isSightWord: false },
    { id: 'with', word: 'with', phonemes: ['w', 'i', 'th'], isSightWord: false },
    { id: 'bath', word: 'bath', phonemes: ['b', 'a', 'th'], isSightWord: false },
    { id: 'math', word: 'math', phonemes: ['m', 'a', 'th'], isSightWord: false },
    { id: 'path', word: 'path', phonemes: ['p', 'a', 'th'], isSightWord: false },
    { id: 'moth', word: 'moth', phonemes: ['m', 'o', 'th'], isSightWord: false },
  ],

  'digraph-wh': [
    { id: 'when', word: 'when', phonemes: ['wh', 'e', 'n'], isSightWord: false },
    { id: 'whip', word: 'whip', phonemes: ['wh', 'i', 'p'], isSightWord: false },
    { id: 'whim', word: 'whim', phonemes: ['wh', 'i', 'm'], isSightWord: false },
    { id: 'whiz', word: 'whiz', phonemes: ['wh', 'i', 'z'], isSightWord: false },
  ],

  'digraph-ck': [
    { id: 'back', word: 'back', phonemes: ['b', 'a', 'ck'], isSightWord: false },
    { id: 'pack', word: 'pack', phonemes: ['p', 'a', 'ck'], isSightWord: false },
    { id: 'rack', word: 'rack', phonemes: ['r', 'a', 'ck'], isSightWord: false },
    { id: 'tack', word: 'tack', phonemes: ['t', 'a', 'ck'], isSightWord: false },
    { id: 'Jack', word: 'Jack', phonemes: ['J', 'a', 'ck'], isSightWord: false },
    { id: 'deck', word: 'deck', phonemes: ['d', 'e', 'ck'], isSightWord: false },
    { id: 'neck', word: 'neck', phonemes: ['n', 'e', 'ck'], isSightWord: false },
    { id: 'peck', word: 'peck', phonemes: ['p', 'e', 'ck'], isSightWord: false },
    { id: 'kick', word: 'kick', phonemes: ['k', 'i', 'ck'], isSightWord: false },
    { id: 'lick', word: 'lick', phonemes: ['l', 'i', 'ck'], isSightWord: false },
    { id: 'pick', word: 'pick', phonemes: ['p', 'i', 'ck'], isSightWord: false },
    { id: 'sick', word: 'sick', phonemes: ['s', 'i', 'ck'], isSightWord: false },
    { id: 'tick', word: 'tick', phonemes: ['t', 'i', 'ck'], isSightWord: false },
    { id: 'wick', word: 'wick', phonemes: ['w', 'i', 'ck'], isSightWord: false },
    { id: 'dock', word: 'dock', phonemes: ['d', 'o', 'ck'], isSightWord: false },
    { id: 'lock', word: 'lock', phonemes: ['l', 'o', 'ck'], isSightWord: false },
    { id: 'rock', word: 'rock', phonemes: ['r', 'o', 'ck'], isSightWord: false },
    { id: 'sock', word: 'sock', phonemes: ['s', 'o', 'ck'], isSightWord: false },
    { id: 'duck', word: 'duck', phonemes: ['d', 'u', 'ck'], isSightWord: false },
    { id: 'luck', word: 'luck', phonemes: ['l', 'u', 'ck'], isSightWord: false },
    { id: 'tuck', word: 'tuck', phonemes: ['t', 'u', 'ck'], isSightWord: false },
    { id: 'truck', word: 'truck', phonemes: ['t', 'r', 'u', 'ck'], isSightWord: false },
  ],
};

// Get words for a specific concept
export const getWordsForConcept = (conceptTag: string): ReadingWord[] => {
  return wordLibrary[conceptTag] || [];
};

// Get random selection of words from a concept
export const getRandomWords = (conceptTag: string, count: number): ReadingWord[] => {
  const words = getWordsForConcept(conceptTag);
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get all available concept tags
export const getAvailableConcepts = (): string[] => {
  return Object.keys(wordLibrary);
};
