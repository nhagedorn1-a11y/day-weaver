import { useState, useCallback } from 'react';
import { Volume2 } from 'lucide-react';

interface GraphemeCardProps {
  grapheme: string;
  phoneme: string;
  keyword?: string;
  keywordEmoji?: string;
  isDigraph?: boolean;
  size?: 'small' | 'medium' | 'large';
  isActive?: boolean;
  showPhoneme?: boolean;
  showKeyword?: boolean; // Show visual cue
  onTap?: () => void;
}

export function GraphemeCard({
  grapheme,
  phoneme,
  keyword,
  keywordEmoji,
  isDigraph = false,
  size = 'medium',
  isActive = false,
  showPhoneme = false,
  showKeyword = true, // Default to showing visual cues
  onTap,
}: GraphemeCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [justTapped, setJustTapped] = useState(false);

  const sizeClasses = {
    small: 'w-20 h-24',
    medium: 'w-28 h-32',
    large: 'w-36 h-44',
  };

  const letterSizes = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-5xl',
  };

  const emojiSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl',
  };

  const handleTap = useCallback(() => {
    setJustTapped(true);
    onTap?.();
    
    // Visual feedback duration
    setTimeout(() => setJustTapped(false), 400);
  }, [onTap]);

  return (
    <button
      onClick={handleTap}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
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
      `}
    >
      {/* Visual keyword emoji - top */}
      {showKeyword && keywordEmoji && (
        <div className={`${emojiSizes[size]} mb-1 ${justTapped ? 'animate-scale-in' : ''}`}>
          {keywordEmoji}
        </div>
      )}

      {/* Grapheme - center, prominent */}
      <span className={`${letterSizes[size]} ${isDigraph ? 'tracking-tighter' : ''}`}>
        {grapheme}
      </span>

      {/* Phoneme (shown on tap or always if showPhoneme) */}
      {(showPhoneme || justTapped) && (
        <span className="text-xs font-mono mt-1 opacity-70">
          {phoneme}
        </span>
      )}

      {/* Keyword text - bottom, subtle */}
      {showKeyword && keyword && (
        <span className={`text-xs text-muted-foreground mt-0.5 ${justTapped ? 'font-medium' : ''}`}>
          {keyword}
        </span>
      )}

      {/* Sound indicator */}
      <div className="absolute bottom-1.5 right-1.5">
        <Volume2 className={`w-3.5 h-3.5 ${justTapped ? 'text-primary animate-pulse' : 'opacity-20'}`} />
      </div>

      {/* Digraph indicator - two letters work together */}
      {isDigraph && (
        <div className="absolute top-1 left-1 flex items-center gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        </div>
      )}
    </button>
  );
}
