import { useState, useCallback, useRef } from 'react';
import { validateLetterTrace } from '@/lib/letterValidation';
import { supabase } from '@/integrations/supabase/client';

interface ValidationResult {
  isValid: boolean;
  feedback: string | null;
}

interface UseLetterValidationReturn {
  /** Run hybrid validation: waypoints first, then AI if waypoints pass */
  validate: (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    points: { x: number; y: number }[],
    letter: string,
    canvasSize: number
  ) => Promise<ValidationResult>;
  /** Force AI-only validation (bypass waypoints) */
  validateWithAI: (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    letter: string
  ) => Promise<ValidationResult>;
  /** Whether AI validation is in progress */
  isChecking: boolean;
  /** Latest AI feedback message */
  feedback: string | null;
  /** Clear feedback */
  clearFeedback: () => void;
}

/**
 * Captures the canvas drawing as a base64 data URL.
 * Creates a clean version with just the user's strokes on a white background.
 */
function captureCanvas(canvas: HTMLCanvasElement): string {
  // Create a temporary canvas to render just the strokes on white background
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const ctx = tempCanvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/png');

  // White background for better AI visibility
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw the original canvas on top (the strokes will show)
  ctx.drawImage(canvas, 0, 0);

  return tempCanvas.toDataURL('image/png');
}

async function callAIValidation(
  imageDataUrl: string,
  letter: string
): Promise<ValidationResult> {
  const { data, error } = await supabase.functions.invoke('validate-letter', {
    body: { image: imageDataUrl, letter },
  });

  if (error) {
    console.error('AI validation error:', error);
    // Fallback: accept on error (don't block the child)
    return { isValid: true, feedback: null };
  }

  if (data?.error) {
    console.error('AI validation returned error:', data.error);
    return { isValid: true, feedback: null };
  }

  return {
    isValid: data?.valid ?? true,
    feedback: data?.feedback ?? null,
  };
}

export function useLetterValidation(): UseLetterValidationReturn {
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const validate = useCallback(
    async (
      canvasRef: React.RefObject<HTMLCanvasElement>,
      points: { x: number; y: number }[],
      letter: string,
      canvasSize: number
    ): Promise<ValidationResult> => {
      // Step 1: Local waypoint check (instant)
      const waypointsPassed = validateLetterTrace(points, letter, canvasSize);

      if (!waypointsPassed) {
        // Waypoints say NO → reject immediately, no API call
        return { isValid: false, feedback: null };
      }

      // Step 2: Waypoints say YES → confirm with AI
      if (!canvasRef.current) {
        // No canvas to capture — trust waypoints
        return { isValid: true, feedback: null };
      }

      setIsChecking(true);
      setFeedback(null);

      try {
        const imageDataUrl = captureCanvas(canvasRef.current);
        const result = await callAIValidation(imageDataUrl, letter);
        setFeedback(result.feedback);
        return result;
      } catch (err) {
        console.error('Validation error:', err);
        // Fallback: accept on network error
        return { isValid: true, feedback: null };
      } finally {
        setIsChecking(false);
      }
    },
    []
  );

  const validateWithAI = useCallback(
    async (
      canvasRef: React.RefObject<HTMLCanvasElement>,
      letter: string
    ): Promise<ValidationResult> => {
      if (!canvasRef.current) {
        return { isValid: false, feedback: 'No drawing to check' };
      }

      setIsChecking(true);
      setFeedback(null);

      try {
        const imageDataUrl = captureCanvas(canvasRef.current);
        const result = await callAIValidation(imageDataUrl, letter);
        setFeedback(result.feedback);
        return result;
      } catch (err) {
        console.error('AI validation error:', err);
        return { isValid: false, feedback: 'Could not check right now' };
      } finally {
        setIsChecking(false);
      }
    },
    []
  );

  return {
    validate,
    validateWithAI,
    isChecking,
    feedback,
    clearFeedback,
  };
}
