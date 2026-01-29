import { useEffect, useState } from 'react';

interface ThoughtBubbleProps {
  message: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number; // ms before appearing
  duration?: number; // ms before auto-hiding (0 = no auto-hide)
  onClose?: () => void;
  className?: string;
}

export function ThoughtBubble({ 
  message, 
  position = 'top', 
  delay = 0, 
  duration = 0,
  onClose,
  className = '' 
}: ThoughtBubbleProps) {
  const [isVisible, setIsVisible] = useState(delay === 0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (delay > 0) {
      const showTimer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(showTimer);
    }
  }, [delay]);

  useEffect(() => {
    if (duration > 0 && isVisible) {
      const hideTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, 300);
      }, duration);
      return () => clearTimeout(hideTimer);
    }
  }, [duration, isVisible, onClose]);

  if (!isVisible) return null;

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  const tailClasses = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-card',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-card',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-card',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-card',
  };

  return (
    <div 
      className={`
        absolute ${positionClasses[position]} z-50
        ${isExiting ? 'animate-fade-out' : 'animate-scale-in'}
        ${className}
      `}
    >
      <div className="relative bg-card rounded-2xl px-4 py-3 shadow-lg border border-border max-w-[200px]">
        <p className="text-sm text-foreground leading-relaxed font-medium">
          {message}
        </p>
        
        {/* Tail */}
        <div className={`absolute w-0 h-0 ${tailClasses[position]}`} />
      </div>

      <style>{`
        @keyframes fade-out {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
        .animate-fade-out {
          animation: fade-out 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
