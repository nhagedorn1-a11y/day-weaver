// Reading Studio Types — Orton-Gillingham aligned

export interface GraphemeCard {
  id: string;
  grapheme: string; // The letter(s): "a", "sh", "ch"
  phoneme: string; // The sound: "/ă/", "/sh/"
  keyword: string; // Keyword for visual association: "apple"
  keywordEmoji: string; // Visual cue emoji: "🍎"
  isDigraph: boolean;
}

export interface ReadingWord {
  id: string;
  word: string;
  phonemes: string[]; // ["m", "a", "t"] for "mat"
  isSightWord: boolean;
}

export interface DecodableSentence {
  id: string;
  text: string;
  targetWords: string[]; // Words with focus pattern
}

export interface ReadingLesson {
  id: string;
  title: string;
  conceptTag: string; // "cvc-short-a", "digraph-sh"
  order: number;
  prerequisites: string[]; // concept tags that must be mastered
  newGraphemes: GraphemeCard[];
  reviewGraphemes: string[]; // grapheme ids to review
  warmUpWords: string[]; // 2-3 words for blending drill
  wordList: ReadingWord[];
  sentences: DecodableSentence[];
  teachingScript: {
    introduction: string;
    iDo: string;
    weDo: string;
    youDo: string;
  };
}

export interface ReadingProfile {
  childId: string;
  currentLessonId: string;
  sessionMinutes: 5 | 7 | 10;
  tokenRewardEnabled: boolean;
  streak: number;
  totalMinutes: number;
  lastSessionDate: string | null;
}

export interface ReadingSessionLog {
  id: string;
  timestamp: string;
  lessonId: string;
  durationSeconds: number;
  completionPercent: number;
  difficultyRating: 1 | 2 | 3; // 1=easy, 2=just right, 3=hard
  notes?: string;
  tokensEarned: number;
}

export interface ReadingSkillMastery {
  conceptTag: string;
  exposuresCount: number;
  lastSuccessDate: string | null;
  masteryLevel: 'learning' | 'practicing' | 'mastered';
}

// Session step types
export type SessionStep = 'warmup' | 'review' | 'teach' | 'practice' | 'sentence' | 'finish';

export interface SessionState {
  lessonId: string;
  currentStep: SessionStep;
  stepProgress: number; // 0-100 within current step
  itemIndex: number; // Current item within step
  startTime: number;
  tokensEarned: number;
  errors: number;
  corrections: number;
}

// Error correction model
export interface ErrorCorrection {
  step: 'myTurn' | 'together' | 'yourTurn';
  target: string; // The grapheme/word being corrected
}
