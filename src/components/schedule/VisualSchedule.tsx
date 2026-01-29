import { Task, TASK_ICONS } from '@/types/jackos';
import { 
  Clock, Star, Check, ChevronRight, Sparkles, Calendar, 
  Pencil, Trash2, GripVertical, X, Save
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
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface VisualScheduleProps {
  tasks: Task[];
  currentTaskIndex: number;
  onTaskClick: (task: Task) => void;
  onTasksChange?: (tasks: Task[]) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  compact?: boolean;
}

export function VisualSchedule({ 
  tasks, 
  currentTaskIndex, 
  onTaskClick, 
  onTasksChange,
  onTaskUpdate,
  onTaskDelete,
  compact = false,
}: VisualScheduleProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      // Update scheduled times based on new order
      const updatedTasks = newTasks.map((task, idx) => ({
        ...task,
        scheduledTime: `${String(7 + Math.floor(idx / 2)).padStart(2, '0')}:${idx % 2 === 0 ? '00' : '30'}`,
      }));
      onTasksChange(updatedTasks);
      toast.success('Schedule reordered');
    }
  };

  const handleDelete = useCallback((taskId: string) => {
    if (onTaskDelete) {
      onTaskDelete(taskId);
      toast.success('Task removed');
    }
  }, [onTaskDelete]);

  const handleStartEdit = useCallback((taskId: string) => {
    setEditingId(taskId);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleSaveEdit = useCallback((taskId: string, updates: Partial<Task>) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, updates);
      toast.success('Task updated');
    }
    setEditingId(null);
  }, [onTaskUpdate]);

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

      {/* Editable Timeline with Drag-and-Drop */}
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
                isEditing={editingId === task.id}
                onTaskClick={onTaskClick}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
                onDelete={handleDelete}
                getIconEmoji={getIconEmoji}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask && (
            <div className="bg-primary text-primary-foreground shadow-2xl scale-105 p-3 rounded-xl flex items-center gap-3">
              <GripVertical className="w-4 h-4" />
              <span className="font-mono text-sm">{activeTask.scheduledTime}</span>
              <span className="text-xl">{getIconEmoji(activeTask.icon)}</span>
              <span className="font-semibold">{activeTask.title}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* All done celebration */}
      {completedCount === sortedTasks.length && sortedTasks.length > 0 && (
        <div className="text-center py-6 px-4 bg-gradient-to-r from-calm/20 to-token/20 rounded-2xl border border-calm/30">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-bold text-calm">All Done!</h3>
          <p className="text-sm text-muted-foreground">Amazing work today!</p>
        </div>
      )}

      {/* Help text */}
      <p className="text-xs text-muted-foreground text-center">
        Tap to complete • Long-press to edit • Drag to reorder
      </p>
    </div>
  );
}

// Sortable wrapper for task items with inline editing
interface SortableTaskItemProps {
  task: Task;
  index: number;
  currentTaskIndex: number;
  isEditing: boolean;
  onTaskClick: (task: Task) => void;
  onStartEdit: (taskId: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  getIconEmoji: (iconId: string) => string;
}

function SortableTaskItem({ 
  task, 
  index, 
  currentTaskIndex, 
  isEditing,
  onTaskClick, 
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  getIconEmoji 
}: SortableTaskItemProps) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTime, setEditTime] = useState(task.scheduledTime || '');
  const [editDuration, setEditDuration] = useState(task.duration?.toString() || '5');
  const [selectedIcon, setSelectedIcon] = useState(task.icon);

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
  const isNext = index === currentTaskIndex + 1;
  const isCompleted = task.completed;

  const handleSave = () => {
    onSaveEdit(task.id, {
      title: editTitle,
      scheduledTime: editTime,
      duration: parseInt(editDuration) || 5,
      icon: selectedIcon,
    });
  };

  // Inline editing mode
  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="touch-none">
        <div className="p-4 rounded-xl bg-card border-2 border-primary shadow-lg space-y-3">
          {/* Title input */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Task Name</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          {/* Time & Duration row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Time</label>
              <input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="w-24">
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Duration</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  min="1"
                  max="120"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Icon</label>
            <div className="flex flex-wrap gap-2">
              {TASK_ICONS.slice(0, 12).map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => setSelectedIcon(icon.id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                    selectedIcon === icon.id 
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {icon.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-semibold"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-secondary text-secondary-foreground font-semibold"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-destructive/10 text-destructive font-semibold"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <div
        className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
          isCurrent
            ? 'bg-gradient-to-r from-now to-primary text-now-foreground shadow-lg scale-[1.02]'
            : isNext
              ? 'bg-gradient-to-r from-next/20 to-next/10 border border-next/30'
              : isCompleted
                ? 'bg-muted/30 opacity-60'
                : 'bg-card/50 border border-border hover:border-primary/30'
        }`}
      >
        {/* Drag handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="w-6 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity"
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

        {/* Info - click to complete, double-click to edit */}
        <div 
          className="flex-1 min-w-0 cursor-pointer" 
          onClick={() => onTaskClick(task)}
          onDoubleClick={(e) => { e.stopPropagation(); onStartEdit(task.id); }}
        >
          <h4 className={`font-semibold truncate ${isCompleted ? 'line-through opacity-70' : ''}`}>
            {task.title}
          </h4>
          <div className={`flex items-center gap-2 text-xs ${isCurrent ? 'text-now-foreground/80' : 'text-muted-foreground'}`}>
            {task.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{task.duration}m</span>}
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3" fill={isCurrent ? 'currentColor' : 'none'} />
              {task.tokens}
            </span>
          </div>
        </div>

        {/* Edit button */}
        <button
          onClick={(e) => { e.stopPropagation(); onStartEdit(task.id); }}
          className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Delete button */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Status indicators */}
        {isCurrent && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Now</span>
          </div>
        )}
        {isNext && !isCompleted && (
          <ChevronRight className="w-4 h-4 text-next opacity-50" />
        )}
      </div>
    </div>
  );
}
