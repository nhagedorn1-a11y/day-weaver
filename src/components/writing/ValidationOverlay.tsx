import { Loader2, Sparkles } from 'lucide-react';

interface ValidationOverlayProps {
  isChecking: boolean;
  feedback: string | null;
  showAskTeacher: boolean;
  onAskTeacher: () => void;
}

export function ValidationOverlay({
  isChecking,
  feedback,
  showAskTeacher,
  onAskTeacher,
}: ValidationOverlayProps) {
  return (
    <>
      {isChecking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-background/30 rounded">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            Checking...
          </div>
        </div>
      )}

      {feedback && !isChecking && (
        <div className="text-sm text-muted-foreground text-center mt-1 animate-in fade-in">
          {feedback}
        </div>
      )}

      {showAskTeacher && !isChecking && (
        <button
          onClick={onAskTeacher}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Ask teacher to check?
        </button>
      )}
    </>
  );
}
