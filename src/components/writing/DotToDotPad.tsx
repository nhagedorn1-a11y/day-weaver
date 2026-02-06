import { useState, useCallback, useRef, useEffect } from 'react';
import { Check, RefreshCw } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { LETTER_DOTS } from '@/data/letterDotPositions';

interface DotToDotPadProps {
  letter: string;
  onComplete?: () => void;
  size?: number;
}

export function DotToDotPad({ letter, onComplete, size = 200 }: DotToDotPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [connectedDots, setConnectedDots] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const { playTap, playComplete, speakPhoneme } = useSound();

  const dots = LETTER_DOTS[letter];
  // If no dots are defined for this character, show a fallback message
  const hasDots = !!dots && dots.length > 0;
  const sortedDots = hasDots ? [...dots].sort((a, b) => a.order - b.order) : [];

  // Deduplicate dots that share the same order (some letters reuse positions)
  const uniqueDots = sortedDots.filter((dot, idx, arr) => {
    if (idx === 0) return true;
    return dot.order !== arr[idx - 1].order;
  });
  const maxOrder = uniqueDots.length > 0 ? uniqueDots[uniqueDots.length - 1].order : 0;

  // Reset when letter changes
  useEffect(() => {
    setConnectedDots([]);
    setIsComplete(false);
  }, [letter]);

  // Draw the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    if (!hasDots) return;

    // Draw guide letter faintly
    const displayLetter = letter.length > 1 ? letter : letter;
    const fontSize = letter.length > 2 ? size * 0.4 : size * 0.6;
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.fillText(displayLetter, size / 2, size / 2);

    // Draw connected lines
    if (connectedDots.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const firstDot = sortedDots.find(d => d.order === connectedDots[0]);
      if (firstDot) {
        ctx.moveTo(firstDot.x * size, firstDot.y * size);
        for (let i = 1; i < connectedDots.length; i++) {
          const dot = sortedDots.find(d => d.order === connectedDots[i]);
          if (dot) {
            ctx.lineTo(dot.x * size, dot.y * size);
          }
        }
        ctx.stroke();
      }
    }

    // Draw dots
    sortedDots.forEach((dot) => {
      const x = dot.x * size;
      const y = dot.y * size;
      const isConnected = connectedDots.includes(dot.order);
      const isNext = connectedDots.length === 0 
        ? dot.order === 1 
        : dot.order === Math.max(...connectedDots) + 1;

      // Dot circle
      ctx.beginPath();
      ctx.arc(x, y, isNext ? 14 : 10, 0, Math.PI * 2);
      
      if (isConnected) {
        ctx.fillStyle = '#6366f1';
      } else if (isNext) {
        ctx.fillStyle = '#10b981';
      } else {
        ctx.fillStyle = '#e5e7eb';
      }
      ctx.fill();

      // Dot border
      ctx.strokeStyle = isNext ? '#059669' : isConnected ? '#4f46e5' : '#d1d5db';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Number label
      ctx.fillStyle = isConnected ? '#ffffff' : isNext ? '#ffffff' : '#6b7280';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(dot.order), x, y);
    });
  }, [letter, size, connectedDots, sortedDots, hasDots]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleTap = useCallback((e: React.PointerEvent) => {
    if (isComplete || !hasDots) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const tapX = (e.clientX - rect.left) * scaleX;
    const tapY = (e.clientY - rect.top) * scaleY;

    // Find which dot was tapped (within tolerance)
    const tolerance = 25;
    const tappedDot = sortedDots.find(dot => {
      const dx = dot.x * size - tapX;
      const dy = dot.y * size - tapY;
      return Math.sqrt(dx * dx + dy * dy) < tolerance;
    });

    if (!tappedDot) return;

    // Check if this is the next expected dot
    const nextExpected = connectedDots.length === 0 
      ? 1 
      : Math.max(...connectedDots) + 1;

    if (tappedDot.order === nextExpected) {
      playTap();
      const newConnected = [...connectedDots, tappedDot.order];
      setConnectedDots(newConnected);

      // Check completion — all unique orders connected
      if (tappedDot.order === maxOrder) {
        setIsComplete(true);
        playComplete();
        speakPhoneme(letter);
        onComplete?.();
      }
    }
  }, [isComplete, hasDots, connectedDots, sortedDots, size, maxOrder, playTap, playComplete, speakPhoneme, letter, onComplete]);

  const handleReset = () => {
    setConnectedDots([]);
    setIsComplete(false);
  };

  if (!hasDots) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className="rounded border-4 border-border bg-card flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <span className="text-muted-foreground text-sm text-center px-4">
            Dot-to-dot not available for "{letter}"
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{ touchAction: 'none' }}
          className={`
            rounded border-4 bg-card cursor-pointer
            transition-colors duration-300 select-none
            ${isComplete ? 'border-calm shadow-lg shadow-calm/20' : 'border-border hover:border-primary/50'}
          `}
          onPointerDown={handleTap}
        />

        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded bg-calm/90 flex items-center justify-center animate-scale-in">
              <Check className="w-8 h-8 text-calm-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!isComplete ? (
          <>
            <span className="text-sm text-muted-foreground">
              Tap dot {connectedDots.length === 0 ? 1 : Math.max(...connectedDots) + 1} next
            </span>
            {connectedDots.length > 0 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </>
        ) : (
          <span className="text-sm font-medium text-calm flex items-center gap-1">
            <Check className="w-4 h-4" />
            Connected!
          </span>
        )}
      </div>
    </div>
  );
}
