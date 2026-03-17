// Rev 8: Transition warning countdown before leaving a mode
// Shows 3-2-1 with gentle messaging

import { useEffect, useState } from 'react';

interface TransitionCountdownProps {
  onComplete: () => void;
  message?: string;
}

export function TransitionCountdown({ onComplete, message = 'Great job!' }: TransitionCountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount(c => c - 1), 800);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background/90 flex flex-col items-center justify-center">
      <p className="text-xl font-semibold text-muted-foreground mb-4">{message}</p>
      <div className="text-7xl font-black text-primary">
        {count > 0 ? count : '✓'}
      </div>
      <p className="text-sm text-muted-foreground mt-4">Heading back…</p>
    </div>
  );
}
