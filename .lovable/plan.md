
# Debugging Plan: Comprehensive Lesson Plan and Mini-App Functionality Audit

## Overview

After thoroughly reviewing the codebase, I've identified several issues and potential problems that could cause lesson plans and mini-apps to hang or fail during execution. This plan addresses bugs, edge cases, and missing functionality across all modules.

---

## Critical Issues Found

### 1. Reading Session Runner - Warmup Words Missing Phoneme Data

**Location:** `src/components/reading/SessionRunner.tsx` (lines 46-50)

**Problem:** The `warmUpWords` from lessons are plain strings (e.g., `"mat"`), but the `WarmupStep` expects objects with `word` and `phonemes` properties. The fallback logic splits the word into individual characters, which doesn't work for digraphs.

**Current Code:**
```typescript
const warmupWithPhonemes = lesson.warmUpWords.slice(0, 3).map(warmupWord => {
  const wordData = lesson.wordList.find(w => w.word === warmupWord);
  return wordData || { id: warmupWord, word: warmupWord, phonemes: warmupWord.split(''), isSightWord: false };
});
```

**Fix:** The fallback `warmupWord.split('')` breaks digraph words (e.g., "ship" would become `['s','h','i','p']` instead of `['sh','i','p']`). Need to ensure warmup words always exist in wordList or use proper phoneme data.

---

### 2. Math Session Runner - Missing Concepts Crash

**Location:** `src/components/modules/MathSessionRunner.tsx` (lines 81-123)

**Problem:** When `lesson.newConcepts` is empty (review lessons), accessing `lesson.newConcepts[0]` returns `undefined`, which could cause runtime issues in the teaching step UI.

**Current Code:**
```typescript
const concept = lesson.newConcepts[0];
// Later used as: {concept && (<...>{concept.emoji}...)}
```

**Fix:** The conditional check exists but needs verification. Review lessons bypass the teach step entirely, but the flow from warmup to teach could still trigger this.

---

### 3. Writing Module - Stage Completion Callbacks Are Empty

**Location:** `src/components/modules/WritingModule.tsx` (lines 106-135)

**Problem:** All writing stage components (TracePad, DotToDotPad, CopyPad, IndependentPad) have empty `onComplete` callbacks, meaning completing a tracing exercise doesn't trigger any progression.

**Current Code:**
```typescript
<TracePad 
  letter={selectedLetter.letter} 
  size={220}
  onComplete={() => {
    // Auto-advance to next stage after completion
  }}
/>
```

**Fix:** Implement proper stage advancement logic that moves through trace -> dotToDot -> copy -> independent automatically, or provides clear feedback.

---

### 4. BlendBoxes Instruction Component Undefined

**Location:** `src/components/reading/BlendBoxes.tsx` (line 90)

**Problem:** The `Hand` component is defined at the bottom of the file but used in the JSX before its definition. While this works due to hoisting, it's fragile.

**Status:** Not a blocking issue, but could cause confusion.

---

### 5. Motor Module - ADL Step Data Access

**Location:** `src/components/modules/MotorModule.tsx` (lines 195-294)

**Problem:** The ADL missions rely on `currentStepData.visualEmoji` and `currentStepData.description`, but if `selectedADL.steps[adlStep]` is undefined (edge case), it will crash.

**Fix:** Add null checks before accessing step data.

---

### 6. Science Module - Missing Activity Filter Edge Case

**Location:** `src/components/modules/ScienceModule.tsx` (lines 329-379)

**Problem:** When filtering activities by duration, if no activities match the selected duration, the UI shows "No X-minute activities" but doesn't reset `selectedDuration` or guide the user.

**Status:** UX improvement needed, not a blocking bug.

---

### 7. Sensory Module - Missing Heavy Work Activity Index

**Location:** `src/components/modules/SensoryModule.tsx` (lines 256-265)

**Problem:** The "Move Break" button hardcodes `heavyWorkActivities[1]` (Bear walk). If this array index doesn't exist, it will crash.

**Current Code:**
```typescript
onClick={() => {
  setSelectedActivity(heavyWorkActivities[1]); // Bear walk
  setView('timer');
}}
```

**Fix:** Add bounds checking or use `.find()` to locate the activity by ID.

---

### 8. TracePad Completion Threshold Too Low

**Location:** `src/components/reading/TracePad.tsx` (lines 17-18)

**Problem:** The coverage threshold of 12% and minimum 20 points may be too lenient or too strict depending on the letter being traced. Complex letters may need more coverage.

**Status:** Calibration issue, not a blocking bug.

---

### 9. Reading Lesson Generator - Review Lesson Edge Case

**Location:** `src/data/lessonGenerator.ts` (lines 132-176)

**Problem:** `generateReviewLesson` can return a lesson with empty `newGraphemes` array, which is handled, but the `teachingScript` references patterns that don't exist in review context.

**Status:** Works but could be cleaner.

---

### 10. Math Lesson Generator - Concept Tag Mismatch

**Location:** `src/data/mathLessonGenerator.ts` (lines 6-16) and `src/data/mathProblemLibrary.ts`

**Problem:** The `MATH_LESSON_SEQUENCE` references concept tags like `'number-order'` and `'before-after'` that don't exist in `mathProblems`. This will return empty problem arrays.

**Missing Concepts:**
- `number-order`
- `before-after`

---

## Implementation Plan

### Phase 1: Critical Bug Fixes

1. **Fix Warmup Words Phoneme Data**
   - Ensure all warmup words have proper phoneme breakdowns
   - Improve fallback logic to handle digraphs correctly

2. **Add Empty State Handling for Writing Stages**
   - Implement auto-advancement between writing stages
   - Add visual feedback for stage completion

3. **Fix Hardcoded Array Index in Sensory Module**
   - Use safe array access or find by ID

4. **Add Missing Math Concept Tags**
   - Add `number-order` and `before-after` problems to `mathProblemLibrary.ts`

### Phase 2: Edge Case Handling

5. **Add Null Checks for ADL Step Data**
   - Protect against undefined step access

6. **Improve Review Lesson Handling**
   - Skip teach phase for review lessons in session runner

7. **Math Session Runner - Review Lesson Flow**
   - Ensure review lessons skip the teach step properly

### Phase 3: UX Improvements

8. **TracePad Calibration**
   - Adjust thresholds based on letter complexity

9. **Science Activity Duration Filter**
   - Add helpful messaging when no activities match

10. **Writing Module Completion Flow**
    - Add clear progression indicators and stage badges

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/reading/SessionRunner.tsx` | Fix warmup phoneme data handling |
| `src/components/modules/WritingModule.tsx` | Add stage completion callbacks and progression |
| `src/components/modules/SensoryModule.tsx` | Fix hardcoded array index |
| `src/components/modules/MotorModule.tsx` | Add null checks for step data |
| `src/data/mathProblemLibrary.ts` | Add missing concept problems |
| `src/data/mathLessonGenerator.ts` | Verify concept tag references |
| `src/components/modules/MathSessionRunner.tsx` | Improve review lesson flow |

---

## Technical Details

### Warmup Words Fix Strategy

The warmup words need to match entries in the `wordList`. The current fallback creates incorrect phoneme arrays for digraph words. The fix will:

1. Ensure `warmUpWords` always reference words that exist in `wordList`
2. Improve the fallback to use a phoneme-aware split function that handles digraphs (sh, ch, th, etc.)

### Writing Stage Progression

Currently, completing a trace doesn't advance to the next stage. The fix will:

1. Track current stage in state
2. On completion, auto-advance with a brief celebration animation
3. After all 4 stages, award tokens and return to home

### Math Problem Library Additions

Add the following problem sets:
- `number-order`: Problems about sequencing numbers (what comes before/after)
- `before-after`: Problems about number relationships

---

## Testing Checklist

After implementation, verify:

- [ ] Reading: Complete warmup, review, teach, practice, sentence, and finish steps
- [ ] Reading: Digraph words blend correctly in BlendBoxes
- [ ] Math: Complete warmup through finish, including review lessons
- [ ] Writing: Complete all 4 stages (trace, dot-to-dot, copy, independent)
- [ ] Science: Complete a multi-step activity from start to finish
- [ ] Motor: Complete ADL missions with visual step progression
- [ ] Sensory: All 4 home buttons work correctly
- [ ] Tokens: Awarded only for Reading, Math, and Writing

