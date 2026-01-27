import { useState } from 'react';
import { Task, TASK_ICONS } from '@/types/jackos';
import { Plus, GripVertical, Trash2, Clock, Star, X, Check } from 'lucide-react';
import { TimeScrollPicker } from '@/components/ui/scroll-picker';

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
    } else {
      onTasksChange([...tasks, task]);
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    onTasksChange(tasks.filter(t => t.id !== taskId));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newTasks = [...tasks];
    const [moved] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, moved);
    onTasksChange(newTasks);
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
        getIconEmoji={getIconEmoji}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
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

      <div className="p-4 space-y-4">
        {/* Visual Timeline */}
        <div className="space-y-2">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground text-sm">
                Tap the + button to start building the day
              </p>
            </div>
          ) : (
            sortedTasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-stretch gap-3"
              >
                {/* Time column */}
                <div className="w-16 flex-shrink-0 text-right pt-4">
                  <span className="font-mono text-sm font-semibold text-muted-foreground">
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

                {/* Task card */}
                <div 
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
                    task.completed 
                      ? 'bg-muted/50 border-border opacity-60' 
                      : 'bg-card border-border hover:border-primary/50 cursor-pointer'
                  }`}
                  onClick={() => !task.completed && setEditingTask(task)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                      <span className="text-2xl">{getIconEmoji(task.icon)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{task.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => setShowAddTask(true)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center gap-2 text-primary font-semibold hover:bg-primary/10 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Activity</span>
        </button>

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
  getIconEmoji: (iconId: string) => string;
}

function TaskEditor({ task, onSave, onCancel, getIconEmoji }: TaskEditorProps) {
  const [title, setTitle] = useState(task.title);
  const [duration, setDuration] = useState(task.duration || 10);
  const [tokens, setTokens] = useState(task.tokens);
  const [hours, setHours] = useState(parseInt(task.scheduledTime?.split(':')[0] || '9'));
  const [minutes, setMinutes] = useState(parseInt(task.scheduledTime?.split(':')[1] || '0'));
  const [selectedIcon, setSelectedIcon] = useState(task.icon);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSave = () => {
    onSave({
      ...task,
      title,
      icon: selectedIcon,
      duration,
      tokens,
      scheduledTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4 safe-top">
          <button onClick={onCancel} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Edit Activity</h1>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
        </div>
      </header>

      <div className="p-6 space-y-6">
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
              className="flex-1 h-2 rounded-full appearance-none bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
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
      </div>
    </div>
  );
}
