import { useRef, useState, useEffect, useCallback, TouchEvent, MouseEvent } from 'react';
import { RefreshCw, Check, Pencil } from 'lucide-react';
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
const COVERAGE_THRESHOLD = 0.12; // 12% of letter area
const MIN_POINTS = 20;

export function TracePad({ letter, onComplete, size = 200 }: TracePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<TracePoint[]>([]);
  const isDrawingRef = useRef(false);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [pointCount, setPointCount] = useState(0);
  const { playTrace, speakPhoneme } = useSound();

  // Draw guide letter (only on mount or letter change)
  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw subtle grid for guidance
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.2)';
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
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 6]);
    ctx.strokeText(displayLetter, size / 2, size / 2);
    ctx.setLineDash([]);
    
    // Fill with very light color
    ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.fillText(displayLetter, size / 2, size / 2);
  }, [letter, size]);

  // Initialize canvas
  useEffect(() => {
    drawGuide();
  }, [drawGuide]);

  // Draw a line segment
  const drawLine = useCallback((from: TracePoint, to: TracePoint, color: string = '#6366f1') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
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
    
    // Handle touch events
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    
    // Handle mouse/pointer events
    if ('clientX' in e) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
    
    return { x: 0, y: 0 };
  }, []);

  const checkCompletion = useCallback(() => {
    const points = pointsRef.current;
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
  }, [size]);

  const handleStart = useCallback((e: TouchEvent | MouseEvent | React.PointerEvent) => {
    if (isComplete) return;
    e.preventDefault();
    e.stopPropagation();
    
    isDrawingRef.current = true;
    const point = getPosition(e);
    pointsRef.current = [point];
    setPointCount(1);
    
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
    const lastPoint = pointsRef.current[pointsRef.current.length - 1];
    
    if (lastPoint) {
      // Only add point if it's far enough from the last one
      const distance = Math.sqrt(
        Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)
      );
      
      if (distance > 2) {
        drawLine(lastPoint, point);
        pointsRef.current.push(point);
        setPointCount(pointsRef.current.length);
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
    } else if (pointsRef.current.length > 10) {
      setAttempts(prev => prev + 1);
    }
  }, [checkCompletion, onComplete, playTrace, speakPhoneme, letter]);

  const handleClear = useCallback(() => {
    pointsRef.current = [];
    setPointCount(0);
    setIsComplete(false);
    setAttempts(0);
    drawGuide();
  }, [drawGuide]);

  // Handle pointer events for better cross-device support
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Capture pointer for better tracking
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{ touchAction: 'none' }}
          className={`
            rounded-2xl border-4 bg-card cursor-crosshair
            transition-colors duration-300 select-none
            ${isComplete ? 'border-calm shadow-lg shadow-calm/20' : 'border-border hover:border-primary/50'}
          `}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          // Fallback for older browsers
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={() => handleEnd()}
          onMouseLeave={() => handleEnd()}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={() => handleEnd()}
        />
        
        {/* Drawing indicator */}
        {!isComplete && pointCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-muted-foreground/50">
              <Pencil className="w-6 h-6" />
            </div>
          </div>
        )}
        
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
              {attempts > 0 && pointCount < MIN_POINTS 
                ? "Keep tracing the whole letter!" 
                : pointCount > 0 
                  ? `Tracing... (${Math.min(100, Math.round(pointCount / MIN_POINTS * 100))}%)`
                  : "Use finger or mouse to trace"
              }
            </span>
            {pointCount > 0 && (
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
