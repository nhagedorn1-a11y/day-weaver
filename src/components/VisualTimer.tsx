import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings2 } from 'lucide-react';
import { TimeScrollPicker } from './ui/scroll-picker';

interface VisualTimerProps {
  duration: number; // seconds
  onComplete: () => void;
  onExtend?: (seconds: number) => void;
  onDurationChange?: (newDuration: number) => void;
  label?: string;
  variant?: 'circle' | 'bar' | 'sand';
  showControls?: boolean;
  autoStart?: boolean;
}

type TimerPhase = 'green' | 'yellow' | 'red';

export function VisualTimer({
  duration,
  onComplete,
  onExtend,
  onDurationChange,
  label,
  variant = 'circle',
  showControls = true,
  autoStart = false,
}: VisualTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isMuted, setIsMuted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMinutes, setEditMinutes] = useState(Math.floor(duration / 60));
  const [editSeconds, setEditSeconds] = useState(duration % 60);

  const progress = timeRemaining / duration;
  
  // Phase based on time remaining
  const getPhase = (): TimerPhase => {
    if (progress > 0.5) return 'green';
    if (progress > 0.2) return 'yellow';
    return 'red';
  };

  const phase = getPhase();

  const phaseColors = {
    green: 'hsl(150, 50%, 45%)',
    yellow: 'hsl(45, 90%, 55%)',
    red: 'hsl(15, 70%, 55%)',
  };

  const phaseBgColors = {
    green: 'hsl(150, 30%, 92%)',
    yellow: 'hsl(45, 50%, 92%)',
    red: 'hsl(15, 40%, 92%)',
  };

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeRemaining]);

  // Sync edit values when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditMinutes(Math.floor(timeRemaining / 60));
      setEditSeconds(timeRemaining % 60);
    }
  }, [isEditing]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApplyTime = useCallback(() => {
    const newDuration = editMinutes * 60 + editSeconds;
    if (newDuration > 0) {
      setTimeRemaining(newDuration);
      onDurationChange?.(newDuration);
    }
    setIsEditing(false);
  }, [editMinutes, editSeconds, onDurationChange]);

  const handleBridgeComplete = () => {
    onComplete();
    setIsComplete(false);
  };

  // Bridge screen - "Time's up, what's next"
  if (isComplete) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-8 rounded text-center transition-all"
        style={{ backgroundColor: phaseBgColors.green }}
      >
        <div className="text-5xl mb-4">✨</div>
        <h3 className="text-2xl font-semibold mb-2" style={{ color: phaseColors.green }}>
          Time's Up!
        </h3>
        <p className="text-muted-foreground mb-6">Ready for what's next?</p>
        <button
          onClick={handleBridgeComplete}
          className="giant-button w-full bg-calm text-calm-foreground"
        >
          <span>Let's Go →</span>
        </button>
      </div>
    );
  }

  // Time picker edit mode
  if (isEditing) {
    return (
      <div 
        className="flex flex-col items-center p-6 rounded transition-colors"
        style={{ backgroundColor: phaseBgColors[phase] }}
      >
        <span 
          className="hw-label mb-4"
          style={{ color: phaseColors[phase] }}
        >
          Set Time
        </span>

        <TimeScrollPicker
          minutes={editMinutes}
          seconds={editSeconds}
          onMinutesChange={setEditMinutes}
          onSecondsChange={setEditSeconds}
          maxMinutes={60}
          className="mb-6"
        />

        <div className="flex gap-3 w-full">
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 py-3 px-4 rounded bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyTime}
            className="flex-1 py-3 px-4 rounded font-semibold transition-colors"
            style={{ 
              backgroundColor: phaseColors[phase],
              color: 'white'
            }}
          >
            Set Timer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col items-center p-6 rounded transition-colors"
      style={{ backgroundColor: phaseBgColors[phase] }}
    >
      {label && (
        <span className="hw-label mb-4" style={{ color: phaseColors[phase] }}>
          {label}
        </span>
      )}

      {/* Timer visualization */}
      {variant === 'circle' && (
        <div 
          className="relative w-48 h-48 mb-6 cursor-pointer group"
          onClick={() => !isRunning && setIsEditing(true)}
        >
          {/* Edit hint overlay */}
          {!isRunning && (
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-foreground/10 rounded p-3">
                <Settings2 className="w-6 h-6 text-foreground/60" />
              </div>
            </div>
          )}
          
          {/* Background circle */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-background/50"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={phaseColors[phase]}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress * 283} 283`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          {/* Center time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span 
              className="timer-display"
              style={{ color: phaseColors[phase] }}
            >
              {formatTime(timeRemaining)}
            </span>
            {!isRunning && (
              <span className="text-xs text-muted-foreground mt-1">Tap to edit</span>
            )}
          </div>
        </div>
      )}

      {variant === 'bar' && (
        <div 
          className="w-full mb-6 cursor-pointer group"
          onClick={() => !isRunning && setIsEditing(true)}
        >
          <div className="h-8 rounded bg-background/50 overflow-hidden">
            <div
              className="h-full rounded transition-all duration-1000 ease-linear"
              style={{ 
                width: `${progress * 100}%`,
                backgroundColor: phaseColors[phase]
              }}
            />
          </div>
          <div className="mt-4 text-center relative">
            <span 
              className="timer-display"
              style={{ color: phaseColors[phase] }}
            >
              {formatTime(timeRemaining)}
            </span>
            {!isRunning && (
              <span className="block text-xs text-muted-foreground mt-1">Tap to edit</span>
            )}
          </div>
        </div>
      )}

      {variant === 'sand' && (
        <div 
          className="relative w-32 h-48 mb-6 cursor-pointer group"
          onClick={() => !isRunning && setIsEditing(true)}
        >
          {/* Sand timer visualization */}
          <div 
            className="absolute inset-x-0 top-0 rounded overflow-hidden transition-all duration-1000"
            style={{ 
              height: `${(1 - progress) * 45}%`,
              backgroundColor: phaseBgColors[phase]
            }}
          />
          <div 
            className="absolute inset-x-4 bottom-0 rounded overflow-hidden transition-all duration-1000"
            style={{ 
              height: `${progress * 45}%`,
              backgroundColor: phaseColors[phase]
            }}
          />
          <div 
            className="absolute inset-0 border-4 rounded"
            style={{ borderColor: phaseColors[phase] }}
          />
          <div className="absolute -bottom-12 inset-x-0 text-center">
            <span 
              className="font-mono text-2xl font-bold"
              style={{ color: phaseColors[phase] }}
            >
              {formatTime(timeRemaining)}
            </span>
            {!isRunning && (
              <span className="block text-xs text-muted-foreground mt-1">Tap to edit</span>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="flex items-center gap-3 w-full">
          {/* Edit Time */}
          <button
            onClick={() => setIsEditing(true)}
            disabled={isRunning}
            className="w-12 h-12 rounded bg-background/50 flex items-center justify-center disabled:opacity-30 hover:bg-background/70 transition-colors"
          >
            <Settings2 className="w-5 h-5" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 h-14 rounded font-semibold flex items-center justify-center gap-2 transition-colors"
            style={{ 
              backgroundColor: phaseColors[phase],
              color: 'white'
            }}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start</span>
              </>
            )}
          </button>

          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 rounded bg-background/50 flex items-center justify-center hover:bg-background/70 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 opacity-50" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
