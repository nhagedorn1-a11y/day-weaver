import { useState, useCallback, useEffect } from 'react';
import { UserMode, Task } from '@/types/jackos';
import { Header } from '@/components/Header';
import { NowNextLater } from '@/components/NowNextLater';
import { TokenProgress } from '@/components/TokenProgress';
import { CalmButton } from '@/components/CalmButton';
import { CalmToolkit } from '@/components/CalmToolkit';
import { TransitionScript } from '@/components/TransitionScript';
import { TaskStarter } from '@/components/TaskStarter';
import { VisualTimer } from '@/components/VisualTimer';
import { BraveryTimer } from '@/components/BraveryTimer';
import { ParentQuickActions } from '@/components/ParentQuickActions';
import { morningRoutine, afterSchoolRoutine, bedtimeRoutine, rewards } from '@/data/sampleSchedule';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

// Combine all routines for demo
const allTasks: Task[] = [...morningRoutine, ...afterSchoolRoutine, ...bedtimeRoutine];
const TOKENS_GOAL = 15;

const microGoals: Record<string, string> = {
  'reading': 'Just open the book',
  'homework': 'Just get out one pencil',
  'teeth': 'Just put toothpaste on the brush',
  'dress': 'Just pick up one piece of clothing',
  'bath': 'Just turn on the water',
  'backpack': 'Just find your bag',
};

const Index = () => {
  const [mode, setMode] = useState<UserMode>('child');
  const [tasks, setTasks] = useState<Task[]>(allTasks);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [showCalmToolkit, setShowCalmToolkit] = useState(false);
  const [showBraveryTimer, setShowBraveryTimer] = useState(false);
  
  // Task states
  const [showTaskStarter, setShowTaskStarter] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [isTaskLocked, setIsTaskLocked] = useState(false);
  
  // Transition states
  const [showTransition, setShowTransition] = useState(false);
  const [transitionSeconds, setTransitionSeconds] = useState(120);

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const nowTask = incompleteTasks[0] || null;
  const nextTask = incompleteTasks[1] || null;
  const laterTasks = incompleteTasks.slice(2);

  const currentReward = rewards[0];

  // Simulate transition warning after task starts
  useEffect(() => {
    if (showTimer && transitionSeconds > 0) {
      const timer = setInterval(() => {
        setTransitionSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showTimer, transitionSeconds]);

  // Show transition warning when time is low
  useEffect(() => {
    if (transitionSeconds <= 120 && transitionSeconds > 0 && showTimer) {
      setShowTransition(true);
    } else {
      setShowTransition(false);
    }
  }, [transitionSeconds, showTimer]);

  const handleModeSwitch = useCallback(() => {
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
      toast.success(`+${task.tokens} token${task.tokens > 1 ? 's' : ''}! 🌟`);
    }
    
    // Reset states
    setShowTimer(false);
    setShowTaskStarter(false);
    setIsTaskLocked(false);
    setTransitionSeconds(120);
  }, [tasks]);

  const handleStartMicro = useCallback(() => {
    setTokensEarned((prev) => prev + 1);
    toast.success('+1 token for starting! 🚀');
  }, []);

  const handleStartFull = useCallback(() => {
    setShowTaskStarter(false);
    setShowTimer(true);
    setIsTaskLocked(true);
    setTransitionSeconds(nowTask?.duration ? nowTask.duration * 60 : 300);
  }, [nowTask]);

  const handleTimerComplete = useCallback(() => {
    if (nowTask) {
      handleTaskComplete(nowTask.id);
    }
  }, [nowTask, handleTaskComplete]);

  const handleExtendTime = useCallback(() => {
    setTransitionSeconds((prev) => prev + 120);
    toast('Added 2 more minutes');
  }, []);

  const handleStartNow = useCallback(() => {
    setShowTransition(false);
    handleTimerComplete();
  }, [handleTimerComplete]);

  const handleBraveryComplete = useCallback(() => {
    setShowBraveryTimer(false);
    setTokensEarned((prev) => prev + 3);
    toast.success('+3 tokens for bravery! 🦁');
  }, []);

  // Determine what to show based on current state
  const renderMainContent = () => {
    // Task Starter for difficult tasks
    if (showTaskStarter && nowTask) {
      return (
        <div className="p-6">
          <TokenProgress 
            earned={tokensEarned} 
            goal={TOKENS_GOAL}
            currentReward={currentReward}
            compact
          />
          <div className="mt-6">
            <TaskStarter
              taskTitle={nowTask.title}
              microGoal={microGoals[nowTask.icon] || 'Just get started'}
              onStart={handleStartMicro}
              onFullStart={handleStartFull}
            />
          </div>
        </div>
      );
    }

    // Visual timer when task is in progress
    if (showTimer && nowTask) {
      return (
        <div className="p-6 space-y-6">
          <TokenProgress 
            earned={tokensEarned} 
            goal={TOKENS_GOAL}
            currentReward={currentReward}
            compact
          />
          
          <div className="bg-card rounded-3xl p-4 border-2 border-border">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{nowTask.icon === 'reading' ? '📖' : '⭐'}</span>
              <h2 className="text-xl font-semibold">{nowTask.title}</h2>
            </div>
            <VisualTimer
              duration={nowTask.duration ? nowTask.duration * 60 : 300}
              onComplete={handleTimerComplete}
              label="Time remaining"
              variant="circle"
              autoStart
            />
          </div>

          {/* Next preview */}
          {nextTask && (
            <div className="task-card-next opacity-50">
              <span className="hw-label">Coming up next</span>
              <p className="font-medium mt-1">{nextTask.title}</p>
            </div>
          )}
        </div>
      );
    }

    // Default: Now/Next/Later board
    return (
      <div className="p-6 space-y-6">
        <TokenProgress 
          earned={tokensEarned} 
          goal={TOKENS_GOAL}
          currentReward={currentReward}
        />

        <NowNextLater
          now={nowTask}
          next={nextTask}
          later={laterTasks}
          onComplete={(taskId) => {
            // For simple tasks, complete immediately
            // For harder tasks (reading, homework), show task starter
            const task = tasks.find(t => t.id === taskId);
            if (task && ['reading', 'homework'].includes(task.icon)) {
              setShowTaskStarter(true);
            } else {
              handleTaskComplete(taskId);
            }
          }}
          isLocked={isTaskLocked}
        />

        {/* Bravery practice button (parent mode) */}
        {mode === 'parent' && (
          <button
            onClick={() => setShowBraveryTimer(true)}
            className="w-full py-4 px-6 rounded-2xl bg-token/10 border-2 border-token/30 flex items-center justify-center gap-3 hover:bg-token/20 transition-colors"
          >
            <Shield className="w-5 h-5 text-token" />
            <span className="font-semibold text-token">Start Bravery Practice</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        mode={mode}
        onModeSwitch={handleModeSwitch}
        childName="Jack"
      />

      <main className="pb-32">
        {/* Parent quick actions */}
        {mode === 'parent' && (
          <div className="p-4 pt-2">
            <ParentQuickActions
              onExtendTime={handleExtendTime}
              onSwapOrder={() => toast('Swapped task order')}
              onPause={() => {
                setShowTimer(false);
                setIsTaskLocked(false);
                toast('Schedule paused');
              }}
              onAddNote={() => toast('Note added')}
            />
          </div>
        )}

        {renderMainContent()}
      </main>

      {/* Transition script warning */}
      {showTransition && nextTask && (
        <TransitionScript
          nextActivity={nextTask.title}
          secondsRemaining={transitionSeconds}
          script={transitionSeconds > 60 ? "Two more minutes, then we'll switch to" : "Almost time! Get ready for"}
          onExtend={handleExtendTime}
          onStartNow={handleStartNow}
          onPause={() => {
            setShowTimer(false);
            setShowTransition(false);
            setIsTaskLocked(false);
          }}
        />
      )}

      {/* Calm button - always visible */}
      <CalmButton onClick={() => setShowCalmToolkit(true)} />

      {/* Calm toolkit overlay */}
      {showCalmToolkit && (
        <CalmToolkit onClose={() => setShowCalmToolkit(false)} />
      )}

      {/* Bravery timer overlay */}
      {showBraveryTimer && (
        <BraveryTimer
          duration={30}
          copingPhrase="I can handle this feeling."
          onComplete={handleBraveryComplete}
          onCancel={() => setShowBraveryTimer(false)}
        />
      )}
    </div>
  );
};

export default Index;
