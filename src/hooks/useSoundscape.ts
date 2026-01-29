import { useRef, useCallback, useState, useEffect } from 'react';

interface SoundscapeOptions {
  enabled?: boolean;
  volume?: number; // 0-1
}

export function useSoundscape(options: SoundscapeOptions = {}) {
  const { enabled = false, volume = 0.3 } = options;
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [currentVolume, setCurrentVolume] = useState(volume);

  // Initialize audio context on first interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Play a simple tone
  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!isEnabled) return;
    
    try {
      const ctx = initAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(currentVolume * 0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [isEnabled, currentVolume, initAudioContext]);

  // Completion sound - gentle rising ding
  const playComplete = useCallback(() => {
    playTone(523.25, 0.15, 'sine'); // C5
    setTimeout(() => playTone(659.25, 0.2, 'sine'), 100); // E5
  }, [playTone]);

  // Token earned - satisfying clink
  const playTokenEarned = useCallback(() => {
    playTone(1046.5, 0.1, 'triangle'); // C6
    setTimeout(() => playTone(1318.5, 0.15, 'triangle'), 50); // E6
  }, [playTone]);

  // Timer warning - gentle bell
  const playTimerWarning = useCallback(() => {
    playTone(440, 0.3, 'sine'); // A4
  }, [playTone]);

  // Calm ambient drone
  const startCalmDrone = useCallback(() => {
    if (!isEnabled) return null;
    
    try {
      const ctx = initAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(110, ctx.currentTime); // A2 - low, calming
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(currentVolume * 0.1, ctx.currentTime + 2);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);

      return () => {
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        setTimeout(() => oscillator.stop(), 1000);
      };
    } catch (e) {
      console.log('Audio not available');
      return null;
    }
  }, [isEnabled, currentVolume, initAudioContext]);

  // Button click feedback
  const playClick = useCallback(() => {
    playTone(800, 0.05, 'square');
  }, [playTone]);

  // Toggle sound on/off
  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isEnabled,
    volume: currentVolume,
    toggle,
    setVolume: setCurrentVolume,
    playComplete,
    playTokenEarned,
    playTimerWarning,
    playClick,
    startCalmDrone,
  };
}
