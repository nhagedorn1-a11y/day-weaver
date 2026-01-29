import { useMemo } from 'react';

type Mood = 'neutral' | 'encouraging' | 'celebrating' | 'calm' | 'curious' | 'sleeping';

interface LittleGuyProps {
  mood?: Mood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export function LittleGuy({ mood = 'neutral', size = 'md', className = '', animate = true }: LittleGuyProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const eyeStyle = useMemo(() => {
    switch (mood) {
      case 'celebrating':
        return { transform: 'scaleY(0.3)', transition: 'transform 0.3s' }; // Happy squint
      case 'calm':
        return { transform: 'scaleY(0.5)', transition: 'transform 0.3s' }; // Relaxed
      case 'curious':
        return { transform: 'scale(1.1)', transition: 'transform 0.3s' }; // Wide eyes
      case 'sleeping':
        return { transform: 'scaleY(0.1)', transition: 'transform 0.3s' }; // Closed
      case 'encouraging':
        return { transform: 'translateY(-1px)', transition: 'transform 0.3s' }; // Looking up
      default:
        return { transition: 'transform 0.3s' };
    }
  }, [mood]);

  const bodyAnimation = useMemo(() => {
    if (!animate) return '';
    switch (mood) {
      case 'celebrating':
        return 'animate-bounce-gentle';
      case 'calm':
        return 'animate-breathe';
      case 'curious':
        return 'animate-wiggle';
      case 'sleeping':
        return '';
      default:
        return 'animate-float';
    }
  }, [mood, animate]);

  // Body color based on mood
  const bodyColor = useMemo(() => {
    switch (mood) {
      case 'celebrating':
        return 'bg-gradient-to-br from-token to-token/80';
      case 'calm':
        return 'bg-gradient-to-br from-calm to-calm/80';
      case 'encouraging':
        return 'bg-gradient-to-br from-primary to-primary/80';
      default:
        return 'bg-gradient-to-br from-muted-foreground/60 to-muted-foreground/40';
    }
  }, [mood]);

  return (
    <div className={`relative ${sizeClasses[size]} ${bodyAnimation} ${className}`}>
      {/* Main body - simple circle */}
      <div className={`w-full h-full rounded-full ${bodyColor} shadow-lg flex items-center justify-center`}>
        {/* Face container */}
        <div className="relative w-[60%] h-[40%] flex items-center justify-center gap-[25%]">
          {/* Left eye */}
          <div 
            className="w-[18%] h-[60%] rounded-full bg-white/90"
            style={eyeStyle}
          >
            {mood !== 'sleeping' && (
              <div className="absolute top-[20%] left-[50%] w-[40%] h-[40%] rounded-full bg-foreground/80 transform -translate-x-1/2" />
            )}
          </div>
          
          {/* Right eye */}
          <div 
            className="w-[18%] h-[60%] rounded-full bg-white/90"
            style={eyeStyle}
          >
            {mood !== 'sleeping' && (
              <div className="absolute top-[20%] left-[50%] w-[40%] h-[40%] rounded-full bg-foreground/80 transform -translate-x-1/2" />
            )}
          </div>
        </div>
      </div>

      {/* Blush for celebrating */}
      {mood === 'celebrating' && (
        <>
          <div className="absolute left-[10%] top-[55%] w-[15%] h-[10%] rounded-full bg-pink-300/50" />
          <div className="absolute right-[10%] top-[55%] w-[15%] h-[10%] rounded-full bg-pink-300/50" />
        </>
      )}

      {/* Sleep "zzz" */}
      {mood === 'sleeping' && (
        <div className="absolute -right-2 -top-2 text-xs font-mono text-muted-foreground opacity-60">
          z<span className="text-[10px]">z</span><span className="text-[8px]">z</span>
        </div>
      )}

      {/* Sparkle for celebrating */}
      {mood === 'celebrating' && (
        <div className="absolute -right-1 -top-1 w-3 h-3">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-token animate-pulse">
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}
