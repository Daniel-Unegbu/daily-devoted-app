export interface PrayerPlanEntry {
  slug: string;
  title: string;
  introduction: string;
  points: string[];
}

const pointTemplates = [
  'Lord, help me bring this need honestly into Your presence today.',
  'Give me wisdom to recognize the next faithful step.',
  'Teach me to trust Your timing when answers feel delayed.',
  'Guard my thoughts from fear, shame, and discouragement.',
  'Help me remember the ways You have been faithful before.',
  'Give me patience with myself and grace toward the people around me.',
  'Lead me toward choices that reflect Your love and truth.',
  'Strengthen me to release what I cannot control.',
  'Open my eyes to the small signs of grace in this day.',
  'Make my words gentle, honest, and useful to others.',
  'Give me courage to ask for help when I need it.',
  'Restore the joy and peace that busyness has taken from me.',
  'Help me forgive as I have been forgiven.',
  'Keep my heart teachable when correction is difficult.',
  'Give me endurance for the work that is mine to do.',
  'Help me choose hope instead of rehearsing the worst outcome.',
  'Place trustworthy people around me and make me trustworthy too.',
  'Remind me that I am never beyond Your care.',
  'Help me carry this concern with prayer instead of anxiety.',
  'Let this prayer shape my actions, not only my feelings.',
];

const categories = [
  ['anxiety', 'Anxiety', 'Bring your worries to God and receive His steady peace.'],
  ['healing', 'Healing', 'Ask for restoration, comfort, and strength for body and soul.'],
  ['night', 'Night Prayer', 'Close the day by resting your burdens in God’s care.'],
  ['repentance', 'Repentance', 'Return to God with honesty, humility, and a renewed heart.'],
  ['family', 'Family', 'Cover the people you love with thoughtful, faithful prayer.'],
  ['strength', 'Strength', 'Seek courage and endurance for the responsibilities ahead.'],
  ['forgiveness', 'Forgiveness', 'Release resentment and receive the freedom of grace.'],
  ['protection', 'Protection', 'Ask God to guard your home, choices, and loved ones.'],
] as const;

export const prayerPlanEntries: PrayerPlanEntry[] = categories.map(([slug, title, introduction]) => ({
  slug,
  title,
  introduction,
  points: pointTemplates.map((point, index) => `${index + 1}. ${point}`),
}));

export function getPrayerPlanEntry(slug: string) {
  return prayerPlanEntries.find((entry) => entry.slug === slug) ?? prayerPlanEntries[0];
}

export function prayerCategorySlug(name: string) {
  return name.toLowerCase() === 'night'
    ? 'night'
    : name.toLowerCase().replace(/\s+/g, '-');
}
