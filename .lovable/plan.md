
# ML-Powered Letter Formation Validation

## What This Does

Instead of relying on hand-tuned waypoint coordinates (which require constant tweaking and still produce false positives/negatives), we'll use AI vision to look at what the child actually drew and decide "does this look like the target letter?"

This is like having a teacher look at the drawing rather than checking if dots were connected.

## How It Works

```text
Child draws on canvas
        |
        v
Canvas captured as image
        |
        v
Sent to backend AI (Gemini Flash)
        |
        v
AI responds: "Yes, that's an R" or "Not quite"
        |
        v
Frontend shows result
```

## Architecture

**Hybrid approach** — keeps the app fast while being much more accurate:

1. **Local waypoint check runs first** (instant, no network needed) as a fast pre-filter
2. **If waypoints say NO** — the answer is "keep trying" (no API call needed for obvious misses)
3. **If waypoints say YES** — send the canvas image to AI for confirmation (prevents false positives like the R issue)
4. **AI validation also serves as a fallback** — if the child draws a valid letter that waypoints reject, a "Check with AI" button lets them request verification

This means:
- Random scribbles are rejected instantly (no API cost)
- Only plausible attempts get sent to AI (~1-2 second round-trip)
- False positives like the R problem get caught by the vision model

## Technical Plan

### 1. Create Edge Function: `validate-letter`

A new backend function that:
- Receives a base64 PNG image of the canvas + the target letter
- Sends it to Lovable AI (Gemini Flash — fast, vision-capable, cheap)
- System prompt instructs: "You are a handwriting teacher for young children. Is this a reasonable attempt at writing the letter [X]? Respond with JSON: {valid: true/false, feedback: string}"
- Uses tool calling to extract structured output
- Returns the result

### 2. Create `useLetterValidation` Hook

A React hook that orchestrates the hybrid validation:
- Exposes `validate(canvasRef, letter)` function
- Runs waypoint check first (instant)
- If waypoints pass, calls the edge function with the canvas image
- Manages loading state for the ~1-2s AI round-trip
- Returns `{ isValid, isChecking, feedback }`

### 3. Update TracePad, CopyPad, IndependentPad

- On pointer up, if waypoints pass, show a brief "Checking..." indicator
- Call the AI validation
- Only mark complete if AI confirms
- If AI rejects, show the feedback ("Try making the bump rounder")
- Add a "Check with AI" button that appears after 3+ failed attempts — lets the child bypass waypoints if they drew a genuinely good letter that waypoints missed

### 4. Update `supabase/config.toml`

Register the new edge function.

## Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/functions/validate-letter/index.ts` | **Create** — Edge function calling Gemini Flash |
| `supabase/config.toml` | **Modify** — Register new function |
| `src/hooks/useLetterValidation.ts` | **Create** — Hybrid validation hook |
| `src/components/writing/TracePad.tsx` | **Modify** — Use new hook |
| `src/components/writing/CopyPad.tsx` | **Modify** — Use new hook |
| `src/components/writing/IndependentPad.tsx` | **Modify** — Use new hook |
| `src/components/reading/TracePad.tsx` | **Modify** — Use new hook |

## Cost and Performance

- **Model**: `google/gemini-3-flash-preview` (fast, cheap, vision-capable)
- **Latency**: ~1-2 seconds per AI check
- **Cost**: Only triggered when waypoints pass (filters out ~80% of attempts)
- **Fallback**: If AI is unavailable (offline/rate-limited), waypoint result is used as-is
- Uses the pre-configured `LOVABLE_API_KEY` — no additional setup needed

## User Experience

- Random scribbles: rejected instantly (no delay, no API call)
- Bad attempts: rejected instantly by waypoints
- Plausible attempts: brief "Checking..." spinner (~1-2s), then confirmed or given feedback
- After 3 failed waypoint attempts: "Ask teacher to check?" button appears for AI-only validation
- AI feedback shown as a gentle hint: "Try making the top rounder" or "Make the line straighter"
