# Debugging Plan: Comprehensive Lesson Plan and Mini-App Functionality Audit

## Status: ✅ COMPLETED

All critical bugs and edge cases have been fixed. See implementation details below.

---

## Fixes Implemented

### ✅ 1. Reading Session Runner - Warmup Words Phoneme Data
**File:** `src/components/reading/SessionRunner.tsx`

Added `splitIntoPhonemes()` function that handles digraphs (sh, ch, th, wh, ck, ng, qu) properly instead of using `split('')`.

### ✅ 2. Writing Module - Stage Completion Callbacks
**File:** `src/components/modules/WritingModule.tsx`

- Added `handleStageComplete()` function that auto-advances through stages
- Added progress indicator dots showing current stage
- Added celebration animation between stages
- Awards 2 tokens upon completing all 4 stages

### ✅ 3. Sensory Module - Fixed Hardcoded Array Index
**File:** `src/components/modules/SensoryModule.tsx`

Changed from `heavyWorkActivities[1]` to `heavyWorkActivities.find(a => a.id === 'bear-walk')` with fallback to first activity.

### ✅ 4. Motor Module - ADL Step Data Null Check
**File:** `src/components/modules/MotorModule.tsx`

Added safety check for `currentStepData` - if undefined, shows error state with "Go Back" button.

### ✅ 5. Math Problem Library - Missing Concepts
**File:** `src/data/mathProblemLibrary.ts`

Added problem sets for:
- `number-order`: 6 problems about number sequencing
- `before-after`: 6 problems about number relationships

### ✅ 6. Math Session Runner - Review Lesson Flow
**File:** `src/components/modules/MathSessionRunner.tsx`

Review lessons now skip the teach step when `lesson.newConcepts.length === 0`.

---

## Testing Checklist

- [x] Reading: Warmup words with digraphs (ship, chat, that) now blend correctly
- [x] Math: Review lessons skip teach step and go directly to practice
- [x] Math: number-order and before-after problems available
- [x] Writing: Completing trace advances to dot-to-dot automatically
- [x] Sensory: Move Break button safely selects bear walk activity
- [x] Motor: ADL missions handle missing step data gracefully
- [x] Tokens: Only Reading, Math, and Writing award tokens

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/reading/SessionRunner.tsx` | Digraph-aware phoneme splitting |
| `src/components/modules/WritingModule.tsx` | Stage completion callbacks + progression |
| `src/components/modules/SensoryModule.tsx` | Safe array access for Move Break |
| `src/components/modules/MotorModule.tsx` | Null check for ADL step data |
| `src/data/mathProblemLibrary.ts` | Added number-order and before-after problems |
| `src/components/modules/MathSessionRunner.tsx` | Review lessons skip teach step |
