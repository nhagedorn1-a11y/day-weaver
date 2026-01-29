import { useRef, useState, useCallback, useEffect } from 'react';

interface RotaryDialProps {
  value: number; // current value in minutes
  min?: number;
  max?: number;
  step?: number; // detent interval
  onChange: (value: number) => void;
  onRelease?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showTicks?: boolean;
  label?: string;
}

export function RotaryDial({
  value,
  min = 1,
  max = 60,
  step = 5,
  onChange,
  onRelease,
  size = 'md',
  showTicks = true,
  label,
}: RotaryDialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastAngle, setLastAngle] = useState(0);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
  };

  const knobSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  // Convert value to rotation angle
  const valueToAngle = useCallback((val: number) => {
    const range = max - min;
    const normalized = (val - min) / range;
    return normalized * 270 - 135; // -135 to +135 degrees
  }, [min, max]);

  // Convert angle to value
  const angleToValue = useCallback((angle: number) => {
    const range = max - min;
    const normalized = (angle + 135) / 270;
    let rawValue = normalized * range + min;
    
    // Snap to step
    rawValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, rawValue));
  }, [min, max, step]);

  const getAngleFromEvent = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dialRef.current) return 0;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  }, []);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const angle = getAngleFromEvent(e.nativeEvent as MouseEvent | TouchEvent);
    setLastAngle(angle);
  }, [getAngleFromEvent]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const newAngle = getAngleFromEvent(e);
      let angleDelta = newAngle - lastAngle;
      
      // Handle wrap-around
      if (angleDelta > 180) angleDelta -= 360;
      if (angleDelta < -180) angleDelta += 360;
      
      const currentRotation = valueToAngle(value);
      let newRotation = currentRotation + angleDelta;
      
      // Clamp rotation
      newRotation = Math.max(-135, Math.min(135, newRotation));
      
      const newValue = angleToValue(newRotation);
      if (newValue !== value) {
        onChange(newValue);
      }
      
      setLastAngle(newAngle);
    };

    const handleEnd = () => {
      setIsDragging(false);
      onRelease?.(value);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, lastAngle, value, valueToAngle, angleToValue, onChange, onRelease, getAngleFromEvent]);

  const rotation = valueToAngle(value);
  const tickCount = Math.floor((max - min) / step) + 1;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Dial container */}
      <div 
        ref={dialRef}
        className={`relative ${sizeClasses[size]} select-none`}
      >
        {/* Tick marks */}
        {showTicks && Array.from({ length: tickCount }, (_, i) => {
          const tickValue = min + i * step;
          const tickAngle = valueToAngle(tickValue);
          const isActive = tickValue <= value;
          const isMajor = tickValue % (step * 2) === 0;
          
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                transform: `rotate(${tickAngle}deg) translateY(-50%)`,
                width: '50%',
              }}
            >
              <div 
                className={`
                  ml-auto rounded-full transition-colors duration-150
                  ${isMajor ? 'w-2 h-2' : 'w-1 h-1'}
                  ${isActive ? 'bg-primary' : 'bg-border'}
                `}
                style={{ marginRight: '4px' }}
              />
            </div>
          );
        })}

        {/* Active arc */}
        <svg className="absolute inset-0 w-full h-full -rotate-[225deg]">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="hsl(var(--primary) / 0.2)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${((value - min) / (max - min)) * 212} 283`}
          />
        </svg>

        {/* Knob */}
        <div 
          className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            ${knobSizes[size]} rounded-full 
            bg-gradient-to-br from-card via-card to-muted
            border-4 border-border shadow-lg
            cursor-grab active:cursor-grabbing
            transition-shadow duration-150
            ${isDragging ? 'shadow-xl ring-2 ring-primary/30' : ''}
          `}
          style={{
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
          {/* Indicator notch */}
          <div 
            className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-primary rounded-full"
          />
          
          {/* Center grip pattern */}
          <div className="absolute inset-4 rounded-full bg-muted/50 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Value display */}
      <div className="text-center">
        <div className="font-mono text-3xl font-bold text-foreground">
          {value}
        </div>
        {label && (
          <div className="hw-label mt-1">{label}</div>
        )}
      </div>
    </div>
  );
}
