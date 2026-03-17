import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { KEYBOARD_ROWS, HAND_MAP, HOME_ROW_KEYS, FINGER_MAP } from '@/data/typingLessons';
import { SENSORY_DEFAULTS } from '@/data/childProfile';

export interface KeyboardDisplayProps {
  onKeyPress: (key: string) => void;
  highlightedKeys?: string[];
  disabledKeys?: string[];
  visibleKeys?: string[];           // Rev 1: only show these keys (others hidden)
  colorZone?: 'left' | 'right' | 'home' | 'none';
  showFingerGuides?: boolean;
  size?: 'compact' | 'large' | 'xl'; // Rev 2: xl = 64px for DCD
  specialKeys?: boolean;
  pressedKey?: string | null;
  displayOnly?: boolean;            // Rev 9: show-only, no tap (physical keyboard mode)
}

// Rev 10: Sensory-aware color constants
const LEFT_COLORS = 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700';
const RIGHT_COLORS = 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700';
const HOME_COLORS = 'bg-amber-100 dark:bg-amber-900/40 border-amber-400 dark:border-amber-600';
const HIGHLIGHT_COLORS_FULL = 'bg-primary text-primary-foreground border-primary ring-4 ring-primary/30 scale-110 shadow-lg';
const HIGHLIGHT_COLORS_REDUCED = 'bg-primary text-primary-foreground border-primary ring-2 ring-primary/20';
const PRESSED_COLORS_FULL = 'bg-token text-token-foreground border-token scale-95';
const PRESSED_COLORS_REDUCED = 'bg-token text-token-foreground border-token';
const HIDDEN_KEY = 'opacity-0 pointer-events-none';

export function KeyboardDisplay({
  onKeyPress,
  highlightedKeys = [],
  disabledKeys = [],
  visibleKeys,
  colorZone = 'none',
  showFingerGuides = false,
  size = 'large',
  specialKeys = false,
  pressedKey = null,
  displayOnly = false,
}: KeyboardDisplayProps) {
  const reducedMotion = SENSORY_DEFAULTS.reducedMotion;

  const HIGHLIGHT_COLORS = reducedMotion ? HIGHLIGHT_COLORS_REDUCED : HIGHLIGHT_COLORS_FULL;
  const PRESSED_COLORS = reducedMotion ? PRESSED_COLORS_REDUCED : PRESSED_COLORS_FULL;

  const handleKeyClick = useCallback((key: string) => {
    if (displayOnly) return;
    if (disabledKeys.includes(key)) return;
    onKeyPress(key);
  }, [onKeyPress, disabledKeys, displayOnly]);

  const isKeyVisible = (key: string) => {
    if (!visibleKeys) return true;
    return visibleKeys.includes(key);
  };

  const getKeyClasses = (key: string) => {
    if (!isKeyVisible(key)) return HIDDEN_KEY;

    const isHighlighted = highlightedKeys.includes(key);
    const isDisabled = disabledKeys.includes(key);
    const isPressed = pressedKey === key;

    if (isPressed) return PRESSED_COLORS;
    if (isHighlighted) return HIGHLIGHT_COLORS;
    if (isDisabled) return 'bg-muted/50 text-muted-foreground/30 border-muted cursor-not-allowed';

    if (colorZone === 'left' && HAND_MAP[key] === 'left') return LEFT_COLORS;
    if (colorZone === 'right' && HAND_MAP[key] === 'right') return RIGHT_COLORS;
    if (colorZone === 'home' && HOME_ROW_KEYS.includes(key)) return HOME_COLORS;

    return 'bg-card border-border hover:bg-accent';
  };

  // Rev 2: Larger touch targets for DCD — responsive for mobile
  const keySize = size === 'xl'
    ? 'min-w-[48px] sm:min-w-[64px] min-h-[48px] sm:min-h-[64px] text-xl sm:text-2xl'
    : size === 'large'
    ? 'min-w-[32px] sm:min-w-[56px] min-h-[40px] sm:min-h-[56px] text-base sm:text-xl'
    : 'min-w-[28px] sm:min-w-[36px] min-h-[36px] sm:min-h-[40px] text-sm sm:text-base';

  // Rev 10: Transition classes based on sensory profile
  const transitionClass = reducedMotion
    ? 'transition-colors duration-100'
    : 'transition-all duration-150';

  return (
    <div className="w-full space-y-1.5 sm:space-y-2 overflow-hidden">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center gap-1 sm:gap-1.5"
          style={{ paddingLeft: rowIndex === 1 ? '12px' : rowIndex === 2 ? '28px' : '0' }}
        >
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyClick(key)}
              disabled={disabledKeys.includes(key) || displayOnly}
              className={cn(
                'relative rounded-xl border-2 font-bold uppercase select-none',
                reducedMotion ? '' : 'active:scale-90',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                transitionClass,
                keySize,
                getKeyClasses(key),
                displayOnly && 'cursor-default',
              )}
            >
              {isKeyVisible(key) ? key : ''}
              {showFingerGuides && FINGER_MAP[key] && isKeyVisible(key) && (
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground whitespace-nowrap font-normal">
                  {FINGER_MAP[key]}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}

      {specialKeys && (
        <div className="flex justify-center gap-1.5 mt-2">
          <button
            onClick={() => handleKeyClick('shift')}
            disabled={displayOnly}
            className={cn(
              'rounded-xl border-2 font-bold px-4',
              transitionClass,
              keySize,
              pressedKey === 'shift' ? PRESSED_COLORS : 'bg-card border-border hover:bg-accent',
              displayOnly && 'cursor-default',
            )}
          >
            ⬆️ Shift
          </button>
          <button
            onClick={() => handleKeyClick('space')}
            disabled={displayOnly}
            className={cn(
              'rounded-xl border-2 font-bold flex-1 max-w-[240px]',
              transitionClass,
              keySize,
              pressedKey === 'space' ? PRESSED_COLORS : 'bg-card border-border hover:bg-accent',
              displayOnly && 'cursor-default',
            )}
          >
            Space
          </button>
          <button
            onClick={() => handleKeyClick('backspace')}
            disabled={displayOnly}
            className={cn(
              'rounded-xl border-2 font-bold px-4',
              transitionClass,
              keySize,
              pressedKey === 'backspace' ? PRESSED_COLORS : 'bg-card border-border hover:bg-accent',
              displayOnly && 'cursor-default',
            )}
          >
            ⌫
          </button>
          <button
            onClick={() => handleKeyClick('enter')}
            disabled={displayOnly}
            className={cn(
              'rounded-xl border-2 font-bold px-4',
              transitionClass,
              keySize,
              pressedKey === 'enter' ? PRESSED_COLORS : 'bg-card border-border hover:bg-accent',
              displayOnly && 'cursor-default',
            )}
          >
            ↵
          </button>
        </div>
      )}
    </div>
  );
}
