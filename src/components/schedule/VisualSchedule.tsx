import { Task, TASK_ICONS } from '@/types/jackos';
import { 
  Clock, Star, Check, ChevronRight, Sparkles, Calendar, 
  Pencil, Trash2, GripVertical 
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface VisualScheduleProps {
  tasks: Task[];
  currentTaskIndex: number;
  onTaskClick: (task: Task) => void;
  onTasksChange?: (tasks: Task[]) => void;
  onTaskDelete?: (taskId: string) => void;
  compact?: boolean;
  editable?: boolean;
}

export function VisualSchedule({ 
  tasks, 
  currentTaskIndex, 
  onTaskClick, 
  onTasksChange,
  onTaskDelete,
  compact = false,
  editable = false,
}: VisualScheduleProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id && onTasksChange) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      onTasksChange(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {sortedTasks.map((task, index) => {
          const isCurrent = index === currentTaskIndex;
          const isCompleted = task.completed;
          
          return (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
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

  const renderTaskItem = (task: Task, index: number, isDragOverlay = false) => {
    const isCurrent = index === currentTaskIndex;
    const isNext = index === currentTaskIndex + 1;
    const isCompleted = task.completed;

    return (
      <div
        className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
          isDragOverlay 
            ? 'bg-primary text-primary-foreground shadow-2xl scale-105'
            : isCurrent
              ? 'bg-gradient-to-r from-now to-primary text-now-foreground shadow-lg scale-[1.02]'
              : isNext
                ? 'bg-gradient-to-r from-next/20 to-next/10 border border-next/30'
                : isCompleted
                  ? 'bg-muted/30 opacity-60'
                  : 'bg-card/50 border border-transparent hover:border-border'
        }`}
      >
        {/* Drag handle (only in editable mode) */}
        {editable && !isDragOverlay && (
          <div className="w-6 flex items-center justify-center cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        )}

        {/* Time column */}
        <div className={`w-12 text-center flex-shrink-0 ${isCurrent ? '' : 'text-muted-foreground'}`}>
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
              : 'bg-muted'
        }`}>
          {isCompleted ? (
            <Check className="w-5 h-5" />
          ) : (
            <span className={`${isCurrent ? 'text-2xl' : 'text-xl'}`}>{getIconEmoji(task.icon)}</span>
          )}
        </div>

        {/* Task info */}
        <div className="flex-1 min-w-0" onClick={() => onTaskClick(task)}>
          <h4 className={`font-semibold truncate transition-all cursor-pointer ${
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

        {/* Actions */}
        {editable && !isDragOverlay && (
          <button
            onClick={(e) => { e.stopPropagation(); onTaskDelete?.(task.id); }}
            className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Status indicators */}
        {isCurrent && !editable && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Now</span>
          </div>
        )}
        {isNext && !isCompleted && !editable && (
          <ChevronRight className="w-4 h-4 text-next opacity-50" />
        )}
      </div>
    );
  };

  // Non-editable simple list
  if (!editable) {
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
        <div className="space-y-1">
          {sortedTasks.map((task, index) => (
            <div key={task.id}>
              {renderTaskItem(task, index)}
            </div>
          ))}
        </div>

        {/* All done celebration */}
        {completedCount === sortedTasks.length && sortedTasks.length > 0 && (
          <div className="text-center py-6 px-4 bg-gradient-to-r from-calm/20 to-token/20 rounded-2xl border border-calm/30">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-bold text-calm">All Done!</h3>
            <p className="text-sm text-muted-foreground">Amazing work today!</p>
          </div>
        )}
      </div>
    );
  }

  // Editable with drag-and-drop
  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Editing Schedule
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Drag to reorder
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {sortedTasks.map((task, index) => (
              <SortableTaskItem
                key={task.id}
                task={task}
                index={index}
                currentTaskIndex={currentTaskIndex}
                onTaskClick={onTaskClick}
                onTaskDelete={onTaskDelete}
                getIconEmoji={getIconEmoji}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask && renderTaskItem(activeTask, -1, true)}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Sortable wrapper for task items
interface SortableTaskItemProps {
  task: Task;
  index: number;
  currentTaskIndex: number;
  onTaskClick: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  getIconEmoji: (iconId: string) => string;
}

function SortableTaskItem({ 
  task, 
  index, 
  currentTaskIndex, 
  onTaskClick, 
  onTaskDelete,
  getIconEmoji 
}: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isCurrent = index === currentTaskIndex;
  const isCompleted = task.completed;

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <div
        className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
          isCurrent
            ? 'bg-gradient-to-r from-now to-primary text-now-foreground shadow-lg'
            : isCompleted
              ? 'bg-muted/30 opacity-60'
              : 'bg-card/50 border border-border hover:border-primary/30'
        }`}
      >
        {/* Drag handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="w-6 flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Time */}
        <div className={`w-12 text-center flex-shrink-0 ${isCurrent ? '' : 'text-muted-foreground'}`}>
          <span className="font-mono text-sm font-bold">{task.scheduledTime || '--:--'}</span>
        </div>

        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isCompleted ? 'bg-calm text-calm-foreground' : isCurrent ? 'bg-white/20' : 'bg-muted'
        }`}>
          {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-xl">{getIconEmoji(task.icon)}</span>}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onTaskClick(task)}>
          <h4 className={`font-semibold truncate ${isCompleted ? 'line-through opacity-70' : ''}`}>
            {task.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {task.duration && <span>{task.duration}m</span>}
            <span className="flex items-center gap-0.5 text-token">
              <Star className="w-3 h-3" fill="currentColor" />
              {task.tokens}
            </span>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={(e) => { e.stopPropagation(); onTaskDelete?.(task.id); }}
          className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
