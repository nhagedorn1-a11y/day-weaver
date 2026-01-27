import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ScrollPickerProps {
  values: (string | number)[];
  value: string | number;
  onChange: (value: string | number) => void;
  itemHeight?: number;
  visibleItems?: number;
  label?: string;
  className?: string;
}

export function ScrollPicker({
  values,
  value,
  onChange,
  itemHeight = 48,
  visibleItems = 5,
  label,
  className,
}: ScrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentIndex = values.indexOf(value);
  const halfVisible = Math.floor(visibleItems / 2);
  const containerHeight = itemHeight * visibleItems;

  // Scroll to selected value on mount and when value changes externally
  useEffect(() => {
    if (containerRef.current && !isScrolling) {
      const targetScroll = currentIndex * itemHeight;
      containerRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [currentIndex, itemHeight, isScrolling]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Debounce to detect scroll end
    scrollTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current) return;

      const scrollTop = containerRef.current.scrollTop;
      const newIndex = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(newIndex, values.length - 1));
      
      // Snap to nearest item
      containerRef.current.scrollTo({
        top: clampedIndex * itemHeight,
        behavior: 'smooth',
      });

      if (values[clampedIndex] !== value) {
        onChange(values[clampedIndex]);
      }
      
      setIsScrolling(false);
    }, 100);
  }, [itemHeight, values, value, onChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {label && (
        <span className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
          {label}
        </span>
      )}
      <div 
        className="relative overflow-hidden rounded-xl bg-muted/50"
        style={{ height: containerHeight }}
      >
        {/* Gradient overlays for fade effect */}
        <div 
          className="absolute inset-x-0 top-0 z-10 pointer-events-none bg-gradient-to-b from-background to-transparent"
          style={{ height: itemHeight * 1.5 }}
        />
        <div 
          className="absolute inset-x-0 bottom-0 z-10 pointer-events-none bg-gradient-to-t from-background to-transparent"
          style={{ height: itemHeight * 1.5 }}
        />
        
        {/* Selection highlight bar */}
        <div 
          className="absolute inset-x-2 z-5 rounded-lg bg-primary/15 border border-primary/20"
          style={{ 
            top: itemHeight * halfVisible,
            height: itemHeight,
          }}
        />

        {/* Scrollable container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto scrollbar-hide scroll-smooth snap-y snap-mandatory"
          style={{ 
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Padding items at start */}
          {Array.from({ length: halfVisible }).map((_, i) => (
            <div key={`pad-start-${i}`} style={{ height: itemHeight }} />
          ))}
          
          {/* Actual values */}
          {values.map((v, index) => {
            const isSelected = v === value;
            const distance = Math.abs(index - currentIndex);
            const opacity = isSelected ? 1 : Math.max(0.3, 1 - distance * 0.25);
            const scale = isSelected ? 1 : Math.max(0.85, 1 - distance * 0.05);
            
            return (
              <div
                key={`${v}-${index}`}
                className={cn(
                  "flex items-center justify-center font-mono transition-all duration-200 snap-center cursor-pointer",
                  isSelected ? "text-primary font-bold" : "text-foreground/70"
                )}
                style={{ 
                  height: itemHeight,
                  opacity,
                  transform: `scale(${scale})`,
                  fontSize: isSelected ? '2rem' : '1.5rem',
                }}
                onClick={() => {
                  onChange(v);
                }}
              >
                {typeof v === 'number' ? v.toString().padStart(2, '0') : v}
              </div>
            );
          })}
          
          {/* Padding items at end */}
          {Array.from({ length: halfVisible }).map((_, i) => (
            <div key={`pad-end-${i}`} style={{ height: itemHeight }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Compound time picker with minutes and seconds
interface TimeScrollPickerProps {
  minutes: number;
  seconds: number;
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
  maxMinutes?: number;
  className?: string;
}

export function TimeScrollPicker({
  minutes,
  seconds,
  onMinutesChange,
  onSecondsChange,
  maxMinutes = 60,
  className,
}: TimeScrollPickerProps) {
  const minuteValues = Array.from({ length: maxMinutes + 1 }, (_, i) => i);
  const secondValues = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ScrollPicker
        values={minuteValues}
        value={minutes}
        onChange={(v) => onMinutesChange(Number(v))}
        label="min"
        className="w-20"
      />
      
      <span className="text-3xl font-bold text-muted-foreground mt-6">:</span>
      
      <ScrollPicker
        values={secondValues}
        value={seconds}
        onChange={(v) => onSecondsChange(Number(v))}
        label="sec"
        className="w-20"
      />
    </div>
  );
}
