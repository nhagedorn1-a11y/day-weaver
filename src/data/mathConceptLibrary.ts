import { MathConcept } from '@/types/academics';

// Complete math concept library with visual cues
// Every concept has an emoji for concrete-pictorial-abstract learning

export const mathConcepts: Record<string, MathConcept> = {
  // === COUNTING & CARDINALITY ===
  'count-1-5': { id: 'count-1-5', name: 'Count 1-5', symbol: '12345', emoji: '🖐️', description: 'Count objects from 1 to 5' },
  'count-1-10': { id: 'count-1-10', name: 'Count 1-10', symbol: '1→10', emoji: '🔢', description: 'Count objects from 1 to 10' },
  'count-1-20': { id: 'count-1-20', name: 'Count 1-20', symbol: '1→20', emoji: '📊', description: 'Count objects from 1 to 20' },
  'count-backwards': { id: 'count-backwards', name: 'Count Backwards', symbol: '5→1', emoji: '⬇️', description: 'Count down from a number' },
  'skip-count-2': { id: 'skip-count-2', name: 'Skip Count by 2', symbol: '2,4,6', emoji: '👟', description: 'Count by twos' },
  'skip-count-5': { id: 'skip-count-5', name: 'Skip Count by 5', symbol: '5,10,15', emoji: '✋', description: 'Count by fives' },
  'skip-count-10': { id: 'skip-count-10', name: 'Skip Count by 10', symbol: '10,20,30', emoji: '🔟', description: 'Count by tens' },

  // === NUMBER SENSE ===
  'one-to-one': { id: 'one-to-one', name: 'One-to-One', symbol: '1:1', emoji: '🎯', description: 'Match one object to one number' },
  'more-less': { id: 'more-less', name: 'More or Less', symbol: '><', emoji: '⚖️', description: 'Compare which group has more or less' },
  'same-different': { id: 'same-different', name: 'Same or Different', symbol: '=≠', emoji: '🔍', description: 'Tell if groups are the same or different' },
  'number-order': { id: 'number-order', name: 'Number Order', symbol: '123', emoji: '📋', description: 'Put numbers in order' },
  'before-after': { id: 'before-after', name: 'Before & After', symbol: '←→', emoji: '👈👉', description: 'What comes before and after a number' },
  'number-bonds': { id: 'number-bonds', name: 'Number Bonds', symbol: '5=2+3', emoji: '🔗', description: 'Ways to make a number' },

  // === ADDITION ===
  'add-within-5': { id: 'add-within-5', name: 'Add Within 5', symbol: '+5', emoji: '➕', description: 'Add numbers with sum up to 5' },
  'add-within-10': { id: 'add-within-10', name: 'Add Within 10', symbol: '+10', emoji: '🧮', description: 'Add numbers with sum up to 10' },
  'add-within-20': { id: 'add-within-20', name: 'Add Within 20', symbol: '+20', emoji: '📈', description: 'Add numbers with sum up to 20' },
  'add-doubles': { id: 'add-doubles', name: 'Doubles', symbol: '3+3', emoji: '👯', description: 'Add the same number twice' },
  'add-near-doubles': { id: 'add-near-doubles', name: 'Near Doubles', symbol: '3+4', emoji: '👯‍♂️', description: 'Add numbers that are one apart' },
  'make-ten': { id: 'make-ten', name: 'Make Ten', symbol: '7+3=10', emoji: '🎰', description: 'Find pairs that make 10' },

  // === SUBTRACTION ===
  'subtract-within-5': { id: 'subtract-within-5', name: 'Subtract Within 5', symbol: '-5', emoji: '➖', description: 'Take away with numbers up to 5' },
  'subtract-within-10': { id: 'subtract-within-10', name: 'Subtract Within 10', symbol: '-10', emoji: '🔻', description: 'Take away with numbers up to 10' },
  'subtract-within-20': { id: 'subtract-within-20', name: 'Subtract Within 20', symbol: '-20', emoji: '📉', description: 'Take away with numbers up to 20' },
  'fact-families': { id: 'fact-families', name: 'Fact Families', symbol: '+-', emoji: '👨‍👩‍👧', description: 'Related addition and subtraction facts' },

  // === SHAPES & GEOMETRY ===
  'shapes-2d': { id: 'shapes-2d', name: '2D Shapes', symbol: '◯△□', emoji: '🔷', description: 'Circles, triangles, squares, rectangles' },
  'shapes-3d': { id: 'shapes-3d', name: '3D Shapes', symbol: '⬡', emoji: '📦', description: 'Cubes, spheres, cylinders, cones' },
  'shape-attributes': { id: 'shape-attributes', name: 'Shape Attributes', symbol: '📐', emoji: '📏', description: 'Sides, corners, faces, edges' },
  'position-words': { id: 'position-words', name: 'Position Words', symbol: '↑↓←→', emoji: '🗺️', description: 'Above, below, beside, between' },

  // === PATTERNS ===
  'patterns-ab': { id: 'patterns-ab', name: 'AB Patterns', symbol: 'ABAB', emoji: '🔴🔵', description: 'Simple repeating patterns' },
  'patterns-abc': { id: 'patterns-abc', name: 'ABC Patterns', symbol: 'ABCABC', emoji: '🔴🔵🟢', description: 'Three-part repeating patterns' },
  'patterns-aab': { id: 'patterns-aab', name: 'AAB Patterns', symbol: 'AABAAB', emoji: '🔴🔴🔵', description: 'Patterns with repeated elements' },
  'growing-patterns': { id: 'growing-patterns', name: 'Growing Patterns', symbol: '1,2,3...', emoji: '📶', description: 'Patterns that increase' },

  // === MEASUREMENT ===
  'compare-length': { id: 'compare-length', name: 'Compare Length', symbol: '📏', emoji: '📐', description: 'Longer, shorter, same length' },
  'compare-weight': { id: 'compare-weight', name: 'Compare Weight', symbol: '⚖️', emoji: '🏋️', description: 'Heavier, lighter, same weight' },
  'compare-capacity': { id: 'compare-capacity', name: 'Compare Capacity', symbol: '🥛', emoji: '🫗', description: 'Holds more, holds less' },
  'time-concepts': { id: 'time-concepts', name: 'Time Concepts', symbol: '🕐', emoji: '⏰', description: 'Morning, afternoon, days of week' },

  // === DATA ===
  'sorting': { id: 'sorting', name: 'Sorting', symbol: '📊', emoji: '🗂️', description: 'Group objects by attribute' },
  'graphing': { id: 'graphing', name: 'Simple Graphs', symbol: '📈', emoji: '📊', description: 'Picture graphs and bar graphs' },
};

// Get concept by ID
export const getMathConcept = (id: string): MathConcept | undefined => {
  return mathConcepts[id];
};

// Get all concepts as array
export const getAllMathConcepts = (): MathConcept[] => {
  return Object.values(mathConcepts);
};

// Get concepts by category
export const getCountingConcepts = (): MathConcept[] => {
  const ids = ['count-1-5', 'count-1-10', 'count-1-20', 'count-backwards', 'skip-count-2', 'skip-count-5', 'skip-count-10'];
  return ids.map(id => mathConcepts[id]).filter(Boolean);
};

export const getAdditionConcepts = (): MathConcept[] => {
  const ids = ['add-within-5', 'add-within-10', 'add-within-20', 'add-doubles', 'add-near-doubles', 'make-ten'];
  return ids.map(id => mathConcepts[id]).filter(Boolean);
};

export const getSubtractionConcepts = (): MathConcept[] => {
  const ids = ['subtract-within-5', 'subtract-within-10', 'subtract-within-20', 'fact-families'];
  return ids.map(id => mathConcepts[id]).filter(Boolean);
};

export const getShapeConcepts = (): MathConcept[] => {
  const ids = ['shapes-2d', 'shapes-3d', 'shape-attributes', 'position-words'];
  return ids.map(id => mathConcepts[id]).filter(Boolean);
};
