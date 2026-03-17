import { useState, useEffect, useCallback } from 'react';

/**
 * useLessonProgress — persists lesson completion locally and auto-advances.
 * When cloud is available (userId provided), syncs via useCloudProgress externally.
 * This hook manages the local state + localStorage fallback.
 */

export interface LessonProgressState {
  currentLessonId: string;
  currentLessonIndex: number;
  streak: number;
  totalMinutes: number;
  totalProblems: number;
  sessionMinutes: number;
  level: string;
  lastSessionDate: string | null;
  masteredItems: string[]; // letters, concepts, etc.
}

interface UseLessonProgressOptions {
  subject: string;
  defaultLessonId: string;
  defaultSessionMinutes?: number;
  defaultLevel?: string;
  /** Function that returns the next lesson ID given current ID */
  getNextLessonId: (currentId: string) => string | null;
  /** Total number of lessons for progress display */
  totalLessons: number;
}

const STORAGE_PREFIX = 'jackos-lesson-progress-';

function loadLocal(subject: string): LessonProgressState | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${subject}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveLocal(subject: string, state: LessonProgressState): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${subject}`, JSON.stringify(state));
  } catch { /* silent */ }
}

export function useLessonProgress(options: UseLessonProgressOptions) {
  const { subject, defaultLessonId, defaultSessionMinutes = 7, defaultLevel = 'concrete', getNextLessonId, totalLessons } = options;

  const [state, setState] = useState<LessonProgressState>(() => {
    const saved = loadLocal(subject);
    if (saved) return saved;
    return {
      currentLessonId: defaultLessonId,
      currentLessonIndex: 0,
      streak: 0,
      totalMinutes: 0,
      totalProblems: 0,
      sessionMinutes: defaultSessionMinutes,
      level: defaultLevel,
      lastSessionDate: null,
      masteredItems: [],
    };
  });

  // Persist on every change
  useEffect(() => {
    saveLocal(subject, state);
  }, [subject, state]);

  /**
   * Call when a session completes. Automatically advances to next lesson.
   * Returns the next lesson ID (or null if at the end).
   */
  const completeSession = useCallback((opts: {
    durationSeconds: number;
    problemsCompleted?: number;
    masteredItem?: string;
  }): string | null => {
    const nextId = getNextLessonId(state.currentLessonId);
    const today = new Date().toISOString().split('T')[0];
    const wasToday = state.lastSessionDate === today;
    const wasYesterday = (() => {
      if (!state.lastSessionDate) return false;
      const last = new Date(state.lastSessionDate);
      const diff = Math.floor((new Date(today).getTime() - last.getTime()) / 86400000);
      return diff === 1;
    })();

    setState(prev => ({
      ...prev,
      currentLessonId: nextId ?? prev.currentLessonId,
      currentLessonIndex: nextId ? prev.currentLessonIndex + 1 : prev.currentLessonIndex,
      totalMinutes: prev.totalMinutes + Math.floor(opts.durationSeconds / 60),
      totalProblems: prev.totalProblems + (opts.problemsCompleted ?? 0),
      streak: wasToday ? prev.streak : wasYesterday ? prev.streak + 1 : 1,
      lastSessionDate: today,
      masteredItems: opts.masteredItem && !prev.masteredItems.includes(opts.masteredItem)
        ? [...prev.masteredItems, opts.masteredItem]
        : prev.masteredItems,
    }));

    return nextId;
  }, [state.currentLessonId, state.lastSessionDate, getNextLessonId]);

  /** Update session config (minutes, level) */
  const updateConfig = useCallback((updates: Partial<Pick<LessonProgressState, 'sessionMinutes' | 'level'>>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /** Manually set lesson (e.g. from lesson picker) */
  const setLesson = useCallback((lessonId: string, lessonIndex: number) => {
    setState(prev => ({ ...prev, currentLessonId: lessonId, currentLessonIndex: lessonIndex }));
  }, []);

  const progressPercent = Math.round((state.currentLessonIndex / totalLessons) * 100);

  return {
    ...state,
    progressPercent,
    totalLessons,
    completeSession,
    updateConfig,
    setLesson,
  };
}
