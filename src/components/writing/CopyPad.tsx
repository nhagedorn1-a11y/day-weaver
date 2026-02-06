import { useRef, useState, useEffect, useCallback } from 'react';
import { Check, RefreshCw, Eye } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { validateLetterTrace } from '@/lib/letterValidation';

interface CopyPadProps {
  letter: string;
  onComplete?: () => void;
  size?: number;
}

export function CopyPad({ letter, onComplete, size = 200 }: CopyPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const isDrawingRef = useRef(false);
  const [isComplete, setIsComplete] = useState(false);
  const [pointCount, setPointCount] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const { playTrace, playComplete, speakPhoneme } = useSound();

  // Reset state when letter changes
  useEffect(() => {
    pointsRef.current = [];
    setPointCount(0);
    setIsComplete(false);
    setShowGuide(true);
  }, [letter]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    // Draw baseline guides
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(0, size * 0.2);
    ctx.lineTo(size, size * 0.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.lineTo(size, size * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, size * 0.8);
    ctx.lineTo(size, size * 0.8);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw the model letter on the left side if guide is shown
    if (showGuide) {
      const fontSize = size * 0.4;
      ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
      ctx.fillText(letter, size * 0.25, size * 0.5);

      // Arrow pointing to writing area
      ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.beginPath();
      ctx.moveTo(size * 0.45, size * 0.5);
      ctx.lineTo(size * 0.4, size * 0.45);
      ctx.lineTo(size * 0.4, size * 0.55);
      ctx.closePath();
      ctx.fill();
    }

    // Redraw all traced points (supporting multi-stroke with NaN sentinels)
    const points = pointsRef.current;
    if (points.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
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
  }, [letter, size, showGuide]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getPosition = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isComplete) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    isDrawingRef.current = true;
    const point = getPosition(e);

    // Accumulate across strokes
    if (pointsRef.current.length > 0) {
      pointsRef.current.push({ x: NaN, y: NaN }); // stroke break
    }
    pointsRef.current.push(point);
    setPointCount(pointsRef.current.filter(p => !isNaN(p.x)).length);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#6366f1';
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [isComplete, getPosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawingRef.current || isComplete) return;
    e.preventDefault();

    const point = getPosition(e);
    const lastPoint = pointsRef.current[pointsRef.current.length - 1];

    if (lastPoint && !isNaN(lastPoint.x)) {
      const distance = Math.sqrt(
        Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)
      );

      if (distance > 2) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.beginPath();
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        }
        pointsRef.current.push(point);
        setPointCount(pointsRef.current.filter(p => !isNaN(p.x)).length);
      }
    }
  }, [isComplete, getPosition]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    isDrawingRef.current = false;

    const realPoints = pointsRef.current.filter(p => !isNaN(p.x));
    if (validateLetterTrace(realPoints, letter, size)) {
      setIsComplete(true);
      playComplete();
      speakPhoneme(letter);
      onComplete?.();
    }
  }, [playComplete, speakPhoneme, letter, size, onComplete]);

  const handleClear = useCallback(() => {
    pointsRef.current = [];
    setPointCount(0);
    setIsComplete(false);
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Model letter display */}
      <div className="flex items-center gap-3 p-3 rounded bg-muted/50">
        <span className="text-4xl font-serif">{letter}</span>
        <span className="text-muted-foreground">→</span>
        <span className="text-sm text-muted-foreground">Copy it on the right</span>
      </div>

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
            <button
              onClick={() => setShowGuide(!showGuide)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                showGuide ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Guide</span>
            </button>
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
            Great copy!
          </span>
        )}
      </div>
    </div>
  );
}
