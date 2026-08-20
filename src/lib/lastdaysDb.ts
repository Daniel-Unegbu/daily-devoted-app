export interface LastDaysSection {
  id: LastDaysSectionId;
  title: string;
  description: string;
  icon: string;
  passages: string[];
}

export type LastDaysSectionId = 'understanding-the-times' | 'how-christians-should-live' | 'scriptural-resources' | 'preparation-checklist';

export interface LastDaysResource {
  id: string;
  category: string;
  title: string;
  reference: string;
  summary: string;
}

export interface LastDaysPreparation {
  id: string;
  title: string;
  description: string;
}

export const lastDaysSections: LastDaysSection[] = [
  {
    id: 'understanding-the-times',
    title: 'Understanding the Times',
    description: 'Study biblical signs with humility, discernment, and care. Scripture calls us to watch without turning speculation into certainty.',
    icon: 'search',
    passages: ['Matthew 24:4-14', '2 Timothy 3:1-5', '1 John 4:1', 'Matthew 24:24'],
  },
  {
    id: 'how-christians-should-live',
    title: 'How Christians Should Live',
    description: 'Readiness is active faith: prayer, holiness, courage, fellowship, mercy, and a faithful witness to the hope of Christ.',
    icon: 'favorite',
    passages: ['Matthew 25:1-13', 'Ephesians 6:10-18', 'Hebrews 10:24-25', 'Mark 16:15'],
  },
  {
    id: 'scriptural-resources',
    title: 'Core Scriptures for End Times',
    description: 'Return to Scripture when fear, confusion, or pressure grows. These passages center the heart on God’s presence and promises.',
    icon: 'menu_book',
    passages: ['John 14:1-3', 'John 16:33', '1 Thessalonians 5:1-11', 'Titus 2:11-13'],
  },
  {
    id: 'preparation-checklist',
    title: 'Preparation Checklist',
    description: 'Small, faithful practices help us remain steady and useful while we wait for the Lord.',
    icon: 'check_circle',
    passages: ['1 Peter 4:7-10', 'Matthew 24:44', 'Revelation 22:12-13'],
  },
];

export const lastDaysResources: LastDaysResource[] = [
  { id: 'prophecy', category: 'Prophecy', title: 'Understand the signs with humility', reference: 'Matthew 24:4-14; 1 Thessalonians 5:1-11', summary: 'Study prophecy carefully without date-setting, fear, or confident claims beyond Scripture.' },
  { id: 'conduct', category: 'Conduct', title: 'Live awake and holy', reference: '1 Peter 4:7-10; Ephesians 6:10-18', summary: 'Readiness is seen in prayer, sobriety, love, discernment, and faithful obedience.' },
  { id: 'hope', category: 'Hope', title: 'Hold to Christ’s promise', reference: 'John 14:1-3; John 16:33; Revelation 22:12-13', summary: 'Jesus gives His people peace and a secure hope, even when the world feels unstable.' },
  { id: 'preparation', category: 'Preparation', title: 'Prepare a steady heart', reference: 'Matthew 25:1-13; Titus 2:11-13', summary: 'Build daily habits of Scripture, prayer, fellowship, and faithful service.' },
  { id: 'soul-winning', category: 'Soul-winning', title: 'Share the hope of Christ', reference: 'Matthew 24:14; Mark 16:15; 1 Peter 3:15', summary: 'The gospel mission continues: speak with courage, gentleness, and genuine love.' },
];

export const lastDaysPreparation: LastDaysPreparation[] = [
  { id: 'word', title: 'Word Anchoring', description: 'Read and memorize passages that strengthen endurance, wisdom, and hope.' },
  { id: 'prayer', title: 'Prayer Watch', description: 'Set a consistent time for prayer, intercession, confession, and listening to God.' },
  { id: 'fellowship', title: 'Fellowship', description: 'Stay connected to a grounded local church or Bible study where believers encourage one another.' },
  { id: 'sharing-faith', title: 'Sharing Faith', description: 'Pray for three people in your circle and look for a humble opportunity to share the hope of Christ.' },
  { id: 'digital-fasting', title: 'Digital Fasting', description: 'Filter sensationalized media, verify claims against Scripture, and protect your peace.' },
];

export function getLastDaysSection(id: LastDaysSectionId) {
  return lastDaysSections.find((section) => section.id === id);
}
