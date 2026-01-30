import { useMemo } from 'react';

type Mood = 'neutral' | 'encouraging' | 'celebrating' | 'calm' | 'curious' | 'sleeping';

interface LittleGuyProps {
  mood?: Mood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export function LittleGuy({ mood = 'neutral', size = 'md', className = '' }: LittleGuyProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const eyeStyle = useMemo(() => {
    switch (mood) {
      case 'celebrating':
        return { transform: 'scaleY(0.3)', transition: 'transform 0.15s' }; // Happy squint
      case 'calm':
        return { transform: 'scaleY(0.5)', transition: 'transform 0.15s' }; // Relaxed
      case 'curious':
        return { transform: 'scale(1.1)', transition: 'transform 0.15s' }; // Wide eyes
      case 'sleeping':
        return { transform: 'scaleY(0.1)', transition: 'transform 0.15s' }; // Closed
      case 'encouraging':
        return { transform: 'translateY(-1px)', transition: 'transform 0.15s' }; // Looking up
      default:
        return { transition: 'transform 0.15s' };
    }
  }, [mood]);

  // Body color based on mood - flat colors only
  const bodyColor = useMemo(() => {
    switch (mood) {
      case 'celebrating':
        return 'bg-token';
      case 'calm':
        return 'bg-calm';
      case 'encouraging':
        return 'bg-primary';
      default:
        return 'bg-muted-foreground/60';
    }
  }, [mood]);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Main body - simple circle */}
      <div className={`w-full h-full rounded ${bodyColor} shadow-lg flex items-center justify-center`}>
        {/* Face container */}
        <div className="relative w-[60%] h-[40%] flex items-center justify-center gap-[25%]">
          {/* Left eye */}
          <div 
            className="w-[18%] h-[60%] rounded bg-white/90"
            style={eyeStyle}
          >
            {mood !== 'sleeping' && (
              <div className="absolute top-[20%] left-[50%] w-[40%] h-[40%] rounded bg-foreground/80 transform -translate-x-1/2" />
            )}
          </div>
          
          {/* Right eye */}
          <div 
            className="w-[18%] h-[60%] rounded bg-white/90"
            style={eyeStyle}
          >
            {mood !== 'sleeping' && (
              <div className="absolute top-[20%] left-[50%] w-[40%] h-[40%] rounded bg-foreground/80 transform -translate-x-1/2" />
            )}
          </div>
        </div>
      </div>

      {/* Sleep "zzz" */}
      {mood === 'sleeping' && (
        <div className="absolute -right-2 -top-2 text-xs font-mono text-muted-foreground opacity-60">
          z<span className="text-[10px]">z</span><span className="text-[8px]">z</span>
        </div>
      )}
    </div>
  );
}
