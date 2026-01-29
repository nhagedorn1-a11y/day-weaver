import { useState, useCallback } from 'react';
import { Task, TASK_ICONS } from '@/types/jackos';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, GripVertical, Trash2, Clock, Star, X, Check, Pencil, 
  ChevronDown, ChevronUp 
} from 'lucide-react';
import { TimeScrollPicker } from '@/components/ui/scroll-picker';
import { toast } from 'sonner';

interface ScheduleBuilderProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onClose: () => void;
}

export function ScheduleBuilder({ tasks, onTasksChange, onClose }: ScheduleBuilderProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      
      // Reassign scheduled times based on new order
      const reorderedTasks = newTasks.map((task, index) => ({
        ...task,
        scheduledTime: getTimeForIndex(index, newTasks.length),
      }));
      
      onTasksChange(reorderedTasks);
      toast.success('Schedule reordered');
    }
  };

  // Generate reasonable time slots based on position
  const getTimeForIndex = (index: number, total: number): string => {
    const startHour = 7; // 7 AM
    const endHour = 20; // 8 PM
    const slot = startHour + Math.floor((endHour - startHour) * (index / Math.max(total - 1, 1)));
    return `${slot.toString().padStart(2, '0')}:00`;
  };

  const handleAddTask = (icon: typeof TASK_ICONS[number]) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: icon.label,
      icon: icon.id,
      duration: 10,
      completed: false,
      tokens: 1,
      category: 'routine',
      scheduledTime: getTimeForIndex(tasks.length, tasks.length + 1),
    };
    onTasksChange([...tasks, newTask]);
    setShowAddTask(false);
    setEditingTaskId(newTask.id);
    toast.success('Activity added');
  };

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    onTasksChange(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  }, [tasks, onTasksChange]);

  const handleDeleteTask = useCallback((taskId: string) => {
    onTasksChange(tasks.filter(t => t.id !== taskId));
    setEditingTaskId(null);
    toast.success('Activity removed');
  }, [tasks, onTasksChange]);

  const getIconEmoji = (iconId: string) => {
    return TASK_ICONS.find(i => i.id === iconId)?.emoji || '⭐';
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4 safe-top">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Build Schedule</h1>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
          >
            Done
          </button>
        </div>
      </header>

      <div className="p-4 space-y-4 pb-32">
        {/* Instructions */}
        <div className="bg-muted/50 rounded-xl p-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <GripVertical className="w-4 h-4 text-primary" />
          </div>
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">Drag</strong> to reorder • 
            <strong className="text-foreground"> Tap</strong> to edit • 
            <strong className="text-foreground"> Swipe</strong> to delete
          </div>
        </div>

        {/* Empty state */}
        {tasks.length === 0 ? (
          <div className="text-center py-12 px-6 bg-card rounded-2xl border-2 border-dashed border-border">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Build the day by adding activities
            </p>
            <button
              onClick={() => setShowAddTask(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add First Activity
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <SortableTaskCard
                    key={task.id}
                    task={task}
                    isEditing={editingTaskId === task.id}
                    onEdit={() => setEditingTaskId(editingTaskId === task.id ? null : task.id)}
                    onUpdate={handleUpdateTask}
                    onDelete={() => handleDeleteTask(task.id)}
                    getIconEmoji={getIconEmoji}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Drag overlay - shows the card being dragged */}
            <DragOverlay>
              {activeTask && (
                <div className="p-4 rounded-2xl bg-primary text-primary-foreground shadow-2xl scale-105 opacity-90">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getIconEmoji(activeTask.icon)}</span>
                    <span className="font-semibold">{activeTask.title}</span>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}

        {/* Add Task Button */}
        {tasks.length > 0 && (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 flex items-center justify-center gap-2 text-primary font-semibold hover:bg-primary/10 active:scale-[0.99] transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Activity</span>
          </button>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={() => setShowAddTask(false)}>
          <div 
            className="w-full bg-background rounded-t-3xl safe-bottom animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-lg">Choose Activity</h3>
              <button
                onClick={() => setShowAddTask(false)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto">
              {TASK_ICONS.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => handleAddTask(icon)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary hover:bg-primary/5 transition-all active:scale-95"
                >
                  <span className="text-3xl">{icon.emoji}</span>
                  <span className="text-xs font-medium text-center">{icon.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Sortable Task Card ===
interface SortableTaskCardProps {
  task: Task;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (task: Task) => void;
  onDelete: () => void;
  getIconEmoji: (iconId: string) => string;
}

function SortableTaskCard({ task, isEditing, onEdit, onUpdate, onDelete, getIconEmoji }: SortableTaskCardProps) {
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

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <div
        className={`rounded-2xl border-2 overflow-hidden transition-all ${
          isEditing 
            ? 'bg-card border-primary shadow-lg' 
            : 'bg-card border-border hover:border-primary/30'
        }`}
      >
        {/* Main row */}
        <div className="flex items-center gap-2 p-3">
          {/* Drag handle */}
          <div 
            {...attributes} 
            {...listeners}
            className="w-8 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">{getIconEmoji(task.icon)}</span>
          </div>

          {/* Info - tappable to expand */}
          <div 
            className="flex-1 min-w-0 cursor-pointer"
            onClick={onEdit}
          >
            <h4 className="font-semibold truncate">{task.title}</h4>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-mono">{task.scheduledTime || '--:--'}</span>
              {task.duration && (
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  {task.duration}m
                </span>
              )}
              <span className="flex items-center gap-0.5 text-token">
                <Star className="w-3 h-3" fill="currentColor" />
                {task.tokens}
              </span>
            </div>
          </div>

          {/* Expand/Delete buttons */}
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"
          >
            {isEditing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded edit panel */}
        {isEditing && (
          <InlineTaskEditor 
            task={task} 
            onUpdate={onUpdate} 
            getIconEmoji={getIconEmoji}
          />
        )}
      </div>
    </div>
  );
}

// === Inline Task Editor ===
interface InlineTaskEditorProps {
  task: Task;
  onUpdate: (task: Task) => void;
  getIconEmoji: (iconId: string) => string;
}

function InlineTaskEditor({ task, onUpdate, getIconEmoji }: InlineTaskEditorProps) {
  const [title, setTitle] = useState(task.title);
  const [duration, setDuration] = useState(task.duration || 10);
  const [tokens, setTokens] = useState(task.tokens);
  const [selectedIcon, setSelectedIcon] = useState(task.icon);
  const [showIconPicker, setShowIconPicker] = useState(false);
  
  // Parse time
  const [hours, setHours] = useState(parseInt(task.scheduledTime?.split(':')[0] || '9'));
  const [minutes, setMinutes] = useState(parseInt(task.scheduledTime?.split(':')[1] || '0'));

  const handleSave = () => {
    if (!title.trim()) return;
    
    onUpdate({
      ...task,
      title: title.trim(),
      icon: selectedIcon,
      duration,
      tokens,
      scheduledTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    });
  };

  // Auto-save on blur
  const handleBlur = () => {
    handleSave();
  };

  return (
    <div className="border-t border-border p-4 space-y-4 bg-muted/30">
      {/* Icon picker */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowIconPicker(!showIconPicker)}
          className="w-14 h-14 rounded-xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center hover:bg-primary/20"
        >
          <span className="text-3xl">{getIconEmoji(selectedIcon)}</span>
        </button>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          className="flex-1 px-3 py-2 rounded-xl bg-card border border-border focus:border-primary outline-none font-semibold"
          placeholder="Activity name..."
          maxLength={50}
        />
      </div>

      {showIconPicker && (
        <div className="grid grid-cols-6 gap-2 p-3 bg-card rounded-xl border border-border">
          {TASK_ICONS.map((icon) => (
            <button
              key={icon.id}
              onClick={() => {
                setSelectedIcon(icon.id);
                setTitle(icon.label);
                setShowIconPicker(false);
                handleSave();
              }}
              className={`p-2 rounded-lg transition-all ${
                selectedIcon === icon.id ? 'bg-primary/20 scale-110' : 'hover:bg-muted'
              }`}
            >
              <span className="text-xl">{icon.emoji}</span>
            </button>
          ))}
        </div>
      )}

      {/* Time */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Time</label>
        <div className="flex justify-center bg-card rounded-xl border border-border p-3">
          <TimeScrollPicker
            minutes={hours}
            seconds={minutes}
            onMinutesChange={(h) => { setHours(h); }}
            onSecondsChange={(m) => { setMinutes(m); }}
            maxMinutes={23}
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Duration</label>
        <div className="flex gap-2">
          {[5, 10, 15, 20, 30, 45, 60].map((d) => (
            <button
              key={d}
              onClick={() => { setDuration(d); handleSave(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                duration === d 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border hover:border-primary/50'
              }`}
            >
              {d}m
            </button>
          ))}
        </div>
      </div>

      {/* Tokens */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Tokens</label>
        <div className="flex gap-2">
          {[1, 2, 3, 5].map((t) => (
            <button
              key={t}
              onClick={() => { setTokens(t); handleSave(); }}
              className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                tokens === t 
                  ? 'bg-token text-token-foreground' 
                  : 'bg-card border border-border hover:border-token/50'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
