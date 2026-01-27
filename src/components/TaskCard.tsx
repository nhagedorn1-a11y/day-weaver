import { Task } from '@/types/jackos';
import { Check, Clock, Star } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  variant: 'now' | 'next' | 'later';
  onComplete?: () => void;
  showTimer?: boolean;
  timeRemaining?: number;
}

const iconMap: Record<string, string> = {
  breakfast: '🍳',
  teeth: '🦷',
  dress: '👕',
  backpack: '🎒',
  reading: '📖',
  homework: '✏️',
  play: '🎮',
  bath: '🛁',
  bed: '🌙',
  calm: '🧘',
  brave: '🦁',
  snack: '🍎',
  walk: '🚶',
  music: '🎵',
  art: '🎨',
  outside: '🌳',
};

export function TaskCard({ task, variant, onComplete, showTimer, timeRemaining }: TaskCardProps) {
  const cardClasses = {
    now: 'task-card-now scale-100',
    next: 'task-card-next scale-95 opacity-90',
    later: 'task-card-later scale-90 opacity-70',
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cardClasses[variant]}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="text-4xl" role="img" aria-label={task.title}>
            {iconMap[task.icon] || '⭐'}
          </div>
          
          {/* Content */}
          <div>
            <span className="hw-label block mb-1">
              {variant === 'now' ? 'Now' : variant === 'next' ? 'Next' : 'Later'}
            </span>
            <h3 className="text-2xl font-semibold">{task.title}</h3>
            {task.duration && (
              <div className="flex items-center gap-1.5 mt-1 opacity-80">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono">{task.duration} min</span>
              </div>
            )}
          </div>
        </div>

        {/* Tokens reward indicator */}
        <div className="flex items-center gap-1.5">
          <Star className="w-5 h-5" />
          <span className="font-mono font-bold">{task.tokens}</span>
        </div>
      </div>

      {/* Timer for NOW card */}
      {variant === 'now' && showTimer && timeRemaining !== undefined && (
        <div className="mt-6 pt-4 border-t border-current/20">
          <div className="flex items-center justify-between">
            <span className="hw-label">Time Remaining</span>
            <span className="timer-display">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      )}

      {/* Complete button for NOW card */}
      {variant === 'now' && onComplete && (
        <button
          onClick={onComplete}
          className="giant-button w-full mt-6 bg-background/20 hover:bg-background/30 text-current"
        >
          <Check className="w-8 h-8" />
          <span>All Done!</span>
        </button>
      )}
    </div>
  );
}
