import { createContext, useContext, ReactNode } from 'react';
import { useSoundscape } from '@/hooks/useSoundscape';

interface SoundContextType {
  isEnabled: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (v: number) => void;
  // Reading/Writing specific sounds
  playTap: () => void;          // Tapping cards/phonemes
  playReveal: () => void;       // Revealing a word
  playBlend: () => void;        // Blending sounds together
  playCorrect: () => void;      // Got it right
  playComplete: () => void;     // Step/section complete
  playTokenEarned: () => void;  // Earning tokens
  playTrace: () => void;        // Tracing completion
  playClick: () => void;        // General button clicks
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const soundscape = useSoundscape({ enabled: true, volume: 0.4 });

  // Custom sounds using Web Audio API
  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
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
  };

  // Soft tap - quick light touch
  const playTap = () => {
    playTone(880, 0.05, 'sine', 0.2);
  };

  // Reveal - gentle upward sweep
  const playReveal = () => {
    playTone(440, 0.1, 'sine', 0.25);
    setTimeout(() => playTone(550, 0.1, 'sine', 0.2), 50);
  };

  // Blend - satisfying swoosh effect
  const playBlend = () => {
    playTone(330, 0.15, 'sine', 0.3);
    setTimeout(() => playTone(440, 0.15, 'sine', 0.25), 80);
    setTimeout(() => playTone(550, 0.2, 'sine', 0.2), 160);
  };

  // Correct - happy ding
  const playCorrect = () => {
    playTone(523.25, 0.12, 'sine', 0.35); // C5
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.3), 80); // E5
  };

  // Complete - triumphant fanfare
  const playComplete = () => {
    playTone(523.25, 0.1, 'triangle', 0.3); // C5
    setTimeout(() => playTone(659.25, 0.1, 'triangle', 0.28), 100); // E5
    setTimeout(() => playTone(783.99, 0.2, 'triangle', 0.35), 200); // G5
  };

  // Token earned - satisfying coin sound
  const playTokenEarned = () => {
    playTone(1046.5, 0.08, 'triangle', 0.3); // C6
    setTimeout(() => playTone(1318.5, 0.12, 'triangle', 0.25), 40); // E6
  };

  // Trace complete - soft success
  const playTrace = () => {
    playTone(392, 0.15, 'sine', 0.25); // G4
    setTimeout(() => playTone(523.25, 0.2, 'sine', 0.3), 100); // C5
  };

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
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    // Return no-op functions if used outside provider
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
    };
  }
  return context;
}
