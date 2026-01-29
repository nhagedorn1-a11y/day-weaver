import { MathLesson, MathConcept } from '@/types/academics';
import { mathConcepts } from './mathConceptLibrary';
import { mathProblems, getRandomProblems } from './mathProblemLibrary';

// Math lesson progression — systematic sequence following CPA approach
const MATH_LESSON_SEQUENCE: { conceptTag: string; title: string; conceptIds: string[] }[] = [
  // Phase 1: Counting foundations
  { conceptTag: 'count-1-5', title: 'Count to 5', conceptIds: ['count-1-5'] },
  { conceptTag: 'count-1-10', title: 'Count to 10', conceptIds: ['count-1-10'] },
  { conceptTag: 'one-to-one', title: 'One-to-One Matching', conceptIds: ['one-to-one'] },
  { conceptTag: 'more-less', title: 'More or Less', conceptIds: ['more-less'] },
  
  // Phase 2: Number sense
  { conceptTag: 'number-order', title: 'Number Order', conceptIds: ['number-order', 'before-after'] },
  { conceptTag: 'number-bonds', title: 'Number Bonds', conceptIds: ['number-bonds'] },
  
  // Phase 3: Addition
  { conceptTag: 'add-within-5', title: 'Add Within 5', conceptIds: ['add-within-5'] },
  { conceptTag: 'add-doubles', title: 'Doubles Facts', conceptIds: ['add-doubles'] },
  { conceptTag: 'add-within-10', title: 'Add Within 10', conceptIds: ['add-within-10'] },
  { conceptTag: 'make-ten', title: 'Make Ten', conceptIds: ['make-ten'] },
  
  // Phase 4: Subtraction
  { conceptTag: 'subtract-within-5', title: 'Subtract Within 5', conceptIds: ['subtract-within-5'] },
  { conceptTag: 'subtract-within-10', title: 'Subtract Within 10', conceptIds: ['subtract-within-10'] },
  
  // Phase 5: Shapes & Patterns
  { conceptTag: 'shapes-2d', title: '2D Shapes', conceptIds: ['shapes-2d'] },
  { conceptTag: 'patterns-ab', title: 'AB Patterns', conceptIds: ['patterns-ab'] },
  { conceptTag: 'patterns-abc', title: 'ABC Patterns', conceptIds: ['patterns-abc'] },
];

// Get prerequisites for a lesson
const getPrerequisites = (lessonIndex: number): string[] => {
  const prereqs: string[] = [];
  for (let i = 0; i < lessonIndex; i++) {
    prereqs.push(MATH_LESSON_SEQUENCE[i].conceptTag);
  }
  return prereqs;
};

// Generate teaching script based on concept
const generateMathScript = (concept: MathConcept) => {
  return {
    introduction: `Today we're learning about ${concept.name}! ${concept.emoji}`,
    iDo: `Watch me. ${concept.description}. I'll show you how.`,
    weDo: `Let's try it together. ${concept.emoji} Ready?`,
    youDo: `Your turn! Remember the ${concept.emoji} picture to help you.`,
  };
};

// Generate a single math lesson
export const generateMathLesson = (lessonIndex: number): MathLesson | null => {
  if (lessonIndex < 0 || lessonIndex >= MATH_LESSON_SEQUENCE.length) {
    return null;
  }

  const lessonConfig = MATH_LESSON_SEQUENCE[lessonIndex];
  const newConcepts = lessonConfig.conceptIds
    .map(id => mathConcepts[id])
    .filter(Boolean) as MathConcept[];

  if (newConcepts.length === 0) {
    return null;
  }

  const allProblems = mathProblems[lessonConfig.conceptTag] || [];
  const warmUpProblems = getRandomProblems(lessonConfig.conceptTag, 3);
  const practiceProblems = getRandomProblems(lessonConfig.conceptTag, 8);

  return {
    id: `math-${lessonIndex + 1}`,
    title: lessonConfig.title,
    conceptTag: lessonConfig.conceptTag,
    order: lessonIndex + 1,
    prerequisites: getPrerequisites(lessonIndex),
    newConcepts,
    warmUpProblems,
    practiceProblems,
    teachingScript: generateMathScript(newConcepts[0]),
  };
};

// Generate all math lessons
export const generateAllMathLessons = (): MathLesson[] => {
  return MATH_LESSON_SEQUENCE
    .map((_, index) => generateMathLesson(index))
    .filter(Boolean) as MathLesson[];
};

// Generate a review lesson based on mastered concepts
export const generateMathReviewLesson = (masteredConcepts: string[]): MathLesson | null => {
  if (masteredConcepts.length === 0) return null;

  const shuffled = [...masteredConcepts].sort(() => Math.random() - 0.5);
  const reviewConcepts = shuffled.slice(0, Math.min(3, shuffled.length));

  const allProblems = reviewConcepts.flatMap(concept => getRandomProblems(concept, 3));
  const allConceptObjs = reviewConcepts
    .map(c => {
      const config = MATH_LESSON_SEQUENCE.find(l => l.conceptTag === c);
      return config?.conceptIds.map(id => mathConcepts[id]);
    })
    .flat()
    .filter(Boolean) as MathConcept[];

  return {
    id: `math-review-${Date.now()}`,
    title: 'Math Review Day!',
    conceptTag: 'review',
    order: 0,
    prerequisites: [],
    newConcepts: [],
    warmUpProblems: allProblems.slice(0, 3),
    practiceProblems: allProblems,
    teachingScript: {
      introduction: "Today we're reviewing what we've learned! 🎉",
      iDo: "Let's practice some problems we've seen before.",
      weDo: "Try these with me!",
      youDo: "Your turn! Show me what you remember.",
    },
  };
};

// Get today's math lesson with daily randomization
export const getTodaysMathLesson = (currentLessonIndex: number): MathLesson | null => {
  const today = new Date().toISOString().split('T')[0];
  const dateNum = today.split('-').reduce((acc, n) => acc + parseInt(n), 0);
  
  // Every 4th day is review day
  if (dateNum % 4 === 0 && currentLessonIndex > 1) {
    const masteredConcepts = MATH_LESSON_SEQUENCE
      .slice(0, currentLessonIndex)
      .map(l => l.conceptTag);
    return generateMathReviewLesson(masteredConcepts);
  }

  return generateMathLesson(currentLessonIndex);
};

// Export for convenience
export const TOTAL_MATH_LESSONS = MATH_LESSON_SEQUENCE.length;
export const getMathLessonSequence = () => MATH_LESSON_SEQUENCE;
export const mathLessons: MathLesson[] = generateAllMathLessons();

export const getMathLesson = (id: string): MathLesson | undefined => {
  return mathLessons.find(l => l.id === id);
};

export const getNextMathLesson = (currentId: string): MathLesson | undefined => {
  const current = mathLessons.find(l => l.id === currentId);
  if (!current) return mathLessons[0];
  return mathLessons.find(l => l.order === current.order + 1);
};
