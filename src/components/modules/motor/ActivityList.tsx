import { useMemo, useState } from 'react';
import { ChevronRight, Lock, Check } from 'lucide-react';

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
  /** Storage key used to persist completed activity ids for difficulty gating */
  storageKey?: string;
}

const DIFFICULTY_LABELS: Record<number, { label: string; emoji: string; desc: string }> = {
  1: { label: 'Level 1 — Starter', emoji: '🌱', desc: 'Easy first steps' },
  2: { label: 'Level 2 — Builder', emoji: '🌿', desc: 'Building confidence' },
  3: { label: 'Level 3 — Explorer', emoji: '🌳', desc: 'Stretch and explore' },
  4: { label: 'Level 4 — Pro', emoji: '⭐', desc: 'Advanced challenges' },
  5: { label: 'Level 5 — Master', emoji: '🏆', desc: 'Expert level' },
};

const COMPLETIONS_TO_UNLOCK = 3;

function loadCompletedIds(storageKey?: string, fallback: string[] = []): string[] {
  if (!storageKey) return fallback;
  try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return fallback; }
}

export function ActivityList({
  title,
  description,
  items,
  onSelect,
  onBack,
  unlockedDifficulty: unlockedDifficultyProp,
  completedIds: completedIdsProp,
  storageKey,
}: ActivityListProps) {
  const completedIds = completedIdsProp ?? loadCompletedIds(storageKey);

  // Group items by difficulty
  const grouped = useMemo(() => {
    const map = new Map<number, ActivityItem[]>();
    items.forEach(it => {
      const d = it.difficulty ?? 1;
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(it);
    });
    return new Map([...map.entries()].sort(([a], [b]) => a - b));
  }, [items]);

  const difficulties = [...grouped.keys()];
  const hasMultipleLevels = difficulties.length > 1;

  // Compute unlocked difficulty from completions if not explicitly provided
  const unlockedDifficulty = useMemo(() => {
    if (unlockedDifficultyProp !== undefined) return unlockedDifficultyProp;
    if (!hasMultipleLevels) return Math.max(...difficulties, 1);
    let unlocked = difficulties[0] ?? 1;
    for (const d of difficulties) {
      const atLevel = grouped.get(d) ?? [];
      const completedAtLevel = atLevel.filter(a => completedIds.includes(a.id)).length;
      if (completedAtLevel >= Math.min(COMPLETIONS_TO_UNLOCK, atLevel.length)) {
        unlocked = d + 1;
      } else break;
    }
    return unlocked;
  }, [unlockedDifficultyProp, difficulties, grouped, completedIds, hasMultipleLevels]);

  // Default selected level = Level 1 (lowest difficulty)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(
    hasMultipleLevels ? null : (difficulties[0] ?? 1)
  );

  // ── Chapter / Level Picker ──
  if (hasMultipleLevels && selectedLevel === null) {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded bg-secondary flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">{title}</h1>
            <span className="text-xs text-muted-foreground">Pick a level</span>
          </div>
        </header>

        <div className="p-4 space-y-3">
          <p className="text-muted-foreground text-sm mb-2">{description}</p>

          {difficulties.map((d) => {
            const meta = DIFFICULTY_LABELS[d] ?? { label: `Level ${d}`, emoji: '✨', desc: '' };
            const groupItems = grouped.get(d) ?? [];
            const isLocked = d > unlockedDifficulty;
            const completedCount = groupItems.filter(i => completedIds.includes(i.id)).length;
            const isCompleted = completedCount >= Math.min(COMPLETIONS_TO_UNLOCK, groupItems.length);

            return (
              <button
                key={d}
                onClick={() => !isLocked && setSelectedLevel(d)}
                disabled={isLocked}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                  isLocked
                    ? 'opacity-40 cursor-not-allowed bg-muted/30'
                    : 'bg-card shadow-sm hover:shadow-md active:scale-[0.98]'
                }`}
              >
                <span className="text-3xl">{meta.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{meta.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {meta.desc} • {groupItems.length} activities
                    {completedCount > 0 && ` • ${completedCount} done`}
                  </p>
                </div>
                {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                {isCompleted && !isLocked && <Check className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Activity list (filtered to selected level when applicable) ──
  const visibleItems = hasMultipleLevels
    ? (grouped.get(selectedLevel!) ?? [])
    : items;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 p-4 border-b border-border safe-top">
        <button
          onClick={() => hasMultipleLevels ? setSelectedLevel(null) : onBack()}
          className="w-10 h-10 rounded bg-secondary flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h1 className="font-semibold text-lg">{title}</h1>
          <span className="text-xs text-muted-foreground">
            {hasMultipleLevels
              ? `${DIFFICULTY_LABELS[selectedLevel!]?.label ?? `Level ${selectedLevel}`} • ${visibleItems.length} activities`
              : `${visibleItems.length} activities`}
          </span>
        </div>
      </header>

      <div className="p-4 space-y-3">
        {!hasMultipleLevels && (
          <p className="text-muted-foreground text-sm mb-4">{description}</p>
        )}

        {visibleItems.map((item) => {
          const diff = item.difficulty ?? 1;
          const isLocked = diff > unlockedDifficulty;
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
