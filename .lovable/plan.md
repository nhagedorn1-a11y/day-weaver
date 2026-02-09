
# New Module: Keyboard Explorer

A pre-typing learning program designed for a neurodivergent child to build familiarity with QWERTY keyboards and basic PC use -- before any actual typing speed is expected.

## Philosophy

This follows the app's existing "operator/explorer" metaphor. The child is a **Keyboard Pilot** learning the controls of a machine. No typing tests, no WPM counters, no time pressure. Instead: guided exploration, key hunts, pattern play, and gradual familiarization with letter positions through games.

The module progresses through stages that mirror how a neurodivergent child would naturally build comfort:

1. **Explore** -- Just tap any key and see/hear what happens (cause and effect)
2. **Find** -- "Where is the B?" style key hunts with visual hints
3. **Patterns** -- Home row awareness, left/right hand, letter groups
4. **Words** -- Type simple familiar words one key at a time with visual guides
5. **PC Skills** -- Concepts like spacebar, enter, backspace, shift explained visually

## What the Child Sees

### Home Screen: "Keyboard Pilot"
A landing page with 5 lane cards (same pattern as Motor Skills module):
- Free Play -- tap keys, see big letters appear with sound
- Key Hunt -- find specific keys with visual hints
- Home Row Heroes -- learn finger positions through games
- Word Builder -- type simple words with a guided on-screen keyboard
- PC Controls -- learn spacebar, enter, backspace, shift, arrows

### Interactive On-Screen Keyboard
A large, touch-friendly QWERTY keyboard component that:
- Highlights keys when tapped (satisfying color burst)
- Shows the letter LARGE on screen when pressed (reinforcement)
- Plays the letter sound using the existing phoneme system
- Color-codes rows or hand zones when in learning mode
- Animates finger guides for home row lessons

### Key Hunt Game
- Shows a big letter/emoji prompt: "Find the K!"
- Keyboard lights up with a hint zone (left/right half, which row)
- Child taps the correct key -- celebration animation
- Difficulty scales: full hint -> row hint -> no hint

### Word Builder
- Shows a simple word like "cat" with the first letter highlighted
- On-screen keyboard highlights the target key
- Child taps it, letter fills in, next letter highlights
- Completion triggers token reward and celebration

## Integration Points

This module plugs into the existing system exactly like every other module:

- Added to `AppModule` type union as `'typing'`
- Registered in `MODULE_REGISTRY` with `awardsTokens: true` (it's a learning module)
- Added to `appModules` array for the Module Menu
- Rendered in `renderModuleContent()` switch in Index.tsx
- Uses existing `onTokensEarned` callback pattern
- Uses existing `useSound()` for phoneme playback on key press

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/modules/TypingModule.tsx` | Main module shell with view routing (home, freePlay, keyHunt, homeRow, wordBuilder, pcControls) |
| `src/components/modules/typing/KeyboardDisplay.tsx` | Reusable on-screen QWERTY keyboard component with highlighting, color zones, and tap handling |
| `src/components/modules/typing/FreePlay.tsx` | Free exploration mode -- tap any key, see big letter + hear sound |
| `src/components/modules/typing/KeyHunt.tsx` | "Find the letter" game with progressive difficulty |
| `src/components/modules/typing/HomeRowHeroes.tsx` | Home row finger placement lessons and practice |
| `src/components/modules/typing/WordBuilder.tsx` | Guided word typing with visual key hints |
| `src/components/modules/typing/PCControls.tsx` | Visual lessons on spacebar, enter, backspace, shift, arrows |
| `src/data/typingLessons.ts` | Lesson data: key hunt sequences, word lists, home row drills, PC control explanations |

## Files to Modify

| File | Change |
|------|--------|
| `src/types/jackos.ts` | Add `'typing'` to `AppModule` union type |
| `src/config/modules.ts` | Add `typing` entry to `MODULE_REGISTRY` |
| `src/data/appContent.ts` | Add typing module to `appModules` array |
| `src/pages/Index.tsx` | Import `TypingModule`, add `case 'typing'` to render switch |

## Technical Details

### KeyboardDisplay Component
The central reusable component. Renders a 3-row QWERTY layout with these props:

```text
interface KeyboardDisplayProps {
  onKeyPress: (key: string) => void;
  highlightedKeys?: string[];        // Keys to glow/highlight
  disabledKeys?: string[];           // Keys to dim out
  colorZone?: 'left' | 'right' | 'home' | 'none';
  showFingerGuides?: boolean;        // Show which finger for each key
  size?: 'compact' | 'large';       // Touch target sizing
  specialKeys?: boolean;             // Show space, enter, backspace, shift
}
```

The keyboard layout uses CSS Grid for consistent sizing. Each key is a large touch target (min 44x44px per accessibility standards, larger on tablet). Keys are color-coded by hand zone using Tailwind classes that already exist in the app's palette.

### Lesson Data Structure
```text
interface KeyHuntLevel {
  id: string;
  targetKey: string;
  hint: 'full' | 'row' | 'hand' | 'none';
  emoji: string;         // Visual cue: "Find the B! B is for Bear"
  keyword: string;
}

interface WordBuilderWord {
  id: string;
  word: string;
  emoji: string;
  difficulty: 1 | 2 | 3;  // 3-letter, 4-letter, 5-letter
}

interface HomeRowLesson {
  id: string;
  title: string;
  keys: string[];          // Which keys to practice
  hand: 'left' | 'right' | 'both';
  fingerMap: Record<string, string>;  // key -> finger name
}

interface PCControlLesson {
  id: string;
  title: string;
  key: string;             // 'space' | 'enter' | 'backspace' | 'shift' | 'arrows'
  emoji: string;
  explanation: string;     // Kid-friendly description
  tryItPrompt: string;     // "Press the big bar at the bottom!"
}
```

### Token Awards
- Free Play: no tokens (pure exploration)
- Key Hunt: 1 token per 5 correct finds
- Home Row: 1 token per completed drill
- Word Builder: 2 tokens per word completed
- PC Controls: 1 token per lesson completed

### Sound Integration
Key presses trigger `playPhoneme(key)` from the existing `SoundContext`, so the child hears the letter sound (using the newly fixed phoneme maps). Special keys get descriptive sounds via `playTap()`.

### Module Registry Entry
```text
typing: {
  id: 'typing',
  title: 'Keyboard Pilot',
  icon: 'Keyboard',
  emoji: '⌨️',
  description: 'Learn the keyboard',
  color: 'secondary',
  enabled: true,
  awardsTokens: true,
  requiresAuth: false,
  parentOnly: false,
  order: 5,  // After writing, before science
}
```

The existing modules after writing will have their order numbers shifted up by 1 to accommodate this.
