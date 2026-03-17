// Rev 6: Progress indicator for all typing modes
// Shows simple dots/segments so the child always knows "how many more"

interface TypingProgressBarProps {
  current: number;   // 0-indexed current position
  total: number;
  label?: string;    // e.g. "Found" or "Letter"
}

export function TypingProgressBar({ current, total, label }: TypingProgressBarProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {label && (
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      )}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              i < current
                ? 'bg-primary'
                : i === current
                ? 'bg-primary/50 animate-pulse'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-muted-foreground">
        {current} / {total}
      </span>
    </div>
  );
}
