import { useEffect, useState, useCallback } from 'react';
import { useEngagement } from './EngagementProvider';

// Particle system for celebrations — respects vibe mode
interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  scale: number;
  rotation: number;
  velocity: { x: number; y: number };
  opacity: number;
  life: number;
}

const CELEBRATION_EMOJIS = ['⭐', '✨', '🌟', '💫', '🎉', '🎊', '🔥', '💥'];
const BADGE_EMOJIS = ['🏅', '🏆', '👑', '🎖️', '💎'];

let particleId = 0;

export function CelebrationOverlay() {
  const { activeSurprise, activeBadge, dismissCelebration, vibe } = useEngagement();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showCard, setShowCard] = useState(false);

  const spawnParticles = useCallback((count: number, emojis: string[]) => {
    const intensity = vibe.particleIntensity;
    const adjustedCount = Math.max(3, Math.round(count * intensity));
    
    const newParticles: Particle[] = Array.from({ length: adjustedCount }, () => ({
      id: particleId++,
      x: 20 + Math.random() * 60, // % from left
      y: 100 + Math.random() * 20, // Start below viewport
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      scale: 0.6 + Math.random() * 0.8,
      rotation: Math.random() * 360,
      velocity: {
        x: (Math.random() - 0.5) * 3,
        y: -(4 + Math.random() * 6), // Rise up
      },
      opacity: 1,
      life: 1,
    }));

    setParticles(prev => [...prev, ...newParticles]);
  }, [vibe.particleIntensity]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const frame = requestAnimationFrame(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocity.x * 0.3,
            y: p.y + p.velocity.y * 0.5,
            velocity: { x: p.velocity.x * 0.98, y: p.velocity.y + 0.15 }, // Gravity
            rotation: p.rotation + (Math.random() - 0.5) * 10,
            opacity: p.opacity - 0.012,
            life: p.life - 0.012,
          }))
          .filter(p => p.life > 0)
      );
    });

    return () => cancelAnimationFrame(frame);
  }, [particles]);

  // Trigger on surprise
  useEffect(() => {
    if (activeSurprise) {
      setShowCard(true);
      spawnParticles(20, CELEBRATION_EMOJIS);
      // Second burst
      setTimeout(() => spawnParticles(15, CELEBRATION_EMOJIS), 300);
    } else {
      setShowCard(false);
    }
  }, [activeSurprise, spawnParticles]);

  // Trigger on badge
  useEffect(() => {
    if (activeBadge) {
      setShowCard(true);
      spawnParticles(12, BADGE_EMOJIS);
    } else if (!activeSurprise) {
      setShowCard(false);
    }
  }, [activeBadge, activeSurprise, spawnParticles]);

  const activeItem = activeSurprise || activeBadge;
  if (!activeItem && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute text-2xl select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `scale(${p.scale}) rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            transition: 'none',
            willChange: 'transform, opacity',
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Celebration card */}
      {showCard && activeItem && (
        <div
          className="absolute inset-x-0 top-1/3 flex justify-center pointer-events-auto"
          onClick={dismissCelebration}
        >
          <div
            className="bg-card border-2 border-token shadow-2xl rounded-3xl px-8 py-6 text-center animate-scale-in max-w-xs"
            style={{
              animation: `scale-in ${vibe.mode === 'calm' ? '300ms' : '200ms'} var(--ease-mechanical) forwards`,
            }}
          >
            <div className="text-5xl mb-3">
              {activeSurprise ? activeSurprise.emoji : activeBadge?.emoji}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              {activeSurprise ? activeSurprise.label : activeBadge?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeSurprise ? activeSurprise.description : activeBadge?.description}
            </p>
            <p className="text-xs text-muted-foreground mt-3">Tap to continue</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Near-miss encouragement banner — shows inline after incorrect answers.
 */
export function NearMissEncouragement({
  accuracy,
  onRetry,
  onContinue,
}: {
  accuracy: number;
  onRetry: () => void;
  onContinue?: () => void;
}) {
  const { nearMiss, vibe } = useEngagement();
  const { message, emoji, partialXP } = nearMiss(accuracy);
  const percentDisplay = Math.round(accuracy * 100);

  if (!vibe.showEncouragement) {
    return null;
  }

  return (
    <div className="bg-token/10 border-2 border-token/30 rounded-2xl p-5 text-center space-y-3 animate-fade-in">
      <div className="text-4xl">{emoji}</div>
      <p className="text-lg font-bold text-foreground">{message}</p>
      {percentDisplay > 0 && (
        <p className="text-sm text-muted-foreground">
          {percentDisplay}% there — you earned partial credit!
        </p>
      )}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 rounded-xl bg-token text-token-foreground font-bold text-lg shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          Try Again! 🔄
        </button>
        {onContinue && (
          <button
            onClick={onContinue}
            className="px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
