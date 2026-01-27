import { useState, useCallback } from 'react';
import { Volume2 } from 'lucide-react';

interface GraphemeCardProps {
  grapheme: string;
  phoneme: string;
  isDigraph?: boolean;
  size?: 'small' | 'medium' | 'large';
  isActive?: boolean;
  showPhoneme?: boolean;
  onTap?: () => void;
}

export function GraphemeCard({
  grapheme,
  phoneme,
  isDigraph = false,
  size = 'medium',
  isActive = false,
  showPhoneme = false,
  onTap,
}: GraphemeCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [justTapped, setJustTapped] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-20 text-2xl',
    medium: 'w-24 h-28 text-4xl',
    large: 'w-32 h-36 text-5xl',
  };

  const handleTap = useCallback(() => {
    setJustTapped(true);
    onTap?.();
    
    // Visual feedback
    setTimeout(() => setJustTapped(false), 300);
  }, [onTap]);

  return (
    <button
      onClick={handleTap}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative flex flex-col items-center justify-center
        rounded-2xl border-4 font-display font-bold
        transition-all duration-150
        ${sizeClasses[size]}
        ${isActive 
          ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105' 
          : 'bg-card text-foreground border-border hover:border-primary/50'
        }
        ${isPressed ? 'scale-95' : ''}
        ${justTapped ? 'ring-4 ring-primary/30' : ''}
        ${isDigraph ? 'tracking-tight' : ''}
      `}
    >
      {/* Grapheme */}
      <span className={isDigraph ? 'tracking-tighter' : ''}>
        {grapheme}
      </span>

      {/* Phoneme (shown on tap or always if showPhoneme) */}
      {(showPhoneme || justTapped) && (
        <span className="text-sm font-mono mt-1 opacity-70">
          {phoneme}
        </span>
      )}

      {/* Sound indicator */}
      <div className="absolute bottom-2 right-2">
        <Volume2 className={`w-4 h-4 ${justTapped ? 'text-primary animate-pulse' : 'opacity-30'}`} />
      </div>

      {/* Digraph indicator */}
      {isDigraph && (
        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-primary/50" />
      )}
    </button>
  );
}
