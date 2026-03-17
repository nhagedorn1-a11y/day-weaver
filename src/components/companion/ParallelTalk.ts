/**
 * ParallelTalk — NPC companion language scaffolding system.
 * 
 * Uses simplified, redundant language with less complex syntax to model concepts.
 * The child absorbs the language framework without pressure to produce complex responses.
 * 
 * Principles:
 * - Short sentences (≤8 words preferred)
 * - Present tense, active voice
 * - Redundant phrasing (say it two ways)
 * - Name the action the child is doing (parallel talk)
 * - No questions that demand complex verbal output
 * - Positive, affirming tone
 */

export type TalkContext =
  | 'task_start'
  | 'task_working'
  | 'task_correct'
  | 'task_incorrect'
  | 'task_complete'
  | 'choosing'
  | 'waiting'
  | 'struggling'
  | 'returning'
  | 'break_time';

export interface ParallelTalkOptions {
  /** The subject or module the child is in */
  subject?: string;
  /** The specific action the child is performing */
  action?: string;
  /** The child's name (for personalization) */
  childName?: string;
  /** Any special interest to weave in */
  specialInterest?: string;
}

// Message pools — simplified, redundant, parallel-talk style
const TALK_POOLS: Record<TalkContext, string[]> = {
  task_start: [
    "Here we go. Let's look at this one.",
    "New one! Let's see it together.",
    "OK. Here's the next one.",
    "Look. A new one to try.",
    "Ready. Let's do this one.",
  ],
  task_working: [
    "You're thinking about it. Good.",
    "You're working on it. Take your time.",
    "You're looking at it carefully.",
    "Thinking. That's good thinking.",
    "You're figuring it out.",
  ],
  task_correct: [
    "You got it. That's right!",
    "Yes! That one is correct.",
    "Right! You knew that one.",
    "That's it. You did it.",
    "Correct. Nice work.",
  ],
  task_incorrect: [
    "Not that one. Let's try again.",
    "Hmm. Close! Try another way.",
    "That's OK. Have another go.",
    "Not quite. You can try again.",
    "Oops! Let's look again.",
  ],
  task_complete: [
    "Done! You finished that whole thing.",
    "All done. You completed it!",
    "Finished! Look at what you did.",
    "That's all of them. Great job.",
    "Complete! You did the whole thing.",
  ],
  choosing: [
    "Two choices. Pick the one you want.",
    "You get to choose. Which one?",
    "Your choice! Point to one.",
    "Two options. You decide.",
    "Pick one. Either one is good.",
  ],
  waiting: [
    "Take your time. No rush.",
    "I'm here. Think about it.",
    "No hurry. Take a moment.",
    "Ready when you are.",
    "I'll wait. You think.",
  ],
  struggling: [
    "This one is hard. That's OK.",
    "Tricky one! You're being brave.",
    "Hard things take time.",
    "It's tough. But you're trying.",
    "That's a hard one. Keep going.",
  ],
  returning: [
    "You're back! Welcome.",
    "Hey! Good to see you.",
    "You came back. Let's go.",
    "Welcome back! Ready?",
    "Here again! Let's play.",
  ],
  break_time: [
    "Break time. Good work today.",
    "Let's rest. You worked hard.",
    "Time to stop. You did great.",
    "Break! You earned it.",
    "Pause time. Nice effort.",
  ],
};

// Subject-specific overlays — adds context to parallel talk
const SUBJECT_TALK: Record<string, Record<string, string[]>> = {
  reading: {
    task_start: [
      "A new word. Let's sound it out.",
      "Look at the letters. Let's read them.",
      "New word! We'll go letter by letter.",
    ],
    task_correct: [
      "You read it! That's the word.",
      "Yes! You sounded it out.",
      "You read that word. Great reading.",
    ],
    task_working: [
      "You're sounding it out. Good.",
      "Looking at each letter. Smart.",
      "Reading each sound. Nice.",
    ],
  },
  math: {
    task_start: [
      "A number problem. Let's count.",
      "Math time! Look at the numbers.",
      "Numbers! Let's figure it out.",
    ],
    task_correct: [
      "Right number! You counted it.",
      "Yes! That's the answer.",
      "Correct! Good counting.",
    ],
    task_working: [
      "You're counting. Take your time.",
      "Working with numbers. Good.",
      "Thinking about the math.",
    ],
  },
  writing: {
    task_start: [
      "Time to write. Look at the shape.",
      "A letter to trace. Follow the path.",
      "Writing time! Look where it starts.",
    ],
    task_correct: [
      "Great letter! You wrote it.",
      "Look at that! You made the shape.",
      "You wrote it. Nice lines.",
    ],
    task_working: [
      "You're making the shape. Careful.",
      "Drawing the letter. Steady hand.",
      "Tracing. You're doing it.",
    ],
  },
};

/**
 * Get a contextually appropriate parallel-talk message.
 * Mixes in subject-specific language when available.
 */
export function getParallelTalk(
  context: TalkContext,
  options: ParallelTalkOptions = {}
): string {
  const { subject, specialInterest, childName } = options;

  // Try subject-specific pool first (50% chance if available)
  if (subject && SUBJECT_TALK[subject]?.[context] && Math.random() > 0.5) {
    const pool = SUBJECT_TALK[subject][context];
    return personalize(pool[Math.floor(Math.random() * pool.length)], childName, specialInterest);
  }

  // Fall back to generic pool
  const pool = TALK_POOLS[context];
  return personalize(pool[Math.floor(Math.random() * pool.length)], childName, specialInterest);
}

/**
 * Get a sequence of messages for a full micro-interaction.
 * Returns [start, working/waiting, resolution] — drip-fed by the companion.
 */
export function getTalkSequence(
  subject: string,
  wasCorrect: boolean,
  childName?: string
): [string, string, string] {
  const opts = { subject, childName };
  return [
    getParallelTalk('task_start', opts),
    getParallelTalk('task_working', opts),
    getParallelTalk(wasCorrect ? 'task_correct' : 'task_incorrect', opts),
  ];
}

function personalize(msg: string, name?: string, interest?: string): string {
  // Optionally weave in the child's name (sparingly — not every message)
  if (name && Math.random() > 0.7) {
    msg = `${name}, ${msg.charAt(0).toLowerCase()}${msg.slice(1)}`;
  }
  return msg;
}
