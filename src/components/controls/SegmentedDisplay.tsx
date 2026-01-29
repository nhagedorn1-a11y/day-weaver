interface SegmentedDisplayProps {
  value: string | number;
  digits?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'token' | 'calm' | 'muted';
  label?: string;
  blinkColon?: boolean;
}

// Seven-segment digit paths
const segmentPaths: Record<string, boolean[]> = {
  // Segments: top, top-right, bottom-right, bottom, bottom-left, top-left, middle
  '0': [true, true, true, true, true, true, false],
  '1': [false, true, true, false, false, false, false],
  '2': [true, true, false, true, true, false, true],
  '3': [true, true, true, true, false, false, true],
  '4': [false, true, true, false, false, true, true],
  '5': [true, false, true, true, false, true, true],
  '6': [true, false, true, true, true, true, true],
  '7': [true, true, true, false, false, false, false],
  '8': [true, true, true, true, true, true, true],
  '9': [true, true, true, true, false, true, true],
  '-': [false, false, false, false, false, false, true],
  ' ': [false, false, false, false, false, false, false],
};

function SevenSegmentDigit({ 
  char, 
  size, 
  activeColor 
}: { 
  char: string; 
  size: 'sm' | 'md' | 'lg';
  activeColor: string;
}) {
  const segments = segmentPaths[char] || segmentPaths[' '];
  
  const sizes = {
    sm: { width: 20, height: 36, stroke: 3 },
    md: { width: 28, height: 50, stroke: 4 },
    lg: { width: 40, height: 72, stroke: 5 },
  };

  const { width, height, stroke } = sizes[size];
  const inactiveColor = 'hsl(var(--muted) / 0.3)';

  return (
    <svg width={width} height={height} viewBox="0 0 20 36" className="transition-colors duration-150">
      {/* Top segment */}
      <polygon
        points="2,1 18,1 15,4 5,4"
        fill={segments[0] ? activeColor : inactiveColor}
      />
      {/* Top-right segment */}
      <polygon
        points="17,2 20,5 20,16 17,19 14,16 14,5"
        fill={segments[1] ? activeColor : inactiveColor}
      />
      {/* Bottom-right segment */}
      <polygon
        points="17,17 20,20 20,31 17,34 14,31 14,20"
        fill={segments[2] ? activeColor : inactiveColor}
      />
      {/* Bottom segment */}
      <polygon
        points="5,32 15,32 18,35 2,35"
        fill={segments[3] ? activeColor : inactiveColor}
      />
      {/* Bottom-left segment */}
      <polygon
        points="3,17 6,20 6,31 3,34 0,31 0,20"
        fill={segments[4] ? activeColor : inactiveColor}
      />
      {/* Top-left segment */}
      <polygon
        points="3,2 6,5 6,16 3,19 0,16 0,5"
        fill={segments[5] ? activeColor : inactiveColor}
      />
      {/* Middle segment */}
      <polygon
        points="3,18 6,15 14,15 17,18 14,21 6,21"
        fill={segments[6] ? activeColor : inactiveColor}
      />
    </svg>
  );
}

function Colon({ 
  size, 
  blink, 
  activeColor 
}: { 
  size: 'sm' | 'md' | 'lg'; 
  blink: boolean;
  activeColor: string;
}) {
  const sizes = {
    sm: { width: 8, dotSize: 3 },
    md: { width: 12, dotSize: 4 },
    lg: { width: 16, dotSize: 6 },
  };

  const { width, dotSize } = sizes[size];

  return (
    <div 
      className={`flex flex-col justify-center items-center gap-2 ${blink ? 'animate-pulse' : ''}`}
      style={{ width }}
    >
      <div 
        className="rounded-full"
        style={{ 
          width: dotSize, 
          height: dotSize, 
          backgroundColor: activeColor 
        }}
      />
      <div 
        className="rounded-full"
        style={{ 
          width: dotSize, 
          height: dotSize, 
          backgroundColor: activeColor 
        }}
      />
    </div>
  );
}

export function SegmentedDisplay({
  value,
  digits = 4,
  size = 'md',
  color = 'primary',
  label,
  blinkColon = false,
}: SegmentedDisplayProps) {
  const colorMap = {
    primary: 'hsl(var(--primary))',
    token: 'hsl(var(--token))',
    calm: 'hsl(var(--calm))',
    muted: 'hsl(var(--muted-foreground))',
  };

  const activeColor = colorMap[color];
  
  // Format value as string with padding
  const strValue = String(value);
  const isTime = strValue.includes(':');
  
  let displayChars: (string | 'colon')[];
  
  if (isTime) {
    const [mins, secs] = strValue.split(':');
    displayChars = [
      ...mins.padStart(2, ' ').split(''),
      'colon',
      ...secs.padStart(2, '0').split(''),
    ];
  } else {
    displayChars = strValue.padStart(digits, ' ').split('');
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="flex items-center justify-center gap-1 bg-muted/20 rounded-xl px-4 py-3 border border-border"
      >
        {displayChars.map((char, i) => 
          char === 'colon' ? (
            <Colon 
              key={`colon-${i}`} 
              size={size} 
              blink={blinkColon} 
              activeColor={activeColor}
            />
          ) : (
            <SevenSegmentDigit 
              key={i} 
              char={char} 
              size={size} 
              activeColor={activeColor}
            />
          )
        )}
      </div>
      
      {label && (
        <span className="hw-label">{label}</span>
      )}
    </div>
  );
}
