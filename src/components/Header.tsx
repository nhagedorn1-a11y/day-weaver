import { UserMode } from '@/types/jackos';
import { Settings, User } from 'lucide-react';

interface HeaderProps {
  mode: UserMode;
  onModeSwitch: () => void;
  childName?: string;
}

export function Header({ mode, onModeSwitch, childName = 'Jack' }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 safe-top bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">J</span>
        </div>
        <div>
          <h1 className="font-semibold text-lg leading-tight">
            {mode === 'child' ? `${childName}'s Day` : 'Parent View'}
          </h1>
          <span className="hw-label">
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </span>
        </div>
      </div>

      <button
        onClick={onModeSwitch}
        className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        aria-label={mode === 'child' ? 'Switch to parent mode' : 'Switch to child mode'}
      >
        {mode === 'child' ? (
          <Settings className="w-5 h-5 text-secondary-foreground" />
        ) : (
          <User className="w-5 h-5 text-secondary-foreground" />
        )}
      </button>
    </header>
  );
}
