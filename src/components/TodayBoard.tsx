import { useState, useEffect } from 'react';
import { Task } from '@/types/jackos';
import { TaskCard } from './TaskCard';
import { TokenBoard } from './TokenBoard';
import { ChevronRight } from 'lucide-react';

interface TodayBoardProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  tokensEarned: number;
  tokensGoal: number;
}

export function TodayBoard({ tasks, onTaskComplete, tokensEarned, tokensGoal }: TodayBoardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const currentTask = tasks[currentIndex];
  const nextTask = tasks[currentIndex + 1];
  const laterTasks = tasks.slice(currentIndex + 2, currentIndex + 4);

  // Timer effect
  useEffect(() => {
    if (currentTask?.duration) {
      setTimeRemaining(currentTask.duration * 60);
    }
  }, [currentIndex, currentTask?.duration]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleComplete = () => {
    if (currentTask) {
      onTaskComplete(currentTask.id);
      if (currentIndex < tasks.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  if (!currentTask) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="text-6xl mb-4">🌟</div>
        <h2 className="text-3xl font-bold mb-2">All Done!</h2>
        <p className="text-muted-foreground text-lg">Great job today!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Token progress - compact */}
      <TokenBoard earned={tokensEarned} goal={tokensGoal} />

      {/* Card deck - stacked view */}
      <div className="relative space-y-4">
        {/* NOW card - prominent */}
        <TaskCard
          task={currentTask}
          variant="now"
          onComplete={handleComplete}
          showTimer={!!currentTask.duration}
          timeRemaining={timeRemaining ?? undefined}
        />

        {/* NEXT card */}
        {nextTask && (
          <div className="pl-4">
            <TaskCard task={nextTask} variant="next" />
          </div>
        )}

        {/* LATER cards - smaller */}
        {laterTasks.length > 0 && (
          <div className="pl-8 space-y-3">
            {laterTasks.map((task) => (
              <TaskCard key={task.id} task={task} variant="later" />
            ))}
          </div>
        )}

        {/* More indicator */}
        {tasks.length > currentIndex + 4 && (
          <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
            <span className="text-sm font-medium">
              +{tasks.length - currentIndex - 4} more
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
