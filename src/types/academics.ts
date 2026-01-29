// Academic Module Types — Structured Learning System

// === MATH TYPES ===
export interface MathConcept {
  id: string;
  name: string;
  symbol: string;      // Visual symbol: "+", "=", ">"
  emoji: string;       // Visual cue: "🧮", "➕"
  description: string;
}

export interface MathProblem {
  id: string;
  type: 'counting' | 'addition' | 'subtraction' | 'comparison' | 'patterns' | 'shapes';
  prompt: string;
  visualCue: string;   // Emoji for concrete representation
  answer: number | string;
  options?: (number | string)[]; // For multiple choice
  difficulty: 1 | 2 | 3;
}

export interface MathLesson {
  id: string;
  title: string;
  conceptTag: string;
  order: number;
  prerequisites: string[];
  newConcepts: MathConcept[];
  warmUpProblems: MathProblem[];
  practiceProblems: MathProblem[];
  teachingScript: {
    introduction: string;
    iDo: string;
    weDo: string;
    youDo: string;
  };
}

export interface MathProfile {
  childId: string;
  currentLessonId: string;
  sessionMinutes: 5 | 7 | 10;
  level: 'concrete' | 'pictorial' | 'abstract'; // CPA approach
  streak: number;
  totalProblems: number;
  lastSessionDate: string | null;
}

// === WRITING TYPES (Handwriting/Fine Motor) ===
export interface LetterCard {
  id: string;
  letter: string;
  isUppercase: boolean;
  strokeOrder: string[];  // SVG path hints
  keyword: string;        // "A is for Apple"
  keywordEmoji: string;
  formationTip: string;   // "Start at the top, slide down..."
}

export interface WritingLesson {
  id: string;
  title: string;
  conceptTag: string;
  order: number;
  prerequisites: string[];
  targetLetters: LetterCard[];
  warmUpStrokes: string[];  // Basic strokes to practice
  practiceWords: string[];
  teachingScript: {
    introduction: string;
    iDo: string;
    weDo: string;
    youDo: string;
  };
}

export interface WritingProfile {
  childId: string;
  currentLessonId: string;
  currentStage: 'trace' | 'dotToDot' | 'copy' | 'independent';
  streak: number;
  masteredLetters: string[];
  lastSessionDate: string | null;
}

// === SCIENCE TYPES ===
export interface ScienceConcept {
  id: string;
  name: string;
  emoji: string;
  category: 'life' | 'earth' | 'physical' | 'space';
  description: string;
}

export interface ScienceActivity {
  id: string;
  title: string;
  conceptId: string;
  type: 'observe' | 'classify' | 'predict' | 'experiment';
  prompt: string;
  visualCue: string;
  materials?: string[];
  steps?: string[];
}

export interface ScienceLesson {
  id: string;
  title: string;
  conceptTag: string;
  order: number;
  prerequisites: string[];
  concepts: ScienceConcept[];
  activities: ScienceActivity[];
  teachingScript: {
    introduction: string;
    observe: string;
    wonder: string;
    discover: string;
  };
}

// === SOCIAL STUDIES TYPES ===
export interface SocialConcept {
  id: string;
  name: string;
  emoji: string;
  category: 'community' | 'geography' | 'history' | 'citizenship';
  description: string;
}

export interface SocialActivity {
  id: string;
  title: string;
  conceptId: string;
  type: 'discuss' | 'map' | 'roleplay' | 'create';
  prompt: string;
  visualCue: string;
}

// === SESSION TRACKING ===
export type AcademicSubject = 'reading' | 'math' | 'writing' | 'science' | 'social';

export interface AcademicSession {
  id: string;
  subject: AcademicSubject;
  lessonId: string;
  timestamp: string;
  durationSeconds: number;
  completionPercent: number;
  correctCount: number;
  totalCount: number;
  tokensEarned: number;
  notes?: string;
}

export interface AcademicProgress {
  subject: AcademicSubject;
  conceptTag: string;
  exposuresCount: number;
  lastSuccessDate: string | null;
  masteryLevel: 'learning' | 'practicing' | 'mastered';
  accuracy: number; // 0-100
}
