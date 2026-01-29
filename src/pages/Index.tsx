import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { WritingModule } from '@/components/modules/WritingModule';
import { ScienceModule } from '@/components/modules/ScienceModule';
import { MotorModule } from '@/components/modules/MotorModule';
import { SocialModule } from '@/components/modules/SocialModule';
import { RewardsModule } from '@/components/modules/RewardsModule';
import { TimerModule } from '@/components/modules/TimerModule';
import { ScheduleBuilder } from '@/components/schedule/ScheduleBuilder';
import { VisualSchedule } from '@/components/schedule/VisualSchedule';
import { GoogleCalendarSync } from '@/components/GoogleCalendarSync';
import { AmbientCanvas } from '@/components/ambient/AmbientCanvas';
import { StatusStrip } from '@/components/controls/StatusStrip';
import { CompanionProvider, useCompanion } from '@/components/companion/CompanionProvider';
import { DailySummary } from '@/components/story/DailySummary';
import { SettingsPage } from '@/components/settings';
import { morningRoutine, afterSchoolRoutine, bedtimeRoutine, rewards } from '@/data/sampleSchedule';
import { appModules } from '@/data/appContent';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, Menu, Plus, List, LayoutGrid, LogIn, User, BookOpen, TrendingUp, Cloud, CloudOff } from 'lucide-react';
import { ProgressHub } from '@/components/dashboard/ProgressHub';
import { useCloudSchedule } from '@/hooks/useCloudSchedule';
import { useCloudProgress } from '@/hooks/useCloudProgress';

const allTasks: Task[] = [...morningRoutine, ...afterSchoolRoutine, ...bedtimeRoutine].map((t, i) => ({
  ...t,
  scheduledTime: `${String(7 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
}));
const TOKENS_GOAL = 15;

const microGoals: Record<string, string> = {
  'reading': 'Just open the book',
  'homework': 'Just get out one pencil',
  'teeth': 'Just put toothpaste on the brush',
  'dress': 'Just pick up one piece of clothing',
  'bath': 'Just turn on the water',
  'backpack': 'Just find your bag',
};

type ViewMode = 'progress' | 'schedule' | 'tasks';

const IndexContent = () => {
  const navigate = useNavigate();
  const { celebrate, encourage, calm: setCompanionCalm } = useCompanion();
  const [mode, setMode] = useState<UserMode>('child');
  const [viewMode, setViewMode] = useState<ViewMode>('progress');
  const [currentModule, setCurrentModule] = useState<AppModule>('today');
  const [showModuleMenu, setShowModuleMenu] = useState(false);
  const [showScheduleBuilder, setShowScheduleBuilder] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>(allTasks);
  const [localTokens, setLocalTokens] = useState(0);
  const [showCalmToolkit, setShowCalmToolkit] = useState(false);
  const [showBraveryTimer, setShowBraveryTimer] = useState(false);
  const [showDailySummary, setShowDailySummary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [regulationLevel, setRegulationLevel] = useState<'good' | 'okay' | 'hard'>('good');
  const [user, setUser] = useState<any>(null);
  const [calmToolkitUses, setCalmToolkitUses] = useState(0);
  const [braveryAttempts, setBraveryAttempts] = useState(0);
  
  const [showTaskStarter, setShowTaskStarter] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [isTaskLocked, setIsTaskLocked] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionSeconds, setTransitionSeconds] = useState(120);

  // Cloud hooks - only active when logged in
  const cloudSchedule = useCloudSchedule(user?.id ?? null);
  const cloudProgress = useCloudProgress(user?.id ?? null);

  // Use cloud data when logged in, local data otherwise
  const isCloudEnabled = !!user;
  const tasks = isCloudEnabled && cloudSchedule.tasks.length > 0 ? cloudSchedule.tasks : localTasks;
  const tokensEarned = isCloudEnabled ? cloudProgress.tokenBalance : localTokens;

  // Unified setters that sync to cloud when logged in
  const setTasks = useCallback((updater: Task[] | ((prev: Task[]) => Task[])) => {
    if (typeof updater === 'function') {
      setLocalTasks(prev => {
        const newTasks = updater(prev);
        if (isCloudEnabled) {
          cloudSchedule.reorderTasks(newTasks);
        }
        return newTasks;
      });
    } else {
      setLocalTasks(updater);
      if (isCloudEnabled) {
        cloudSchedule.reorderTasks(updater);
      }
    }
  }, [isCloudEnabled, cloudSchedule]);

  const setTokensEarned = useCallback((updater: number | ((prev: number) => number)) => {
    if (typeof updater === 'function') {
      setLocalTokens(prev => {
        const newTokens = updater(prev);
        const diff = newTokens - prev;
        if (isCloudEnabled && diff > 0) {
          cloudProgress.addTokens(diff);
        }
        return newTokens;
      });
    } else {
      const diff = updater - localTokens;
      setLocalTokens(updater);
      if (isCloudEnabled && diff > 0) {
        cloudProgress.addTokens(diff);
      }
    }
  }, [isCloudEnabled, cloudProgress, localTokens]);

  // Auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
  };

  const handleImportCalendarTasks = useCallback((importedTasks: Task[]) => {
    // Merge with existing tasks, avoiding duplicates
    setTasks(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const newTasks = importedTasks.filter(t => !existingIds.has(t.id));
      const merged = [...prev, ...newTasks].sort((a, b) => {
        if (!a.scheduledTime || !b.scheduledTime) return 0;
        return a.scheduledTime.localeCompare(b.scheduledTime);
      });
      return merged;
    });
    toast.success(`Imported ${importedTasks.length} events`);
  }, []);

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const currentTaskIndex = tasks.findIndex(t => !t.completed);
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
      celebrate();
    }
    setShowTimer(false);
    setShowTaskStarter(false);
    setIsTaskLocked(false);
    setTransitionSeconds(120);
  }, [tasks, celebrate]);

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
    setBraveryAttempts((prev) => prev + 1);
    toast.success('+3 tokens for bravery! 🦁');
    celebrate("You faced something hard. That's real courage.");
  }, [celebrate]);

  const handleOpenCalmToolkit = useCallback(() => {
    setShowCalmToolkit(true);
    setCalmToolkitUses((prev) => prev + 1);
    setCompanionCalm();
  }, [setCompanionCalm]);

  const handleTokensEarned = useCallback((tokens: number) => {
    setTokensEarned((prev) => prev + tokens);
  }, []);

  const handleSpendTokens = useCallback((amount: number) => {
    setTokensEarned((prev) => Math.max(0, prev - amount));
  }, []);

  const completedTasks = tasks.filter(t => t.completed).length;
  const hardestTask = tasks.find(t => t.duration && t.duration >= 15)?.title;

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
      case 'writing':
        return <WritingModule onBack={() => setCurrentModule('today')} onTokensEarned={handleTokensEarned} />;
      case 'science':
        return <ScienceModule onBack={() => setCurrentModule('today')} onTokensEarned={handleTokensEarned} />;
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
      <div className="space-y-5">
        {/* Token Progress - compact at top */}
        <div className="px-5 pt-2">
          <TokenProgress earned={tokensEarned} goal={TOKENS_GOAL} currentReward={currentReward} compact />
        </div>

        {/* View Toggle + Build Button */}
        <div className="px-5 flex items-center gap-2">
          <div className="flex-1 flex bg-muted rounded-xl p-1">
            <button
              onClick={() => setViewMode('progress')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'progress' 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Progress
            </button>
            <button
              onClick={() => setViewMode('tasks')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'tasks' 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Tasks
            </button>
            <button
              onClick={() => setViewMode('schedule')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'schedule' 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              <List className="w-4 h-4" />
              Schedule
            </button>
          </div>
          
          {mode === 'parent' && (
            <button
              onClick={() => setShowScheduleBuilder(true)}
              className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Content based on view mode */}
        {viewMode === 'progress' ? (
          <div className="px-5">
            <ProgressHub 
              onNavigateToModule={(moduleId) => setCurrentModule(moduleId as AppModule)}
              tokensEarned={tokensEarned}
              tokensGoal={TOKENS_GOAL}
            />
          </div>
        ) : viewMode === 'tasks' ? (
          <>
            {/* Now/Next/Later - the main focus */}
            <div className="px-5">
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
            </div>

            {/* Self-talk buttons */}
            <div className="px-5">
              <SelfTalkButtons />
            </div>
          </>
        ) : (
          /* Full Schedule View - Fully Editable */
          <div className="px-5">
            <VisualSchedule
              tasks={tasks}
              currentTaskIndex={currentTaskIndex}
              onTaskClick={(task) => {
                if (task.icon === 'reading') {
                  setCurrentModule('reading');
                } else if (['homework'].includes(task.icon)) {
                  setShowTaskStarter(true);
                } else if (!task.completed) {
                  handleTaskComplete(task.id);
                }
              }}
              onTasksChange={(newTasks) => setTasks(newTasks)}
              onTaskUpdate={(taskId, updates) => {
                setTasks(prev => prev.map(t => 
                  t.id === taskId ? { ...t, ...updates } : t
                ));
              }}
              onTaskDelete={(taskId) => {
                setTasks(prev => prev.filter(t => t.id !== taskId));
              }}
            />
          </div>
        )}

        {/* Quick access modules */}
        <div className="px-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Activities
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {appModules.slice(1, 5).map((module) => (
              <button
                key={module.id}
                onClick={() => setCurrentModule(module.id)}
                className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md active:scale-[0.98] transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-muted/50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <span className="text-xl">{module.icon}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {module.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Parent-only bravery button */}
        {mode === 'parent' && (
          <div className="px-5 pb-4">
            <button
              onClick={() => setShowBraveryTimer(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-token/10 to-primary/10 border border-token/30 flex items-center justify-center gap-3 hover:from-token/20 hover:to-primary/20 active:scale-[0.99] transition-all"
            >
              <Shield className="w-5 h-5 text-token" />
              <span className="font-bold text-token">Start Bravery Practice</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
    return { text: 'Good Evening', emoji: '🌙' };
  };

  const greeting = getGreeting();


  return (
    <div className="min-h-screen relative">
      {/* Ambient background layer */}
      <AmbientCanvas 
        tokensEarned={tokensEarned} 
        isCalm={showCalmToolkit}
        currentModule={currentModule}
      />
      {/* Header with greeting */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between p-4 safe-top">
          <button
            onClick={() => setShowModuleMenu(true)}
            className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex justify-center">
            <StatusStrip 
              tokensEarned={tokensEarned}
              tokensGoal={TOKENS_GOAL}
              regulationLevel={regulationLevel}
              onTokenTap={() => setCurrentModule('rewards')}
              onRegulationTap={handleOpenCalmToolkit}
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Cloud sync indicator */}
            {isCloudEnabled && (
              <div 
                className="w-8 h-8 rounded-lg bg-calm/10 flex items-center justify-center"
                title="Cloud sync enabled"
              >
                <Cloud className="w-4 h-4 text-calm" />
              </div>
            )}
            
            {user ? (
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center"
                title="Log out"
              >
                <User className="w-4 h-4 text-calm" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-medium flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Log in
              </button>
            )}
            <button
              onClick={handleModeSwitch}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'parent' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-card border border-border'
              }`}
            >
              {mode === 'child' ? 'Parent' : 'Child'}
            </button>
          </div>
        </div>
        
        {/* Mode indicator for parent with daily summary access */}
        {mode === 'parent' && (
          <div className="px-4 pb-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <button
              onClick={() => setShowDailySummary(true)}
              className="text-xs text-primary font-medium flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              View Story
            </button>
          </div>
        )}
      </header>

      <main className="pb-32">
        {mode === 'parent' && (
          <div className="p-4 pt-2 space-y-3">
            {/* Google Calendar Sync - only show when logged in */}
            {user && (
              <div className="flex justify-end">
                <GoogleCalendarSync tasks={tasks} onImportTasks={handleImportCalendarTasks} />
              </div>
            )}
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
        onOpenSettings={() => setShowSettings(true)}
        currentModule={currentModule}
      />

      <CalmButton onClick={handleOpenCalmToolkit} />
      {showCalmToolkit && <CalmToolkit onClose={() => setShowCalmToolkit(false)} />}
      {showBraveryTimer && (
        <BraveryTimer duration={30} copingPhrase="I can handle this feeling." onComplete={handleBraveryComplete} onCancel={() => setShowBraveryTimer(false)} />
      )}
      {showDailySummary && (
        <DailySummary
          tasksCompleted={completedTasks}
          totalTasks={tasks.length}
          tokensEarned={tokensEarned}
          calmToolkitUses={calmToolkitUses}
          braveryAttempts={braveryAttempts}
          hardestTask={hardestTask}
          onClose={() => setShowDailySummary(false)}
        />
      )}
      {showScheduleBuilder && (
        <ScheduleBuilder
          tasks={tasks}
          onTasksChange={setTasks}
          onClose={() => setShowScheduleBuilder(false)}
        />
      )}
      <SettingsPage
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onLogin={() => navigate('/auth')}
        onLogout={handleLogout}
      />
    </div>
  );
};

// Wrap with CompanionProvider
const Index = () => (
  <CompanionProvider>
    <IndexContent />
  </CompanionProvider>
);

export default Index;
