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

// Generate decodable sentences from word list
const generateSentences = (words: ReadingWord[], conceptTag: string): DecodableSentence[] => {
  const templates = [
    { template: '{name} has a {noun}.', slots: ['name', 'noun'] },
    { template: 'The {noun} is {adj}.', slots: ['noun', 'adj'] },
    { template: 'I can {verb} it.', slots: ['verb'] },
    { template: '{name} can {verb}.', slots: ['name', 'verb'] },
  ];

  const names = words.filter(w => w.word[0] === w.word[0].toUpperCase());
  const nouns = words.filter(w => w.word[0] === w.word[0].toLowerCase());

  const sentences: DecodableSentence[] = [];
  
  // Generate 2-3 sentences
  if (names.length > 0 && nouns.length > 0) {
    sentences.push({
      id: `${conceptTag}-s1`,
      text: `${names[0]?.word || 'Sam'} has a ${nouns[0]?.word || 'hat'}.`,
      targetWords: [names[0]?.word, nouns[0]?.word].filter(Boolean) as string[],
    });
  }
  
  if (nouns.length > 1) {
    sentences.push({
      id: `${conceptTag}-s2`,
      text: `The ${nouns[1]?.word || 'cat'} is ${nouns[2]?.word || 'big'}.`,
      targetWords: [nouns[1]?.word, nouns[2]?.word].filter(Boolean) as string[],
    });
  }

  return sentences;
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
    sentences: generateSentences(selectedWords, lessonConfig.conceptTag),
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
    sentences: generateSentences(allWords, 'review'),
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
