// Re-export everything from the modular lesson system
// This file maintains backwards compatibility with existing imports

import { ReadingLesson } from '@/types/reading';
import { graphemeCards } from './graphemeLibrary';
import { generateAllLessons, getTodaysLesson, generateLesson, TOTAL_LESSONS, getLessonSequence } from './lessonGenerator';

// Re-export grapheme cards
export { graphemeCards } from './graphemeLibrary';

// Generate all lessons on module load
export const readingLessons: ReadingLesson[] = generateAllLessons();

// Helper to get lesson by ID
export const getLesson = (id: string): ReadingLesson | undefined => {
  // Check if it's a review lesson (generated dynamically)
  if (id.startsWith('review-')) {
    return undefined; // Review lessons are generated fresh
  }
  return readingLessons.find(l => l.id === id);
};

// Get next lesson in sequence
export const getNextLesson = (currentId: string): ReadingLesson | undefined => {
  const current = readingLessons.find(l => l.id === currentId);
  if (!current) return readingLessons[0];
  return readingLessons.find(l => l.order === current.order + 1);
};

// Get today's dynamically generated lesson
export const getDailyLesson = (currentLessonIndex: number): ReadingLesson | null => {
  return getTodaysLesson(currentLessonIndex);
};

// Re-export for convenience
export { TOTAL_LESSONS, getLessonSequence, generateLesson };
