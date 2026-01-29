import { useState, useEffect } from 'react';
import { Star, Smile, Meh, Frown, Moon } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';

interface StatusStripProps {
  tokensEarned: number;
  tokensGoal: number;
  regulationLevel?: 'good' | 'okay' | 'hard';
  onTokenTap?: () => void;
  onRegulationTap?: () => void;
  childName?: string;
}

// Get moon phase (simplified)
const getMoonPhase = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Simplified moon phase calculation
  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month);
  const jd = c + e + day - 694039.09;
  const phase = jd / 29.5305882;
  const phaseIndex = Math.floor((phase - Math.floor(phase)) * 8);
  
  const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  const names = ['New', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  
  return { emoji: phases[phaseIndex], name: names[phaseIndex] };
};

export function StatusStrip({ 
  tokensEarned, 
  tokensGoal, 
  regulationLevel = 'good',
  onTokenTap,
  onRegulationTap,
}: StatusStripProps) {
  const [time, setTime] = useState(new Date());
  const [expandedSegment, setExpandedSegment] = useState<string | null>(null);
  const { weather } = useWeather();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const moonPhase = getMoonPhase();

  const regulationEmojis = {
    good: <Smile className="w-4 h-4 text-calm" />,
    okay: <Meh className="w-4 h-4 text-token" />,
    hard: <Frown className="w-4 h-4 text-destructive" />,
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const segments = [
    {
      id: 'time',
      content: (
        <span className="font-mono text-xs tracking-wider">
          {formatTime(time)}
        </span>
      ),
      expanded: (
        <div className="text-center">
          <div className="font-mono text-lg">{formatTime(time)}</div>
          <div className="text-xs text-muted-foreground">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
      ),
    },
    {
      id: 'weather',
      content: (
        <span className="text-sm">
          {weather?.emoji ?? '☀️'} <span className="font-mono text-xs">{weather ? `${weather.temperature}°` : '--°'}</span>
        </span>
      ),
      expanded: (
        <div className="text-center">
          <div className="text-2xl mb-1">{weather?.emoji ?? '☀️'}</div>
          <div className="font-mono text-sm">{weather ? `${weather.temperature}${weather.temperatureUnit}` : '--°F'}</div>
          <div className="text-xs text-muted-foreground">{weather?.description ?? 'Loading...'}</div>
          <div className="text-xs text-muted-foreground mt-1">{weather?.location ?? 'Palisades, NY'}</div>
        </div>
      ),
    },
    {
      id: 'moon',
      content: <span className="text-sm">{moonPhase.emoji}</span>,
      expanded: (
        <div className="text-center">
          <div className="text-2xl mb-1">{moonPhase.emoji}</div>
          <div className="text-xs text-muted-foreground">{moonPhase.name}</div>
        </div>
      ),
    },
    {
      id: 'tokens',
      content: (
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-token" fill="currentColor" />
          <span className="font-mono text-xs">{tokensEarned}/{tokensGoal}</span>
        </div>
      ),
      expanded: (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Star className="w-5 h-5 text-token" fill="currentColor" />
            <span className="font-mono text-lg">{tokensEarned}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {tokensGoal - tokensEarned > 0 ? `${tokensGoal - tokensEarned} to goal` : 'Goal reached!'}
          </div>
        </div>
      ),
      onClick: onTokenTap,
    },
    {
      id: 'regulation',
      content: regulationEmojis[regulationLevel],
      expanded: (
        <div className="text-center">
          <div className="text-2xl mb-1">
            {regulationLevel === 'good' ? '😊' : regulationLevel === 'okay' ? '😐' : '😔'}
          </div>
          <div className="text-xs text-muted-foreground capitalize">{regulationLevel}</div>
        </div>
      ),
      onClick: onRegulationTap,
    },
  ];

  return (
    <div className="relative">
      {/* Main strip */}
      <div className="flex items-stretch bg-card border-2 border-border rounded-xl overflow-hidden shadow-sm">
        {segments.map((segment, index) => (
          <button
            key={segment.id}
            onClick={() => {
              segment.onClick?.();
              setExpandedSegment(expandedSegment === segment.id ? null : segment.id);
            }}
            className={`
              flex items-center justify-center px-3 py-2 transition-all
              hover:bg-muted/50 active:bg-muted
              ${index > 0 ? 'border-l-2 border-border' : ''}
            `}
          >
            {segment.content}
          </button>
        ))}
      </div>

      {/* Expanded segment overlay */}
      {expandedSegment && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-xl p-4 shadow-lg animate-scale-in z-50"
          onClick={() => setExpandedSegment(null)}
        >
          {segments.find(s => s.id === expandedSegment)?.expanded}
        </div>
      )}
    </div>
  );
}
