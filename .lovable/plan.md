

# Jony Ive Aesthetic Overhaul

## The Problem

The current interface is functional but visually cluttered. There's inconsistent spacing, too many competing colors and shapes, rounded corners fighting the stated "soft brutalist" system, gratuitous gradients, and a general lack of the *restraint* and *material honesty* the design system claims. Jony Ive's design philosophy can be summarized as: **remove everything that isn't essential, then make what remains feel inevitable.**

## Design Audit — What Ive Would Change

### 1. Strip the Visual Noise
- **StatusStrip** (top bar): Too many segments crammed together. The weather, moon phase, tokens, regulation emoji, and clock all compete. Ive would reduce this to time + one status indicator, and hide the rest behind a deliberate tap.
- **TokenProgress** (orange banner): The orange-on-warm-background creates a garish band. Replace with a thin, elegant progress line — no fill color on the container, just a precise indicator.
- **ProgressHub** header: The `bg-gradient-to-br from-primary/10 via-calm/5 to-token/10` gradient is the antithesis of Ive. Replace with a single, flat, subtle tint or pure white card.
- **Subject cards**: Emoji icons + colored pills + streak flames + progress bars + chevrons = too many signals per card. Reduce to: icon, name, progress bar, one piece of metadata.

### 2. Establish a Typographic Hierarchy
- Currently everything is bold. When everything shouts, nothing communicates. Introduce clear weight tiers:
  - **Display**: One element per screen at 600/700 weight (the page title or the current task)
  - **Body**: 400 weight for most text
  - **Caption**: 400 weight, reduced opacity for metadata
- Reduce font sizes globally. The current UI uses `text-xl`, `text-lg` too aggressively.

### 3. Whitespace as Structure
- Increase vertical spacing between sections from `space-y-5`/`space-y-6` to `space-y-8` or more.
- Cards should breathe — increase internal padding, reduce border thickness from `border-2` to `border` or remove borders entirely in favor of subtle elevation.
- The module grid (Activities) is cramped. Increase gap and reduce icon size for a calmer grid.

### 4. Color Discipline
- Reduce active colors on any single screen from 5+ to 2-3 max.
- The primary terracotta + token orange + calm teal + next blue all appear simultaneously — this creates visual chaos.
- Ive approach: one accent color per screen context. The dashboard uses a single accent (terracotta). Reading uses teal. Math uses a warm tone. Never mix.
- Remove all `/10`, `/15`, `/20` opacity background tints on cards — use pure `bg-card` with subtle shadow instead.

### 5. Borders and Corners
- The design system says `--radius: 0.25rem` (machined, minimal) but many components use `rounded-2xl`, `rounded-3xl`. This contradiction makes the UI feel unresolved.
- Standardize: all interactive cards get `rounded-xl` (0.75rem). All containers get `rounded-lg`. No `rounded-3xl` anywhere.
- Replace `border-2` and `border-3` with `border` (1px). Thick borders feel heavy and dated.

### 6. Shadows and Depth
- Remove `shadow-xl`, `shadow-lg` from cards. Use a single, consistent shadow: `shadow-sm` for resting state, `shadow-md` on hover/press.
- The token star badge uses `shadow-lg` + `shadow-md` + `border-2` — three depth cues is two too many.

### 7. Motion
- Current animations are fine (mechanical, short) but some use `animate-pulse` which feels cheap. Replace any pulse with a single subtle opacity transition.

## Implementation Plan

### File 1: `src/index.css` — Design Token Refinement
- Increase `--radius` from `0.25rem` to `0.625rem` (a single, confident rounding)
- Add `--shadow-card` and `--shadow-card-hover` custom properties
- Reduce border color contrast slightly (make borders more subtle)
- Add a `--color-surface` for elevated cards (slightly warmer than background)

### File 2: `src/components/controls/StatusStrip.tsx` — Simplify
- Show only: time, weather emoji, token count
- Remove moon phase and regulation emoji from the default view
- Make the strip thinner — reduce padding, use `text-[11px]` mono
- Remove the 2px border; use a single hairline bottom border

### File 3: `src/components/TokenProgress.tsx` — Minimal Progress
- Compact mode: replace the orange box with a flat inline row — star icon, count, thin progress bar, no background color
- Remove `shadow-lg`, `shadow-inner`, `shadow-md` from all elements
- Token dots: reduce to simple circles, no shadows

### File 4: `src/components/dashboard/ProgressHub.tsx` — Clean Cards
- Remove the gradient header. Use flat `bg-card` with consistent padding.
- Subject cards: remove emoji, use Lucide icon only. Remove the colored pill tags. Show just: icon, name, progress bar, lesson count.
- "Suggested Next Steps" cards: reduce to a simpler, flatter style — no colored backgrounds, just icon + text + subtle border.
- Standardize all `rounded-*` to `rounded-xl`

### File 5: `src/components/StructuredChoice.tsx` — Quieter Choice Cards
- Remove `border-3`. Use `border` (1px).
- Remove `drop-shadow-sm` from emoji.
- Reduce emoji size from `text-5xl` to `text-4xl`.
- Replace colored backgrounds with `bg-card` + subtle left-edge color accent (a 3px left border in the module color).
- Remove hover scale effect. Use background tint change only.

### File 6: `src/components/Header.tsx` — Integrate with StatusStrip
- Remove the separate header component. Merge the "J" avatar + day label into the StatusStrip as a unified top bar.
- Or: simplify header to just the avatar circle + a single line of text + settings button. Remove `backdrop-blur-sm` (blur is overused).

### File 7: `src/pages/Index.tsx` — Layout and Spacing
- Increase section spacing throughout
- Standardize padding from mixed `px-5`/`p-6`/`p-4` to a consistent `px-6`
- View toggle (Progress/Tasks/Schedule): reduce visual weight — use underline-style tabs instead of pill-background tabs
- Remove the redundant "Suggested Next Steps" when StructuredChoice already exists (they do the same thing)

### File 8: `src/components/ModuleMenu.tsx` — Gallery Grid
- Remove gradients from active module card
- Use a simple left-border accent or subtle background shift for active state
- Reduce card padding and emoji size for a calmer grid

### Summary of Principles Applied
```text
BEFORE (current)              AFTER (Ive revision)
─────────────────             ────────────────────
5+ colors per screen    →     2 colors max per screen
border-2, border-3      →     border (1px) or none
rounded-2xl/3xl mixed   →     rounded-xl everywhere
shadow-lg/xl            →     shadow-sm, shadow-md hover
Gradient backgrounds    →     Flat bg-card
Bold everything         →     Clear weight hierarchy
Cramped spacing         →     Generous whitespace
Emoji + icon + pill     →     One signal per element
```

