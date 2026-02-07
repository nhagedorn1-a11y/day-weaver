import { PhonemeSlider } from './PhonemeSlider';

interface BlendBoxesProps {
  phonemes: string[];
  word: string;
  onComplete?: () => void;
  showWord?: boolean;
}

/**
 * BlendBoxes now wraps PhonemeSlider — children slide through each phoneme
 * rather than tapping in strict order. This supports back-and-forth exploration
 * while keeping the blend-then-confirm flow.
 */
export function BlendBoxes({ phonemes, word, onComplete, showWord = false }: BlendBoxesProps) {
  return (
    <PhonemeSlider
      phonemes={phonemes}
      word={word}
      onComplete={onComplete}
      showWord={showWord}
      mode="warmup"
    />
  );
}
