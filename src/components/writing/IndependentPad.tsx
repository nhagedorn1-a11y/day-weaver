import { useRef, useState, useEffect, useCallback } from 'react';
import { Check, RefreshCw, Star } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { useLetterValidation } from '@/hooks/useLetterValidation';
import { ValidationOverlay } from '@/components/writing/ValidationOverlay';

interface IndependentPadProps {
  letter: string;
  onComplete?: () => void;
  size?: number;
}

const AI_FALLBACK_ATTEMPTS = 3;
const MIN_POINTS_PER_STROKE = 5;
const VALIDATION_DELAY_MS = 1200;

export function IndependentPad({ letter, onComplete, size = 200 }: IndependentPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const isDrawingRef = useRef(false);
  const validationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [pointCount, setPointCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const { playComplete, playTokenEarned, speakPhoneme } = useSound();
  const { validate, validateWithAI, isChecking, feedback, clearFeedback } = useLetterValidation();

  useEffect(() => {
    pointsRef.current = [];
    setPointCount(0);
    setIsComplete(false);
    setAttempts(0);
    clearFeedback();
    if (validationTimerRef.current) {
      clearTimeout(validationTimerRef.current);
      validationTimerRef.current = null;
    }
  }, [letter]); // eslint-disable-line react-hooks/exhaustive-deps

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    ctx.strokeStyle = 'rgba(128, 128, 128, 0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    [0.2, 0.5, 0.8].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(0, size * y);
      ctx.lineTo(size, size * y);
      ctx.stroke();
    });
    ctx.setLineDash([]);

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
  }, [size]);

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
    if (isComplete || isChecking) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    // Cancel any pending validation — the child is still drawing
    if (validationTimerRef.current) {
      clearTimeout(validationTimerRef.current);
      validationTimerRef.current = null;
    }

    isDrawingRef.current = true;
    const point = getPosition(e);
    if (pointsRef.current.length > 0) {
      pointsRef.current.push({ x: NaN, y: NaN });
    }
    pointsRef.current.push(point);
    setPointCount(pointsRef.current.filter(p => !isNaN(p.x)).length);
    clearFeedback();

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
  }, [isComplete, isChecking, getPosition, clearFeedback]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawingRef.current || isComplete || isChecking) return;
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
  }, [isComplete, isChecking, getPosition]);

  // Debounced validation — waits VALIDATION_DELAY_MS after the last stroke
  const scheduleValidation = useCallback(() => {
    if (validationTimerRef.current) {
      clearTimeout(validationTimerRef.current);
    }

    validationTimerRef.current = setTimeout(async () => {
      validationTimerRef.current = null;
      const realPoints = pointsRef.current.filter(p => !isNaN(p.x));
      const result = await validate(canvasRef, realPoints, letter, size);

      if (result.isValid) {
        setIsComplete(true);
        playComplete();
        playTokenEarned();
        speakPhoneme(letter);
        onComplete?.();
      } else {
        if (realPoints.length > MIN_POINTS_PER_STROKE) {
          setAttempts(prev => prev + 1);
        }
      }
    }, VALIDATION_DELAY_MS);
  }, [validate, onComplete, playComplete, playTokenEarned, speakPhoneme, letter, size]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    isDrawingRef.current = false;
    scheduleValidation();
  }, [scheduleValidation]);

  const handleAskTeacher = useCallback(async () => {
    const result = await validateWithAI(canvasRef, letter);
    if (result.isValid) {
      setIsComplete(true);
      playComplete();
      playTokenEarned();
      speakPhoneme(letter);
      onComplete?.();
    }
  }, [validateWithAI, letter, playComplete, playTokenEarned, speakPhoneme, onComplete]);

  const handleClear = useCallback(() => {
    if (validationTimerRef.current) {
      clearTimeout(validationTimerRef.current);
      validationTimerRef.current = null;
    }
    pointsRef.current = [];
    setPointCount(0);
    setIsComplete(false);
    setAttempts(0);
    clearFeedback();
    drawCanvas();
  }, [drawCanvas, clearFeedback]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 p-3 rounded bg-token/10 border border-token/20">
        <Star className="w-5 h-5 text-token" />
        <span className="text-sm font-medium">Write the letter</span>
        <span className="text-3xl font-serif text-token">{letter}</span>
        <span className="text-sm font-medium">from memory!</span>
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
            ${isComplete ? 'border-token shadow-lg shadow-token/20' : 'border-border hover:border-primary/50'}
          `}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded bg-token/90 flex items-center justify-center animate-scale-in">
              <Star className="w-8 h-8 text-token-foreground fill-current" />
            </div>
          </div>
        )}

        <ValidationOverlay
          isChecking={isChecking}
          feedback={null}
          showAskTeacher={false}
          onAskTeacher={handleAskTeacher}
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          {!isComplete ? (
            <>
              <span className="text-sm text-muted-foreground">
                {isChecking
                  ? "Checking your letter..."
                  : pointCount === 0
                    ? "Write it on your own!"
                    : `Drawing... (${pointCount} points)`
                }
              </span>
              {pointCount > 0 && !isChecking && (
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
            <span className="text-sm font-medium text-token flex items-center gap-1">
              <Star className="w-4 h-4" />
              Amazing! You did it!
            </span>
          )}
        </div>

        {feedback && !isComplete && !isChecking && (
          <span className="text-sm text-muted-foreground italic">{feedback}</span>
        )}

        {!isComplete && attempts >= AI_FALLBACK_ATTEMPTS && pointCount > 0 && (
          <ValidationOverlay
            isChecking={false}
            feedback={null}
            showAskTeacher={true}
            onAskTeacher={handleAskTeacher}
          />
        )}
      </div>
    </div>
  );
}
