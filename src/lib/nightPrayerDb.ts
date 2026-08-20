export interface NightPrayerEntry {
  slug: string;
  title: string;
  introduction: string;
  points: string[];
}

const nightPrayerTemplates = [
  'Thank God for carrying you through this day.',
  'Name the worry you are holding and place it in God’s hands.',
  'Ask for a quiet mind and a peaceful heart.',
  'Confess any words or actions that need forgiveness.',
  'Receive God’s mercy instead of replaying your mistakes.',
  'Pray for the people who shared this day with you.',
  'Release the work you finished and the work still waiting.',
  'Ask God to protect your home and everyone under your care.',
  'Pray for healing where your body or spirit feels tired.',
  'Ask for wisdom for tomorrow’s decisions.',
  'Choose one good thing from today and give thanks for it.',
  'Ask God to guard your dreams and imagination.',
  'Pray for anyone who feels lonely tonight.',
  'Release resentment and bless someone who has hurt you.',
  'Ask for strength to begin again tomorrow.',
  'Let go of the need to solve everything before sleep.',
  'Pray that your rest will renew you for faithful service.',
  'Ask God to make His presence real in the quiet.',
  'Rest in the promise that you are seen, known, and loved.',
  'End with a simple thank-you and entrust the night to God.',
];

const entries = [
  ['peaceful-sleep', 'Peaceful Sleep', 'Settle your mind and rest beneath God’s faithful care.'],
  ['forgiveness', 'Forgiveness', 'End the day by receiving grace and releasing what weighs on you.'],
  ['protection', 'Protection', 'Pray for God’s covering over your home, loved ones, and rest.'],
] as const;

export const nightPrayerEntries: NightPrayerEntry[] = entries.map(([slug, title, introduction]) => ({
  slug,
  title,
  introduction,
  points: nightPrayerTemplates.map((point, index) => `${index + 1}. ${point}`),
}));

export function getNightPrayerEntry(slug: string) {
  return nightPrayerEntries.find((entry) => entry.slug === slug) ?? nightPrayerEntries[0];
}
