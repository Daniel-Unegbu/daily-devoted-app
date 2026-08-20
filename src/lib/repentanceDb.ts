export interface RepentanceCard {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: string;
  lesson: string;
  practices: string[];
  scripture: string;
}

const weeklyDetails = [
  ['hearing-conviction', 'Hearing & Conviction', 'hearing', 'Slow down long enough to hear what God is showing you. Conviction is an invitation to return, not a sentence of shame.', ['Read one Gospel passage without rushing.', 'Write down one truth that exposes a needed change.', 'Respond with an honest prayer instead of self-condemnation.'], 'John 16:8'],
  ['faith-belief', 'Faith & Belief', 'auto_awesome', 'Faith rests on the character and finished work of Jesus rather than on changing feelings or perfect performance.', ['Name one promise of God you are choosing to trust.', 'Replace one anxious thought with Scripture.', 'Share your confidence in Christ with a trusted believer.'], 'Hebrews 11:1'],
  ['genuine-repentance', 'Genuine Repentance', 'turn_left', 'Repentance is a change of direction. We turn from sin, turn toward God, and welcome His help for the next faithful step.', ['Confess specifically and without excuses.', 'Remove one opportunity that repeatedly pulls you backward.', 'Make one action that agrees with your new direction.'], 'Acts 3:19'],
  ['confession-of-faith', 'Confession of Faith', 'record_voice_over', 'Following Jesus is not a hidden idea. Confession gives your faith a clear voice and invites a life of faithful obedience.', ['Write your own short testimony.', 'Tell one safe person what Christ means to you.', 'Let one decision today reflect Jesus as Lord.'], 'Romans 10:9'],
  ['water-baptism', 'Water Baptism', 'water_drop', 'Baptism publicly pictures the believer’s union with Christ: the old life is buried and a new life rises in Him.', ['Ask a mature church leader about baptism.', 'Read Romans 6 and reflect on new life.', 'Prepare a few sentences about your faith journey.'], 'Romans 6:4'],
  ['receiving-the-holy-spirit', 'Receiving the Holy Spirit', 'local_fire_department', 'The Holy Spirit comforts, teaches, and strengthens believers for daily life. Dependence grows through surrender and prayer.', ['Invite the Spirit to guide your decisions.', 'Practice a few quiet minutes of listening prayer.', 'Choose the fruit of the Spirit in one difficult interaction.'], 'Galatians 5:22-23'],
  ['daily-prayer-life', 'Daily Prayer Life', 'self_improvement', 'Prayer is an ongoing relationship with God, not a performance. Begin simply and return consistently.', ['Set a realistic prayer time.', 'Pray through gratitude, confession, requests, and surrender.', 'Keep one sentence from your prayer in your journal.'], '1 Thessalonians 5:17'],
  ['abiding-in-scripture', 'Abiding in Scripture', 'menu_book', 'God’s Word renews our thinking as we read it, understand it, and practice it in ordinary decisions.', ['Read a short passage twice.', 'Underline one instruction and one promise.', 'Put one verse into practice before the day ends.'], 'Psalm 119:105'],
  ['grace-vs-works', 'Grace vs. Works', 'card_giftcard', 'Salvation is received by grace through faith. Good works are the fruit of that gift, not the price we pay to earn it.', ['Thank God for a grace you could never earn.', 'Notice where perfectionism is stealing peace.', 'Serve someone freely without seeking applause.'], 'Ephesians 2:8-10'],
  ['overcoming-temptation', 'Overcoming Temptation', 'shield', 'Temptation becomes weaker when we identify its patterns, move toward the light, and choose a practical escape.', ['Name your common trigger.', 'Prepare a replacement action before the next temptation.', 'Contact an accountability partner when pressure rises.'], '1 Corinthians 10:13'],
  ['christian-fellowship', 'Christian Fellowship', 'groups', 'Growth becomes steadier when believers encourage one another with honesty, prayer, and shared responsibility.', ['Attend a healthy local church gathering.', 'Ask someone to pray with you this week.', 'Offer encouragement before asking for it.'], 'Hebrews 10:24-25'],
  ['taming-the-tongue', 'Taming the Tongue', 'chat_bubble', 'Our words can wound or heal. Wisdom grows when we listen carefully and speak truth with gentleness.', ['Pause before replying when emotions rise.', 'Refuse one piece of gossip.', 'Speak one specific word of life to someone today.'], 'James 1:19'],
  ['walking-in-forgiveness', 'Walking in Forgiveness', 'favorite', 'Forgiveness releases revenge to God. It does not deny harm or remove wise boundaries, but it frees the heart from being ruled by the injury.', ['Tell God honestly where you are hurt.', 'Pray for willingness before forcing a feeling.', 'Choose a healthy boundary where one is needed.'], 'Colossians 3:13'],
  ['developing-fruit-of-the-spirit', 'Developing Fruit of the Spirit', 'eco', 'Spiritual fruit grows through abiding in Christ. Small repeated choices make His character visible over time.', ['Choose one fruit to practice today.', 'Notice one moment where God helped you respond differently.', 'Thank someone who models Christlike character.'], 'Galatians 5:22-23'],
  ['fasting-discipline', 'Fasting & Discipline', 'set_meal', 'Fasting creates space to seek God and examine our appetites. It should be practiced wisely, humbly, and never as a way to earn approval.', ['Choose a safe, simple fast appropriate for your health.', 'Use the time you save to pray.', 'Break the fast with gratitude and moderation.'], 'Matthew 6:16-18'],
  ['discovering-your-gifts', 'Discovering Your Gifts', 'extension', 'God equips His people to serve. Gifts become clearer as we serve, receive wise feedback, and look for what strengthens others.', ['Ask a trusted believer what strengths they see in you.', 'Try one practical serving opportunity.', 'Use your ability for someone else’s good this week.'], '1 Peter 4:10'],
  ['financial-stewardship', 'Financial Stewardship', 'savings', 'Stewardship treats money, time, and possessions as entrusted gifts. Faithfulness begins with honesty, gratitude, and wise planning.', ['Review one spending habit without shame.', 'Plan generosity before impulse spending.', 'Thank God for what you already have.'], 'Matthew 6:21'],
  ['identity-in-christ', 'Identity in Christ', 'verified', 'Your worth is grounded in God’s love and adoption, not achievement, failure, approval, or comparison.', ['Write three truths God says about His people.', 'Refuse one comparison that diminishes your calling.', 'Receive correction without turning it into a verdict on your worth.'], '2 Corinthians 5:17'],
  ['sharing-your-testimony', 'Sharing Your Testimony', 'campaign', 'Your story can point to Jesus with humility and hope. You do not need a perfect story to share what God has done.', ['Describe your life before, meeting Christ, and life since.', 'Keep the focus on God’s grace.', 'Listen respectfully to someone else’s story.'], '1 Peter 3:15'],
  ['enduring-trials', 'Enduring Trials', 'landscape', 'Endurance is faithful presence in a hard season. God meets us with wisdom, community, and hope while we keep taking the next step.', ['Name the support you need instead of isolating.', 'Pray for endurance rather than a quick escape.', 'Mark one evidence of grace from this week.'], 'James 1:2-4'],
  ['spiritual-warfare', 'Spiritual Warfare', 'swords', 'Stand firm through truth, prayer, righteousness, and community. Spiritual strength is not bravado; it is dependence on God.', ['Put on one piece of the armor from Ephesians 6.', 'Reject lies with a specific truth.', 'Ask a trusted believer to pray with you.'], 'Ephesians 6:10-18'],
  ['humility-servant-hood', 'Humility & Servant Hood', 'volunteer_activism', 'Jesus leads through loving service. Humility makes room to notice needs without needing recognition.', ['Do a useful task no one is applauding.', 'Listen before offering your solution.', 'Thank someone whose service is often overlooked.'], 'Philippians 2:3-5'],
  ['guarding-the-gates', 'Guarding the Gates', 'visibility', 'What we repeatedly watch, hear, and rehearse shapes our attention. Wise boundaries protect the heart and make space for what is true.', ['Audit one media habit.', 'Remove one source that repeatedly pulls you toward sin.', 'Replace empty input with Scripture or encouragement.'], 'Proverbs 4:23'],
  ['discipleship-mentoring', 'Discipleship & Mentoring', 'diversity_3', 'Mature faith is received and shared. Walk closely enough with others to learn, encourage, correct, and multiply hope.', ['Ask someone mature for a regular conversation.', 'Share one lesson you have learned.', 'Encourage a newer believer with patience.'], '2 Timothy 2:2'],
  ['persisting-to-eternity', 'Persisting to Eternity', 'emoji_events', 'Faithfulness is built through ordinary obedience. Keep your eyes on Christ when progress feels slow and finish the race with hope.', ['Remember why you began following Jesus.', 'Take the next small obedient step.', 'Celebrate progress without despising small beginnings.'], 'Hebrews 12:1-2'],
] as const;

const addictionDetails = [
  ['alcohol', 'Alcohol & Drunkenness', 'wine_bar', 'Freedom begins with honesty about what alcohol is costing you. You are not disqualified from help, and recovery is stronger when spiritual care joins qualified support.', ['Tell a trusted person the truth about your use.', 'Remove alcohol from your immediate environment.', 'Contact a doctor or recovery professional before stopping suddenly if heavy use may make withdrawal dangerous.'], 'Ephesians 5:18'],
  ['smoking', 'Smoking & Vaping', 'smoking_rooms', 'Your body deserves patient care, not contempt. Build freedom through support, trigger awareness, and practical replacement habits.', ['List the moments that trigger nicotine use.', 'Ask a healthcare professional about cessation support.', 'Replace one trigger with a walk, prayer, water, or a supportive call.'], '1 Corinthians 6:19-20'],
  ['gambling', 'Gambling & High Stakes', 'casino', 'Gambling can turn hope into compulsion and damage trust. Recovery starts by making finances visible and removing secret access.', ['Tell someone trustworthy about the debt or spending.', 'Block gambling apps and sites.', 'Give a trusted person temporary oversight of high-risk finances.'], 'Proverbs 13:11'],
  ['pornography', 'Pornography & Sexual Lust', 'visibility_off', 'Shame keeps cycles hidden; confession, wise boundaries, and compassionate accountability bring them into the light.', ['Identify the time, mood, and device connected to the habit.', 'Use filtering and keep devices out of private high-risk spaces.', 'Seek a qualified counselor or mature accountability partner.'], '1 Thessalonians 4:3-5'],
  ['substances', 'Drugs & Substance Abuse', 'medication', 'Substance dependence needs serious, compassionate care. Prayer and professional treatment belong together, and immediate safety comes first.', ['Tell a trusted person what you are using and how often.', 'Contact a medical or recovery professional.', 'If you may overdose or are in immediate danger, call emergency services now.'], 'Psalm 34:18'],
  ['social-media', 'Social Media & Screens', 'smartphone', 'Digital habits can quietly consume attention and peace. Recovery means reclaiming presence through clear limits and meaningful alternatives.', ['Track when scrolling begins and how you feel afterward.', 'Set app limits and remove notifications.', 'Create a screen-free practice for meals, prayer, or sleep.'], 'Philippians 4:8'],
  ['gaming', 'Video Game Escapism', 'sports_esports', 'Games are not the enemy, but escape becomes costly when it replaces sleep, responsibilities, relationships, or prayer.', ['Set a stopping time before you begin.', 'Restore one neglected responsibility.', 'Invite a friend to help you keep a balanced schedule.'], '1 Corinthians 6:12'],
  ['shopping', 'Compulsive Shopping', 'shopping_bag', 'Buying can briefly soothe pain while deepening anxiety and debt. Contentment grows through honesty, limits, and care for the need beneath the impulse.', ['Use a 48-hour pause for nonessential purchases.', 'Remove saved payment methods.', 'Discuss debt and emotional triggers with a trusted helper.'], '1 Timothy 6:6-8'],
  ['gluttony', 'Gluttony & Bingeing', 'flatware', 'Food struggles deserve dignity and professional care, not punishment. Seek healing for both the behavior and the emotions beneath it.', ['Record feelings and situations without judging yourself.', 'Keep regular meals and avoid extreme restriction.', 'Speak with a qualified healthcare or eating-disorder professional.'], '1 Corinthians 10:31'],
  ['anger-rage', 'Explosive Anger & Rage', 'sentiment_extremely_dissatisfied', 'Anger is a signal, but it must not become permission to harm. Safety, accountability, and learned calming skills can interrupt destructive patterns.', ['Leave the conversation before you lose control.', 'Do not threaten, drive aggressively, or use force.', 'Seek counseling and make a safety plan with someone trustworthy.'], 'James 1:20'],
] as const;

function createCards(entries: readonly (readonly [string, string, string, string, readonly string[], string])[], category: 'weekly' | 'addiction'): RepentanceCard[] {
  return entries.map(([id, title, icon, lesson, practices, scripture], index) => ({
    id,
    label: category === 'weekly' ? `Stage ${String(index + 1).padStart(2, '0')}` : 'Recovery path',
    title,
    description: lesson,
    icon,
    lesson,
    practices: [...practices],
    scripture,
  }));
}

export const weeklyGuideCards = createCards(weeklyDetails, 'weekly');
export const addictionCards = createCards(addictionDetails, 'addiction');

export function getWeeklyGuideCard(id: string) {
  return weeklyGuideCards.find((card) => card.id === id);
}

export function getAddictionCard(id: string) {
  return addictionCards.find((card) => card.id === id);
}
