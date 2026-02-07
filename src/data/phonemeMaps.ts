/**
 * Engine-optimized phoneme pronunciation maps.
 *
 * Two separate maps because the TTS engines have very different strengths:
 *
 * **Web Speech API** — struggles with very short text; needs proxy words
 * of 2–3 characters that force the engine into the correct mouth shape.
 *
 * **ElevenLabs** — handles short, crisp text well; a single letter with a
 * trailing period (sentence stop) produces a clean, isolated phoneme.
 *
 * Every phoneme that appears in the word library MUST have an entry in both
 * maps. If a phoneme falls through, the raw text is sent to the TTS engine
 * and multi-letter digraphs get spelled out letter-by-letter.
 */

// ---------------------------------------------------------------------------
// Web Speech — proxy words / syllables
// ---------------------------------------------------------------------------
export const WEB_SPEECH_PHONEMES: Record<string, string> = {
  // === CONSONANTS ===
  'b': 'buh',
  'c': 'kuh',
  'd': 'duh',
  'f': 'fuh',
  'g': 'guh',
  'h': 'huh',
  'j': 'juh',
  'k': 'kuh',
  'l': 'luh',
  'm': 'muh',
  'n': 'nuh',
  'p': 'puh',
  'q': 'kwuh',
  'r': 'ruh',
  's': 'suh',
  't': 'tuh',
  'v': 'vuh',
  'w': 'wuh',
  'x': 'ks',
  'y': 'yuh',
  'z': 'zuh',

  // === SHORT VOWELS (CORRECTED) ===
  // "ah" → sounds like "father" on most engines; "at" clipped is /æ/ as in cat
  'a': 'at',
  'e': 'eh',
  'i': 'ih',
  // "aw" → sounds like "paw"; "ot" clipped is /ɒ/ as in hot
  'o': 'ot',
  'u': 'uh',

  // === DIGRAPHS ===
  'sh': 'shh',
  'ch': 'chuh',
  'th': 'thuh',
  'wh': 'whuh',
  'ck': 'kuh',      // /k/ sound — NOT "see-kay"
  'ng': 'sing',     // embed in a word so TTS produces /ŋ/ not "en-jee"
  'ph': 'fuh',      // same sound as /f/

  // === VOWEL TEAMS ===
  'ai': 'ay',       // rain
  'ay': 'ay',       // play
  'ea': 'ee',       // leaf
  'ee': 'ee',       // bee
  'oa': 'oh',       // boat
  'ow': 'oh',       // snow (long-o team; context-dependent)
  'ou': 'ow',       // house
  'oi': 'oy',       // coin
  'oy': 'oy',       // toy
  'au': 'aw',       // sauce
  'aw': 'aw',       // paw
  'oo': 'oo',       // moon
  'ew': 'you',      // new

  // === R-CONTROLLED VOWELS ===
  'ar': 'ar',
  'er': 'er',
  'ir': 'er',       // same as er
  'ur': 'er',       // same as er
  'or': 'or',

  // === BLENDS ===
  'bl': 'bluh',
  'br': 'bruh',
  'cl': 'cluh',
  'cr': 'cruh',
  'dr': 'druh',
  'fl': 'fluh',
  'fr': 'fruh',
  'gl': 'gluh',
  'gr': 'gruh',
  'pl': 'pluh',
  'pr': 'pruh',
  'sk': 'skuh',
  'sl': 'sluh',
  'sm': 'smuh',
  'sn': 'snuh',
  'sp': 'spuh',
  'st': 'stuh',
  'sw': 'swuh',
  'tr': 'truh',
  'tw': 'twuh',
  'sc': 'skuh',
  'scr': 'scruh',
  'spr': 'spruh',
  'str': 'struh',
  'spl': 'spluh',

  // === IPA-STYLE KEYS (graphemeLibrary uses /x/ notation) ===
  '/b/': 'buh', '/k/': 'kuh', '/d/': 'duh', '/f/': 'fuh',
  '/g/': 'guh', '/h/': 'huh', '/j/': 'juh', '/l/': 'luh',
  '/m/': 'muh', '/n/': 'nuh', '/p/': 'puh', '/kw/': 'kwuh',
  '/r/': 'ruh', '/s/': 'suh', '/t/': 'tuh', '/v/': 'vuh',
  '/w/': 'wuh', '/ks/': 'ks', '/y/': 'yuh', '/z/': 'zuh',
  '/ă/': 'at', '/ĕ/': 'eh', '/ĭ/': 'ih', '/ŏ/': 'ot', '/ŭ/': 'uh',
  '/ā/': 'ay', '/ē/': 'ee', '/ī/': 'eye', '/ō/': 'oh', '/ū/': 'you',
  '/sh/': 'shh', '/ch/': 'chuh', '/th/': 'thuh', '/wh/': 'whuh', '/ng/': 'sing',
  '/bl/': 'bluh', '/br/': 'bruh', '/cl/': 'cluh', '/cr/': 'cruh',
  '/dr/': 'druh', '/fl/': 'fluh', '/fr/': 'fruh', '/gl/': 'gluh',
  '/gr/': 'gruh', '/pl/': 'pluh', '/pr/': 'pruh', '/sk/': 'skuh',
  '/sl/': 'sluh', '/sm/': 'smuh', '/sn/': 'snuh', '/sp/': 'spuh',
  '/st/': 'stuh', '/sw/': 'swuh', '/tr/': 'truh', '/tw/': 'twuh',
  '/oo/': 'oo', '/ou/': 'ow', '/oi/': 'oy', '/aw/': 'aw',
  '/ar/': 'ar', '/er/': 'er', '/or/': 'or',
};

// ---------------------------------------------------------------------------
// ElevenLabs — short, crisp text optimised for the AI voice
// ---------------------------------------------------------------------------
export const ELEVENLABS_PHONEMES: Record<string, string> = {
  // === CONSONANTS ===
  // A trailing period forces the engine to produce a clean stop
  'b': 'b.',
  'c': 'k.',
  'd': 'd.',
  'f': 'f.',
  'g': 'g.',
  'h': 'h.',
  'j': 'j.',
  'k': 'k.',
  'l': 'l.',
  'm': 'm.',
  'n': 'n.',
  'p': 'p.',
  'q': 'kw.',
  'r': 'r.',
  's': 'ss.',
  't': 't.',
  'v': 'v.',
  'w': 'w.',
  'x': 'ks.',
  'y': 'y.',
  'z': 'z.',

  // === SHORT VOWELS ===
  'a': 'aah.',       // short-a as in cat
  'e': 'eh.',        // short-e as in bed
  'i': 'ih.',        // short-i as in sit
  'o': 'ahh.',       // short-o as in hot (open-back vowel)
  'u': 'uh.',        // short-u as in cup

  // === DIGRAPHS ===
  'sh': 'shh.',
  'ch': 'ch.',
  'th': 'th.',
  'wh': 'wh.',
  'ck': 'k.',        // /k/ sound
  'ng': 'ng.',
  'ph': 'f.',

  // === VOWEL TEAMS ===
  'ai': 'ay.',
  'ay': 'ay.',
  'ea': 'ee.',
  'ee': 'ee.',
  'oa': 'oh.',
  'ow': 'oh.',
  'ou': 'ow.',
  'oi': 'oy.',
  'oy': 'oy.',
  'au': 'aw.',
  'aw': 'aw.',
  'oo': 'oo.',
  'ew': 'yoo.',

  // === R-CONTROLLED VOWELS ===
  'ar': 'ar.',
  'er': 'er.',
  'ir': 'er.',
  'ur': 'er.',
  'or': 'or.',

  // === BLENDS ===
  'bl': 'bl.', 'br': 'br.', 'cl': 'cl.', 'cr': 'cr.',
  'dr': 'dr.', 'fl': 'fl.', 'fr': 'fr.', 'gl': 'gl.',
  'gr': 'gr.', 'pl': 'pl.', 'pr': 'pr.', 'sk': 'sk.',
  'sl': 'sl.', 'sm': 'sm.', 'sn': 'sn.', 'sp': 'sp.',
  'st': 'st.', 'sw': 'sw.', 'tr': 'tr.', 'tw': 'tw.',
  'sc': 'sk.', 'scr': 'scr.', 'spr': 'spr.', 'str': 'str.', 'spl': 'spl.',

  // === IPA-STYLE KEYS ===
  '/b/': 'b.', '/k/': 'k.', '/d/': 'd.', '/f/': 'f.',
  '/g/': 'g.', '/h/': 'h.', '/j/': 'j.', '/l/': 'l.',
  '/m/': 'm.', '/n/': 'n.', '/p/': 'p.', '/kw/': 'kw.',
  '/r/': 'r.', '/s/': 'ss.', '/t/': 't.', '/v/': 'v.',
  '/w/': 'w.', '/ks/': 'ks.', '/y/': 'y.', '/z/': 'z.',
  '/ă/': 'aah.', '/ĕ/': 'eh.', '/ĭ/': 'ih.', '/ŏ/': 'ahh.', '/ŭ/': 'uh.',
  '/ā/': 'ay.', '/ē/': 'ee.', '/ī/': 'eye.', '/ō/': 'oh.', '/ū/': 'yoo.',
  '/sh/': 'shh.', '/ch/': 'ch.', '/th/': 'th.', '/wh/': 'wh.', '/ng/': 'ng.',
  '/bl/': 'bl.', '/br/': 'br.', '/cl/': 'cl.', '/cr/': 'cr.',
  '/dr/': 'dr.', '/fl/': 'fl.', '/fr/': 'fr.', '/gl/': 'gl.',
  '/gr/': 'gr.', '/pl/': 'pl.', '/pr/': 'pr.', '/sk/': 'sk.',
  '/sl/': 'sl.', '/sm/': 'sm.', '/sn/': 'sn.', '/sp/': 'sp.',
  '/st/': 'st.', '/sw/': 'sw.', '/tr/': 'tr.', '/tw/': 'tw.',
  '/oo/': 'oo.', '/ou/': 'ow.', '/oi/': 'oy.', '/aw/': 'aw.',
  '/ar/': 'ar.', '/er/': 'er.', '/or/': 'or.',
};

// ---------------------------------------------------------------------------
// Resolver — look up the correct proxy text for a given engine
// ---------------------------------------------------------------------------
export type TTSEngine = 'web-speech' | 'elevenlabs';

export function resolvePhonemeText(
  phoneme: string,
  engine: TTSEngine,
): { text: string; source: 'map' | 'fallback' } {
  const map = engine === 'elevenlabs' ? ELEVENLABS_PHONEMES : WEB_SPEECH_PHONEMES;
  const normalized = phoneme.toLowerCase().trim();

  // Direct match
  if (map[normalized]) {
    return { text: map[normalized], source: 'map' };
  }

  // Try stripping IPA slashes → plain key
  if (normalized.startsWith('/') && normalized.endsWith('/')) {
    const inner = normalized.slice(1, -1);
    if (map[inner]) {
      return { text: map[inner], source: 'map' };
    }
  }

  // Uppercase letter fallback (e.g. 'S' in 'Sam')
  const lower = normalized.toLowerCase();
  if (map[lower]) {
    return { text: map[lower], source: 'map' };
  }

  // Nothing matched — return raw text (will be logged as a warning)
  return { text: normalized, source: 'fallback' };
}
