import { useEffect, useRef, useState } from 'react';

interface AmbientCanvasProps {
  tokensEarned?: number;
  isCalm?: boolean;
  currentModule?: string;
}

// Time-of-day color palette
const getTimeColors = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 9) {
    // Dawn: warm peach to soft gold
    return {
      primary: 'hsl(25, 80%, 75%)',
      secondary: 'hsl(40, 70%, 85%)',
      accent: 'hsl(350, 60%, 80%)',
    };
  } else if (hour >= 9 && hour < 12) {
    // Morning: clear sky with warm undertones
    return {
      primary: 'hsl(45, 50%, 92%)',
      secondary: 'hsl(200, 30%, 88%)',
      accent: 'hsl(150, 25%, 85%)',
    };
  } else if (hour >= 12 && hour < 17) {
    // Afternoon: bright and calm
    return {
      primary: 'hsl(45, 35%, 94%)',
      secondary: 'hsl(180, 20%, 90%)',
      accent: 'hsl(200, 25%, 88%)',
    };
  } else if (hour >= 17 && hour < 20) {
    // Evening: golden hour warmth
    return {
      primary: 'hsl(30, 60%, 82%)',
      secondary: 'hsl(20, 50%, 80%)',
      accent: 'hsl(350, 40%, 78%)',
    };
  } else {
    // Night: deep calm blues
    return {
      primary: 'hsl(220, 30%, 25%)',
      secondary: 'hsl(240, 25%, 30%)',
      accent: 'hsl(260, 30%, 35%)',
    };
  }
};

// Module-specific color overlays
const getModuleColors = (module?: string) => {
  switch (module) {
    case 'reading':
      return { overlay: 'hsl(45, 30%, 95%)', pattern: 'paper' };
    case 'bravery':
      return { overlay: 'hsl(35, 70%, 90%)', pattern: 'rays' };
    case 'sensory':
      return { overlay: 'hsl(180, 30%, 92%)', pattern: 'waves' };
    case 'math':
      return { overlay: 'hsl(220, 25%, 94%)', pattern: 'grid' };
    case 'motor':
      return { overlay: 'hsl(100, 25%, 92%)', pattern: 'dots' };
    default:
      return { overlay: 'transparent', pattern: 'none' };
  }
};

export function AmbientCanvas({ tokensEarned = 0, isCalm = false, currentModule }: AmbientCanvasProps) {
  const [colors, setColors] = useState(getTimeColors());
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Update colors every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setColors(getTimeColors());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Generate sparkle particles based on tokens
  useEffect(() => {
    const count = Math.min(tokensEarned, 20);
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
    }));
    setParticles(newParticles);
  }, [tokensEarned]);

  const moduleColors = getModuleColors(currentModule);

  return (
    <div 
      ref={canvasRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-all duration-[2000ms]"
      style={{
        background: isCalm 
          ? `linear-gradient(180deg, hsl(150, 30%, 92%) 0%, hsl(150, 25%, 88%) 100%)`
          : `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
      }}
    >
      {/* Module overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ backgroundColor: moduleColors.overlay, opacity: moduleColors.overlay !== 'transparent' ? 0.5 : 0 }}
      />

      {/* Gradient orbs - subtle floating shapes */}
      <div 
        className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-30 blur-3xl transition-all duration-[3000ms]"
        style={{ 
          background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute bottom-[-30%] left-[-20%] w-[70%] h-[70%] rounded-full opacity-20 blur-3xl transition-all duration-[3000ms]"
        style={{ 
          background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`,
          animation: 'float 25s ease-in-out infinite reverse',
        }}
      />

      {/* Calm mode breathing overlay */}
      {isCalm && (
        <div 
          className="absolute inset-0 bg-gradient-to-b from-calm/20 to-calm/40 animate-breathe"
          style={{ animationDuration: '6s' }}
        />
      )}

      {/* Token sparkles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1.5 h-1.5 rounded-full bg-token/60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `twinkle 3s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Subtle grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(2%, 3%) rotate(1deg); }
          50% { transform: translate(-1%, 5%) rotate(-1deg); }
          75% { transform: translate(-3%, 2%) rotate(0.5deg); }
        }
      `}</style>
    </div>
  );
}
