import { Heart } from 'lucide-react';

interface CalmButtonProps {
  onClick: () => void;
}

export function CalmButton({ onClick }: CalmButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 w-16 h-16 rounded-full bg-calm shadow-lg flex items-center justify-center hover:scale-110 active:scale-100 transition-transform safe-bottom"
      aria-label="Open calm toolkit"
    >
      <Heart className="w-7 h-7 text-calm-foreground" />
    </button>
  );
}
