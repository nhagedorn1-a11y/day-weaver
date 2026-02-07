

# Fix Phoneme Sound Accuracy Across the App

## The Problems Found

After a thorough audit, I found **four root causes** for why letter sounds are still off:

### 1. Incorrect Vowel Sound Mappings
The short vowel proxy words sent to TTS engines are producing the **wrong sounds**:
- Short "a" (as in "cat") is mapped to `"ah"` -- TTS engines pronounce this like the "a" in "father", which is a completely different sound
- Short "o" (as in "hot") is mapped to `"aw"` -- TTS engines pronounce this like the "aw" in "paw", which is again a different sound
- These are the vowels children practice MOST in early reading, so getting them wrong undermines the entire lesson

### 2. Missing Phoneme Entries (Broken Digraphs)
Many multi-letter phonemes used in the word library have **no pronunciation entry** at all. When the app encounters them, they fall through to raw text, and the TTS engine spells them out letter-by-letter:
- `"ck"` (as in "back") -- TTS says **"see-kay"** instead of a /k/ sound
- `"wh"`, `"ng"`, `"ph"` -- all missing from the fallback map
- Vowel teams `"ai"`, `"ay"`, `"ea"`, `"oa"`, `"ow"`, `"ou"`, `"oi"`, `"oy"`, `"au"` -- all missing
- R-controlled vowels `"er"`, `"ir"`, `"ur"` -- missing

### 3. Same Text Sent to Both Engines
Web Speech API and ElevenLabs have very different capabilities, but they receive the same proxy text. ElevenLabs handles short, nuanced utterances much better and should receive **cleaner, shorter text** optimized for its engine, while Web Speech needs longer proxy words to sound acceptable.

### 4. No Audio Caching (ElevenLabs)
Every time a child taps a phoneme, a new API call is made. This means:
- 1-2 second delay on every tap (bad for a child's attention)
- Inconsistent audio (slightly different each time)
- Unnecessary API costs
- The same 26 consonant sounds + 5 vowels are generated hundreds of times

## The Fix

### Step 1: Create Separate Engine-Optimized Pronunciation Maps

**For ElevenLabs** -- use short, crisp text that the AI voice handles well:
- Consonants: Very short with minimal vowel coloring (e.g., `"b"` with a period stop, not `"buh"`)
- Vowels: Use real example words trimmed to just the vowel portion

**For Web Speech** -- use slightly longer proxy words since this engine struggles with very short text:
- Keep the `"xuh"` pattern for consonants (it's the best Web Speech can do)
- Fix the **incorrect vowel mappings**: short-a to `"aah"` (as in cat), short-o to `"ott"` (as in hot)

### Step 2: Complete the Missing Phoneme Coverage

Add every phoneme that appears in the word library to both maps:
- `ck` mapped to the /k/ sound
- `wh` mapped to "wh" sound
- `ng` mapped to "ng" sound  
- All vowel teams: `ai/ay` to long-a, `ea/ee` to long-e, `oa/ow` to long-o, etc.
- All r-controlled vowels: `er/ir/ur` to the "er" sound

### Step 3: Add Audio Cache for ElevenLabs

Cache generated audio in memory so each phoneme is only generated once per session:
- First tap: call API, store the audio blob
- Subsequent taps: play from cache instantly (no delay, consistent sound)
- Cache keyed by phoneme + voice ID

### Step 4: Update the Edge Function

Optimize the ElevenLabs TTS edge function for phoneme-specific behavior:
- For phonemes: use a specific prompt style that produces the clearest isolated sound
- Add logging that shows exactly what text is being sent (for debugging)
- Differentiate phoneme vs word vs sentence output tuning

### Step 5: Add Debug Logging

Add console logging throughout the sound pipeline so we can trace exactly:
- What phoneme was requested
- What proxy text was resolved
- Which engine handled it
- Whether cache was hit or API was called
- Any errors that occurred

## Files to Change

| File | What Changes |
|------|-------------|
| `src/contexts/SoundContext.tsx` | Rewrite pronunciation maps (separate per engine), add audio cache, fix vowel mappings, add missing phonemes, add debug logging |
| `supabase/functions/elevenlabs-tts/index.ts` | Optimize voice settings for isolated phonemes, add better logging |

## Corrected Sound Mappings (Key Fixes)

| Phoneme | Current (Wrong) | Fixed (Web Speech) | Fixed (ElevenLabs) |
|---------|-----------------|-------------------|-------------------|
| Short a (cat) | "ah" (sounds like "father") | "at" clipped | "a." |
| Short o (hot) | "aw" (sounds like "paw") | "ot" clipped | "o." |
| ck (back) | falls through to "ck" = "see-kay" | "kuh" | "k." |
| ng (ring) | "ng" (might say "en-jee") | "ng" with context | "ng." |
| wh (whale) | missing from fallback | "whuh" | "wh." |
| ai/ay (rain) | missing entirely | "ay" | "ay." |
| ea/ee (leaf) | "ee" only for ee | "ee" for both | "ee." |
| oa/ow (boat) | missing | "oh" | "oh." |
| ou (house) | missing | "ow" | "ow." |
| oi/oy (coin) | missing | "oy" | "oy." |
| er/ir/ur | missing ir, ur | "er" for all three | "er." |

## What This Achieves
- Vowel sounds will match actual English pronunciation
- No more TTS engines spelling out digraphs letter-by-letter
- ElevenLabs users get faster, cached playback after first tap
- Both engines receive text optimized for their capabilities
- Debug logs make it easy to identify any remaining problem sounds

