import { createContext, useContext, ReactNode, useCallback, useState, useEffect, useRef } from 'react';
import { useSoundscape } from '@/hooks/useSoundscape';

type TTSEngine = 'web-speech' | 'elevenlabs';

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

// Phoneme pronunciation map - uses WORDS that TTS engines will pronounce correctly
// The key insight: TTS spells out repeated letters ("mmm" → "M M M"), so we use real words/sounds
const PHONEME_PRONUNCIATIONS: Record<string, string> = {
  // === CONSONANTS (IPA notation from graphemeLibrary) ===
  // Using minimal syllables that TTS pronounces as sounds, not letter names
  '/b/': 'buh',      // bear
  '/k/': 'kuh',      // cat, kite
  '/d/': 'duh',      // dog
  '/f/': 'fuh',      // fish - "fuh" not "fff" (TTS would say "F F F")
  '/g/': 'guh',      // goat
  '/h/': 'huh',      // hat
  '/j/': 'juh',      // jam
  '/l/': 'luh',      // lion
  '/m/': 'muh',      // mouse - "muh" not "mmm" (TTS would say "M M M")
  '/n/': 'nuh',      // nest
  '/p/': 'puh',      // pig
  '/kw/': 'kwuh',    // queen
  '/r/': 'ruh',      // rabbit
  '/s/': 'suh',      // snake - "suh" not "sss" (TTS would say "S S S")
  '/t/': 'tuh',      // turtle
  '/v/': 'vuh',      // van
  '/w/': 'wuh',      // wave
  '/ks/': 'ks',      // fox
  '/y/': 'yuh',      // yo-yo
  '/z/': 'zuh',      // zebra
  
  // === SHORT VOWELS (IPA notation with breve) ===
  '/ă/': 'ah',       // apple - short a as in "cat"
  '/ĕ/': 'eh',       // egg - short e as in "bed"
  '/ĭ/': 'ih',       // itch - short i as in "sit"
  '/ŏ/': 'aw',       // octopus - short o as in "hot"
  '/ŭ/': 'uh',       // umbrella - short u as in "cup"
  
  // === LONG VOWELS (IPA notation with macron) ===
  '/ā/': 'ay',       // cake, rain, play - long a
  '/ē/': 'ee',       // eve, leaf, bee - long e
  '/ī/': 'eye',      // bike - long i
  '/ō/': 'oh',       // bone, boat, snow - long o
  '/ū/': 'you',      // cube - long u
  
  // === DIGRAPHS ===
  '/sh/': 'shh',     // ship
  '/ch/': 'chuh',    // cheese
  '/th/': 'thuh',    // thumb
  '/wh/': 'whuh',    // whale
  '/ng/': 'ng',      // ring - this works as "ng" sound
  
  // === BLENDS (two sounds together) ===
  '/bl/': 'bluh',
  '/br/': 'bruh',
  '/cl/': 'cluh',
  '/cr/': 'cruh',
  '/dr/': 'druh',
  '/fl/': 'fluh',
  '/fr/': 'fruh',
  '/gl/': 'gluh',
  '/gr/': 'gruh',
  '/pl/': 'pluh',
  '/pr/': 'pruh',
  '/sk/': 'skuh',
  '/sl/': 'sluh',
  '/sm/': 'smuh',
  '/sn/': 'snuh',
  '/sp/': 'spuh',
  '/st/': 'stuh',
  '/sw/': 'swuh',
  '/tr/': 'truh',
  '/tw/': 'twuh',
  
  // === VOWEL TEAMS & DIPHTHONGS ===
  '/oo/': 'oo',      // moon
  '/ou/': 'ow',      // house
  '/oi/': 'oy',      // coin, toy
  '/aw/': 'aw',      // sauce, paw
  
  // === R-CONTROLLED VOWELS ===
  '/ar/': 'ar',      // car
  '/er/': 'er',      // fern, bird, turtle
  '/or/': 'or',      // corn
  
  // === FALLBACK SIMPLE LETTERS (without slashes) ===
  // Used when plain letters are passed (e.g., from test grid)
  'a': 'ah',
  'b': 'buh',
  'c': 'kuh',
  'd': 'duh',
  'e': 'eh',
  'f': 'fuh',
  'g': 'guh',
  'h': 'huh',
  'i': 'ih',
  'j': 'juh',
  'k': 'kuh',
  'l': 'luh',
  'm': 'muh',
  'n': 'nuh',
  'o': 'aw',
  'p': 'puh',
  'q': 'kwuh',
  'r': 'ruh',
  's': 'suh',
  't': 'tuh',
  'u': 'uh',
  'v': 'vuh',
  'w': 'wuh',
  'x': 'ks',
  'y': 'yuh',
  'z': 'zuh',
  
  // Digraphs without slashes
  'sh': 'shh',
  'ch': 'chuh',
  'th': 'thuh',
  'ee': 'ee',
  'oo': 'oo',
  'ar': 'ar',
  'or': 'or',
};

function getPhonemeSound(phoneme: string): string {
  const normalized = phoneme.toLowerCase().trim();
  
  if (PHONEME_PRONUNCIATIONS[normalized]) {
    return PHONEME_PRONUNCIATIONS[normalized];
  }
  
  if (normalized.startsWith('/') && normalized.endsWith('/')) {
    const inner = normalized.slice(1, -1);
    if (PHONEME_PRONUNCIATIONS[inner]) {
      return PHONEME_PRONUNCIATIONS[inner];
    }
  }
  
  if (normalized.length === 1) {
    return PHONEME_PRONUNCIATIONS[normalized] || normalized;
  }
  
  return normalized;
}

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
      
      // Set default voice on first load
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

  const playTap = useCallback(() => {
    playTone(880, 0.05, 'sine', 0.2);
  }, [playTone]);

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

  const speakPhonemeWithElevenLabs = useCallback(async (phoneme: string) => {
    const textToSpeak = getPhonemeSound(phoneme);
    
    try {
      setIsSpeaking(true);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            text: textToSpeak, 
            voiceId: settings.elevenLabsVoiceId 
          }),
        }
      );

      if (!response.ok) {
        console.error('ElevenLabs TTS failed:', response.status);
        // Fallback to Web Speech
        speakPhonemeWithWebSpeech(phoneme);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.volume = soundscape.volume;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      setIsSpeaking(false);
      // Fallback to Web Speech
      speakPhonemeWithWebSpeech(phoneme);
    }
  }, [settings.elevenLabsVoiceId, soundscape.volume]);

  const speakPhonemeWithWebSpeech = useCallback((phoneme: string) => {
    if (!('speechSynthesis' in window)) {
      playTap();
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const textToSpeak = getPhonemeSound(phoneme);
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = settings.speechRate;
    utterance.pitch = settings.speechPitch;
    utterance.volume = soundscape.volume;
    
    if (settings.voiceURI) {
      const voice = availableVoices.find(v => v.voiceURI === settings.voiceURI);
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      playTap();
    };
    
    window.speechSynthesis.speak(utterance);
  }, [soundscape.volume, settings.speechRate, settings.speechPitch, settings.voiceURI, availableVoices, playTap]);

  const speakPhoneme = useCallback((phoneme: string) => {
    if (!soundscape.isEnabled || !settings.phonemesEnabled) return;
    
    if (settings.ttsEngine === 'elevenlabs') {
      speakPhonemeWithElevenLabs(phoneme);
    } else {
      speakPhonemeWithWebSpeech(phoneme);
    }
  }, [soundscape.isEnabled, settings.phonemesEnabled, settings.ttsEngine, speakPhonemeWithElevenLabs, speakPhonemeWithWebSpeech]);

  const speakWord = useCallback((word: string) => {
    if (!soundscape.isEnabled) return;
    if (!('speechSynthesis' in window)) {
      playComplete();
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = settings.speechRate + 0.1; // Slightly faster for words
    utterance.pitch = settings.speechPitch;
    utterance.volume = soundscape.volume;
    
    if (settings.voiceURI) {
      const voice = availableVoices.find(v => v.voiceURI === settings.voiceURI);
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [soundscape.isEnabled, soundscape.volume, settings, availableVoices, playComplete]);

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
