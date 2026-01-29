import { createContext, useContext, ReactNode, useCallback, useState } from 'react';
import { useSoundscape } from '@/hooks/useSoundscape';

interface SoundContextType {
  isEnabled: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (v: number) => void;
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

// Phoneme-to-pronunciation map for Web Speech API
// These spellings help TTS pronounce the SOUND, not the letter name
const PHONEME_PRONUNCIATIONS: Record<string, string> = {
  // Short vowels
  'a': 'ah',           // /æ/ as in "cat"
  'e': 'eh',           // /ɛ/ as in "bed"
  'i': 'ih',           // /ɪ/ as in "sit"
  'o': 'aw',           // /ɒ/ as in "hot"
  'u': 'uh',           // /ʌ/ as in "cup"
  
  // Long vowels (usually with silent e or digraphs)
  'a_e': 'ay',         // /eɪ/ as in "cake"
  'e_e': 'ee',         // /iː/ as in "Pete"
  'i_e': 'eye',        // /aɪ/ as in "bike"
  'o_e': 'oh',         // /oʊ/ as in "home"
  'u_e': 'yoo',        // /juː/ as in "cube"
  
  // Consonants - pronounced as sounds, not names
  'b': 'buh',
  'c': 'kuh',          // Hard c sound
  'd': 'duh',
  'f': 'fff',
  'g': 'guh',          // Hard g
  'h': 'huh',
  'j': 'juh',
  'k': 'kuh',
  'l': 'lll',
  'm': 'mmm',
  'n': 'nnn',
  'p': 'puh',
  'q': 'kwuh',
  'r': 'rrr',
  's': 'sss',
  't': 'tuh',
  'v': 'vvv',
  'w': 'wuh',
  'x': 'ks',
  'y': 'yuh',
  'z': 'zzz',
  
  // Digraphs
  'sh': 'shh',
  'ch': 'chuh',
  'th': 'thh',
  'wh': 'wuh',
  'ph': 'fff',
  'ck': 'kuh',
  'ng': 'ng',
  'nk': 'nk',
  
  // Vowel teams
  'ee': 'ee',
  'ea': 'ee',
  'ai': 'ay',
  'ay': 'ay',
  'oa': 'oh',
  'ow': 'oh',
  'ou': 'ow',
  'oo': 'oo',
  'oi': 'oy',
  'oy': 'oy',
  'au': 'aw',
  'aw': 'aw',
  
  // R-controlled vowels
  'ar': 'ar',
  'er': 'er',
  'ir': 'er',
  'or': 'or',
  'ur': 'er',
  
  // Common phonemes from IPA notation
  '/a/': 'ah',
  '/e/': 'eh',
  '/i/': 'ih',
  '/o/': 'aw',
  '/u/': 'uh',
  '/æ/': 'ah',
  '/ɛ/': 'eh',
  '/ɪ/': 'ih',
  '/ɒ/': 'aw',
  '/ʌ/': 'uh',
  '/ʃ/': 'shh',
  '/tʃ/': 'chuh',
  '/θ/': 'thh',
  '/ð/': 'thh',
};

// Get pronunciation for a phoneme
function getPhonemeSound(phoneme: string): string {
  const normalized = phoneme.toLowerCase().trim();
  
  // Check direct match
  if (PHONEME_PRONUNCIATIONS[normalized]) {
    return PHONEME_PRONUNCIATIONS[normalized];
  }
  
  // Check if it's wrapped in slashes (IPA style)
  if (normalized.startsWith('/') && normalized.endsWith('/')) {
    const inner = normalized.slice(1, -1);
    if (PHONEME_PRONUNCIATIONS[inner]) {
      return PHONEME_PRONUNCIATIONS[inner];
    }
  }
  
  // For unknown phonemes, try to make it sound-like
  // If it's a single letter, use our consonant/vowel sounds
  if (normalized.length === 1) {
    return PHONEME_PRONUNCIATIONS[normalized] || normalized;
  }
  
  // Return as-is for longer unknown phonemes
  return normalized;
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const soundscape = useSoundscape({ enabled: true, volume: 0.4 });
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  // Speak phoneme using Web Speech API with phonetic pronunciation
  const speakPhoneme = useCallback((phoneme: string) => {
    if (!soundscape.isEnabled) return;
    if (!('speechSynthesis' in window)) {
      playTap();
      return;
    }
    
    window.speechSynthesis.cancel();
    
    // Get the phonetic pronunciation instead of letter name
    const textToSpeak = getPhonemeSound(phoneme);
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.75; // Slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = soundscape.volume;
    
    // Try to find a clear voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') || 
      v.name.includes('Google US English') ||
      (v.lang.startsWith('en') && v.name.includes('Female'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      playTap();
    };
    
    window.speechSynthesis.speak(utterance);
  }, [soundscape.isEnabled, soundscape.volume, playTap]);

  // Speak full word (this says the actual word, not letter by letter)
  const speakWord = useCallback((word: string) => {
    if (!soundscape.isEnabled) return;
    if (!('speechSynthesis' in window)) {
      playComplete();
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = soundscape.volume;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') || 
      v.name.includes('Google US English') ||
      v.lang.startsWith('en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [soundscape.isEnabled, soundscape.volume, playComplete]);

  return (
    <SoundContext.Provider
      value={{
        isEnabled: soundscape.isEnabled,
        volume: soundscape.volume,
        toggle: soundscape.toggle,
        setVolume: soundscape.setVolume,
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
