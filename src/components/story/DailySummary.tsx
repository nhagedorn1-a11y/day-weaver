import { useMemo } from 'react';
import { Star, Shield, Wind, CheckCircle2, Clock, Trophy } from 'lucide-react';
import { LittleGuy } from '../companion/LittleGuy';

interface DailySummaryProps {
  date?: Date;
  tasksCompleted: number;
  totalTasks: number;
  tokensEarned: number;
  calmToolkitUses: number;
  braveryAttempts: number;
  hardestTask?: string;
  childName?: string;
  onClose?: () => void;
}

export function DailySummary({
  date = new Date(),
  tasksCompleted,
  totalTasks,
  tokensEarned,
  calmToolkitUses,
  braveryAttempts,
  hardestTask,
  childName = 'Jack',
  onClose,
}: DailySummaryProps) {
  const narrative = useMemo(() => {
    const challengeWord = totalTasks === 1 ? 'challenge' : 'challenges';
    const starWord = tokensEarned === 1 ? 'star' : 'stars';
    
    let story = `Today, ${childName} faced ${totalTasks} ${challengeWord}. `;
    
    if (tasksCompleted === totalTasks) {
      story += `Every single one was completed. `;
    } else if (tasksCompleted > totalTasks / 2) {
      story += `${tasksCompleted} were completed — that's a lot! `;
    } else {
      story += `${tasksCompleted} ${tasksCompleted === 1 ? 'was' : 'were'} completed. Some days are like that. `;
    }

    if (hardestTask) {
      story += `${hardestTask} was the hardest part. `;
    }

    story += `${tokensEarned} ${starWord} were earned along the way. `;

    if (calmToolkitUses > 0) {
      story += `The calm corner was visited ${calmToolkitUses} ${calmToolkitUses === 1 ? 'time' : 'times'}. `;
    }

    if (braveryAttempts > 0) {
      story += `Bravery was practiced ${braveryAttempts} ${braveryAttempts === 1 ? 'time' : 'times'} — that takes courage. `;
    }

    story += `Tomorrow is a new day.`;

    return story;
  }, [childName, totalTasks, tasksCompleted, tokensEarned, calmToolkitUses, braveryAttempts, hardestTask]);

  const completionRate = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
  
  const getMood = () => {
    if (completionRate >= 80) return 'celebrating';
    if (completionRate >= 50) return 'encouraging';
    return 'calm';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-card rounded-3xl border-2 border-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-token/10 to-calm/10 p-6 text-center border-b border-border">
          <div className="flex justify-center mb-3">
            <LittleGuy mood={getMood()} size="lg" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {date.toLocaleDateString('en-US', { weekday: 'long' })}'s Story
          </h2>
          <p className="text-sm text-muted-foreground">
            {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 p-4 border-b border-border">
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-calm" />
            <div className="font-mono text-lg font-bold">{tasksCompleted}/{totalTasks}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tasks</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <Star className="w-5 h-5 mx-auto mb-1 text-token" />
            <div className="font-mono text-lg font-bold">{tokensEarned}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Stars</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <Shield className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="font-mono text-lg font-bold">{braveryAttempts}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Brave</div>
          </div>
        </div>

        {/* Narrative */}
        <div className="p-6">
          <p className="text-foreground leading-relaxed text-center italic">
            "{narrative}"
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/30 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
}
