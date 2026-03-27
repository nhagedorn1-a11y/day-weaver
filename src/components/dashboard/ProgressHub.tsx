import { useMemo } from 'react';
import { 
  Book, Calculator, Pencil, Beaker, ChevronRight, 
  TrendingUp, Star, Clock, Award
} from 'lucide-react';

interface SubjectProgress {
  id: string;
  name: string;
  icon: React.ReactNode;
  currentLesson: number;
  totalLessons: number;
  streak: number;
  lastActivity: string | null;
  strengthAreas: string[];
  focusAreas: string[];
}

interface ProgressHubProps {
  onNavigateToModule: (moduleId: string) => void;
  tokensEarned: number;
  tokensGoal: number;
}

export function ProgressHub({ onNavigateToModule, tokensEarned, tokensGoal }: ProgressHubProps) {
  const subjects: SubjectProgress[] = useMemo(() => [
    {
      id: 'reading',
      name: 'Reading',
      icon: <Book className="w-4 h-4" />,
      currentLesson: 3,
      totalLessons: 10,
      streak: 3,
      lastActivity: 'Today',
      strengthAreas: ['Short A words', 'CVC blending'],
      focusAreas: ['Digraphs (sh, ch)'],
    },
    {
      id: 'math',
      name: 'Math',
      icon: <Calculator className="w-4 h-4" />,
      currentLesson: 2,
      totalLessons: 15,
      streak: 2,
      lastActivity: 'Yesterday',
      strengthAreas: ['Counting to 10', 'One-to-one'],
      focusAreas: ['Number bonds'],
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: <Pencil className="w-4 h-4" />,
      currentLesson: 5,
      totalLessons: 52,
      streak: 1,
      lastActivity: '2 days ago',
      strengthAreas: ['Uppercase A-E'],
      focusAreas: ['Lowercase letters'],
    },
    {
      id: 'science',
      name: 'Science',
      icon: <Beaker className="w-4 h-4" />,
      currentLesson: 1,
      totalLessons: 20,
      streak: 0,
      lastActivity: null,
      strengthAreas: [],
      focusAreas: ['Life Science basics'],
    },
  ], []);

  const totalProgress = useMemo(() => {
    const total = subjects.reduce((acc, s) => acc + s.currentLesson, 0);
    const max = subjects.reduce((acc, s) => acc + s.totalLessons, 0);
    return Math.round((total / max) * 100);
  }, [subjects]);

  return (
    <div className="space-y-8">
      {/* Overall Progress Header — flat, restrained */}
      <div className="bg-card rounded-lg p-5 border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold">Learning Progress</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Keep up the great work</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-muted p-2.5 text-center">
            <span className="text-sm font-semibold block">{totalProgress}%</span>
            <span className="text-[10px] text-muted-foreground">Overall</span>
          </div>
          <div className="rounded-lg bg-muted p-2.5 text-center">
            <span className="text-sm font-semibold block">{Math.max(...subjects.map(s => s.streak))}</span>
            <span className="text-[10px] text-muted-foreground">Best Streak</span>
          </div>
          <div className="rounded-lg bg-muted p-2.5 text-center">
            <span className="text-sm font-semibold block">{tokensEarned}</span>
            <span className="text-[10px] text-muted-foreground">Tokens</span>
          </div>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="space-y-2">
        <h3 className="hw-label px-1">Subjects</h3>
        
        {subjects.map((subject) => {
          const progressPercent = Math.round((subject.currentLesson / subject.totalLessons) * 100);
          
          return (
            <button
              key={subject.id}
              onClick={() => onNavigateToModule(subject.id)}
              className="w-full bg-card rounded-lg border border-border hover:border-primary/30 transition-all active:scale-[0.99] overflow-hidden"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                    {subject.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-medium text-sm">{subject.name}</h4>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-muted rounded-sm mb-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-sm bg-primary transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <span className="text-[11px] text-muted-foreground">
                      Lesson {subject.currentLesson} of {subject.totalLessons}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Achievement teaser */}
      <div className="bg-card rounded-lg p-4 border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Award className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <span className="font-medium text-sm block">Almost there</span>
            <span className="text-xs text-muted-foreground">
              {tokensGoal - tokensEarned} more tokens to unlock a reward
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
