import { ChevronRight, Lock } from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  emoji: string;
  difficulty?: number;
  instructions?: string[];
  steps?: { instruction: string }[];
}

interface ActivityListProps {
  title: string;
  description: string;
  items: ActivityItem[];
  onSelect: (item: ActivityItem) => void;
  onBack: () => void;
  /** If set, activities above this difficulty are locked */
  unlockedDifficulty?: number;
  completedIds?: string[];
}

export function ActivityList({ title, description, items, onSelect, onBack, unlockedDifficulty, completedIds = [] }: ActivityListProps) {
  // Group by difficulty if gating is active
  const maxDiff = Math.max(...items.map(i => i.difficulty ?? 1));
  const showDifficultyGroups = unlockedDifficulty !== undefined && maxDiff > 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded bg-secondary flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h1 className="font-semibold text-lg">{title}</h1>
          <span className="text-xs text-muted-foreground">{items.length} activities</span>
        </div>
      </header>

      <div className="p-4 space-y-3">
        <p className="text-muted-foreground text-sm mb-4">{description}</p>

        {items.map((item) => {
          const diff = item.difficulty ?? 1;
          const isLocked = unlockedDifficulty !== undefined && diff > unlockedDifficulty;
          const isCompleted = completedIds.includes(item.id);

          return (
            <button
              key={item.id}
              onClick={() => !isLocked && onSelect(item)}
              disabled={isLocked}
              className={`w-full flex items-center gap-4 p-4 rounded-xl bg-card border text-left transition-all ${
                isLocked
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:shadow-sm active:scale-[0.99]'
              } ${isCompleted ? 'border-primary/30' : 'border-border'}`}
            >
              <span className="text-4xl">{item.emoji}</span>
              <div className="flex-1 text-left">
                <span className="font-semibold block">{item.title}</span>
                <span className="text-sm text-muted-foreground">
                  {item.difficulty && (
                    <span className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full ${i < item.difficulty! ? 'bg-primary' : 'bg-muted'}`} 
                        />
                      ))}
                    </span>
                  )}
                  {item.steps && `${item.steps.length} steps`}
                </span>
              </div>
              {isLocked ? (
                <Lock className="w-4 h-4 text-muted-foreground" />
              ) : isCompleted ? (
                <span className="text-primary text-sm">✓</span>
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
