// Letter-shape validation for TracePad
// Uses waypoints — key positions the trace MUST pass through.
// A waypoint is "hit" if any trace point falls within WAYPOINT_RADIUS of it.
// The letter is considered correctly traced when >= MIN_WAYPOINTS_PCT of waypoints are hit.

interface Point {
  x: number;
  y: number;
}

const WAYPOINT_RADIUS = 0.18; // normalized distance tolerance
const MIN_TRACE_POINTS = 10;

// Dynamic threshold based on waypoint count:
// Fewer waypoints → higher hit requirement (prevents false positives on simple letters)
function getMinHitPct(waypointCount: number): number {
  if (waypointCount <= 3) return 1.0;    // ALL waypoints required (I, l, 1)
  if (waypointCount <= 5) return 0.6;    // 60% for medium complexity
  return 0.5;                             // 50% for complex letters
}

// Waypoints for every letter — positions along the natural stroke path (normalized 0-1)
const LETTER_WAYPOINTS: Record<string, Point[]> = {
  // ========================
  // UPPERCASE A-Z
  // ========================
  'A': [
    { x: 0.5, y: 0.15 },  // apex
    { x: 0.35, y: 0.5 },  // left leg mid
    { x: 0.2, y: 0.85 },  // bottom left
    { x: 0.65, y: 0.5 },  // right leg mid
    { x: 0.8, y: 0.85 },  // bottom right
    { x: 0.35, y: 0.55 }, // crossbar left
    { x: 0.65, y: 0.55 }, // crossbar right
  ],
  'B': [
    { x: 0.25, y: 0.15 }, // top
    { x: 0.25, y: 0.5 },  // middle
    { x: 0.25, y: 0.85 }, // bottom
    { x: 0.6, y: 0.25 },  // upper bump
    { x: 0.65, y: 0.4 },  // upper bump peak
    { x: 0.65, y: 0.65 }, // lower bump
    { x: 0.6, y: 0.8 },   // lower bump base
  ],
  'C': [
    { x: 0.7, y: 0.25 },  // start
    { x: 0.5, y: 0.15 },  // top
    { x: 0.25, y: 0.35 }, // upper left
    { x: 0.2, y: 0.5 },   // left
    { x: 0.25, y: 0.7 },  // lower left
    { x: 0.5, y: 0.85 },  // bottom
    { x: 0.7, y: 0.75 },  // end
  ],
  'D': [
    { x: 0.25, y: 0.15 },
    { x: 0.25, y: 0.5 },
    { x: 0.25, y: 0.85 },
    { x: 0.55, y: 0.85 },
    { x: 0.75, y: 0.5 },
    { x: 0.55, y: 0.15 },
  ],
  'E': [
    { x: 0.7, y: 0.15 },
    { x: 0.25, y: 0.15 },
    { x: 0.25, y: 0.5 },
    { x: 0.6, y: 0.5 },
    { x: 0.25, y: 0.85 },
    { x: 0.7, y: 0.85 },
  ],
  'F': [
    { x: 0.7, y: 0.15 },
    { x: 0.25, y: 0.15 },
    { x: 0.25, y: 0.5 },
    { x: 0.55, y: 0.5 },
    { x: 0.25, y: 0.85 },
  ],
  'G': [
    { x: 0.7, y: 0.25 },
    { x: 0.5, y: 0.15 },
    { x: 0.2, y: 0.5 },
    { x: 0.5, y: 0.85 },
    { x: 0.75, y: 0.65 },
    { x: 0.55, y: 0.55 },
  ],
  'H': [
    { x: 0.25, y: 0.15 },
    { x: 0.25, y: 0.5 },
    { x: 0.25, y: 0.85 },
    { x: 0.75, y: 0.5 },
    { x: 0.75, y: 0.15 },
    { x: 0.75, y: 0.85 },
  ],
  'I': [
    { x: 0.5, y: 0.15 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.85 },
  ],
  'J': [
    { x: 0.55, y: 0.15 },
    { x: 0.55, y: 0.5 },
    { x: 0.55, y: 0.7 },
    { x: 0.4, y: 0.85 },
    { x: 0.25, y: 0.75 },
  ],
  'K': [
    { x: 0.25, y: 0.15 },
    { x: 0.25, y: 0.5 },
    { x: 0.25, y: 0.85 },
    { x: 0.7, y: 0.15 },
    { x: 0.5, y: 0.35 },
    { x: 0.7, y: 0.85 },
    { x: 0.5, y: 0.65 },
  ],
  'L': [
    { x: 0.3, y: 0.15 },
    { x: 0.3, y: 0.5 },
    { x: 0.3, y: 0.85 },
    { x: 0.5, y: 0.85 },
    { x: 0.7, y: 0.85 },
  ],
  'M': [
    { x: 0.15, y: 0.85 },
    { x: 0.15, y: 0.15 },
    { x: 0.5, y: 0.55 },
    { x: 0.85, y: 0.15 },
    { x: 0.85, y: 0.85 },
  ],
  'N': [
    { x: 0.2, y: 0.85 },
    { x: 0.2, y: 0.15 },
    { x: 0.5, y: 0.5 },
    { x: 0.8, y: 0.85 },
    { x: 0.8, y: 0.15 },
  ],
  'O': [
    { x: 0.5, y: 0.15 },
    { x: 0.2, y: 0.35 },
    { x: 0.2, y: 0.65 },
    { x: 0.5, y: 0.85 },
    { x: 0.8, y: 0.65 },
    { x: 0.8, y: 0.35 },
  ],
  'P': [
    { x: 0.25, y: 0.15 },
    { x: 0.25, y: 0.5 },
    { x: 0.25, y: 0.85 },
    { x: 0.6, y: 0.15 },
    { x: 0.7, y: 0.3 },
    { x: 0.6, y: 0.5 },
  ],
  'Q': [
    { x: 0.5, y: 0.15 },
    { x: 0.2, y: 0.5 },
    { x: 0.5, y: 0.85 },
    { x: 0.8, y: 0.5 },
    { x: 0.7, y: 0.8 },
    { x: 0.8, y: 0.95 },
  ],
  'R': [
    { x: 0.25, y: 0.15 },
    { x: 0.25, y: 0.5 },
    { x: 0.25, y: 0.85 },
    { x: 0.6, y: 0.15 },
    { x: 0.7, y: 0.3 },
    { x: 0.65, y: 0.85 },
  ],
  'S': [
    { x: 0.7, y: 0.25 },
    { x: 0.5, y: 0.15 },
    { x: 0.3, y: 0.3 },
    { x: 0.5, y: 0.5 },
    { x: 0.7, y: 0.65 },
    { x: 0.5, y: 0.85 },
    { x: 0.3, y: 0.75 },
  ],
  'T': [
    { x: 0.2, y: 0.15 },
    { x: 0.5, y: 0.15 },
    { x: 0.8, y: 0.15 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.85 },
  ],
  'U': [
    { x: 0.2, y: 0.15 },
    { x: 0.2, y: 0.65 },
    { x: 0.5, y: 0.85 },
    { x: 0.8, y: 0.65 },
    { x: 0.8, y: 0.15 },
  ],
  'V': [
    { x: 0.2, y: 0.15 },
    { x: 0.35, y: 0.5 },
    { x: 0.5, y: 0.85 },
    { x: 0.65, y: 0.5 },
    { x: 0.8, y: 0.15 },
  ],
  'W': [
    { x: 0.1, y: 0.15 },
    { x: 0.3, y: 0.85 },
    { x: 0.5, y: 0.4 },
    { x: 0.7, y: 0.85 },
    { x: 0.9, y: 0.15 },
  ],
  'X': [
    { x: 0.2, y: 0.15 },
    { x: 0.5, y: 0.5 },
    { x: 0.8, y: 0.85 },
    { x: 0.8, y: 0.15 },
    { x: 0.2, y: 0.85 },
  ],
  'Y': [
    { x: 0.2, y: 0.15 },
    { x: 0.5, y: 0.5 },
    { x: 0.8, y: 0.15 },
    { x: 0.5, y: 0.7 },
    { x: 0.5, y: 0.85 },
  ],
  'Z': [
    { x: 0.2, y: 0.15 },
    { x: 0.5, y: 0.15 },
    { x: 0.8, y: 0.15 },
    { x: 0.5, y: 0.5 },
    { x: 0.2, y: 0.85 },
    { x: 0.5, y: 0.85 },
    { x: 0.8, y: 0.85 },
  ],

  // ========================
  // LOWERCASE a-z
  // ========================
  'a': [
    { x: 0.65, y: 0.35 },
    { x: 0.45, y: 0.3 },
    { x: 0.3, y: 0.5 },
    { x: 0.45, y: 0.85 },
    { x: 0.65, y: 0.6 },
    { x: 0.65, y: 0.85 },
  ],
  'b': [
    { x: 0.3, y: 0.15 },
    { x: 0.3, y: 0.5 },
    { x: 0.3, y: 0.85 },
    { x: 0.55, y: 0.85 },
    { x: 0.65, y: 0.6 },
    { x: 0.5, y: 0.38 },
  ],
  'c': [
    { x: 0.65, y: 0.4 },
    { x: 0.45, y: 0.3 },
    { x: 0.3, y: 0.55 },
    { x: 0.45, y: 0.85 },
    { x: 0.65, y: 0.75 },
  ],
  'd': [
    { x: 0.65, y: 0.15 },
    { x: 0.65, y: 0.5 },
    { x: 0.65, y: 0.85 },
    { x: 0.45, y: 0.85 },
    { x: 0.3, y: 0.6 },
    { x: 0.45, y: 0.38 },
  ],
  'e': [
    { x: 0.3, y: 0.55 },
    { x: 0.65, y: 0.55 },
    { x: 0.65, y: 0.4 },
    { x: 0.45, y: 0.3 },
    { x: 0.3, y: 0.7 },
    { x: 0.5, y: 0.85 },
  ],
  'f': [
    { x: 0.6, y: 0.2 },
    { x: 0.45, y: 0.15 },
    { x: 0.38, y: 0.35 },
    { x: 0.38, y: 0.6 },
    { x: 0.38, y: 0.85 },
    { x: 0.25, y: 0.45 },
    { x: 0.55, y: 0.45 },
  ],
  'g': [
    { x: 0.65, y: 0.35 },
    { x: 0.45, y: 0.3 },
    { x: 0.3, y: 0.55 },
    { x: 0.45, y: 0.78 },
    { x: 0.65, y: 0.6 },
    { x: 0.65, y: 0.9 },
    { x: 0.45, y: 0.98 },
  ],
  'h': [
    { x: 0.3, y: 0.15 },
    { x: 0.3, y: 0.5 },
    { x: 0.3, y: 0.85 },
    { x: 0.5, y: 0.38 },
    { x: 0.65, y: 0.55 },
    { x: 0.65, y: 0.85 },
  ],
  'i': [
    { x: 0.5, y: 0.4 },
    { x: 0.5, y: 0.6 },
    { x: 0.5, y: 0.85 },
  ],
  'j': [
    { x: 0.55, y: 0.4 },
    { x: 0.55, y: 0.7 },
    { x: 0.45, y: 0.9 },
    { x: 0.3, y: 0.85 },
  ],
  'k': [
    { x: 0.3, y: 0.15 },
    { x: 0.3, y: 0.5 },
    { x: 0.3, y: 0.85 },
    { x: 0.6, y: 0.35 },
    { x: 0.6, y: 0.85 },
  ],
  'l': [
    { x: 0.5, y: 0.15 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.85 },
  ],
  'm': [
    { x: 0.15, y: 0.85 },
    { x: 0.15, y: 0.38 },
    { x: 0.35, y: 0.35 },
    { x: 0.42, y: 0.6 },
    { x: 0.42, y: 0.85 },
    { x: 0.62, y: 0.35 },
    { x: 0.75, y: 0.6 },
    { x: 0.85, y: 0.85 },
  ],
  'n': [
    { x: 0.25, y: 0.85 },
    { x: 0.25, y: 0.38 },
    { x: 0.5, y: 0.35 },
    { x: 0.7, y: 0.55 },
    { x: 0.7, y: 0.85 },
  ],
  'o': [
    { x: 0.5, y: 0.3 },
    { x: 0.3, y: 0.5 },
    { x: 0.3, y: 0.7 },
    { x: 0.5, y: 0.85 },
    { x: 0.7, y: 0.7 },
    { x: 0.7, y: 0.5 },
  ],
  'p': [
    { x: 0.3, y: 0.38 },
    { x: 0.3, y: 0.65 },
    { x: 0.3, y: 0.95 },
    { x: 0.5, y: 0.35 },
    { x: 0.65, y: 0.5 },
    { x: 0.5, y: 0.75 },
  ],
  'q': [
    { x: 0.6, y: 0.38 },
    { x: 0.4, y: 0.3 },
    { x: 0.3, y: 0.55 },
    { x: 0.45, y: 0.78 },
    { x: 0.6, y: 0.6 },
    { x: 0.6, y: 0.95 },
  ],
  'r': [
    { x: 0.35, y: 0.38 },
    { x: 0.35, y: 0.6 },
    { x: 0.35, y: 0.85 },
    { x: 0.55, y: 0.38 },
    { x: 0.65, y: 0.42 },
  ],
  's': [
    { x: 0.6, y: 0.38 },
    { x: 0.45, y: 0.3 },
    { x: 0.3, y: 0.42 },
    { x: 0.5, y: 0.55 },
    { x: 0.65, y: 0.68 },
    { x: 0.5, y: 0.85 },
    { x: 0.3, y: 0.78 },
  ],
  't': [
    { x: 0.5, y: 0.15 },
    { x: 0.5, y: 0.4 },
    { x: 0.5, y: 0.65 },
    { x: 0.5, y: 0.85 },
    { x: 0.3, y: 0.4 },
    { x: 0.7, y: 0.4 },
  ],
  'u': [
    { x: 0.3, y: 0.38 },
    { x: 0.3, y: 0.65 },
    { x: 0.5, y: 0.85 },
    { x: 0.65, y: 0.65 },
    { x: 0.65, y: 0.38 },
    { x: 0.65, y: 0.85 },
  ],
  'v': [
    { x: 0.25, y: 0.35 },
    { x: 0.38, y: 0.6 },
    { x: 0.5, y: 0.85 },
    { x: 0.62, y: 0.6 },
    { x: 0.75, y: 0.35 },
  ],
  'w': [
    { x: 0.12, y: 0.35 },
    { x: 0.3, y: 0.85 },
    { x: 0.5, y: 0.5 },
    { x: 0.7, y: 0.85 },
    { x: 0.88, y: 0.35 },
  ],
  'x': [
    { x: 0.25, y: 0.35 },
    { x: 0.5, y: 0.6 },
    { x: 0.75, y: 0.85 },
    { x: 0.75, y: 0.35 },
    { x: 0.25, y: 0.85 },
  ],
  'y': [
    { x: 0.25, y: 0.35 },
    { x: 0.5, y: 0.6 },
    { x: 0.75, y: 0.35 },
    { x: 0.4, y: 0.85 },
    { x: 0.3, y: 0.95 },
  ],
  'z': [
    { x: 0.25, y: 0.35 },
    { x: 0.5, y: 0.35 },
    { x: 0.75, y: 0.35 },
    { x: 0.5, y: 0.6 },
    { x: 0.25, y: 0.85 },
    { x: 0.5, y: 0.85 },
    { x: 0.75, y: 0.85 },
  ],

  // ========================
  // NUMBERS 0-9, 10
  // ========================
  '0': [
    { x: 0.5, y: 0.15 },
    { x: 0.25, y: 0.35 },
    { x: 0.25, y: 0.65 },
    { x: 0.5, y: 0.85 },
    { x: 0.75, y: 0.65 },
    { x: 0.75, y: 0.35 },
  ],
  '1': [
    { x: 0.5, y: 0.15 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.85 },
  ],
  '2': [
    { x: 0.3, y: 0.3 },
    { x: 0.5, y: 0.15 },
    { x: 0.7, y: 0.3 },
    { x: 0.5, y: 0.5 },
    { x: 0.3, y: 0.85 },
    { x: 0.7, y: 0.85 },
  ],
  '3': [
    { x: 0.3, y: 0.2 },
    { x: 0.55, y: 0.15 },
    { x: 0.65, y: 0.3 },
    { x: 0.45, y: 0.48 },
    { x: 0.65, y: 0.65 },
    { x: 0.5, y: 0.85 },
    { x: 0.3, y: 0.8 },
  ],
  '4': [
    { x: 0.55, y: 0.15 },
    { x: 0.2, y: 0.6 },
    { x: 0.5, y: 0.6 },
    { x: 0.75, y: 0.6 },
    { x: 0.6, y: 0.85 },
  ],
  '5': [
    { x: 0.7, y: 0.15 },
    { x: 0.3, y: 0.15 },
    { x: 0.3, y: 0.48 },
    { x: 0.6, y: 0.45 },
    { x: 0.7, y: 0.6 },
    { x: 0.5, y: 0.85 },
    { x: 0.3, y: 0.78 },
  ],
  '6': [
    { x: 0.6, y: 0.18 },
    { x: 0.35, y: 0.25 },
    { x: 0.25, y: 0.5 },
    { x: 0.35, y: 0.85 },
    { x: 0.6, y: 0.8 },
    { x: 0.65, y: 0.6 },
    { x: 0.45, y: 0.5 },
  ],
  '7': [
    { x: 0.25, y: 0.15 },
    { x: 0.5, y: 0.15 },
    { x: 0.75, y: 0.15 },
    { x: 0.6, y: 0.5 },
    { x: 0.45, y: 0.85 },
  ],
  '8': [
    { x: 0.5, y: 0.15 },
    { x: 0.3, y: 0.25 },
    { x: 0.5, y: 0.5 },
    { x: 0.7, y: 0.7 },
    { x: 0.5, y: 0.85 },
    { x: 0.3, y: 0.7 },
    { x: 0.7, y: 0.3 },
  ],
  '9': [
    { x: 0.5, y: 0.2 },
    { x: 0.3, y: 0.3 },
    { x: 0.3, y: 0.45 },
    { x: 0.6, y: 0.4 },
    { x: 0.65, y: 0.6 },
    { x: 0.55, y: 0.85 },
  ],
  '10': [
    // 1 portion
    { x: 0.2, y: 0.15 },
    { x: 0.2, y: 0.5 },
    { x: 0.2, y: 0.85 },
    // 0 portion
    { x: 0.55, y: 0.15 },
    { x: 0.42, y: 0.5 },
    { x: 0.55, y: 0.85 },
    { x: 0.7, y: 0.5 },
  ],
};

/**
 * Validate that a set of trace points matches the expected shape of a letter.
 * Uses waypoint-based checking — each letter has key positions the trace must pass through.
 *
 * @param points - Array of trace points (in canvas coordinates)
 * @param letter - The target letter/character to validate against
 * @param canvasSize - The size of the canvas in pixels
 * @returns true if the trace sufficiently matches the letter shape
 */
export function validateLetterTrace(
  points: { x: number; y: number }[],
  letter: string,
  canvasSize: number,
): boolean {
  if (points.length < MIN_TRACE_POINTS) return false;

  // Try exact match first, then uppercase fallback
  const waypoints = LETTER_WAYPOINTS[letter] ?? LETTER_WAYPOINTS[letter.toUpperCase()];

  // If no waypoints defined, fall back to basic coverage check
  if (!waypoints || waypoints.length === 0) {
    return fallbackCoverageCheck(points, canvasSize);
  }

  // Normalize points to 0-1 range
  const normalized = points.map(p => ({
    x: p.x / canvasSize,
    y: p.y / canvasSize,
  }));

  // Count how many waypoints are "hit" by nearby trace points
  let hitCount = 0;
  for (const wp of waypoints) {
    const isHit = normalized.some(p => {
      const dx = p.x - wp.x;
      const dy = p.y - wp.y;
      return Math.sqrt(dx * dx + dy * dy) < WAYPOINT_RADIUS;
    });
    if (isHit) hitCount++;
  }

  const minPct = getMinHitPct(waypoints.length);
  const hitRatio = hitCount / waypoints.length;
  return hitRatio >= minPct;
}

/**
 * Fallback for letters without defined waypoints.
 * Uses bounding-box coverage — less precise but better than nothing.
 */
function fallbackCoverageCheck(
  points: { x: number; y: number }[],
  canvasSize: number,
): boolean {
  if (points.length < MIN_TRACE_POINTS) return false;

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const coverage = ((maxX - minX) * (maxY - minY)) / (canvasSize * canvasSize);
  return coverage >= 0.12;
}
