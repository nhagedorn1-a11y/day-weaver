import { Task, TASK_ICONS } from '@/types/jackos';
import { Clock, Star, Check, ChevronRight, Sparkles, Calendar } from 'lucide-react';

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

  const completedCount = sortedTasks.filter(t => t.completed).length;
  const progress = sortedTasks.length > 0 ? (completedCount / sortedTasks.length) * 100 : 0;

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {sortedTasks.map((task, index) => {
          const isCurrent = index === currentTaskIndex;
          const isCompleted = task.completed;
          
          return (
            <div
              key={task.id}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-all touch-bounce ${
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

  // Empty state
  if (sortedTasks.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-card/50 rounded-2xl border-2 border-dashed border-border">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No Schedule Yet</h3>
        <p className="text-muted-foreground text-sm">
          Switch to Parent mode to build today's schedule
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Today's Schedule
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full bg-calm transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {completedCount}/{sortedTasks.length}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-1 stagger-children">
        {sortedTasks.map((task, index) => {
          const isCurrent = index === currentTaskIndex;
          const isNext = index === currentTaskIndex + 1;
          const isCompleted = task.completed;

          return (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all touch-bounce ${
                isCurrent
                  ? 'bg-gradient-to-r from-now to-primary text-now-foreground shadow-lg scale-[1.02]'
                  : isNext
                    ? 'bg-gradient-to-r from-next/20 to-next/10 border border-next/30 hover:border-next/50'
                    : isCompleted
                      ? 'bg-muted/30 opacity-60 hover:opacity-80'
                      : 'bg-card/50 hover:bg-card hover:shadow-sm border border-transparent hover:border-border'
              }`}
            >
              {/* Time column */}
              <div className={`w-14 text-center flex-shrink-0 ${isCurrent ? '' : 'text-muted-foreground'}`}>
                <span className={`font-mono font-bold ${isCurrent ? 'text-base' : 'text-sm'}`}>
                  {task.scheduledTime || '--:--'}
                </span>
              </div>

              {/* Status/icon indicator */}
              <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                isCompleted
                  ? 'bg-calm text-calm-foreground'
                  : isCurrent
                    ? 'bg-white/20 shadow-inner'
                    : 'bg-muted group-hover:bg-primary/10'
              }`}>
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className={`${isCurrent ? 'text-2xl' : 'text-xl'}`}>{getIconEmoji(task.icon)}</span>
                )}
                
                {/* Current indicator dot */}
                {isCurrent && (
                  <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-now animate-pulse" />
                  </div>
                )}
              </div>

              {/* Task info */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold truncate transition-all ${
                  isCurrent ? 'text-lg' : isCompleted ? 'text-sm line-through opacity-70' : 'text-sm'
                }`}>
                  {task.title}
                </h4>
                <div className={`flex items-center gap-3 text-xs ${
                  isCurrent ? 'text-now-foreground/80' : 'text-muted-foreground'
                }`}>
                  {task.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.duration}m
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" fill={isCurrent ? 'currentColor' : 'none'} />
                    {task.tokens}
                  </span>
                </div>
              </div>

              {/* Action indicator */}
              {isCurrent && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">Now</span>
                </div>
              )}
              {isNext && !isCompleted && (
                <ChevronRight className="w-4 h-4 text-next opacity-50 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          );
        })}
      </div>

      {/* All done celebration */}
      {completedCount === sortedTasks.length && sortedTasks.length > 0 && (
        <div className="text-center py-6 px-4 bg-gradient-to-r from-calm/20 to-token/20 rounded-2xl border border-calm/30 animate-success-pop">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-bold text-calm">All Done!</h3>
          <p className="text-sm text-muted-foreground">Amazing work today!</p>
        </div>
      )}
    </div>
  );
}
