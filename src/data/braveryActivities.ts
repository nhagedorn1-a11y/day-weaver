import { BraveryLadder, BraveryStep, BraveryStory } from '@/types/activities';

// Coping tools that can be linked to bravery steps
export const COPING_TOOLS = [
  { id: 'ct-breathing', name: 'Deep Breaths', emoji: '🫁', type: 'breathing' },
  { id: 'ct-squeeze', name: 'Squeeze Something', emoji: '🤲', type: 'pressure' },
  { id: 'ct-count', name: 'Count to 10', emoji: '🔢', type: 'distraction' },
  { id: 'ct-move', name: 'Move Your Body', emoji: '🏃', type: 'movement' },
  { id: 'ct-sing', name: 'Sing a Song', emoji: '🎵', type: 'distraction' },
  { id: 'ct-hug', name: 'Get a Hug', emoji: '🤗', type: 'comfort' },
  { id: 'ct-talk', name: 'Tell a Grown-Up', emoji: '💬', type: 'support' },
  { id: 'ct-wait', name: 'Wait and Watch', emoji: '👀', type: 'observe' },
  { id: 'ct-drink', name: 'Drink Water', emoji: '💧', type: 'grounding' },
  { id: 'ct-place', name: 'Go to Safe Spot', emoji: '🏠', type: 'retreat' },
];

// Outcome emojis for after completing a step
export const OUTCOME_EMOJIS = [
  { emoji: '😊', label: 'Felt okay' },
  { emoji: '😌', label: 'Got easier' },
  { emoji: '😰', label: 'Was hard' },
  { emoji: '💪', label: 'Did it anyway' },
  { emoji: '🌟', label: 'Proud of myself' },
];

// 12 Template ladders (parent-editable)
export const braveryLadderTemplates: BraveryLadder[] = [
  // Transitions (2)
  {
    id: 'ladder-screen-dinner',
    title: 'Screen to Dinner',
    description: 'Practice stopping screen time for meals',
    emoji: '📱',
    category: 'transitions',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Parent gives 5-minute warning', kidFriendlyDescription: 'Grown-up says "5 more minutes"', distressRating: 2, timeGoal: 30, copingToolIds: ['ct-count'], completed: false },
      { id: 's2', description: 'Parent gives 1-minute warning', kidFriendlyDescription: 'Grown-up says "1 more minute"', distressRating: 3, timeGoal: 30, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's3', description: 'Pause and save game/show', kidFriendlyDescription: 'Press pause and save', distressRating: 4, timeGoal: 60, copingToolIds: ['ct-breathing', 'ct-count'], completed: false },
      { id: 's4', description: 'Turn off screen', kidFriendlyDescription: 'Turn it off', distressRating: 5, timeGoal: 30, copingToolIds: ['ct-squeeze'], completed: false },
      { id: 's5', description: 'Walk to dinner table', kidFriendlyDescription: 'Go to the table', distressRating: 4, timeGoal: 60, copingToolIds: ['ct-move'], completed: false },
      { id: 's6', description: 'Sit down without device', kidFriendlyDescription: 'Sit down, no screens', distressRating: 3, timeGoal: 120, copingToolIds: ['ct-talk'], completed: false },
    ],
  },
  {
    id: 'ladder-leaving-house',
    title: 'Leaving the House',
    description: 'Practice transitioning to go somewhere',
    emoji: '🚗',
    category: 'transitions',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Hear "time to go" announcement', kidFriendlyDescription: 'Grown-up says "time to go soon"', distressRating: 2, timeGoal: 30, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's2', description: 'Stop current activity', kidFriendlyDescription: 'Pause what youre doing', distressRating: 4, timeGoal: 60, copingToolIds: ['ct-count'], completed: false },
      { id: 's3', description: 'Get shoes', kidFriendlyDescription: 'Find your shoes', distressRating: 3, timeGoal: 60, copingToolIds: ['ct-sing'], completed: false },
      { id: 's4', description: 'Put on shoes', kidFriendlyDescription: 'Put shoes on', distressRating: 3, timeGoal: 120, copingToolIds: ['ct-talk'], completed: false },
      { id: 's5', description: 'Walk to door', kidFriendlyDescription: 'Go to the door', distressRating: 4, timeGoal: 60, copingToolIds: ['ct-move'], completed: false },
      { id: 's6', description: 'Leave the house', kidFriendlyDescription: 'Step outside', distressRating: 5, timeGoal: 30, copingToolIds: ['ct-breathing', 'ct-hug'], completed: false },
    ],
  },

  // Reassurance seeking (2)
  {
    id: 'ladder-asking-okay',
    title: 'Asking "Is It Okay?"',
    description: 'Practice reducing reassurance questions',
    emoji: '❓',
    category: 'reassurance',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Delay asking for 10 seconds', kidFriendlyDescription: 'Wait 10 seconds before asking', distressRating: 3, timeGoal: 10, copingToolIds: ['ct-count'], completed: false },
      { id: 's2', description: 'Delay asking for 30 seconds', kidFriendlyDescription: 'Wait 30 seconds before asking', distressRating: 4, timeGoal: 30, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's3', description: 'Delay asking for 1 minute', kidFriendlyDescription: 'Wait 1 whole minute', distressRating: 5, timeGoal: 60, copingToolIds: ['ct-squeeze', 'ct-breathing'], completed: false },
      { id: 's4', description: 'Delay asking for 2 minutes', kidFriendlyDescription: 'Wait 2 minutes', distressRating: 6, timeGoal: 120, copingToolIds: ['ct-move', 'ct-sing'], completed: false },
      { id: 's5', description: 'Answer own question out loud', kidFriendlyDescription: 'Try answering yourself first', distressRating: 6, timeGoal: 60, copingToolIds: ['ct-talk'], completed: false },
      { id: 's6', description: 'Skip asking completely', kidFriendlyDescription: 'Dont ask at all', distressRating: 7, timeGoal: 180, copingToolIds: ['ct-breathing', 'ct-wait'], completed: false },
    ],
  },
  {
    id: 'ladder-saying-maybe',
    title: 'Saying "Maybe"',
    description: 'Practice tolerating uncertainty',
    emoji: '🤷',
    category: 'reassurance',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Parent says "maybe" with support', kidFriendlyDescription: 'Grown-up says "maybe" and stays with you', distressRating: 3, timeGoal: 30, copingToolIds: ['ct-hug'], completed: false },
      { id: 's2', description: 'Hear "maybe" about small thing', kidFriendlyDescription: 'Hear "maybe" about something little', distressRating: 4, timeGoal: 60, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's3', description: 'Say "maybe" yourself', kidFriendlyDescription: 'You say "maybe"', distressRating: 5, timeGoal: 30, copingToolIds: ['ct-squeeze'], completed: false },
      { id: 's4', description: 'Wait with "maybe" for 1 minute', kidFriendlyDescription: 'Sit with "maybe" for 1 minute', distressRating: 6, timeGoal: 60, copingToolIds: ['ct-count', 'ct-breathing'], completed: false },
      { id: 's5', description: 'Wait with "maybe" for 5 minutes', kidFriendlyDescription: 'Sit with "maybe" for 5 minutes', distressRating: 7, timeGoal: 300, copingToolIds: ['ct-move', 'ct-sing'], completed: false },
    ],
  },

  // Checking (2)
  {
    id: 'ladder-door-checking',
    title: 'Door Checking',
    description: 'Practice checking the door only once',
    emoji: '🚪',
    category: 'checking',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Check door 3 times max', kidFriendlyDescription: 'Check the door 3 times only', distressRating: 3, timeGoal: 30, copingToolIds: ['ct-count'], completed: false },
      { id: 's2', description: 'Check door 2 times max', kidFriendlyDescription: 'Check the door 2 times only', distressRating: 4, timeGoal: 30, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's3', description: 'Check door 1 time', kidFriendlyDescription: 'Check the door 1 time only', distressRating: 5, timeGoal: 30, copingToolIds: ['ct-squeeze'], completed: false },
      { id: 's4', description: 'Look at door without touching', kidFriendlyDescription: 'Just look at the door', distressRating: 6, timeGoal: 60, copingToolIds: ['ct-wait'], completed: false },
      { id: 's5', description: 'Walk past without checking', kidFriendlyDescription: 'Walk past, dont check', distressRating: 7, timeGoal: 30, copingToolIds: ['ct-breathing', 'ct-move'], completed: false },
    ],
  },
  {
    id: 'ladder-backpack',
    title: 'Backpack Checking',
    description: 'Practice checking backpack less',
    emoji: '🎒',
    category: 'checking',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Check backpack with checklist', kidFriendlyDescription: 'Use a checklist to check once', distressRating: 2, timeGoal: 60, copingToolIds: ['ct-count'], completed: false },
      { id: 's2', description: 'Check without reopening', kidFriendlyDescription: 'Check once, then zip it up', distressRating: 4, timeGoal: 30, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's3', description: 'Say "its packed" and walk away', kidFriendlyDescription: 'Say "its ready" and leave it', distressRating: 5, timeGoal: 60, copingToolIds: ['ct-talk'], completed: false },
      { id: 's4', description: 'Trust the checklist completely', kidFriendlyDescription: 'Believe the checklist', distressRating: 6, timeGoal: 120, copingToolIds: ['ct-wait', 'ct-squeeze'], completed: false },
    ],
  },

  // Contamination-lite (2)
  {
    id: 'ladder-hands-wet',
    title: 'Hands Getting Wet',
    description: 'Practice being okay with wet hands',
    emoji: '💧',
    category: 'contamination',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Touch water with one finger', kidFriendlyDescription: 'Touch water with 1 finger', distressRating: 2, timeGoal: 10, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's2', description: 'Dip whole hand in water', kidFriendlyDescription: 'Put your whole hand in', distressRating: 3, timeGoal: 10, copingToolIds: ['ct-count'], completed: false },
      { id: 's3', description: 'Wait 10 seconds to dry', kidFriendlyDescription: 'Wait before drying', distressRating: 4, timeGoal: 10, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's4', description: 'Wait 30 seconds to dry', kidFriendlyDescription: 'Wait longer before drying', distressRating: 5, timeGoal: 30, copingToolIds: ['ct-sing'], completed: false },
      { id: 's5', description: 'Let hands air dry completely', kidFriendlyDescription: 'Let hands dry by themselves', distressRating: 6, timeGoal: 120, copingToolIds: ['ct-move', 'ct-wait'], completed: false },
    ],
  },
  {
    id: 'ladder-handwash-once',
    title: 'Washing Hands Once',
    description: 'Practice washing hands just one time',
    emoji: '🧼',
    category: 'contamination',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Wash hands 3 times max', kidFriendlyDescription: 'Wash only 3 times', distressRating: 3, timeGoal: 60, copingToolIds: ['ct-count'], completed: false },
      { id: 's2', description: 'Wash hands 2 times max', kidFriendlyDescription: 'Wash only 2 times', distressRating: 4, timeGoal: 60, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's3', description: 'Wash hands 1 time with timer', kidFriendlyDescription: 'Wash 1 time for 20 seconds', distressRating: 5, timeGoal: 20, copingToolIds: ['ct-sing'], completed: false },
      { id: 's4', description: 'Wash hands 1 time, no re-wash', kidFriendlyDescription: 'Wash once, done!', distressRating: 6, timeGoal: 20, copingToolIds: ['ct-wait', 'ct-squeeze'], completed: false },
      { id: 's5', description: 'Touch something after washing once', kidFriendlyDescription: 'Touch something right after', distressRating: 7, timeGoal: 60, copingToolIds: ['ct-breathing', 'ct-hug'], completed: false },
    ],
  },

  // Separation (2)
  {
    id: 'ladder-different-room',
    title: 'Different Rooms',
    description: 'Practice being in a different room',
    emoji: '🏠',
    category: 'separation',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Parent in next room, door open', kidFriendlyDescription: 'Grown-up nearby, door open', distressRating: 2, timeGoal: 60, copingToolIds: ['ct-talk'], completed: false },
      { id: 's2', description: 'Parent in next room, 2 minutes', kidFriendlyDescription: 'Grown-up nearby for 2 minutes', distressRating: 3, timeGoal: 120, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's3', description: 'Parent in next room, 5 minutes', kidFriendlyDescription: 'Grown-up nearby for 5 minutes', distressRating: 4, timeGoal: 300, copingToolIds: ['ct-count', 'ct-sing'], completed: false },
      { id: 's4', description: 'Parent upstairs/downstairs', kidFriendlyDescription: 'Grown-up on different floor', distressRating: 5, timeGoal: 300, copingToolIds: ['ct-squeeze', 'ct-wait'], completed: false },
      { id: 's5', description: 'Stay alone for 10 minutes', kidFriendlyDescription: 'Be alone for 10 minutes', distressRating: 6, timeGoal: 600, copingToolIds: ['ct-breathing', 'ct-move', 'ct-place'], completed: false },
    ],
  },
  {
    id: 'ladder-bedtime-alone',
    title: 'Bedtime Alone',
    description: 'Practice falling asleep independently',
    emoji: '🛏️',
    category: 'separation',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Parent sits in room until asleep', kidFriendlyDescription: 'Grown-up sits in your room', distressRating: 2, timeGoal: 600, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's2', description: 'Parent sits in doorway', kidFriendlyDescription: 'Grown-up sits at the door', distressRating: 3, timeGoal: 600, copingToolIds: ['ct-squeeze'], completed: false },
      { id: 's3', description: 'Parent checks every 5 minutes', kidFriendlyDescription: 'Grown-up checks on you', distressRating: 4, timeGoal: 300, copingToolIds: ['ct-count', 'ct-wait'], completed: false },
      { id: 's4', description: 'Parent checks every 10 minutes', kidFriendlyDescription: 'Grown-up checks less often', distressRating: 5, timeGoal: 600, copingToolIds: ['ct-breathing', 'ct-hug'], completed: false },
      { id: 's5', description: 'Fall asleep independently', kidFriendlyDescription: 'Fall asleep by yourself', distressRating: 6, timeGoal: 900, copingToolIds: ['ct-place', 'ct-breathing'], completed: false },
    ],
  },

  // Custom templates (2)
  {
    id: 'ladder-new-food',
    title: 'Trying New Food',
    description: 'Practice trying unfamiliar foods',
    emoji: '🍽️',
    category: 'custom',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Look at new food on table', kidFriendlyDescription: 'Just look at the new food', distressRating: 2, timeGoal: 30, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's2', description: 'Have new food on plate', kidFriendlyDescription: 'Put it on your plate', distressRating: 3, timeGoal: 60, copingToolIds: ['ct-wait'], completed: false },
      { id: 's3', description: 'Touch new food', kidFriendlyDescription: 'Touch it with your finger', distressRating: 4, timeGoal: 10, copingToolIds: ['ct-count'], completed: false },
      { id: 's4', description: 'Smell new food', kidFriendlyDescription: 'Smell it', distressRating: 4, timeGoal: 10, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's5', description: 'Lick new food', kidFriendlyDescription: 'Give it a tiny lick', distressRating: 5, timeGoal: 5, copingToolIds: ['ct-drink'], completed: false },
      { id: 's6', description: 'Take one small bite', kidFriendlyDescription: 'Take one tiny bite', distressRating: 6, timeGoal: 10, copingToolIds: ['ct-hug', 'ct-drink'], completed: false },
    ],
  },
  {
    id: 'ladder-loud-sounds',
    title: 'Loud Sounds',
    description: 'Practice tolerating unexpected sounds',
    emoji: '🔊',
    category: 'custom',
    isTemplate: true,
    steps: [
      { id: 's1', description: 'Know loud sound is coming', kidFriendlyDescription: 'Know its coming, cover ears okay', distressRating: 2, timeGoal: 5, copingToolIds: ['ct-breathing'], completed: false },
      { id: 's2', description: 'Hear predicted loud sound', kidFriendlyDescription: 'Know its coming, hands ready', distressRating: 3, timeGoal: 5, copingToolIds: ['ct-squeeze'], completed: false },
      { id: 's3', description: 'Hear loud sound, hands down', kidFriendlyDescription: 'Know its coming, hands down', distressRating: 4, timeGoal: 5, copingToolIds: ['ct-breathing', 'ct-count'], completed: false },
      { id: 's4', description: 'Hear semi-surprise loud sound', kidFriendlyDescription: 'It might happen, stay calm', distressRating: 5, timeGoal: 10, copingToolIds: ['ct-wait', 'ct-hug'], completed: false },
      { id: 's5', description: 'Stay in noisy environment', kidFriendlyDescription: 'Stay where its a bit loud', distressRating: 6, timeGoal: 120, copingToolIds: ['ct-breathing', 'ct-move'], completed: false },
    ],
  },
];

// 6 Interactive bravery stories
export const braveryStories: BraveryStory[] = [
  {
    id: 'story-leaving',
    title: 'The Big Adventure',
    emoji: '🚗',
    theme: 'Leaving the house',
    pages: [
      { id: 'p1', text: 'Its Saturday morning and Mom says "Were going to the park!"', emoji: '🌅' },
      { id: 'p2', text: 'I was playing with my blocks. I dont want to stop!', emoji: '🧱', choices: [
        { text: 'Throw the blocks and scream', nextPageId: 'p3a', isBrave: false },
        { text: 'Take a deep breath', nextPageId: 'p3b', isBrave: true },
      ]},
      { id: 'p3a', text: 'Mom looks sad. Now we might not go at all.', emoji: '😢', choices: [
        { text: 'Try again - take a breath', nextPageId: 'p3b', isBrave: true },
      ]},
      { id: 'p3b', text: 'I breathe in... and out... The worried feeling gets smaller.', emoji: '💨' },
      { id: 'p4', text: 'Mom says "5 more minutes to finish." That helps!', emoji: '⏰', choices: [
        { text: 'Keep building forever', nextPageId: 'p5a', isBrave: false },
        { text: 'Build one more thing, then stop', nextPageId: 'p5b', isBrave: true },
      ]},
      { id: 'p5a', text: 'The timer rings. Mom waits. I feel stuck.', emoji: '😰', choices: [
        { text: 'Try the brave choice', nextPageId: 'p5b', isBrave: true },
      ]},
      { id: 'p5b', text: 'I put my blocks away. It was hard, but I did it!', emoji: '✨' },
      { id: 'p6', text: 'At the park, I have SO much fun! Being brave was worth it.', emoji: '🎉' },
    ],
  },
  {
    id: 'story-washing',
    title: 'The Soap Story',
    emoji: '🧼',
    theme: 'Handwashing just once',
    pages: [
      { id: 'p1', text: 'I touched the doorknob. My brain says "WASH YOUR HANDS NOW!"', emoji: '🚪' },
      { id: 'p2', text: 'I wash my hands with soap. Scrub, scrub, scrub for 20 seconds.', emoji: '🧼' },
      { id: 'p3', text: 'My brain says "Do it again! They might not be clean!"', emoji: '🧠', choices: [
        { text: 'Wash again 5 more times', nextPageId: 'p4a', isBrave: false },
        { text: 'Say "Thats just Mr. Worry talking"', nextPageId: 'p4b', isBrave: true },
      ]},
      { id: 'p4a', text: 'My hands feel sore. Mr. Worry is still talking. Washing more didnt help.', emoji: '😟', choices: [
        { text: 'Try talking back to Mr. Worry', nextPageId: 'p4b', isBrave: true },
      ]},
      { id: 'p4b', text: 'I say "Nice try, Mr. Worry! One wash is enough."', emoji: '💪' },
      { id: 'p5', text: 'The worried feeling is there... but I dont have to do what it says.', emoji: '🌊', choices: [
        { text: 'Wait and see what happens', nextPageId: 'p6', isBrave: true },
      ]},
      { id: 'p6', text: 'I waited! Nothing bad happened. And the worry got smaller!', emoji: '🌟' },
    ],
  },
  {
    id: 'story-maybe',
    title: 'The Maybe Monster',
    emoji: '🤷',
    theme: 'Saying maybe instead of checking',
    pages: [
      { id: 'p1', text: 'I ask Mom: "Will it rain tomorrow?"', emoji: '🌧️' },
      { id: 'p2', text: 'Mom says: "Maybe. We dont know for sure."', emoji: '🤷' },
      { id: 'p3', text: 'MAYBE?! My brain doesnt like maybe. It wants to KNOW!', emoji: '😰', choices: [
        { text: 'Ask again and again', nextPageId: 'p4a', isBrave: false },
        { text: 'Sit with the maybe feeling', nextPageId: 'p4b', isBrave: true },
      ]},
      { id: 'p4a', text: 'I ask 10 more times. Mom still says "maybe." Now were both tired.', emoji: '😫', choices: [
        { text: 'Try sitting with maybe', nextPageId: 'p4b', isBrave: true },
      ]},
      { id: 'p4b', text: 'I take a breath. Maybe is uncomfortable... but Im okay.', emoji: '💨' },
      { id: 'p5', text: 'I say to my brain: "We can handle not knowing."', emoji: '🧠', choices: [
        { text: 'Do something fun instead', nextPageId: 'p6', isBrave: true },
      ]},
      { id: 'p6', text: 'I played and forgot about the rain. Tomorrow will be whatever it is!', emoji: '🎈' },
    ],
  },
  {
    id: 'story-alone',
    title: 'The Brave Room',
    emoji: '🏠',
    theme: 'Being in a room alone',
    pages: [
      { id: 'p1', text: 'Dad says he needs to start dinner. "Ill be in the kitchen."', emoji: '🍳' },
      { id: 'p2', text: 'That means... Ill be in the living room by myself!', emoji: '😨', choices: [
        { text: 'Follow Dad everywhere', nextPageId: 'p3a', isBrave: false },
        { text: 'Stay and try being alone', nextPageId: 'p3b', isBrave: true },
      ]},
      { id: 'p3a', text: 'Dad trips over me in the kitchen. Its hard to cook like this.', emoji: '😅', choices: [
        { text: 'Try staying in the living room', nextPageId: 'p3b', isBrave: true },
      ]},
      { id: 'p3b', text: 'I sit on the couch. I can hear Dad in the kitchen. Hes close by.', emoji: '🛋️' },
      { id: 'p4', text: 'My heart beats fast. But nothing bad is happening.', emoji: '💓', choices: [
        { text: 'Find something to do', nextPageId: 'p5', isBrave: true },
      ]},
      { id: 'p5', text: 'I start drawing. Time goes by. I forgot I was alone!', emoji: '🎨' },
      { id: 'p6', text: 'Dad comes back. "Wow, great drawing!" I feel proud of my bravery.', emoji: '🌟' },
    ],
  },
  {
    id: 'story-new-food',
    title: 'The Mystery Bite',
    emoji: '🍽️',
    theme: 'Trying new food',
    pages: [
      { id: 'p1', text: 'Theres something new on my plate. Its green and lumpy.', emoji: '🥦' },
      { id: 'p2', text: 'My brain says "DANGER! Dont eat that! It might be gross!"', emoji: '😱', choices: [
        { text: 'Push the plate away', nextPageId: 'p3a', isBrave: false },
        { text: 'Just look at it first', nextPageId: 'p3b', isBrave: true },
      ]},
      { id: 'p3a', text: 'I miss out on dessert. And I never find out what it tastes like.', emoji: '😢', choices: [
        { text: 'Maybe just look at it', nextPageId: 'p3b', isBrave: true },
      ]},
      { id: 'p3b', text: 'I look at it. Its broccoli with cheese. Cheese is good...', emoji: '👀' },
      { id: 'p4', text: 'Maybe I could touch it? Just a tiny poke.', emoji: '👆', choices: [
        { text: 'Give it a tiny poke', nextPageId: 'p5', isBrave: true },
      ]},
      { id: 'p5', text: 'I touched it! Its not slimy. I could maybe try a bite...', emoji: '🤔', choices: [
        { text: 'Take the tiniest bite ever', nextPageId: 'p6', isBrave: true },
      ]},
      { id: 'p6', text: 'I tried it! Its actually... not bad? My family cheers!', emoji: '🎉' },
    ],
  },
  {
    id: 'story-loud',
    title: 'The Brave Ears',
    emoji: '🔊',
    theme: 'Handling loud sounds',
    pages: [
      { id: 'p1', text: 'Were going to a birthday party. There might be balloons popping!', emoji: '🎈' },
      { id: 'p2', text: 'My brain says "Its going to be SO LOUD. Stay home!"', emoji: '😰', choices: [
        { text: 'Stay home and miss the fun', nextPageId: 'p3a', isBrave: false },
        { text: 'Make a plan for loud sounds', nextPageId: 'p3b', isBrave: true },
      ]},
      { id: 'p3a', text: 'I stayed home. But I hear my friends had cake and played games.', emoji: '😢', choices: [
        { text: 'Maybe I could try with a plan', nextPageId: 'p3b', isBrave: true },
      ]},
      { id: 'p3b', text: 'I bring my headphones just in case. And practice my deep breaths.', emoji: '🎧' },
      { id: 'p4', text: 'At the party, a balloon pops! BANG!', emoji: '💥', choices: [
        { text: 'Take a deep breath', nextPageId: 'p5', isBrave: true },
      ]},
      { id: 'p5', text: 'I jumped, but I breathed. It was loud... and then it was over.', emoji: '💨' },
      { id: 'p6', text: 'I stayed at the party! I had cake and played games. Being brave rocks!', emoji: '🎂' },
    ],
  },
];

// Helper functions
export function getLaddersByCategory(category: string): BraveryLadder[] {
  return braveryLadderTemplates.filter(l => l.category === category);
}

export function getStoryById(id: string): BraveryStory | undefined {
  return braveryStories.find(s => s.id === id);
}

export function getCopingToolById(id: string) {
  return COPING_TOOLS.find(t => t.id === id);
}
