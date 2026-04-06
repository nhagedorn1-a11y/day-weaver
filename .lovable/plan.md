
# Progressive Difficulty & Randomized Banks — All Modules

## Philosophy
Every module that tests knowledge should have: (1) multiple difficulty tiers, (2) 15-20+ items per tier, (3) random selection each session, (4) gated progression — complete one level to unlock the next.

## Module Assessment

### Already Done ✅
- **Word Builder** — 5 levels, 20+ words each, random picks, gated unlock

### Needs Work 🔧

#### 1. Math Problem Library (`src/data/mathProblemLibrary.ts`)
**Current**: 4-8 problems per concept (too few — child sees repeats quickly)
**Fix**: Expand every concept to 15-20 problems with varied emoji/visual cues. The `getRandomProblems()` function already exists — just needs bigger pools.

Concepts to expand:
- `count-1-5`: 8 → 20 problems
- `count-1-10`: 8 → 20
- `more-less`: 6 → 15
- `one-to-one`: 4 → 15
- `add-within-5`: 8 → 20
- `add-within-10`: 8 → 20
- `subtract-within-5`: 6 → 20
- `subtract-within-10`: 6 → 20
- `shapes-2d`: 6 → 15
- `patterns-ab`: 4 → 15
- `patterns-abc`: 3 → 15
- `number-bonds`: 4 → 15
- `number-order`: 6 → 15
- `before-after`: 6 → 15
- `add-doubles`: 5 → 15
- `make-ten`: 6 → 15

#### 2. Key Hunt (`src/components/modules/typing/KeyHunt.tsx`)
**Current**: 26 levels played sequentially, always same order
**Fix**: Group into 4 difficulty tiers (full hint, row hint, hand hint, no hint) with random letter picks each session. Add a level picker screen like Word Builder.

#### 3. Science Module (`src/components/modules/ScienceModule.tsx`)
**Current**: Activities have difficulty 1-3 but no gating, shown as flat list
**Fix**: Add difficulty filter/progression — start with difficulty 1 activities unlocked, completing 3+ unlocks next tier. Already has the difficulty field on every activity.

#### 4. Motor Module (`src/components/modules/MotorModule.tsx`)
**Current**: Activities have difficulty levels but shown as flat lists
**Fix**: Same pattern — gate by difficulty, unlock tiers through completion.

### Not Applicable ❌
- **Free Play** — Exploratory, no difficulty concept
- **Home Row Heroes** — Fixed 3-lesson drill (left/right/both), difficulty doesn't apply
- **PC Controls** — Fixed 5 lessons, sequential by nature
- **Social Module** — Social stories are parent-created, not difficulty-tiered
- **Sensory Module** — Therapeutic activities chosen by need, not skill level
- **Reading Studio** — Already has full Orton-Gillingham lesson progression
- **Writing Studio** — Already has sequential letter progression

## Implementation Order
1. Math problem bank expansion (biggest impact, most repetition-prone)
2. Key Hunt difficulty tiers + randomization
3. Science difficulty gating
4. Motor difficulty gating

## Files Changed
- `src/data/mathProblemLibrary.ts` — Expand all concept pools to 15-20+
- `src/data/typingLessons.ts` — Restructure KEY_HUNT_LEVELS into tiered groups
- `src/components/modules/typing/KeyHunt.tsx` — Add level picker + random selection
- `src/components/modules/ScienceModule.tsx` — Add difficulty gating with unlock progression
- `src/components/modules/MotorModule.tsx` — Add difficulty gating with unlock progression
