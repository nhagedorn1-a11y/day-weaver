/**
 * SpeechQueue — prevents overlapping TTS calls and provides
 * debounced phoneme playback + cascade blend support.
 *
 * Design goals:
 * 1. Only one utterance plays at a time (queue serializes)
 * 2. Rapid slider movements are debounced (last-wins within window)
 * 3. Cascade blend plays phonemes at shrinking intervals then the word
 */

type PlayFn = () => Promise<void> | void;

export class SpeechQueue {
  private queue: PlayFn[] = [];
  private playing = false;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private abortController: AbortController | null = null;

  /** Cancel everything in-flight and queued */
  flush() {
    this.queue = [];
    this.abortController?.abort();
    this.abortController = null;
    this.debounceTimer && clearTimeout(this.debounceTimer);
    this.debounceTimer = null;
    this.playing = false;

    // Also cancel Web Speech if active
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /** Enqueue a play function — runs in serial order */
  enqueue(fn: PlayFn) {
    this.queue.push(fn);
    if (!this.playing) this.drain();
  }

  /** Debounced enqueue — only the last call within `ms` window runs */
  debouncedEnqueue(fn: PlayFn, ms = 120) {
    // Cancel any in-flight speech immediately so there's no overlap
    this.flush();
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null;
      this.enqueue(fn);
    }, ms);
  }

  private async drain() {
    if (this.playing) return;
    this.playing = true;

    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;
      try {
        await fn();
      } catch (e) {
        console.warn('[SpeechQueue] Item failed:', e);
      }
    }

    this.playing = false;
  }

  /** Play a sequence of fns with decreasing delays between them */
  async cascade(
    items: PlayFn[],
    startGapMs = 350,
    endGapMs = 80,
    signal?: AbortSignal,
  ) {
    const count = items.length;
    for (let i = 0; i < count; i++) {
      if (signal?.aborted) return;

      await items[i]();

      if (i < count - 1) {
        // Linear interpolation from startGap → endGap
        const t = i / Math.max(count - 1, 1);
        const gap = Math.round(startGapMs + t * (endGapMs - startGapMs));
        await delay(gap, signal);
      }
    }
  }
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });
}

/** Singleton for the app */
export const speechQueue = new SpeechQueue();
