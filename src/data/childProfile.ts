// Child Profile Configuration — Assessment-Derived Settings
// Based on Dr. Kai Kangas-Dick's Neuropsychological Assessment (November 2025)

export interface ChildProfile {
  name: string;
  age: number;
  grade: number;
  
  // Diagnostic Profile
  diagnoses: {
    autism: { level: 1 | 2 | 3; withIntellectualImpairment: boolean; withLanguageImpairment: boolean };
    adhd: 'inattentive' | 'hyperactive' | 'combined';
    anxiety: boolean;
    ocd: { active: boolean; personification: string; personificationName: string };
    learningDisabilities: string[];
    developmentalCoordination: boolean;
  };
  
  // Cognitive Profile
  cognition: {
    verbalComprehension: 'strength' | 'average' | 'weakness';
    fluidReasoning: 'strength' | 'average' | 'weakness';
    workingMemory: 'strength' | 'average' | 'weakness';
    visualSpatial: 'strength' | 'average' | 'weakness';
  };
  
  // Sensory Profile
  sensory: {
    noiseHypersensitive: boolean;
    needsHeadphones: boolean;
    painUnderresponsive: boolean;
    temperatureUnderresponsive: boolean;
    seeksProprioceptive: boolean; // Deep pressure, heavy work
  };
  
  // Interests (for engagement & rewards)
  interests: string[];
  
  // Instructional Accommodations
  accommodations: {
    maxStepsPerInstruction: number; // Working memory limit
    requiresVisualSupport: boolean;
    requiresAdvanceWarning: boolean;
    bifurcateWriting: boolean; // Separate ideas from handwriting
  };
}

// Jack's Profile
export const childProfile: ChildProfile = {
  name: 'Jack',
  age: 8,
  grade: 2,
  
  diagnoses: {
    autism: { level: 2, withIntellectualImpairment: true, withLanguageImpairment: true },
    adhd: 'combined',
    anxiety: true,
    ocd: { 
      active: true, 
      personification: 'alien', 
      personificationName: 'Naughty Mr. Alien'
    },
    learningDisabilities: ['reading-decoding', 'math-number-sense', 'written-expression'],
    developmentalCoordination: true,
  },
  
  cognition: {
    verbalComprehension: 'average', // Low-Average to Average
    fluidReasoning: 'weakness',     // Score: 67 (1st percentile)
    workingMemory: 'weakness',      // Score: 62 (2nd percentile) — PROFOUND
    visualSpatial: 'weakness',      // Score: 75
  },
  
  sensory: {
    noiseHypersensitive: true,
    needsHeadphones: true,
    painUnderresponsive: true,
    temperatureUnderresponsive: true,
    seeksProprioceptive: true,
  },
  
  interests: [
    'Poppy Playtime',
    'Alphabet Lore',
    'creepy toys',
    'monsters',
    'spooky things',
    'Nerf',
  ],
  
  accommodations: {
    maxStepsPerInstruction: 1,    // Cannot hold multi-step directions
    requiresVisualSupport: true,   // All instructions paired with visuals
    requiresAdvanceWarning: true,  // Transitions require advance notice
    bifurcateWriting: true,        // Ideas via scribe/speech-to-text, handwriting separate
  },
};

// Instructional Constants derived from profile
export const INSTRUCTION_RULES = {
  // Maximum steps in any single instruction (working memory: 2nd percentile)
  MAX_STEPS: 1,
  
  // All instructions must be: Direct, Positively Stated, Paired with Visual
  INSTRUCTION_STYLE: 'direct-positive-visual',
  
  // Session lengths that work (short, stop while going well)
  MAX_SESSION_MINUTES: 10,
  OPTIMAL_SESSION_MINUTES: 7,
  MIN_SESSION_MINUTES: 5,
  
  // Transition warning times (required for all transitions)
  TRANSITION_WARNINGS: [300, 120, 60, 30], // 5min, 2min, 1min, 30sec
  
  // Reading: Orton-Gillingham required
  READING_METHOD: 'orton-gillingham',
  
  // Math: Concrete-Pictorial-Abstract
  MATH_METHOD: 'cpa',
  
  // Writing: 4-stage formation (Trace → Dot-to-Dot → Copy → Independent)
  WRITING_STAGES: ['trace', 'dotToDot', 'copy', 'independent'],
};

// OCD-specific scripts using established personification
export const OCD_SCRIPTS = {
  personificationName: childProfile.diagnoses.ocd.personificationName,
  
  // Scripts for talking back to OCD
  talkBack: [
    `That's just ${childProfile.diagnoses.ocd.personificationName} talking!`,
    `${childProfile.diagnoses.ocd.personificationName} is being tricky again.`,
    `We don't have to listen to ${childProfile.diagnoses.ocd.personificationName}.`,
    `${childProfile.diagnoses.ocd.personificationName} wants us to worry, but we're brave.`,
    `Bye bye, ${childProfile.diagnoses.ocd.personificationName}. We're not playing your game.`,
  ],
  
  // Reassurance limiter
  reassuranceLimit: `I can't answer that again, but I can help you cope. Let's try something else.`,
  
  // Delay prompts
  delayPrompts: [
    "Let's wait a little bit...",
    "We can handle the waiting.",
    "The worry will get smaller if we wait.",
  ],
};

// Sensory accommodations
export const SENSORY_DEFAULTS = {
  // Audio settings
  soundEnabled: false,       // Sound off by default (hypersensitive)
  maxVolume: 0.5,           // Never too loud
  showHeadphonesReminder: true,
  
  // Visual settings
  reducedMotion: true,       // Minimal animation
  lowStimulation: true,      // Muted palette, stable layouts
  
  // Heavy work / proprioceptive options (seeks input)
  heavyWorkEnabled: true,
  heavyWorkPromptFrequency: 'high',
};

// Interest-themed content options
export const THEMED_CONTENT = {
  // Reward naming using interests
  rewardThemes: {
    creepy: ['Creepy Vault pick', 'New creepy toy', 'Spooky snack plate', 'Spooky short'],
    monster: ['Monster sticker', 'Design a monster', 'Monster trading card'],
  },
  
  // Mascot/companion could use interest themes
  companionOptions: ['friendly monster', 'alphabet character', 'creepy-cute creature'],
  
  // Activity framing
  braveryFraming: `Talk back to ${childProfile.diagnoses.ocd.personificationName}`,
};

// Helper to check if instruction is too complex
export const isInstructionTooComplex = (steps: number): boolean => {
  return steps > INSTRUCTION_RULES.MAX_STEPS;
};

// Helper to format instruction (single step, visual, positive)
export const formatInstruction = (action: string, emoji: string): string => {
  // Positive framing: "Do X" not "Don't do Y"
  // Paired with visual emoji
  return `${emoji} ${action}`;
};
