import { useRef, useState, useEffect, useCallback, TouchEvent, MouseEvent } from 'react';

interface TracePoint {
  x: number;
  y: number;
}

interface TracePadProps {
  letter: string;
  onComplete?: () => void;
  size?: number;
}

export function TracePad({ letter, onComplete, size = 200 }: TracePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<TracePoint[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Draw guide letter
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and set up
    ctx.clearRect(0, 0, size, size);
    
    // Draw guide letter (light, dashed)
    ctx.font = `bold ${size * 0.7}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(letter.toUpperCase(), size / 2, size / 2);
    ctx.setLineDash([]);
  }, [letter, size]);

  // Draw user trace
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw trace line
    ctx.beginPath();
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }, [points]);

  const getPosition = (e: TouchEvent | MouseEvent): TracePoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    
    return {
      x: (e as MouseEvent).clientX - rect.left,
      y: (e as MouseEvent).clientY - rect.top,
    };
  };

  const handleStart = (e: TouchEvent | MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setPoints([getPosition(e)]);
  };

  const handleMove = (e: TouchEvent | MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    setPoints(prev => [...prev, getPosition(e)]);
  };

  const handleEnd = useCallback(() => {
    setIsDrawing(false);
    
    // Consider complete if enough points drawn
    if (points.length > 20) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [points.length, onComplete]);

  const handleClear = () => {
    setPoints([]);
    setIsComplete(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw guide
    ctx.clearRect(0, 0, size, size);
    ctx.font = `bold ${size * 0.7}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(letter.toUpperCase(), size / 2, size / 2);
    ctx.setLineDash([]);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className={`
            rounded-2xl border-4 bg-card touch-none
            ${isComplete ? 'border-calm' : 'border-border'}
          `}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-6xl animate-scale-in">✨</div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Trace the letter with your finger
        </span>
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
