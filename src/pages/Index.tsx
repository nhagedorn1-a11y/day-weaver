import { useState, useCallback, useEffect } from 'react';
import { UserMode, Task, AppModule } from '@/types/jackos';
import { Header } from '@/components/Header';
import { ModuleMenu } from '@/components/ModuleMenu';
import { NowNextLater } from '@/components/NowNextLater';
import { TokenProgress } from '@/components/TokenProgress';
import { SelfTalkButtons } from '@/components/SelfTalkButtons';
import { CalmButton } from '@/components/CalmButton';
import { CalmToolkit } from '@/components/CalmToolkit';
import { TransitionScript } from '@/components/TransitionScript';
import { TaskStarter } from '@/components/TaskStarter';
import { VisualTimer } from '@/components/VisualTimer';
import { BraveryTimer } from '@/components/BraveryTimer';
import { ParentQuickActions } from '@/components/ParentQuickActions';
import { ReadingStudio } from '@/components/reading/ReadingStudio';
import { SensoryModule } from '@/components/modules/SensoryModule';
import { MathModule } from '@/components/modules/MathModule';
import { MotorModule } from '@/components/modules/MotorModule';
import { SocialModule } from '@/components/modules/SocialModule';
import { RewardsModule } from '@/components/modules/RewardsModule';
import { TimerModule } from '@/components/modules/TimerModule';
import { morningRoutine, afterSchoolRoutine, bedtimeRoutine, rewards } from '@/data/sampleSchedule';
import { appModules } from '@/data/appContent';
import { toast } from 'sonner';
import { Shield, Menu } from 'lucide-react';

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
  const [currentModule, setCurrentModule] = useState<AppModule>('today');
  const [showModuleMenu, setShowModuleMenu] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(allTasks);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [showCalmToolkit, setShowCalmToolkit] = useState(false);
  const [showBraveryTimer, setShowBraveryTimer] = useState(false);
  
  const [showTaskStarter, setShowTaskStarter] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [isTaskLocked, setIsTaskLocked] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionSeconds, setTransitionSeconds] = useState(120);

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const nowTask = incompleteTasks[0] || null;
  const nextTask = incompleteTasks[1] || null;
  const laterTasks = incompleteTasks.slice(2);
  const currentReward = rewards[0];

  useEffect(() => {
    if (showTimer && transitionSeconds > 0) {
      const timer = setInterval(() => {
        setTransitionSeconds((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showTimer, transitionSeconds]);

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
    setTasks((prev) => prev.map((task) => task.id === taskId ? { ...task, completed: true } : task));
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTokensEarned((prev) => prev + task.tokens);
      toast.success(`+${task.tokens} token${task.tokens > 1 ? 's' : ''}! 🌟`);
    }
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
    if (nowTask) handleTaskComplete(nowTask.id);
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

  const handleTokensEarned = useCallback((tokens: number) => {
    setTokensEarned((prev) => prev + tokens);
  }, []);

  const handleSpendTokens = useCallback((amount: number) => {
    setTokensEarned((prev) => Math.max(0, prev - amount));
  }, []);

  // Render module content
  const renderModuleContent = () => {
    switch (currentModule) {
      case 'timers':
        return <TimerModule onBack={() => setCurrentModule('today')} onTokensEarned={handleTokensEarned} />;
      case 'reading':
        return <ReadingStudio onBack={() => setCurrentModule('today')} onTokensEarned={handleTokensEarned} />;
      case 'sensory':
        return <SensoryModule onBack={() => setCurrentModule('today')} onTokensEarned={handleTokensEarned} />;
      case 'math':
        return <MathModule onBack={() => setCurrentModule('today')} onTokensEarned={handleTokensEarned} />;
      case 'motor':
        return <MotorModule onBack={() => setCurrentModule('today')} onTokensEarned={handleTokensEarned} />;
      case 'social':
        return <SocialModule onBack={() => setCurrentModule('today')} onTokensEarned={handleTokensEarned} />;
      case 'bravery':
        return (
          <div className="min-h-screen bg-background p-6">
            <button onClick={() => setCurrentModule('today')} className="mb-4 px-4 py-2 rounded-xl bg-secondary">← Back</button>
            <h1 className="text-2xl font-bold mb-4">Bravery Ladder</h1>
            <button onClick={() => setShowBraveryTimer(true)} className="giant-button w-full bg-token text-token-foreground">
              <Shield className="w-8 h-8" />
              <span>Start Bravery Practice</span>
            </button>
          </div>
        );
      case 'rewards':
        return <RewardsModule onBack={() => setCurrentModule('today')} tokensEarned={tokensEarned} onSpendTokens={handleSpendTokens} />;
      default:
        return null;
    }
  };

  // Non-today modules
  if (currentModule !== 'today') {
    return (
      <>
        {renderModuleContent()}
        <CalmButton onClick={() => setShowCalmToolkit(true)} />
        {showCalmToolkit && <CalmToolkit onClose={() => setShowCalmToolkit(false)} />}
        {showBraveryTimer && (
          <BraveryTimer duration={30} copingPhrase="I can handle this feeling." onComplete={handleBraveryComplete} onCancel={() => setShowBraveryTimer(false)} />
        )}
      </>
    );
  }

  // Today module content
  const renderTodayContent = () => {
    if (showTaskStarter && nowTask) {
      return (
        <div className="p-6">
          <TokenProgress earned={tokensEarned} goal={TOKENS_GOAL} currentReward={currentReward} compact />
          <div className="mt-6">
            <TaskStarter taskTitle={nowTask.title} microGoal={microGoals[nowTask.icon] || 'Just get started'} onStart={handleStartMicro} onFullStart={handleStartFull} />
          </div>
        </div>
      );
    }

    if (showTimer && nowTask) {
      return (
        <div className="p-6 space-y-6">
          <TokenProgress earned={tokensEarned} goal={TOKENS_GOAL} currentReward={currentReward} compact />
          <div className="bg-card rounded-3xl p-4 border-2 border-border">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{nowTask.icon === 'reading' ? '📖' : '⭐'}</span>
              <h2 className="text-xl font-semibold">{nowTask.title}</h2>
            </div>
            <VisualTimer duration={nowTask.duration ? nowTask.duration * 60 : 300} onComplete={handleTimerComplete} label="Time remaining" variant="circle" autoStart />
          </div>
          {nextTask && (
            <div className="task-card-next opacity-50">
              <span className="hw-label">Coming up next</span>
              <p className="font-medium mt-1">{nextTask.title}</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        <TokenProgress earned={tokensEarned} goal={TOKENS_GOAL} currentReward={currentReward} />
        
        {/* Self-talk buttons */}
        <SelfTalkButtons />

        <NowNextLater
          now={nowTask}
          next={nextTask}
          later={laterTasks}
          onComplete={(taskId) => {
            const task = tasks.find(t => t.id === taskId);
            if (task && task.icon === 'reading') {
              setCurrentModule('reading');
            } else if (task && ['homework'].includes(task.icon)) {
              setShowTaskStarter(true);
            } else {
              handleTaskComplete(taskId);
            }
          }}
          isLocked={isTaskLocked}
        />

        {/* Module shortcuts */}
        <div className="grid grid-cols-4 gap-3">
          {appModules.slice(1, 5).map((module) => (
            <button
              key={module.id}
              onClick={() => setCurrentModule(module.id)}
              className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-colors"
            >
              <span className="text-2xl">{module.icon}</span>
              <span className="text-xs font-medium">{module.title}</span>
            </button>
          ))}
        </div>

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
      {/* Header with menu button */}
      <header className="flex items-center justify-between p-4 safe-top bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-20">
        <button
          onClick={() => setShowModuleMenu(true)}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h1 className="font-semibold text-lg">Jack's Day</h1>
          <span className="hw-label">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
        </div>

        <button
          onClick={handleModeSwitch}
          className="px-3 py-2 rounded-xl bg-secondary text-xs font-medium"
        >
          {mode === 'child' ? 'Parent' : 'Child'}
        </button>
      </header>

      <main className="pb-32">
        {mode === 'parent' && (
          <div className="p-4 pt-2">
            <ParentQuickActions
              onExtendTime={handleExtendTime}
              onSwapOrder={() => toast('Swapped task order')}
              onPause={() => { setShowTimer(false); setIsTaskLocked(false); toast('Schedule paused'); }}
              onAddNote={() => toast('Note added')}
            />
          </div>
        )}
        {renderTodayContent()}
      </main>

      {showTransition && nextTask && (
        <TransitionScript
          nextActivity={nextTask.title}
          secondsRemaining={transitionSeconds}
          script={transitionSeconds > 60 ? "Two more minutes, then we'll switch to" : "Almost time! Get ready for"}
          onExtend={handleExtendTime}
          onStartNow={handleStartNow}
          onPause={() => { setShowTimer(false); setShowTransition(false); setIsTaskLocked(false); }}
        />
      )}

      <ModuleMenu
        isOpen={showModuleMenu}
        onClose={() => setShowModuleMenu(false)}
        onSelectModule={setCurrentModule}
        currentModule={currentModule}
      />

      <CalmButton onClick={() => setShowCalmToolkit(true)} />
      {showCalmToolkit && <CalmToolkit onClose={() => setShowCalmToolkit(false)} />}
      {showBraveryTimer && (
        <BraveryTimer duration={30} copingPhrase="I can handle this feeling." onComplete={handleBraveryComplete} onCancel={() => setShowBraveryTimer(false)} />
      )}
    </div>
  );
};

export default Index;
