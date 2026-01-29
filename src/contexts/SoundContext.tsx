import { createContext, useContext, ReactNode, useCallback, useState, useEffect, useRef } from 'react';
import { useSoundscape } from '@/hooks/useSoundscape';

interface SoundSettings {
  voiceURI: string;
  speechRate: number;
  speechPitch: number;
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

// Phoneme pronunciation map - uses phonetic spellings that force TTS to say SOUNDS not letter names
// Format: letter/grapheme -> phonetic spelling the TTS engine will pronounce correctly
const PHONEME_PRONUNCIATIONS: Record<string, string> = {
  // === SHORT VOWELS (most common sounds) ===
  'a': 'aah',      // /æ/ as in "cat" - open mouth "aah" 
  'e': 'eeh',      // /ɛ/ as in "bed" - short "eh"
  'i': 'iih',      // /ɪ/ as in "sit" - short "ih"
  'o': 'awe',      // /ɒ/ as in "hot" - open "aw"
  'u': 'uhh',      // /ʌ/ as in "cup" - short "uh"
  
  // === CONSONANTS (continuous sounds stretched, stops minimal) ===
  // Continuous sounds - can be held/stretched
  'f': 'ffff',     // friction sound
  'l': 'llll',     // tongue tip up
  'm': 'mmmm',     // lips together, hum
  'n': 'nnnn',     // tongue behind teeth
  'r': 'rrrr',     // tongue curled back
  's': 'ssss',     // snake sound
  'v': 'vvvv',     // teeth on lip, vibrate
  'w': 'wwww',     // lips rounded
  'y': 'yyyy',     // tongue up, glide
  'z': 'zzzz',     // buzzing s
  
  // Stop sounds - quick burst, minimal vowel
  'b': 'b',        // lips pop
  'c': 'k',        // back of tongue
  'd': 'd',        // tongue tap
  'g': 'g',        // throat sound
  'h': 'h',        // breath out
  'j': 'j',        // soft g sound
  'k': 'k',        // back of tongue pop
  'p': 'p',        // lips pop (no "uh")
  'q': 'kw',       // always with u
  't': 't',        // tongue tap (no "uh")
  'x': 'ks',       // combo sound
  
  // === DIGRAPHS (two letters, one sound) ===
  'sh': 'shhhh',   // quiet sound
  'ch': 'ch',      // train sound
  'th': 'thhh',    // tongue between teeth (voiceless)
  'wh': 'wh',      // breathy w
  'ph': 'ffff',    // same as f
  'ck': 'k',       // same as k
  'ng': 'ng',      // back of tongue, nasal
  'nk': 'nk',      // n + k blend
  
  // === LONG VOWELS (say their name) ===
  'a_e': 'ay',     // cake
  'e_e': 'ee',     // these
  'i_e': 'eye',    // like
  'o_e': 'oh',     // home
  'u_e': 'you',    // cute
  
  // === VOWEL TEAMS ===
  'ee': 'ee',      // tree
  'ea': 'ee',      // read
  'ai': 'ay',      // rain
  'ay': 'ay',      // play
  'oa': 'oh',      // boat
  'ow': 'oh',      // snow (also "ow" as in cow)
  'ou': 'ow',      // out
  'oo': 'oo',      // moon
  'oi': 'oy',      // oil
  'oy': 'oy',      // boy
  'au': 'aw',      // caught
  'aw': 'aw',      // saw
  'ew': 'you',     // new
  'ue': 'oo',      // blue
  'ie': 'eye',     // pie
  
  // === R-CONTROLLED VOWELS ===
  'ar': 'ar',      // car
  'er': 'er',      // her
  'ir': 'er',      // bird
  'or': 'or',      // for
  'ur': 'er',      // fur
  
  // === IPA NOTATION (for lesson data) ===
  '/æ/': 'aah',
  '/ɛ/': 'eeh', 
  '/ɪ/': 'iih',
  '/ɒ/': 'awe',
  '/ʌ/': 'uhh',
  '/ʃ/': 'shhhh',
  '/tʃ/': 'ch',
  '/θ/': 'thhh',
  '/ð/': 'thhh',
  '/ŋ/': 'ng',
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

const DEFAULT_SETTINGS: SoundSettings = {
  voiceURI: '',
  speechRate: 0.75,
  speechPitch: 1.0,
};

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

  const speakPhoneme = useCallback((phoneme: string) => {
    if (!soundscape.isEnabled) return;
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
    
    // Use selected voice
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
  }, [soundscape.isEnabled, soundscape.volume, settings, availableVoices, playTap]);

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
