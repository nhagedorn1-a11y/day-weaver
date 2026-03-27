import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';

interface StatusStripProps {
  tokensEarned: number;
  tokensGoal: number;
  regulationLevel?: 'good' | 'okay' | 'hard';
  onTokenTap?: () => void;
  onRegulationTap?: () => void;
  childName?: string;
}

export function StatusStrip({ 
  tokensEarned, 
  tokensGoal, 
  onTokenTap,
}: StatusStripProps) {
  const [time, setTime] = useState(new Date());
  const { weather } = useWeather();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="flex items-center gap-px bg-card border border-border rounded-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
      {/* Time */}
      <div className="flex items-center justify-center px-3 py-1.5">
        <span className="font-mono text-[11px] tracking-wider text-muted-foreground">
          {formatTime(time)}
        </span>
      </div>

      <div className="w-px h-4 bg-border" />

      {/* Weather */}
      <div className="flex items-center justify-center px-2.5 py-1.5">
        <span className="text-sm">
          {weather?.emoji ?? '☀️'}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground ml-1">
          {weather ? `${weather.temperature}°` : '--°'}
        </span>
      </div>

      <div className="w-px h-4 bg-border" />

      {/* Tokens */}
      <button
        onClick={onTokenTap}
        className="flex items-center justify-center gap-1 px-2.5 py-1.5 hover:bg-muted/50 transition-colors"
      >
        <Star className="w-3 h-3 text-token" fill="currentColor" />
        <span className="font-mono text-[11px] text-foreground">{tokensEarned}/{tokensGoal}</span>
      </button>
    </div>
  );
}
