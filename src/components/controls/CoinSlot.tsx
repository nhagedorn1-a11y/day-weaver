import { useState, useCallback } from 'react';
import { Star } from 'lucide-react';

interface CoinSlotProps {
  onTokenEarned?: () => void;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CoinSlot({ onTokenEarned, isActive = false, size = 'md' }: CoinSlotProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCoin, setShowCoin] = useState(false);

  const triggerAnimation = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowCoin(true);
    
    // Coin drop animation
    setTimeout(() => {
      setShowCoin(false);
      onTokenEarned?.();
    }, 800);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [isAnimating, onTokenEarned]);

  // Auto-trigger when active
  if (isActive && !isAnimating && !showCoin) {
    triggerAnimation();
  }

  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-24 h-28',
    lg: 'w-32 h-36',
  };

  const coinSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const slotHeights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex flex-col items-center`}>
      {/* Slot machine body */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-muted via-muted to-muted-foreground/20 border-2 border-border shadow-lg overflow-hidden">
        {/* Slot opening */}
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-[70%] ${slotHeights[size]} bg-foreground/80 rounded-sm shadow-inner`}>
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent rounded-sm" />
        </div>

        {/* Collection area */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-muted-foreground/10 rounded-xl border border-border flex items-center justify-center">
          <Star className="w-6 h-6 text-token/40" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[35%] left-2 w-1.5 h-1.5 rounded-full bg-destructive/40" />
        <div className="absolute top-[35%] right-2 w-1.5 h-1.5 rounded-full bg-calm/40" />
      </div>

      {/* Falling coin */}
      {showCoin && (
        <div 
          className={`
            absolute ${coinSizes[size]} rounded-full 
            bg-gradient-to-br from-token via-token to-amber-600 
            shadow-lg flex items-center justify-center
            border-2 border-amber-400
          `}
          style={{
            animation: 'coin-drop 0.8s ease-in forwards',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Star className="w-1/2 h-1/2 text-amber-900/60" fill="currentColor" />
        </div>
      )}

      {/* Clink effect */}
      {isAnimating && (
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-token font-bold text-sm"
          style={{ animation: 'clink-pop 0.4s ease-out 0.6s forwards', opacity: 0 }}
        >
          +1 ✨
        </div>
      )}

      <style>{`
        @keyframes coin-drop {
          0% {
            top: -20%;
            transform: translateX(-50%) rotateX(0deg);
          }
          30% {
            top: 10%;
            transform: translateX(-50%) rotateX(180deg);
          }
          50% {
            top: 15%;
            transform: translateX(-50%) rotateX(360deg);
          }
          70% {
            top: 45%;
            transform: translateX(-50%) rotateX(540deg);
            opacity: 1;
          }
          100% {
            top: 55%;
            transform: translateX(-50%) rotateX(720deg);
            opacity: 0;
          }
        }
        
        @keyframes clink-pop {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(0) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) translateY(-10px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
