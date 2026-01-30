
# Fix Aesthetic Violations: MoMA × TE Design Compliance

## Summary

Purge all organic/decorative animations, flatten gradients to solid semantic colors, unify corner radius to 0.25rem, and remove non-functional decorative elements across 7 component files — while preserving all content and functionality.

## Files to Modify

| File | Violations |
|------|------------|
| `LittleGuy.tsx` | organic animations, gradients, blush, sparkle |
| `NowNextLater.tsx` | organic animation, gradients, decorative circles |
| `BraveryTimer.tsx` | organic animations, gradients, sparkles/confetti |
| `TokenProgress.tsx` | gradients, shimmer animation, decorative circles |
| `CalmToolkit.tsx` | breathing animation (keep functional, reduce flourish) |
| `VisualTimer.tsx` | rounded-3xl corner radius |
| `VisualSchedule.tsx` | gradients on current/celebration states |

---

## Changes by File

### 1. LittleGuy.tsx

**Motion — Remove Organic Animations:**
- Remove `animate-bounce-gentle`, `animate-breathe`, `animate-wiggle`, `animate-float` from `bodyAnimation` logic
- Return empty string for all moods (static by default)

**Color — Flatten Gradients:**
```
Before: bg-gradient-to-br from-token to-token/80
After:  bg-token
```
All mood-based gradients become solid semantic colors.

**Decorative — Remove:**
- Blush marks (lines 94-100)
- Sparkle SVG (lines 109-116)

Keep: Eye animations (functional state indication), zzz for sleeping.

---

### 2. NowNextLater.tsx

**Motion — Remove:**
- `animate-float` on celebration emoji (line 201)

**Decorative Circles — Remove:**
- Lines 67-68: background decorative circles in NOW card
- Line 136: decorative circle in NEXT card

**Gradients — Flatten:**
```
NOW card:
Before: bg-gradient-to-br from-now via-now to-primary
After:  bg-now

NEXT card:
Before: bg-gradient-to-br from-next/90 to-next
After:  bg-next

Celebration text:
Before: bg-gradient-to-r from-primary to-token bg-clip-text
After:  text-primary
```

**Corner Radius:**
- `rounded-3xl` → `rounded`
- `rounded-2xl` → `rounded`
- `rounded-xl` → `rounded`
- `rounded-full` (badge/pills) → `rounded` (if structural, keep if semantic like token dots)

---

### 3. BraveryTimer.tsx

**Motion — Remove:**
- `animate-bounce-gentle` on lion emoji (line 73)
- `animate-float` on Sparkles particles (line 60)
- `animate-calm-pulse` on Heart icon (line 162)
- `animate-breathe` on outer rings (lines 133-134)
- `animate-pulse` on star badge (line 74), wind icon (line 98), footer dot (line 181)

**Decorative — Remove:**
- Sparkles particle loop entirely (lines 56-70)
- Star badge decorative circle (lines 74-76)

**Gradients — Flatten:**
```
Complete screen:
Before: bg-gradient-to-b from-token via-token to-token/90
After:  bg-token

Timer screen:
Before: bg-gradient-to-b from-calm via-calm to-calm/90
After:  bg-calm
```

**Corner Radius:**
- `rounded-2xl` → `rounded`

Keep: Progress ring animation (functional timing display).

---

### 4. TokenProgress.tsx

**Shimmer Animation — Remove:**
- Lines 46-48 and 112-114: shimmer overlay divs

**Decorative Circles — Remove:**
- Lines 66-67: top-right and bottom-left decorative circles

**Gradients — Flatten:**
```
Compact container:
Before: bg-gradient-to-r from-token/15 via-token/10 to-primary/5
After:  bg-token/10

Token icon box:
Before: bg-gradient-to-br from-token to-token/80
After:  bg-token

Progress bar fill:
Before: bg-gradient-to-r from-token via-primary to-token
After:  bg-token

Full container:
Before: bg-gradient-to-br from-card via-card to-muted/30
After:  bg-card

Token dots earned:
Before: bg-gradient-to-br from-token to-primary
After:  bg-token

Celebration banner:
Before: bg-gradient-to-r from-token/20 to-primary/20
After:  bg-token/10
```

**Corner Radius:**
- `rounded-3xl` → `rounded`
- `rounded-2xl` → `rounded`

---

### 5. CalmToolkit.tsx

**Breathing Circle — Keep Functional, Remove Flourish:**
- Keep the 4s breathing scale animation (it's functional for guided breathing)
- Remove `animate-pulse` from Wind icon (line 98)

**Gradients — Flatten:**
```
Container:
Before: bg-gradient-to-b from-calm via-calm to-calm/90
After:  bg-calm
```

**Corner Radius:**
- `rounded-3xl` → `rounded`
- `rounded-2xl` → `rounded`

---

### 6. VisualTimer.tsx

**Corner Radius only:**
- Line 107-108: `rounded-3xl` → `rounded`
- Line 130: `rounded-3xl` → `rounded`
- Line 173: `rounded-3xl` → `rounded`

No gradient or motion changes (already clean).

---

### 7. VisualSchedule.tsx

**Gradients — Flatten:**
```
Current task row:
Before: bg-gradient-to-r from-now to-primary
After:  bg-now

Next task row:
Before: bg-gradient-to-r from-next/20 to-next/10
After:  bg-next/10

Celebration banner:
Before: bg-gradient-to-r from-calm/20 to-token/20
After:  bg-calm/10
```

**Corner Radius:**
- `rounded-2xl` → `rounded`

---

## Summary of Removals

| Type | Count |
|------|-------|
| Organic animations | ~12 instances |
| Decorative circles | 5 elements |
| Sparkle/confetti | 2 elements |
| Blush marks | 1 element |
| Shimmer overlays | 2 instances |
| Multi-stop gradients | ~18 flattened |
| Radius overrides | ~25 normalized |

## Preserved Functionality

- All content and copy unchanged
- Breathing circle timing (functional for guided breathing)
- Timer progress animation (functional state)
- Eye state changes in LittleGuy (functional indication)
- Sleep "zzz" indicator (functional)
- All interaction handlers unchanged
- Token economy logic unchanged

## Result

Components will match the MoMA × TE aesthetic:
- Flat, material-like colors
- Machined 0.25rem corners everywhere
- No decorative motion — only mechanical state confirmation
- Visible structure without organic softness

