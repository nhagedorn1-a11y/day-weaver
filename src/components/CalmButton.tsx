import { Heart } from 'lucide-react';

interface CalmButtonProps {
  onClick: () => void;
}

export function CalmButton({ onClick }: CalmButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 w-16 h-16 rounded-full bg-gradient-to-br from-calm to-calm/80 shadow-xl flex items-center justify-center hover:scale-110 hover:shadow-2xl active:scale-100 transition-all safe-bottom group"
      aria-label="Open calm toolkit"
    >
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full bg-calm/30 animate-ping opacity-75" />
      
      {/* Inner glow */}
      <div className="absolute inset-1 rounded-full bg-calm-foreground/10" />
      
      {/* Icon */}
      <Heart className="w-7 h-7 text-calm-foreground relative z-10 group-hover:scale-110 transition-transform" fill="currentColor" />
    </button>
  );
}
