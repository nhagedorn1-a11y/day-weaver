import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { KEYBOARD_ROWS, HAND_MAP, HOME_ROW_KEYS, FINGER_MAP } from '@/data/typingLessons';

export interface KeyboardDisplayProps {
  onKeyPress: (key: string) => void;
  highlightedKeys?: string[];
  disabledKeys?: string[];
  colorZone?: 'left' | 'right' | 'home' | 'none';
  showFingerGuides?: boolean;
  size?: 'compact' | 'large';
  specialKeys?: boolean;
  pressedKey?: string | null;
}

const LEFT_COLORS = 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700';
const RIGHT_COLORS = 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700';
const HOME_COLORS = 'bg-amber-100 dark:bg-amber-900/40 border-amber-400 dark:border-amber-600';
const HIGHLIGHT_COLORS = 'bg-primary text-primary-foreground border-primary ring-4 ring-primary/30 scale-110 shadow-lg';
const PRESSED_COLORS = 'bg-token text-token-foreground border-token scale-95';

export function KeyboardDisplay({
  onKeyPress,
  highlightedKeys = [],
  disabledKeys = [],
  colorZone = 'none',
  showFingerGuides = false,
  size = 'large',
  specialKeys = false,
  pressedKey = null,
}: KeyboardDisplayProps) {
  const handleKeyClick = useCallback((key: string) => {
    if (disabledKeys.includes(key)) return;
    onKeyPress(key);
  }, [onKeyPress, disabledKeys]);

  const getKeyClasses = (key: string) => {
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

  const keySize = size === 'large' ? 'min-w-[44px] min-h-[52px] text-xl' : 'min-w-[36px] min-h-[40px] text-base';

  return (
    <div className="w-full space-y-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center gap-1.5"
          style={{ paddingLeft: rowIndex === 1 ? '16px' : rowIndex === 2 ? '40px' : '0' }}
        >
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyClick(key)}
              disabled={disabledKeys.includes(key)}
              className={cn(
                'relative rounded-xl border-2 font-bold uppercase transition-all duration-150 select-none',
                'active:scale-90 focus:outline-none focus:ring-2 focus:ring-primary/50',
                keySize,
                getKeyClasses(key),
              )}
            >
              {key}
              {showFingerGuides && FINGER_MAP[key] && (
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
            className={cn(
              'rounded-xl border-2 font-bold transition-all duration-150 px-4',
              keySize,
              pressedKey === 'shift' ? PRESSED_COLORS : 'bg-card border-border hover:bg-accent',
            )}
          >
            ⬆️ Shift
          </button>
          <button
            onClick={() => handleKeyClick('space')}
            className={cn(
              'rounded-xl border-2 font-bold transition-all duration-150 flex-1 max-w-[240px]',
              keySize,
              pressedKey === 'space' ? PRESSED_COLORS : 'bg-card border-border hover:bg-accent',
            )}
          >
            Space
          </button>
          <button
            onClick={() => handleKeyClick('backspace')}
            className={cn(
              'rounded-xl border-2 font-bold transition-all duration-150 px-4',
              keySize,
              pressedKey === 'backspace' ? PRESSED_COLORS : 'bg-card border-border hover:bg-accent',
            )}
          >
            ⌫
          </button>
          <button
            onClick={() => handleKeyClick('enter')}
            className={cn(
              'rounded-xl border-2 font-bold transition-all duration-150 px-4',
              keySize,
              pressedKey === 'enter' ? PRESSED_COLORS : 'bg-card border-border hover:bg-accent',
            )}
          >
            ↵
          </button>
        </div>
      )}
    </div>
  );
}
