import { useState, useCallback, useRef, useEffect } from 'react';
import { Check, RefreshCw } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

interface DotToDotPadProps {
  letter: string;
  onComplete?: () => void;
  size?: number;
}

// Define dot positions for common letters (normalized 0-1 coordinates)
const LETTER_DOTS: Record<string, { x: number; y: number; order: number }[]> = {
  // Uppercase
  'A': [
    { x: 0.5, y: 0.15, order: 1 },   // Top
    { x: 0.2, y: 0.85, order: 2 },   // Bottom left
    { x: 0.8, y: 0.85, order: 3 },   // Bottom right
    { x: 0.35, y: 0.55, order: 4 },  // Cross left
    { x: 0.65, y: 0.55, order: 5 },  // Cross right
  ],
  'B': [
    { x: 0.25, y: 0.15, order: 1 },  // Top
    { x: 0.25, y: 0.5, order: 2 },   // Middle
    { x: 0.25, y: 0.85, order: 3 },  // Bottom
    { x: 0.6, y: 0.3, order: 4 },    // Upper bump
    { x: 0.65, y: 0.7, order: 5 },   // Lower bump
  ],
  'C': [
    { x: 0.75, y: 0.25, order: 1 },  // Top right
    { x: 0.35, y: 0.15, order: 2 },  // Top
    { x: 0.2, y: 0.5, order: 3 },    // Left middle
    { x: 0.35, y: 0.85, order: 4 },  // Bottom
    { x: 0.75, y: 0.75, order: 5 },  // Bottom right
  ],
  'D': [
    { x: 0.25, y: 0.15, order: 1 },  // Top left
    { x: 0.25, y: 0.85, order: 2 },  // Bottom left
    { x: 0.6, y: 0.15, order: 3 },   // Top curve
    { x: 0.75, y: 0.5, order: 4 },   // Right curve
    { x: 0.6, y: 0.85, order: 5 },   // Bottom curve
  ],
  'E': [
    { x: 0.7, y: 0.15, order: 1 },   // Top right
    { x: 0.25, y: 0.15, order: 2 },  // Top left
    { x: 0.25, y: 0.5, order: 3 },   // Middle left
    { x: 0.6, y: 0.5, order: 4 },    // Middle right
    { x: 0.25, y: 0.85, order: 5 },  // Bottom left
    { x: 0.7, y: 0.85, order: 6 },   // Bottom right
  ],
  'F': [
    { x: 0.7, y: 0.15, order: 1 },   // Top right
    { x: 0.25, y: 0.15, order: 2 },  // Top left
    { x: 0.25, y: 0.5, order: 3 },   // Middle
    { x: 0.55, y: 0.5, order: 4 },   // Middle right
    { x: 0.25, y: 0.85, order: 5 },  // Bottom
  ],
  'G': [
    { x: 0.75, y: 0.25, order: 1 },
    { x: 0.5, y: 0.15, order: 2 },
    { x: 0.2, y: 0.5, order: 3 },
    { x: 0.5, y: 0.85, order: 4 },
    { x: 0.75, y: 0.6, order: 5 },
    { x: 0.55, y: 0.6, order: 6 },
  ],
  'H': [
    { x: 0.25, y: 0.15, order: 1 },
    { x: 0.25, y: 0.5, order: 2 },
    { x: 0.25, y: 0.85, order: 3 },
    { x: 0.75, y: 0.5, order: 4 },
    { x: 0.75, y: 0.15, order: 5 },
    { x: 0.75, y: 0.85, order: 6 },
  ],
  'I': [
    { x: 0.35, y: 0.15, order: 1 },
    { x: 0.65, y: 0.15, order: 2 },
    { x: 0.5, y: 0.15, order: 3 },
    { x: 0.5, y: 0.85, order: 4 },
    { x: 0.35, y: 0.85, order: 5 },
    { x: 0.65, y: 0.85, order: 6 },
  ],
  'L': [
    { x: 0.3, y: 0.15, order: 1 },
    { x: 0.3, y: 0.85, order: 2 },
    { x: 0.7, y: 0.85, order: 3 },
  ],
  'M': [
    { x: 0.15, y: 0.85, order: 1 },
    { x: 0.15, y: 0.15, order: 2 },
    { x: 0.5, y: 0.5, order: 3 },
    { x: 0.85, y: 0.15, order: 4 },
    { x: 0.85, y: 0.85, order: 5 },
  ],
  'N': [
    { x: 0.2, y: 0.85, order: 1 },
    { x: 0.2, y: 0.15, order: 2 },
    { x: 0.8, y: 0.85, order: 3 },
    { x: 0.8, y: 0.15, order: 4 },
  ],
  'O': [
    { x: 0.5, y: 0.15, order: 1 },
    { x: 0.2, y: 0.35, order: 2 },
    { x: 0.2, y: 0.65, order: 3 },
    { x: 0.5, y: 0.85, order: 4 },
    { x: 0.8, y: 0.65, order: 5 },
    { x: 0.8, y: 0.35, order: 6 },
  ],
  'T': [
    { x: 0.2, y: 0.15, order: 1 },
    { x: 0.8, y: 0.15, order: 2 },
    { x: 0.5, y: 0.15, order: 3 },
    { x: 0.5, y: 0.85, order: 4 },
  ],
  // Lowercase
  'a': [
    { x: 0.7, y: 0.35, order: 1 },
    { x: 0.5, y: 0.3, order: 2 },
    { x: 0.3, y: 0.5, order: 3 },
    { x: 0.5, y: 0.85, order: 4 },
    { x: 0.7, y: 0.6, order: 5 },
    { x: 0.7, y: 0.85, order: 6 },
  ],
  'b': [
    { x: 0.3, y: 0.15, order: 1 },
    { x: 0.3, y: 0.85, order: 2 },
    { x: 0.6, y: 0.5, order: 3 },
    { x: 0.7, y: 0.7, order: 4 },
  ],
  'c': [
    { x: 0.7, y: 0.4, order: 1 },
    { x: 0.5, y: 0.3, order: 2 },
    { x: 0.3, y: 0.55, order: 3 },
    { x: 0.5, y: 0.85, order: 4 },
    { x: 0.7, y: 0.75, order: 5 },
  ],
  'd': [
    { x: 0.7, y: 0.15, order: 1 },
    { x: 0.7, y: 0.85, order: 2 },
    { x: 0.4, y: 0.5, order: 3 },
    { x: 0.3, y: 0.7, order: 4 },
  ],
  'e': [
    { x: 0.3, y: 0.55, order: 1 },
    { x: 0.7, y: 0.55, order: 2 },
    { x: 0.7, y: 0.4, order: 3 },
    { x: 0.3, y: 0.7, order: 4 },
    { x: 0.7, y: 0.8, order: 5 },
  ],
  'l': [
    { x: 0.5, y: 0.15, order: 1 },
    { x: 0.5, y: 0.85, order: 2 },
  ],
  'm': [
    { x: 0.15, y: 0.85, order: 1 },
    { x: 0.15, y: 0.35, order: 2 },
    { x: 0.4, y: 0.35, order: 3 },
    { x: 0.5, y: 0.85, order: 4 },
    { x: 0.65, y: 0.35, order: 5 },
    { x: 0.85, y: 0.85, order: 6 },
  ],
  'n': [
    { x: 0.25, y: 0.85, order: 1 },
    { x: 0.25, y: 0.35, order: 2 },
    { x: 0.55, y: 0.35, order: 3 },
    { x: 0.75, y: 0.55, order: 4 },
    { x: 0.75, y: 0.85, order: 5 },
  ],
  'o': [
    { x: 0.5, y: 0.3, order: 1 },
    { x: 0.25, y: 0.55, order: 2 },
    { x: 0.5, y: 0.85, order: 3 },
    { x: 0.75, y: 0.55, order: 4 },
  ],
  't': [
    { x: 0.5, y: 0.15, order: 1 },
    { x: 0.5, y: 0.5, order: 2 },
    { x: 0.3, y: 0.4, order: 3 },
    { x: 0.7, y: 0.4, order: 4 },
    { x: 0.5, y: 0.85, order: 5 },
  ],
};

// Generate simple dots for letters without defined paths
function generateDefaultDots(letter: string): { x: number; y: number; order: number }[] {
  return [
    { x: 0.5, y: 0.2, order: 1 },
    { x: 0.3, y: 0.4, order: 2 },
    { x: 0.7, y: 0.5, order: 3 },
    { x: 0.4, y: 0.7, order: 4 },
    { x: 0.6, y: 0.85, order: 5 },
  ];
}

export function DotToDotPad({ letter, onComplete, size = 200 }: DotToDotPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [connectedDots, setConnectedDots] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const { playTap, playComplete, speakPhoneme } = useSound();

  const dots = LETTER_DOTS[letter] || generateDefaultDots(letter);
  const sortedDots = [...dots].sort((a, b) => a.order - b.order);

  // Draw the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    // Draw guide letter faintly
    const displayLetter = letter.length > 1 ? letter : letter;
    const fontSize = size * 0.6;
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
    sortedDots.forEach((dot, index) => {
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
  }, [letter, size, connectedDots, sortedDots]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleTap = useCallback((e: React.PointerEvent) => {
    if (isComplete) return;

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

      // Check completion
      if (newConnected.length === sortedDots.length) {
        setIsComplete(true);
        playComplete();
        speakPhoneme(letter);
        onComplete?.();
      }
    }
  }, [isComplete, connectedDots, sortedDots, size, playTap, playComplete, speakPhoneme, letter, onComplete]);

  const handleReset = () => {
    setConnectedDots([]);
    setIsComplete(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{ touchAction: 'none' }}
          className={`
            rounded-2xl border-4 bg-card cursor-pointer
            transition-colors duration-300 select-none
            ${isComplete ? 'border-calm shadow-lg shadow-calm/20' : 'border-border hover:border-primary/50'}
          `}
          onPointerDown={handleTap}
        />

        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-calm/90 flex items-center justify-center animate-scale-in">
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80"
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