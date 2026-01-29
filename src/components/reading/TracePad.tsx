import { useRef, useState, useEffect, useCallback, TouchEvent, MouseEvent } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

interface TracePoint {
  x: number;
  y: number;
}

interface TracePadProps {
  letter: string;
  onComplete?: () => void;
  size?: number;
}

// Minimum coverage threshold to consider tracing complete
const COVERAGE_THRESHOLD = 0.15; // 15% of letter area
const MIN_POINTS = 30;

export function TracePad({ letter, onComplete, size = 200 }: TracePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<TracePoint[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { playTrace } = useSound();

  // Draw guide letter with dotted outline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw subtle grid for guidance
    ctx.strokeStyle = 'hsl(var(--border) / 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();
    
    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.stroke();
    
    ctx.setLineDash([]);

    // Draw guide letter (large, dashed)
    const displayLetter = letter.length > 1 ? letter : letter.toUpperCase();
    const fontSize = letter.length > 1 ? size * 0.5 : size * 0.65;
    
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'hsl(var(--primary) / 0.25)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 6]);
    ctx.strokeText(displayLetter, size / 2, size / 2);
    ctx.setLineDash([]);
    
    // Fill with very light color
    ctx.fillStyle = 'hsl(var(--primary) / 0.08)';
    ctx.fillText(displayLetter, size / 2, size / 2);
  }, [letter, size]);

  // Draw user trace
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw trace line
    ctx.beginPath();
    ctx.strokeStyle = isComplete ? 'hsl(var(--calm))' : 'hsl(var(--primary))';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }, [points, isComplete]);

  const getPosition = (e: TouchEvent | MouseEvent): TracePoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    
    return {
      x: ((e as MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as MouseEvent).clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e: TouchEvent | MouseEvent) => {
    if (isComplete) return;
    e.preventDefault();
    setIsDrawing(true);
    setPoints([getPosition(e)]);
  };

  const handleMove = (e: TouchEvent | MouseEvent) => {
    if (!isDrawing || isComplete) return;
    e.preventDefault();
    setPoints(prev => [...prev, getPosition(e)]);
  };

  const checkCompletion = useCallback(() => {
    // Check if enough tracing was done
    // Simple heuristic: enough points spread across the canvas
    if (points.length < MIN_POINTS) return false;
    
    // Calculate bounding box coverage
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    const coverage = ((maxX - minX) * (maxY - minY)) / (size * size);
    
    return coverage >= COVERAGE_THRESHOLD;
  }, [points, size]);

  const handleEnd = useCallback(() => {
    setIsDrawing(false);
    
    if (checkCompletion()) {
      setIsComplete(true);
      playTrace(); // Play trace complete sound
      onComplete?.();
    } else if (points.length > 10) {
      // Not enough coverage - increment attempts
      setAttempts(prev => prev + 1);
    }
  }, [checkCompletion, onComplete, points.length, playTrace]);

  const handleClear = () => {
    setPoints([]);
    setIsComplete(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw guide
    ctx.clearRect(0, 0, size, size);
    
    // Redraw grid
    ctx.strokeStyle = 'hsl(var(--border) / 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Redraw letter
    const displayLetter = letter.length > 1 ? letter : letter.toUpperCase();
    const fontSize = letter.length > 1 ? size * 0.5 : size * 0.65;
    
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'hsl(var(--primary) / 0.25)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 6]);
    ctx.strokeText(displayLetter, size / 2, size / 2);
    ctx.setLineDash([]);
    ctx.fillStyle = 'hsl(var(--primary) / 0.08)';
    ctx.fillText(displayLetter, size / 2, size / 2);
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
            transition-colors duration-300
            ${isComplete ? 'border-calm shadow-lg shadow-calm/20' : 'border-border'}
          `}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        
        {/* Completion overlay */}
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-calm/90 flex items-center justify-center animate-scale-in">
              <Check className="w-8 h-8 text-calm-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Instructions and controls */}
      <div className="flex items-center gap-4">
        {!isComplete ? (
          <>
            <span className="text-sm text-muted-foreground">
              {attempts > 0 && points.length < MIN_POINTS 
                ? "Keep tracing the whole letter!" 
                : "Trace while saying the sound"
              }
            </span>
            {points.length > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </>
        ) : (
          <span className="text-sm font-medium text-calm flex items-center gap-1">
            <Check className="w-4 h-4" />
            Great tracing!
          </span>
        )}
      </div>

      {/* Multisensory reminder */}
      {!isComplete && (
        <p className="text-xs text-muted-foreground text-center max-w-[200px]">
          Say "{letter.length > 1 ? `/${letter}/` : `the ${letter.toUpperCase()} sound`}" out loud while you trace
        </p>
      )}
    </div>
  );
}
