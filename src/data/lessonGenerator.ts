import { ReadingLesson, ReadingWord, DecodableSentence, GraphemeCard } from '@/types/reading';
import { graphemeCards } from './graphemeLibrary';
import { wordLibrary, getRandomWords } from './wordLibrary';

// Lesson progression order - systematic phonics sequence
const LESSON_SEQUENCE: { conceptTag: string; title: string; graphemeIds: string[] }[] = [
  // Phase 1: Short vowels with basic consonants
  { conceptTag: 'cvc-short-a', title: 'Short A Words', graphemeIds: ['a'] },
  { conceptTag: 'cvc-short-i', title: 'Short I Words', graphemeIds: ['i', 'n', 'd'] },
  { conceptTag: 'cvc-short-o', title: 'Short O Words', graphemeIds: ['o', 'c', 'h'] },
  { conceptTag: 'cvc-short-e', title: 'Short E Words', graphemeIds: ['e', 'b', 'g'] },
  { conceptTag: 'cvc-short-u', title: 'Short U Words', graphemeIds: ['u', 'j', 'k'] },
  
  // Phase 2: Digraphs
  { conceptTag: 'digraph-sh', title: 'The SH Sound', graphemeIds: ['sh'] },
  { conceptTag: 'digraph-ch', title: 'The CH Sound', graphemeIds: ['ch'] },
  { conceptTag: 'digraph-th', title: 'The TH Sound', graphemeIds: ['th'] },
  { conceptTag: 'digraph-wh', title: 'The WH Sound', graphemeIds: ['wh'] },
  { conceptTag: 'digraph-ck', title: 'The CK Sound', graphemeIds: ['ck'] },
];

// Get all graphemes introduced up to a lesson
const getReviewGraphemes = (lessonIndex: number): string[] => {
  const reviewIds: string[] = ['m', 's', 't', 'p']; // Always start with these
  for (let i = 0; i < lessonIndex; i++) {
    reviewIds.push(...LESSON_SEQUENCE[i].graphemeIds);
  }
  return [...new Set(reviewIds)];
};

// Get prerequisites for a lesson
const getPrerequisites = (lessonIndex: number): string[] => {
  const prereqs: string[] = [];
  for (let i = 0; i < lessonIndex; i++) {
    prereqs.push(LESSON_SEQUENCE[i].conceptTag);
  }
  return prereqs;
};

// Generate teaching script based on grapheme
const generateTeachingScript = (grapheme: GraphemeCard) => {
  const isDigraph = grapheme.isDigraph;
  
  return {
    introduction: isDigraph
      ? `Today we'll learn a special team: ${grapheme.grapheme.toUpperCase()} says ${grapheme.phoneme}, like in "${grapheme.keyword}".`
      : `Today we'll learn the ${grapheme.phoneme} sound, like in "${grapheme.keyword}".`,
    iDo: isDigraph
      ? `Watch me. These letters together say ${grapheme.phoneme}. ${grapheme.keywordEmoji} ${grapheme.keyword} starts with ${grapheme.phoneme}.`
      : `Watch me. This letter says ${grapheme.phoneme}. When I see it in a word, I tap each sound.`,
    weDo: `Let's say it together: ${grapheme.phoneme}. Now let's tap a word together.`,
    youDo: `Your turn! Remember the ${grapheme.keywordEmoji} ${grapheme.keyword} picture to help you.`,
  };
};

// Hand-crafted decodable sentences per concept — natural, meaningful, and OG-aligned
const DECODABLE_SENTENCES: Record<string, DecodableSentence[]> = {
  'cvc-short-a': [
    { id: 'cvc-short-a-s1', text: 'Sam sat on a mat.', targetWords: ['Sam', 'sat', 'mat'] },
    { id: 'cvc-short-a-s2', text: 'The cat can tap.', targetWords: ['cat', 'can', 'tap'] },
    { id: 'cvc-short-a-s3', text: 'Pam has a cap and a bag.', targetWords: ['Pam', 'cap', 'bag'] },
    { id: 'cvc-short-a-s4', text: 'Dan ran to the van.', targetWords: ['Dan', 'ran', 'van'] },
    { id: 'cvc-short-a-s5', text: 'The bat sat on a lap.', targetWords: ['bat', 'sat', 'lap'] },
  ],
  'cvc-short-i': [
    { id: 'cvc-short-i-s1', text: 'Tim did sit on a big pig.', targetWords: ['Tim', 'did', 'sit', 'big', 'pig'] },
    { id: 'cvc-short-i-s2', text: 'The kid hid the lid.', targetWords: ['kid', 'hid', 'lid'] },
    { id: 'cvc-short-i-s3', text: 'I can sip and dip.', targetWords: ['sip', 'dip'] },
    { id: 'cvc-short-i-s4', text: 'The wig is on him.', targetWords: ['wig', 'him'] },
  ],
  'cvc-short-o': [
    { id: 'cvc-short-o-s1', text: 'Tom has a hot pot.', targetWords: ['Tom', 'hot', 'pot'] },
    { id: 'cvc-short-o-s2', text: 'The dog sat on a log.', targetWords: ['dog', 'log'] },
    { id: 'cvc-short-o-s3', text: 'Bob can hop and jog.', targetWords: ['Bob', 'hop', 'jog'] },
    { id: 'cvc-short-o-s4', text: 'Mom got a mop.', targetWords: ['Mom', 'got', 'mop'] },
  ],
  'cvc-short-e': [
    { id: 'cvc-short-e-s1', text: 'Ben fed the hen.', targetWords: ['Ben', 'fed', 'hen'] },
    { id: 'cvc-short-e-s2', text: 'The red pet is wet.', targetWords: ['red', 'pet', 'wet'] },
    { id: 'cvc-short-e-s3', text: 'Ted set ten men on the bed.', targetWords: ['Ted', 'set', 'ten', 'men', 'bed'] },
    { id: 'cvc-short-e-s4', text: 'I can get the net.', targetWords: ['get', 'net'] },
  ],
  'cvc-short-u': [
    { id: 'cvc-short-u-s1', text: 'The pup dug up a bug.', targetWords: ['pup', 'dug', 'bug'] },
    { id: 'cvc-short-u-s2', text: 'I can run in the sun.', targetWords: ['run', 'sun'] },
    { id: 'cvc-short-u-s3', text: 'The cup is on the rug.', targetWords: ['cup', 'rug'] },
    { id: 'cvc-short-u-s4', text: 'The cub hid in the hut.', targetWords: ['cub', 'hut'] },
  ],
  'digraph-sh': [
    { id: 'digraph-sh-s1', text: 'The fish is in the dish.', targetWords: ['fish', 'dish'] },
    { id: 'digraph-sh-s2', text: 'I wish I had a ship.', targetWords: ['wish', 'ship'] },
    { id: 'digraph-sh-s3', text: 'She shut the shed.', targetWords: ['shut', 'shed'] },
    { id: 'digraph-sh-s4', text: 'We dash to the shop.', targetWords: ['dash', 'shop'] },
  ],
  'digraph-ch': [
    { id: 'digraph-ch-s1', text: 'I had a chip and a chat.', targetWords: ['chip', 'chat'] },
    { id: 'digraph-ch-s2', text: 'The rich chap can chop.', targetWords: ['rich', 'chap', 'chop'] },
    { id: 'digraph-ch-s3', text: 'It is much fun to munch.', targetWords: ['much', 'munch'] },
  ],
  'digraph-th': [
    { id: 'digraph-th-s1', text: 'This is the path to the bath.', targetWords: ['this', 'path', 'bath'] },
    { id: 'digraph-th-s2', text: 'Then the moth sat with them.', targetWords: ['then', 'moth', 'with', 'them'] },
    { id: 'digraph-th-s3', text: 'That thin cat ran.', targetWords: ['that', 'thin'] },
  ],
  'digraph-wh': [
    { id: 'digraph-wh-s1', text: 'When did the whip hit?', targetWords: ['when', 'whip'] },
    { id: 'digraph-wh-s2', text: 'The kid had a whim.', targetWords: ['whim'] },
  ],
  'digraph-ck': [
    { id: 'digraph-ck-s1', text: 'Jack can kick the rock.', targetWords: ['Jack', 'kick', 'rock'] },
    { id: 'digraph-ck-s2', text: 'The duck sat on the dock.', targetWords: ['duck', 'dock'] },
    { id: 'digraph-ck-s3', text: 'I can pick a sock and pack it.', targetWords: ['pick', 'sock', 'pack'] },
    { id: 'digraph-ck-s4', text: 'The truck got stuck in the muck.', targetWords: ['truck', 'stuck', 'muck'] },
  ],
  'review': [
    { id: 'review-s1', text: 'Sam and Tom can run and hop.', targetWords: ['Sam', 'Tom', 'run', 'hop'] },
    { id: 'review-s2', text: 'The big red bus is fun.', targetWords: ['big', 'red', 'bus', 'fun'] },
    { id: 'review-s3', text: 'Ben has a pet cat on his lap.', targetWords: ['Ben', 'pet', 'cat', 'lap'] },
  ],
};

// Get decodable sentences for a concept, with optional shuffling
const getSentences = (conceptTag: string, count: number = 3): DecodableSentence[] => {
  const pool = DECODABLE_SENTENCES[conceptTag] || DECODABLE_SENTENCES['review'] || [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Generate a single lesson
export const generateLesson = (lessonIndex: number): ReadingLesson | null => {
  if (lessonIndex < 0 || lessonIndex >= LESSON_SEQUENCE.length) {
    return null;
  }

  const lessonConfig = LESSON_SEQUENCE[lessonIndex];
  const newGraphemes = lessonConfig.graphemeIds
    .map(id => graphemeCards[id])
    .filter(Boolean) as GraphemeCard[];

  if (newGraphemes.length === 0) {
    return null;
  }

  const words = wordLibrary[lessonConfig.conceptTag] || [];
  const selectedWords = getRandomWords(lessonConfig.conceptTag, 10);
  const warmUpWords = selectedWords.slice(0, 3).map(w => w.word);

  return {
    id: `lesson-${lessonIndex + 1}`,
    title: lessonConfig.title,
    conceptTag: lessonConfig.conceptTag,
    order: lessonIndex + 1,
    prerequisites: getPrerequisites(lessonIndex),
    newGraphemes,
    reviewGraphemes: getReviewGraphemes(lessonIndex),
    warmUpWords,
    wordList: selectedWords,
    sentences: getSentences(lessonConfig.conceptTag, 3),
    teachingScript: generateTeachingScript(newGraphemes[0]),
  };
};

// Generate all static lessons
export const generateAllLessons = (): ReadingLesson[] => {
  return LESSON_SEQUENCE
    .map((_, index) => generateLesson(index))
    .filter(Boolean) as ReadingLesson[];
};

// Generate a random review lesson based on mastered concepts
export const generateReviewLesson = (masteredConcepts: string[]): ReadingLesson | null => {
  if (masteredConcepts.length === 0) return null;

  // Pick 2-3 random concepts to review
  const shuffled = [...masteredConcepts].sort(() => Math.random() - 0.5);
  const reviewConcepts = shuffled.slice(0, Math.min(3, shuffled.length));

  // Gather words from all review concepts
  const allWords: ReadingWord[] = [];
  const allGraphemeIds: string[] = [];
  
  reviewConcepts.forEach(concept => {
    const words = getRandomWords(concept, 4);
    allWords.push(...words);
    
    const lessonConfig = LESSON_SEQUENCE.find(l => l.conceptTag === concept);
    if (lessonConfig) {
      allGraphemeIds.push(...lessonConfig.graphemeIds);
    }
  });

  const uniqueGraphemeIds = [...new Set(allGraphemeIds)];
  const reviewGraphemes = uniqueGraphemeIds
    .map(id => graphemeCards[id])
    .filter(Boolean) as GraphemeCard[];

  return {
    id: `review-${Date.now()}`,
    title: 'Review Day!',
    conceptTag: 'review',
    order: 0,
    prerequisites: [],
    newGraphemes: [],
    reviewGraphemes: uniqueGraphemeIds,
    warmUpWords: allWords.slice(0, 3).map(w => w.word),
    wordList: allWords,
    sentences: getSentences('review', 3),
    teachingScript: {
      introduction: "Today we're going to review what we've learned!",
      iDo: "Watch me read some words we've practiced.",
      weDo: "Let's read together. Tap each sound.",
      youDo: "Your turn! Show me what you remember.",
    },
  };
};

// Get today's lesson based on date seed for variety
export const getTodaysLesson = (currentLessonIndex: number, seed?: string): ReadingLesson | null => {
  const today = seed || new Date().toISOString().split('T')[0];
  
  // Use date as seed for consistent daily randomization
  const dateNum = today.split('-').reduce((acc, n) => acc + parseInt(n), 0);
  
  // Every 5th day is review day (if we have completed at least 2 lessons)
  if (dateNum % 5 === 0 && currentLessonIndex > 1) {
    const masteredConcepts = LESSON_SEQUENCE
      .slice(0, currentLessonIndex)
      .map(l => l.conceptTag);
    return generateReviewLesson(masteredConcepts);
  }

  // Otherwise, return the current lesson with randomized word selection
  return generateLesson(currentLessonIndex);
};

// Export lesson count
export const TOTAL_LESSONS = LESSON_SEQUENCE.length;

// Export sequence for external use
export const getLessonSequence = () => LESSON_SEQUENCE;
