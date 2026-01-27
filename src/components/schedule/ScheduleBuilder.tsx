import { useState } from 'react';
import { Task, TASK_ICONS } from '@/types/jackos';
import { Plus, GripVertical, Trash2, Clock, Star, X, Check, Pencil } from 'lucide-react';
import { TimeScrollPicker } from '@/components/ui/scroll-picker';
import { toast } from 'sonner';

interface ScheduleBuilderProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onClose: () => void;
}

export function ScheduleBuilder({ tasks, onTasksChange, onClose }: ScheduleBuilderProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = (icon: typeof TASK_ICONS[number]) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: icon.label,
      icon: icon.id,
      duration: 10,
      completed: false,
      tokens: 1,
      category: 'routine',
      scheduledTime: '09:00',
    };
    setEditingTask(newTask);
    setShowAddTask(false);
  };

  const handleSaveTask = (task: Task) => {
    const exists = tasks.find(t => t.id === task.id);
    if (exists) {
      onTasksChange(tasks.map(t => t.id === task.id ? task : t));
      toast.success('Activity updated');
    } else {
      onTasksChange([...tasks, task]);
      toast.success('Activity added');
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    onTasksChange(tasks.filter(t => t.id !== taskId));
    toast.success('Activity removed');
  };

  // Sort tasks by scheduled time
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.scheduledTime || !b.scheduledTime) return 0;
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });

  const getIconEmoji = (iconId: string) => {
    return TASK_ICONS.find(i => i.id === iconId)?.emoji || '⭐';
  };

  if (editingTask) {
    return (
      <TaskEditor
        task={editingTask}
        onSave={handleSaveTask}
        onCancel={() => setEditingTask(null)}
        onDelete={() => {
          handleDeleteTask(editingTask.id);
          setEditingTask(null);
        }}
        getIconEmoji={getIconEmoji}
        isNew={!tasks.find(t => t.id === editingTask.id)}
      />
    );
  }

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
          <h1 className="font-bold text-lg">Build Today's Schedule</h1>
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
        <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Pencil className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Tap</strong> any activity to edit name, time & tokens
          </p>
        </div>

        {/* Visual Timeline */}
        <div className="space-y-2">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-12 px-6 bg-card rounded-2xl border-2 border-dashed border-border">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Build Jack's day by adding activities
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
            sortedTasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-stretch gap-3"
              >
                {/* Time column */}
                <div className="w-14 flex-shrink-0 text-right pt-4">
                  <span className="font-mono text-sm font-bold text-primary">
                    {task.scheduledTime || '--:--'}
                  </span>
                </div>

                {/* Timeline connector */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-calm' : 'bg-primary'}`} />
                  {index < sortedTasks.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border" />
                  )}
                </div>

                {/* Task card - tappable to edit */}
                <div 
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                    task.completed 
                      ? 'bg-muted/50 border-border opacity-60' 
                      : 'bg-card border-border hover:border-primary/50 hover:shadow-md cursor-pointer'
                  }`}
                  onClick={() => setEditingTask(task)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <span className="text-2xl">{getIconEmoji(task.icon)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate text-lg">{task.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {task.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {task.duration}m
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-token">
                          <Star className="w-3.5 h-3.5" fill="currentColor" />
                          {task.tokens}
                        </span>
                      </div>
                    </div>
                    {/* Edit indicator */}
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Task Button - Always visible */}
        {sortedTasks.length > 0 && (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 flex items-center justify-center gap-2 text-primary font-semibold hover:bg-primary/10 active:scale-[0.99] transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Activity</span>
          </button>
        )}

        {/* Quick Templates */}
        <div className="pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Templates
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Morning', icon: '🌅', count: 5 },
              { label: 'After School', icon: '🏠', count: 4 },
              { label: 'Bedtime', icon: '🌙', count: 4 },
            ].map((template) => (
              <button
                key={template.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <span className="text-2xl">{template.icon}</span>
                <span className="text-xs font-medium">{template.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-background rounded-t-3xl safe-bottom animate-slide-up">
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

// Task Editor Sub-component
interface TaskEditorProps {
  task: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
  onDelete: () => void;
  getIconEmoji: (iconId: string) => string;
  isNew: boolean;
}

function TaskEditor({ task, onSave, onCancel, onDelete, getIconEmoji, isNew }: TaskEditorProps) {
  const [title, setTitle] = useState(task.title);
  const [duration, setDuration] = useState(task.duration || 10);
  const [tokens, setTokens] = useState(task.tokens);
  const [hours, setHours] = useState(parseInt(task.scheduledTime?.split(':')[0] || '9'));
  const [minutes, setMinutes] = useState(parseInt(task.scheduledTime?.split(':')[1] || '0'));
  const [selectedIcon, setSelectedIcon] = useState(task.icon);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter an activity name');
      return;
    }
    onSave({
      ...task,
      title: title.trim(),
      icon: selectedIcon,
      duration,
      tokens,
      scheduledTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4 safe-top">
          <button onClick={onCancel} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">{isNew ? 'Add Activity' : 'Edit Activity'}</h1>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {isNew ? 'Add' : 'Save'}
          </button>
        </div>
      </header>

      <div className="p-6 space-y-6 pb-32">
        {/* Icon selector */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <span className="text-5xl">{getIconEmoji(selectedIcon)}</span>
          </button>
          <span className="text-sm text-muted-foreground mt-2">Tap to change icon</span>
        </div>

        {showIconPicker && (
          <div className="grid grid-cols-6 gap-2 p-4 bg-muted rounded-2xl">
            {TASK_ICONS.map((icon) => (
              <button
                key={icon.id}
                onClick={() => {
                  setSelectedIcon(icon.id);
                  setTitle(icon.label);
                  setShowIconPicker(false);
                }}
                className={`p-2 rounded-xl transition-all ${
                  selectedIcon === icon.id ? 'bg-primary/20 scale-110' : 'hover:bg-background'
                }`}
              >
                <span className="text-2xl">{icon.emoji}</span>
              </button>
            ))}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            Activity Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-card border-2 border-border focus:border-primary outline-none text-lg font-semibold"
            placeholder="Activity name..."
            maxLength={50}
          />
        </div>

        {/* Time Picker */}
        <div>
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
            Scheduled Time
          </label>
          <div className="flex justify-center bg-card rounded-2xl border border-border p-4">
            <TimeScrollPicker
              minutes={hours}
              seconds={minutes}
              onMinutesChange={setHours}
              onSecondsChange={setMinutes}
              maxMinutes={23}
            />
          </div>
        </div>

        {/* Duration slider */}
        <div>
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            Duration
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="w-20 px-3 py-2 rounded-xl bg-card border border-border text-center">
              <span className="font-mono font-bold">{duration}</span>
              <span className="text-sm text-muted-foreground ml-1">min</span>
            </div>
          </div>
        </div>

        {/* Tokens */}
        <div>
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            Token Reward
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 5].map((t) => (
              <button
                key={t}
                onClick={() => setTokens(t)}
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  tokens === t 
                    ? 'bg-token text-token-foreground shadow-lg scale-105' 
                    : 'bg-card border border-border hover:border-token/50'
                }`}
              >
                <Star className="w-4 h-4" />
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Delete button - only for existing tasks */}
        {!isNew && (
          <div className="pt-4 border-t border-border">
            <button
              onClick={onDelete}
              className="w-full py-4 rounded-xl bg-destructive/10 text-destructive font-semibold flex items-center justify-center gap-2 hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Remove Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
