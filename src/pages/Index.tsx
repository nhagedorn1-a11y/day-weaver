import { useState, useCallback } from 'react';
import { UserMode, Task } from '@/types/jackos';
import { Header } from '@/components/Header';
import { TodayBoard } from '@/components/TodayBoard';
import { CalmButton } from '@/components/CalmButton';
import { CalmToolkit } from '@/components/CalmToolkit';
import { ParentQuickActions } from '@/components/ParentQuickActions';
import { morningRoutine, afterSchoolRoutine, bedtimeRoutine } from '@/data/sampleSchedule';
import { toast } from 'sonner';

// Combine all routines for demo
const allTasks: Task[] = [...morningRoutine, ...afterSchoolRoutine, ...bedtimeRoutine];
const TOKENS_GOAL = 15;

const Index = () => {
  const [mode, setMode] = useState<UserMode>('child');
  const [tasks, setTasks] = useState<Task[]>(allTasks);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [showCalmToolkit, setShowCalmToolkit] = useState(false);

  const handleModeSwitch = useCallback(() => {
    // In a real app, this would require PIN/auth
    setMode((prev) => (prev === 'child' ? 'parent' : 'child'));
    toast(mode === 'child' ? 'Switched to Parent Mode' : 'Switched to Child Mode');
  }, [mode]);

  const handleTaskComplete = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
    
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTokensEarned((prev) => prev + task.tokens);
      toast.success(`+${task.tokens} token${task.tokens > 1 ? 's' : ''}! Great job! 🌟`);
    }
  }, [tasks]);

  const handleExtendTime = useCallback(() => {
    toast('Added 2 more minutes');
  }, []);

  const handleSwapOrder = useCallback(() => {
    toast('Swapped task order');
  }, []);

  const handlePause = useCallback(() => {
    toast('Schedule paused');
  }, []);

  const handleAddNote = useCallback(() => {
    toast('Note added');
  }, []);

  const incompleteTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="min-h-screen bg-background">
      <Header
        mode={mode}
        onModeSwitch={handleModeSwitch}
        childName="Jack"
      />

      <main className="pb-24">
        {/* Parent quick actions */}
        {mode === 'parent' && (
          <div className="p-4 pt-2">
            <ParentQuickActions
              onExtendTime={handleExtendTime}
              onSwapOrder={handleSwapOrder}
              onPause={handlePause}
              onAddNote={handleAddNote}
            />
          </div>
        )}

        {/* Today Board */}
        <TodayBoard
          tasks={incompleteTasks}
          onTaskComplete={handleTaskComplete}
          tokensEarned={tokensEarned}
          tokensGoal={TOKENS_GOAL}
        />
      </main>

      {/* Calm button - always visible */}
      <CalmButton onClick={() => setShowCalmToolkit(true)} />

      {/* Calm toolkit overlay */}
      {showCalmToolkit && (
        <CalmToolkit onClose={() => setShowCalmToolkit(false)} />
      )}
    </div>
  );
};

export default Index;
