import { useMemo } from 'react';

interface MoodGradientProps {
  mood?: 'calm' | 'focused' | 'celebrating' | 'transitioning';
  intensity?: number; // 0-1
  className?: string;
}

export function MoodGradient({ mood = 'focused', intensity = 0.5, className = '' }: MoodGradientProps) {
  const gradientStyle = useMemo(() => {
    const baseOpacity = intensity * 0.3;
    
    switch (mood) {
      case 'calm':
        return {
          background: `linear-gradient(135deg, 
            hsla(150, 30%, 45%, ${baseOpacity}) 0%, 
            hsla(150, 25%, 50%, ${baseOpacity * 0.5}) 50%,
            transparent 100%)`,
        };
      case 'celebrating':
        return {
          background: `linear-gradient(135deg, 
            hsla(45, 95%, 55%, ${baseOpacity}) 0%, 
            hsla(30, 80%, 60%, ${baseOpacity * 0.5}) 50%,
            transparent 100%)`,
        };
      case 'transitioning':
        return {
          background: `linear-gradient(135deg, 
            hsla(200, 25%, 50%, ${baseOpacity}) 0%, 
            hsla(180, 20%, 55%, ${baseOpacity * 0.5}) 50%,
            transparent 100%)`,
        };
      case 'focused':
      default:
        return {
          background: `linear-gradient(135deg, 
            hsla(15, 60%, 55%, ${baseOpacity * 0.3}) 0%, 
            transparent 100%)`,
        };
    }
  }, [mood, intensity]);

  return (
    <div 
      className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${className}`}
      style={gradientStyle}
    />
  );
}
