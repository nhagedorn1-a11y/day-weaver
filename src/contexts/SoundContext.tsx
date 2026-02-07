import { createContext, useContext, ReactNode, useCallback, useState, useEffect, useRef } from 'react';
import { useSoundscape } from '@/hooks/useSoundscape';
import { resolvePhonemeText, TTSEngine } from '@/data/phonemeMaps';

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
  speakWord: (word: string) => void;
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
  // Tone helpers (unchanged)
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
  // ---------------------------------------------------------------------------
  const playBlob = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.volume = soundscape.volume;
    audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
    audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
    audio.play().catch(() => setIsSpeaking(false));
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

    // Cache hit?
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
  // speakPhoneme — ElevenLabs path
  // ---------------------------------------------------------------------------
  const speakPhonemeWithElevenLabs = useCallback(async (phoneme: string) => {
    const { text, source } = resolvePhonemeText(phoneme, 'elevenlabs');
    logSound('phoneme-resolve', { phoneme, text, source, engine: 'elevenlabs' });
    if (source === 'fallback') {
      console.warn(`[Sound] No ElevenLabs mapping for phoneme "${phoneme}" — using fallback "${text}"`);
    }

    try {
      setIsSpeaking(true);
      const blob = await callElevenLabs(text, settings.elevenLabsVoiceId, false);
      if (blob) {
        playBlob(blob);
      } else {
        // Fallback to Web Speech
        setIsSpeaking(false);
        speakPhonemeWithWebSpeech(phoneme);
      }
    } catch (error) {
      console.error('[Sound] ElevenLabs phoneme error:', error);
      setIsSpeaking(false);
      speakPhonemeWithWebSpeech(phoneme);
    }
  }, [settings.elevenLabsVoiceId, callElevenLabs, playBlob]);

  // ---------------------------------------------------------------------------
  // speakPhoneme — Web Speech path
  // ---------------------------------------------------------------------------
  const speakPhonemeWithWebSpeech = useCallback((phoneme: string) => {
    if (!('speechSynthesis' in window)) { playTap(); return; }

    window.speechSynthesis.cancel();

    const { text, source } = resolvePhonemeText(phoneme, 'web-speech');
    logSound('phoneme-resolve', { phoneme, text, source, engine: 'web-speech' });
    if (source === 'fallback') {
      console.warn(`[Sound] No Web Speech mapping for phoneme "${phoneme}" — using fallback "${text}"`);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speechRate;
    utterance.pitch = settings.speechPitch;
    utterance.volume = soundscape.volume;

    if (settings.voiceURI) {
      const voice = availableVoices.find(v => v.voiceURI === settings.voiceURI);
      if (voice) utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => { setIsSpeaking(false); playTap(); };

    window.speechSynthesis.speak(utterance);
  }, [soundscape.volume, settings.speechRate, settings.speechPitch, settings.voiceURI, availableVoices, playTap]);

  // ---------------------------------------------------------------------------
  // speakPhoneme — dispatcher
  // ---------------------------------------------------------------------------
  const speakPhoneme = useCallback((phoneme: string) => {
    if (!soundscape.isEnabled || !settings.phonemesEnabled) return;
    if (settings.ttsEngine === 'elevenlabs') {
      speakPhonemeWithElevenLabs(phoneme);
    } else {
      speakPhonemeWithWebSpeech(phoneme);
    }
  }, [soundscape.isEnabled, settings.phonemesEnabled, settings.ttsEngine, speakPhonemeWithElevenLabs, speakPhonemeWithWebSpeech]);

  // ---------------------------------------------------------------------------
  // speakWord — Web Speech
  // ---------------------------------------------------------------------------
  const speakWordWithWebSpeech = useCallback((word: string) => {
    if (!('speechSynthesis' in window)) { playComplete(); return; }

    window.speechSynthesis.cancel();
    logSound('word', { word, engine: 'web-speech' });

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = settings.speechRate + 0.1;
    utterance.pitch = settings.speechPitch;
    utterance.volume = soundscape.volume;

    if (settings.voiceURI) {
      const voice = availableVoices.find(v => v.voiceURI === settings.voiceURI);
      if (voice) utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [soundscape.volume, settings.speechRate, settings.speechPitch, settings.voiceURI, availableVoices, playComplete]);

  // ---------------------------------------------------------------------------
  // speakWord — ElevenLabs (with cache)
  // ---------------------------------------------------------------------------
  const speakWordWithElevenLabs = useCallback(async (word: string) => {
    logSound('word', { word, engine: 'elevenlabs' });
    try {
      setIsSpeaking(true);
      const blob = await callElevenLabs(word, settings.elevenLabsVoiceId, true);
      if (blob) {
        playBlob(blob);
      } else {
        setIsSpeaking(false);
        speakWordWithWebSpeech(word);
      }
    } catch (error) {
      console.error('[Sound] ElevenLabs word error:', error);
      setIsSpeaking(false);
      speakWordWithWebSpeech(word);
    }
  }, [settings.elevenLabsVoiceId, callElevenLabs, playBlob, speakWordWithWebSpeech]);

  // ---------------------------------------------------------------------------
  // speakWord — dispatcher
  // ---------------------------------------------------------------------------
  const speakWord = useCallback((word: string) => {
    if (!soundscape.isEnabled) return;
    if (settings.ttsEngine === 'elevenlabs') {
      speakWordWithElevenLabs(word);
    } else {
      speakWordWithWebSpeech(word);
    }
  }, [soundscape.isEnabled, settings.ttsEngine, speakWordWithElevenLabs, speakWordWithWebSpeech]);

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
        speakWord,
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
      speakWord: () => {},
      isSpeaking: false,
    };
  }
  return context;
}
