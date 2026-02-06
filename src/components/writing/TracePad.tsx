import { useRef, useState, useEffect, useCallback, TouchEvent, MouseEvent } from 'react';
import { RefreshCw, Check, Pencil } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { validateLetterTrace } from '@/lib/letterValidation';

interface TracePoint {
  x: number;
  y: number;
}

interface TracePadProps {
  letter: string;
  onComplete?: () => void;
  size?: number;
}

const MIN_POINTS_PER_STROKE = 5;

export function TracePad({ letter, onComplete, size = 200 }: TracePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<TracePoint[]>([]);
  const isDrawingRef = useRef(false);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [pointCount, setPointCount] = useState(0);
  const { playTrace, speakPhoneme } = useSound();

  // Draw guide letter
  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    
    // Draw subtle grid for guidance
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.2)';
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

    // Draw guide letter (large, dashed)
    const displayLetter = letter.length > 1 ? letter : letter.toUpperCase();
    const fontSize = letter.length > 1 ? size * 0.5 : size * 0.65;
    
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 6]);
    ctx.strokeText(displayLetter, size / 2, size / 2);
    ctx.setLineDash([]);
    
    ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.fillText(displayLetter, size / 2, size / 2);

    // Redraw existing trace lines if any (for multi-stroke)
    const points = pointsRef.current;
    if (points.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        // Check for stroke breaks (marked by NaN sentinel)
        if (isNaN(points[i].x)) {
          if (i + 1 < points.length && !isNaN(points[i + 1].x)) {
            ctx.moveTo(points[i + 1].x, points[i + 1].y);
          }
          continue;
        }
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }
  }, [letter, size]);

  // Reset state when letter changes
  useEffect(() => {
    pointsRef.current = [];
    setPointCount(0);
    setIsComplete(false);
    setAttempts(0);
    drawGuide();
  }, [letter, size]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize canvas
  useEffect(() => {
    drawGuide();
  }, [drawGuide]);

  const drawLine = useCallback((from: TracePoint, to: TracePoint) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }, []);

  const getPosition = useCallback((e: TouchEvent | MouseEvent | React.PointerEvent): TracePoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    
    if ('clientX' in e) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
    
    return { x: 0, y: 0 };
  }, []);

  const checkCompletion = useCallback(() => {
    // Filter out stroke-break sentinels for validation
    const realPoints = pointsRef.current.filter(p => !isNaN(p.x));
    return validateLetterTrace(realPoints, letter, size);
  }, [letter, size]);

  const handleStart = useCallback((e: TouchEvent | MouseEvent | React.PointerEvent) => {
    if (isComplete) return;
    e.preventDefault();
    e.stopPropagation();
    
    isDrawingRef.current = true;
    const point = getPosition(e);

    // Accumulate across strokes — add a sentinel to mark stroke break
    if (pointsRef.current.length > 0) {
      pointsRef.current.push({ x: NaN, y: NaN }); // stroke break
    }
    pointsRef.current.push(point);
    setPointCount(pointsRef.current.filter(p => !isNaN(p.x)).length);
    
    // Draw starting dot
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#6366f1';
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [isComplete, getPosition]);

  const handleMove = useCallback((e: TouchEvent | MouseEvent | React.PointerEvent) => {
    if (!isDrawingRef.current || isComplete) return;
    e.preventDefault();
    e.stopPropagation();
    
    const point = getPosition(e);
    const allPoints = pointsRef.current;
    const lastPoint = allPoints[allPoints.length - 1];
    
    if (lastPoint && !isNaN(lastPoint.x)) {
      const distance = Math.sqrt(
        Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)
      );
      
      if (distance > 2) {
        drawLine(lastPoint, point);
        pointsRef.current.push(point);
        setPointCount(pointsRef.current.filter(p => !isNaN(p.x)).length);
      }
    }
  }, [isComplete, getPosition, drawLine]);

  const handleEnd = useCallback((e?: TouchEvent | MouseEvent | React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    isDrawingRef.current = false;
    
    if (checkCompletion()) {
      setIsComplete(true);
      playTrace();
      speakPhoneme(letter);
      onComplete?.();
    } else {
      const realPoints = pointsRef.current.filter(p => !isNaN(p.x));
      if (realPoints.length > MIN_POINTS_PER_STROKE) {
        setAttempts(prev => prev + 1);
      }
    }
  }, [checkCompletion, onComplete, playTrace, speakPhoneme, letter]);

  const handleClear = useCallback(() => {
    pointsRef.current = [];
    setPointCount(0);
    setIsComplete(false);
    setAttempts(0);
    drawGuide();
  }, [drawGuide]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handleStart(e);
  }, [handleStart]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    handleMove(e);
  }, [handleMove]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    handleEnd(e);
  }, [handleEnd]);

  const realPointCount = pointsRef.current.filter(p => !isNaN(p.x)).length;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{ touchAction: 'none' }}
          className={`
            rounded border-4 bg-card cursor-crosshair
            transition-colors duration-300 select-none
            ${isComplete ? 'border-calm shadow-lg shadow-calm/20' : 'border-border hover:border-primary/50'}
          `}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={() => handleEnd()}
          onMouseLeave={() => handleEnd()}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={() => handleEnd()}
        />
        
        {!isComplete && pointCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-muted-foreground/50">
              <Pencil className="w-6 h-6" />
            </div>
          </div>
        )}
        
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
              {attempts > 1
                ? "Trace the whole letter shape carefully!"
                : attempts === 1
                  ? "Try again — follow the guide closely"
                  : pointCount > 0 
                    ? `Tracing... (${realPointCount} points)`
                    : "Use finger or mouse to trace"
              }
            </span>
            {pointCount > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80"
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

      {!isComplete && (
        <p className="text-xs text-muted-foreground text-center max-w-[200px]">
          Say "{letter.length > 1 ? `/${letter}/` : `the ${letter.toUpperCase()} sound`}" out loud while you trace
        </p>
      )}
    </div>
  );
}
