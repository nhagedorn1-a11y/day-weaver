import { useMemo } from 'react';
import { 
  Book, Calculator, Pencil, Beaker, ChevronRight, 
  TrendingUp, Star, Flame, Clock, Target, Award
} from 'lucide-react';

interface SubjectProgress {
  id: string;
  name: string;
  icon: React.ReactNode;
  emoji: string;
  color: string;
  bgColor: string;
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
  // In production, this would come from database
  const subjects: SubjectProgress[] = useMemo(() => [
    {
      id: 'reading',
      name: 'Reading',
      icon: <Book className="w-5 h-5" />,
      emoji: '📚',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
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
      icon: <Calculator className="w-5 h-5" />,
      emoji: '🧮',
      color: 'text-token',
      bgColor: 'bg-token/10',
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
      icon: <Pencil className="w-5 h-5" />,
      emoji: '✏️',
      color: 'text-calm',
      bgColor: 'bg-calm/10',
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
      icon: <Beaker className="w-5 h-5" />,
      emoji: '🔬',
      color: 'text-next',
      bgColor: 'bg-next/10',
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

  const bestStreak = useMemo(() => {
    return Math.max(...subjects.map(s => s.streak));
  }, [subjects]);

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <div className="bg-gradient-to-br from-primary/10 via-calm/5 to-token/10 rounded-3xl p-6 border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Learning Progress</h2>
            <p className="text-sm text-muted-foreground">Keep up the great work!</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-background/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-lg font-bold">{totalProgress}%</span>
            </div>
            <span className="text-xs text-muted-foreground">Overall</span>
          </div>
          <div className="bg-background/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-token" />
              <span className="text-lg font-bold">{bestStreak}</span>
            </div>
            <span className="text-xs text-muted-foreground">Best Streak</span>
          </div>
          <div className="bg-background/60 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-token" />
              <span className="text-lg font-bold">{tokensEarned}</span>
            </div>
            <span className="text-xs text-muted-foreground">Tokens</span>
          </div>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
          Subjects
        </h3>
        
        {subjects.map((subject) => {
          const progressPercent = Math.round((subject.currentLesson / subject.totalLessons) * 100);
          
          return (
            <button
              key={subject.id}
              onClick={() => onNavigateToModule(subject.id)}
              className="w-full bg-card rounded-2xl border-2 border-border hover:border-primary/40 transition-all hover:shadow-lg active:scale-[0.99] overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Subject icon */}
                  <div className={`w-14 h-14 rounded-xl ${subject.bgColor} flex items-center justify-center shrink-0`}>
                    <span className="text-2xl">{subject.emoji}</span>
                  </div>

                  {/* Subject info */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-lg">{subject.name}</h4>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-muted rounded-full mb-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          subject.id === 'reading' ? 'bg-primary' :
                          subject.id === 'math' ? 'bg-token' :
                          subject.id === 'writing' ? 'bg-calm' : 'bg-next'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Lesson {subject.currentLesson} of {subject.totalLessons}
                      </span>
                      <div className="flex items-center gap-1">
                        {subject.streak > 0 && (
                          <>
                            <Flame className="w-3.5 h-3.5 text-token" />
                            <span className="text-xs font-medium text-token">{subject.streak}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strengths & Focus areas */}
                {(subject.strengthAreas.length > 0 || subject.focusAreas.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-1.5">
                      {subject.strengthAreas.slice(0, 2).map((area, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-calm/20 text-xs font-medium text-calm">
                          ✓ {area}
                        </span>
                      ))}
                      {subject.focusAreas.slice(0, 1).map((area, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-token/20 text-xs font-medium text-token">
                          → {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
          Suggested Next Steps
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigateToModule('reading')}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-primary/10 border-2 border-primary/30 hover:border-primary/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Book className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-center">Continue Reading</span>
            <span className="text-xs text-muted-foreground">Short I Words</span>
          </button>

          <button
            onClick={() => onNavigateToModule('math')}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-token/10 border-2 border-token/30 hover:border-token/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-token/20 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-token" />
            </div>
            <span className="text-sm font-semibold text-center">Practice Math</span>
            <span className="text-xs text-muted-foreground">Count to 10</span>
          </button>
        </div>
      </div>

      {/* Achievements teaser */}
      <div className="bg-muted/50 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-token/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-token" />
          </div>
          <div className="flex-1">
            <span className="font-semibold block">Almost there!</span>
            <span className="text-sm text-muted-foreground">
              {tokensGoal - tokensEarned} more tokens to unlock a reward
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
