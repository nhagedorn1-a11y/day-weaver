import { Task, TASK_ICONS } from '@/types/jackos';
import { Clock, Star, Check, ChevronRight } from 'lucide-react';

interface VisualScheduleProps {
  tasks: Task[];
  currentTaskIndex: number;
  onTaskClick: (task: Task) => void;
  compact?: boolean;
}

export function VisualSchedule({ tasks, currentTaskIndex, onTaskClick, compact = false }: VisualScheduleProps) {
  const getIconEmoji = (iconId: string) => {
    return TASK_ICONS.find(i => i.id === iconId)?.emoji || '⭐';
  };

  // Sort by scheduled time
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.scheduledTime || !b.scheduledTime) return 0;
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {sortedTasks.map((task, index) => {
          const isCurrent = index === currentTaskIndex;
          const isCompleted = task.completed;
          
          return (
            <div
              key={task.id}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : isCompleted
                    ? 'bg-muted/50 text-muted-foreground'
                    : 'bg-card border border-border'
              }`}
            >
              {isCompleted && <Check className="w-3 h-3" />}
              <span className="text-lg">{getIconEmoji(task.icon)}</span>
              {task.scheduledTime && (
                <span className="text-xs font-mono opacity-70">{task.scheduledTime}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {sortedTasks.map((task, index) => {
        const isCurrent = index === currentTaskIndex;
        const isNext = index === currentTaskIndex + 1;
        const isCompleted = task.completed;
        const isPast = index < currentTaskIndex;

        return (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              isCurrent
                ? 'bg-gradient-to-r from-now to-primary text-now-foreground shadow-lg scale-[1.02]'
                : isNext
                  ? 'bg-next/20 border border-next/30'
                  : isCompleted
                    ? 'bg-muted/30 opacity-50'
                    : 'bg-card/50 hover:bg-card'
            }`}
          >
            {/* Time */}
            <div className={`w-14 text-center ${isCurrent ? '' : 'text-muted-foreground'}`}>
              <span className="font-mono text-sm font-bold">
                {task.scheduledTime || '--:--'}
              </span>
            </div>

            {/* Status indicator */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCompleted
                ? 'bg-calm text-calm-foreground'
                : isCurrent
                  ? 'bg-white/20'
                  : 'bg-muted'
            }`}>
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-lg">{getIconEmoji(task.icon)}</span>
              )}
            </div>

            {/* Task info */}
            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold truncate ${isCurrent ? 'text-lg' : 'text-sm'}`}>
                {task.title}
              </h4>
              {(isCurrent || isNext) && (
                <div className={`flex items-center gap-2 text-xs ${isCurrent ? 'opacity-80' : 'text-muted-foreground'}`}>
                  {task.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.duration}m
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {task.tokens}
                  </span>
                </div>
              )}
            </div>

            {/* Arrow for current */}
            {isCurrent && (
              <ChevronRight className="w-5 h-5 opacity-70" />
            )}
          </div>
        );
      })}
    </div>
  );
}
