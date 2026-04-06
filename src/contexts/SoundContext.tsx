import { createContext, useContext, ReactNode, useCallback, useState, useEffect, useRef } from 'react';
import { useSoundscape } from '@/hooks/useSoundscape';
import { resolvePhonemeText, TTSEngine } from '@/data/phonemeMaps';
import { speechQueue } from '@/lib/speechQueue';

interface SoundSettings {
  voiceURI: string;
  speechRate: number;
  speechPitch: number;
  phonemesEnabled: boolean;
  ttsEngine: TTSEngine;
  elevenLabsVoiceId: string;
}

interface SoundContextType {
  isEnabled: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (v: number) => void;
  settings: SoundSettings;
  setSettings: (s: Partial<SoundSettings>) => void;
  availableVoices: SpeechSynthesisVoice[];
  playTap: () => void;
  playReveal: () => void;
  playBlend: () => void;
  playCorrect: () => void;
  playComplete: () => void;
  playTokenEarned: () => void;
  playTrace: () => void;
  playClick: () => void;
  speakPhoneme: (phoneme: string) => void;
  /** Speak the letter name (e.g. "A", "B") instead of its phonetic sound */
  speakLetterName: (letter: string) => void;
  speakWord: (word: string) => void;
  /** Cascade phonemes at shrinking intervals then speak the full word */
  speakBlend: (phonemes: string[], word: string) => void;
  isSpeaking: boolean;
}

const SoundContext = createContext<SoundContextType | null>(null);

// ElevenLabs voice options for phonemes
const ELEVENLABS_VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Clear)' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily (Gentle)' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Warm)' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica (Friendly)' },
];

const DEFAULT_SETTINGS: SoundSettings = {
  voiceURI: '',
  speechRate: 0.75,
  speechPitch: 1.0,
  phonemesEnabled: true,
  ttsEngine: 'web-speech',
  elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL',
};

export { ELEVENLABS_VOICES };

// ---------------------------------------------------------------------------
// In-memory audio cache for ElevenLabs (keyed by phoneme+voiceId)
// ---------------------------------------------------------------------------
const elevenLabsCache = new Map<string, Blob>();

function getCacheKey(text: string, voiceId: string, isWord: boolean): string {
  return `${isWord ? 'w' : 'p'}:${text}:${voiceId}`;
}

// ---------------------------------------------------------------------------
// Debug logger — prefix all phoneme pipeline logs for easy filtering
// ---------------------------------------------------------------------------
function logSound(tag: string, data: Record<string, unknown>) {
  console.log(`[Sound:${tag}]`, JSON.stringify(data));
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const soundscape = useSoundscape({ enabled: true, volume: 0.4 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settings, setSettingsState] = useState<SoundSettings>(DEFAULT_SETTINGS);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const voicesLoadedRef = useRef(false);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      if (!('speechSynthesis' in window)) return;
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      setAvailableVoices(englishVoices);
      
      if (!voicesLoadedRef.current && englishVoices.length > 0) {
        voicesLoadedRef.current = true;
        const defaultVoice = englishVoices.find(v => 
          v.name.includes('Samantha') || 
          v.name.includes('Google US English') ||
          v.name.includes('Karen')
        ) || englishVoices[0];
        
        setSettingsState(prev => ({
          ...prev,
          voiceURI: defaultVoice.voiceURI,
        }));
      }
    };

    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const setSettings = useCallback((updates: Partial<SoundSettings>) => {
    setSettingsState(prev => ({ ...prev, ...updates }));
  }, []);

  // ---------------------------------------------------------------------------
  // Tone helpers
  // ---------------------------------------------------------------------------
  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
    if (!soundscape.isEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      gainNode.gain.setValueAtTime(volume * soundscape.volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [soundscape.isEnabled, soundscape.volume]);

  const playTap = useCallback(() => playTone(880, 0.05, 'sine', 0.2), [playTone]);
  const playReveal = useCallback(() => {
    playTone(440, 0.1, 'sine', 0.25);
    setTimeout(() => playTone(550, 0.1, 'sine', 0.2), 50);
  }, [playTone]);
  const playBlend = useCallback(() => {
    playTone(330, 0.15, 'sine', 0.3);
    setTimeout(() => playTone(440, 0.15, 'sine', 0.25), 80);
    setTimeout(() => playTone(550, 0.2, 'sine', 0.2), 160);
  }, [playTone]);
  const playCorrect = useCallback(() => {
    playTone(523.25, 0.12, 'sine', 0.35);
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.3), 80);
  }, [playTone]);
  const playComplete = useCallback(() => {
    playTone(523.25, 0.1, 'triangle', 0.3);
    setTimeout(() => playTone(659.25, 0.1, 'triangle', 0.28), 100);
    setTimeout(() => playTone(783.99, 0.2, 'triangle', 0.35), 200);
  }, [playTone]);
  const playTokenEarned = useCallback(() => {
    playTone(1046.5, 0.08, 'triangle', 0.3);
    setTimeout(() => playTone(1318.5, 0.12, 'triangle', 0.25), 40);
  }, [playTone]);
  const playTrace = useCallback(() => {
    playTone(392, 0.15, 'sine', 0.25);
    setTimeout(() => playTone(523.25, 0.2, 'sine', 0.3), 100);
  }, [playTone]);

  // ---------------------------------------------------------------------------
  // Play a blob (shared helper for cached / fresh ElevenLabs audio)
  // Returns a promise that resolves when playback ends
  // ---------------------------------------------------------------------------
  const playBlob = useCallback((blob: Blob): Promise<void> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.volume = soundscape.volume;
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); resolve(); };
      audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); resolve(); };
      audio.play().catch(() => { setIsSpeaking(false); resolve(); });
    });
  }, [soundscape.volume]);

  // ---------------------------------------------------------------------------
  // ElevenLabs TTS (with cache)
  // ---------------------------------------------------------------------------
  const callElevenLabs = useCallback(async (
    textToSend: string,
    voiceId: string,
    isWord: boolean,
  ): Promise<Blob | null> => {
    const cacheKey = getCacheKey(textToSend, voiceId, isWord);

    const cached = elevenLabsCache.get(cacheKey);
    if (cached) {
      logSound('cache-hit', { cacheKey });
      return cached;
    }

    logSound('api-call', { text: textToSend, voiceId, isWord });

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: textToSend, voiceId, isWord }),
      }
    );

    if (!response.ok) {
      logSound('api-error', { status: response.status });
      return null;
    }

    const blob = await response.blob();
    elevenLabsCache.set(cacheKey, blob);
    logSound('api-ok', { cacheKey, bytes: blob.size });
    return blob;
  }, []);

  // ---------------------------------------------------------------------------
  // Core speech functions (return Promises for queue integration)
  // ---------------------------------------------------------------------------

  /** Speak via Web Speech, returns a promise that resolves on utterance end */
  const webSpeechSpeak = useCallback((text: string, rate?: number): Promise<void> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) { playTap(); resolve(); return; }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate ?? settings.speechRate;
      utterance.pitch = settings.speechPitch;
      utterance.volume = soundscape.volume;

      if (settings.voiceURI) {
        const voice = availableVoices.find(v => v.voiceURI === settings.voiceURI);
        if (voice) utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => { setIsSpeaking(false); resolve(); };
      utterance.onerror = () => { setIsSpeaking(false); resolve(); };

      window.speechSynthesis.speak(utterance);
    });
  }, [soundscape.volume, settings.speechRate, settings.speechPitch, settings.voiceURI, availableVoices, playTap]);

  /** Play a phoneme via ElevenLabs, returns promise */
  const elevenLabsPhoneme = useCallback(async (phoneme: string): Promise<void> => {
    const { text, source } = resolvePhonemeText(phoneme, 'elevenlabs');
    logSound('phoneme-resolve', { phoneme, text, source, engine: 'elevenlabs' });
    if (source === 'fallback') {
      console.warn(`[Sound] No ElevenLabs mapping for "${phoneme}" — fallback "${text}"`);
    }

    setIsSpeaking(true);
    const blob = await callElevenLabs(text, settings.elevenLabsVoiceId, false);
    if (blob) {
      await playBlob(blob);
    } else {
      // Fallback to Web Speech
      setIsSpeaking(false);
      const { text: wsText } = resolvePhonemeText(phoneme, 'web-speech');
      await webSpeechSpeak(wsText);
    }
  }, [settings.elevenLabsVoiceId, callElevenLabs, playBlob, webSpeechSpeak]);

  /** Play a word via ElevenLabs, returns promise */
  const elevenLabsWord = useCallback(async (word: string): Promise<void> => {
    logSound('word', { word, engine: 'elevenlabs' });
    setIsSpeaking(true);
    const blob = await callElevenLabs(word, settings.elevenLabsVoiceId, true);
    if (blob) {
      await playBlob(blob);
    } else {
      setIsSpeaking(false);
      await webSpeechSpeak(word, settings.speechRate + 0.1);
    }
  }, [settings.elevenLabsVoiceId, callElevenLabs, playBlob, webSpeechSpeak]);

  // ---------------------------------------------------------------------------
  // Public API — debounced through speechQueue
  // ---------------------------------------------------------------------------

  const speakPhoneme = useCallback((phoneme: string) => {
    if (!soundscape.isEnabled || !settings.phonemesEnabled) return;

    // Debounce rapid slider movements — only the last phoneme in a burst plays
    speechQueue.debouncedEnqueue(async () => {
      if (settings.ttsEngine === 'elevenlabs') {
        await elevenLabsPhoneme(phoneme);
      } else {
        const { text } = resolvePhonemeText(phoneme, 'web-speech');
        logSound('phoneme-resolve', { phoneme, text, engine: 'web-speech' });
        await webSpeechSpeak(text);
      }
    }, 100);
  }, [soundscape.isEnabled, settings.phonemesEnabled, settings.ttsEngine, elevenLabsPhoneme, webSpeechSpeak]);

  /** Speak the letter name (e.g. "A", "B", "Z") — used by keyboard/typing modules */
  const speakLetterName = useCallback((letter: string) => {
    if (!soundscape.isEnabled) return;
    speechQueue.debouncedEnqueue(async () => {
      const name = letter.toUpperCase();
      if (settings.ttsEngine === 'elevenlabs') {
        await elevenLabsWord(name);
      } else {
        await webSpeechSpeak(name, settings.speechRate);
      }
    }, 100);
  }, [soundscape.isEnabled, settings.ttsEngine, settings.speechRate, elevenLabsWord, webSpeechSpeak]);

  const speakWord = useCallback((word: string) => {
    if (!soundscape.isEnabled) return;

    speechQueue.flush();
    speechQueue.enqueue(async () => {
      if (settings.ttsEngine === 'elevenlabs') {
        await elevenLabsWord(word);
      } else {
        logSound('word', { word, engine: 'web-speech' });
        await webSpeechSpeak(word, settings.speechRate + 0.1);
      }
    });
  }, [soundscape.isEnabled, settings.ttsEngine, elevenLabsWord, webSpeechSpeak, settings.speechRate]);

  /**
   * speakBlend — cascade phonemes at shrinking intervals then speak the word.
   * This gives the child the auditory experience of sounds merging into a word.
   */
  const speakBlend = useCallback((phonemes: string[], word: string) => {
    if (!soundscape.isEnabled) return;

    speechQueue.flush();

    const abortController = new AbortController();

    const playItems = phonemes.map((p) => async () => {
      if (settings.ttsEngine === 'elevenlabs') {
        await elevenLabsPhoneme(p);
      } else {
        const { text } = resolvePhonemeText(p, 'web-speech');
        await webSpeechSpeak(text);
      }
    });

    speechQueue.enqueue(async () => {
      try {
        // Cascade: 350ms gap → 80ms gap across phonemes
        await speechQueue.cascade(playItems, 350, 80, abortController.signal);

        // Brief pause then full word
        await new Promise(r => setTimeout(r, 400));

        if (settings.ttsEngine === 'elevenlabs') {
          await elevenLabsWord(word);
        } else {
          await webSpeechSpeak(word, settings.speechRate + 0.1);
        }
      } catch (e) {
        if ((e as Error).name !== 'AbortError') throw e;
      }
    });
  }, [soundscape.isEnabled, settings.ttsEngine, settings.speechRate, elevenLabsPhoneme, elevenLabsWord, webSpeechSpeak]);

  return (
    <SoundContext.Provider
      value={{
        isEnabled: soundscape.isEnabled,
        volume: soundscape.volume,
        toggle: soundscape.toggle,
        setVolume: soundscape.setVolume,
        settings,
        setSettings,
        availableVoices,
        playTap,
        playReveal,
        playBlend,
        playCorrect,
        playComplete,
        playTokenEarned,
        playTrace,
        playClick: soundscape.playClick,
        speakPhoneme,
        speakLetterName,
        speakWord,
        speakBlend,
        isSpeaking,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    return {
      isEnabled: false,
      volume: 0,
      toggle: () => {},
      setVolume: () => {},
      settings: DEFAULT_SETTINGS,
      setSettings: () => {},
      availableVoices: [] as SpeechSynthesisVoice[],
      playTap: () => {},
      playReveal: () => {},
      playBlend: () => {},
      playCorrect: () => {},
      playComplete: () => {},
      playTokenEarned: () => {},
      playTrace: () => {},
      playClick: () => {},
      speakPhoneme: () => {},
      speakLetterName: () => {},
      speakWord: () => {},
      speakBlend: (_p: string[], _w: string) => {},
      isSpeaking: false,
    };
  }
  return context;
}
