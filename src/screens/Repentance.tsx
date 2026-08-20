import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { BottomNav, TabKey } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { getAddictionCard, getWeeklyGuideCard, RepentanceCard, weeklyGuideCards } from '@/lib/repentanceDb';
import { NavigationItem } from '@/components/Navigation';
import { BibleShortcut, BibleTarget } from '@/components/BibleShortcut';

interface RepentanceProps {
  onNavigate: (tab: TabKey) => void;
  onBack: () => void;
  initialTab?: 'instant' | 'weekly' | 'addictions';
  onNavigation?: (item: NavigationItem) => void;
  onOpenBible: (target: BibleTarget) => void;
}

// ----------------------------------------------------------------------
// DATA TYPES & DATASETS (Ready to be extracted into a separate .ts file)
// ----------------------------------------------------------------------

export type InstantSectionKey = 'temptation' | 'repentance' | 'anger' | 'unforgiveness' | 'anxiety' | 'lust';

export interface InstantHelpData {
  key: InstantSectionKey;
  title: string;
  icon: string;
  verse: string;
  reference: string;
  prayer: string;
}

export const INSTANT_HELP_SECTIONS: Record<InstantSectionKey, InstantHelpData> = {
  temptation: {
    key: 'temptation',
    title: 'Temptation',
    icon: 'front_hand',
    verse: '"No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear."',
    reference: '1 Corinthians 10:13',
    prayer: 'Lord, give me strength right now to resist this urge. Provide the way of escape You promised and anchor my spirit in Your peace.',
  },
  repentance: {
    key: 'repentance',
    title: 'Repentance',
    icon: 'restart_alt',
    verse: '"Repent, then, and turn to God, so that your sins may be wiped out, that times of refreshing may come from the Lord."',
    reference: 'Acts 3:19',
    prayer: 'Father, I acknowledge my sin before You. Cleanse my heart, renew a right spirit within me, and restore the joy of my salvation.',
  },
  anger: {
    key: 'anger',
    title: 'Anger',
    icon: 'local_fire_department',
    verse: '"My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry."',
    reference: 'James 1:19',
    prayer: 'Lord, cool the heat in my mind. Help me release control and choose Your meekness over my explosive wrath.',
  },
  unforgiveness: {
    key: 'unforgiveness',
    title: 'Unforgiveness',
    icon: 'heart_broken',
    verse: '"Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you."',
    reference: 'Colossians 3:13',
    prayer: 'Jesus, release me from the poison of bitterness. Give me the grace to forgive those who hurt me, just as You forgave me on the cross.',
  },
  anxiety: {
    key: 'anxiety',
    title: 'Anxiety',
    icon: 'air',
    verse: '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."',
    reference: 'Philippians 4:6',
    prayer: 'God, I cast all my cares and heavy thoughts upon You right now. Take away this spirit of fear and guard my heart with Your peace.',
  },
  lust: {
    key: 'lust',
    title: 'Lust',
    icon: 'visibility_off',
    verse: '"Flee from sexual immorality. All other sins a person commits are outside the body, but whoever sins sexually sins against their own body."',
    reference: '1 Corinthians 6:18',
    prayer: 'Holy Spirit, purify my heart and my eyes. Help me turn away from fleeting desires and honor Your temple in purity and truth.',
  },
};

export const WEEKLY_GUIDE_STEPS = [
  { id: 1, week: 'Stage 01', title: 'Hearing & Conviction', desc: 'Understanding the Gospel message and responding to the Holy Spirit\'s conviction.', icon: 'hearing' },
  { id: 2, week: 'Stage 02', title: 'Faith & Belief', desc: 'Placing unshakeable trust in the finished work of Jesus Christ on the cross.', icon: 'auto_awesome' },
  { id: 3, week: 'Stage 03', title: 'Genuine Repentance', desc: 'Turning away completely from past sin and changing your mind toward God.', icon: 'turn_left' },
  { id: 4, week: 'Stage 04', title: 'Confession of Faith', desc: 'Declaring Jesus as Lord publicly and making a firm commitment to follow Him.', icon: 'record_voice_over' },
  { id: 5, week: 'Stage 05', title: 'Water Baptism', desc: 'Symbolizing death to the old self and rising into newness of spiritual life.', icon: 'water_drop' },
  { id: 6, week: 'Stage 06', title: 'Receiving the Holy Spirit', desc: 'Welcoming the Comforter into your life for daily power and spiritual guidance.', icon: 'local_fire_department' },
  { id: 7, week: 'Stage 07', title: 'Daily Prayer Life', desc: 'Establishing a continuous altar of secret prayer and intimacy with the Father.', icon: 'self_improvement' },
  { id: 8, week: 'Stage 08', title: 'Abiding in Scripture', desc: 'Renewing your mind daily through reading, meditating, and studying the Word.', icon: 'menu_book' },
  { id: 9, week: 'Stage 09', title: 'Grace vs. Works', desc: 'Understanding that salvation is a gift of grace, not earned by human striving.', icon: 'card_giftcard' },
  { id: 10, week: 'Stage 10', title: 'Overcoming Temptation', desc: 'Learning practical tools to spot spiritual traps and put on the Armor of God.', icon: 'shield' },
  { id: 11, week: 'Stage 11', title: 'Christian Fellowship', desc: 'Connecting with a local church community and walking with accountability partners.', icon: 'groups' },
  { id: 12, week: 'Stage 12', title: 'Taming the Tongue', desc: 'Guarding your speech against gossip, foul words, and speaking life instead.', icon: 'chat_bubble' },
  { id: 13, week: 'Stage 13', title: 'Walking in Forgiveness', desc: 'Releasing grudges promptly and walking in the freedom of Christlike mercy.', icon: 'favorite' },
  { id: 14, week: 'Stage 14', title: 'Developing Fruit of the Spirit', desc: 'Allowing love, joy, peace, and self-control to naturally mature in your life.', icon: 'eco' },
  { id: 15, week: 'Stage 15', title: 'Fasting & Discipline', desc: 'Subduing fleshly appetites through spiritual fasting and sacred discipline.', icon: 'set_meal' },
  { id: 16, week: 'Stage 16', title: 'Discovering Your Gifts', desc: 'Identifying your unique spiritual gifts to build up the Body of Christ.', icon: 'extension' },
  { id: 17, week: 'Stage 17', title: 'Financial Stewardship', desc: 'Honoring God with your tithes, offerings, time, and earthly possessions.', icon: 'savings' },
  { id: 18, week: 'Stage 18', title: 'Identity in Christ', desc: 'Standing firm in your standing as a redeemed, adopted child of the King.', icon: 'verified' },
  { id: 19, week: 'Stage 19', title: 'Sharing Your Testimony', desc: 'Learning how to share what Jesus did for you with lost friends and family.', icon: 'campaign' },
  { id: 20, week: 'Stage 20', title: 'Enduring Trials', desc: 'Maintaining faith and praise through seasons of suffering and dry wilderness.', icon: 'landscape' },
  { id: 21, week: 'Stage 21', title: 'Spiritual Warfare', desc: 'Recognizing enemy schemes and taking authority in the name of Jesus.', icon: 'swords' },
  { id: 22, week: 'Stage 22', title: 'Humility & Servant Hood', desc: 'Following Christ\'s example of washing feet and serving others without pride.', icon: 'volunteer_activism' },
  { id: 23, week: 'Stage 23', title: 'Guarding the Gates', desc: 'Filtering what enters your heart through your eyes, ears, and media intake.', icon: 'visibility' },
  { id: 24, week: 'Stage 24', title: 'Discipleship & Mentoring', desc: 'Helping newer believers grow in faith as someone once helped you.', icon: 'diversity_3' },
  { id: 25, week: 'Stage 25', title: 'Persisting to Eternity', desc: 'Keeping your eyes on the heavenly reward and finishing your race with joy.', icon: 'emoji_events' },
];

export const ADDICTION_CARDS = [
  { id: 'alcohol', title: 'Alcohol & Drunkenness', desc: 'Breaking free from dependency on alcohol and finding true comfort in the Spirit.', icon: 'wine_bar' },
  { id: 'smoking', title: 'Smoking & Vaping', desc: 'Reclaiming your lungs and body as a holy, undefiled temple of God.', icon: 'smoking_rooms' },
  { id: 'gambling', title: 'Gambling & High Stakes', desc: 'Overcoming financial impulsivity, greed, and trusting God as your sole Provider.', icon: 'casino' },
  { id: 'pornography', title: 'Pornography & Sexual Lust', desc: 'Uprooting secret impurity, breaking lust cycles, and restoring clean eyes.', icon: 'visibility_off' },
  { id: 'substances', title: 'Drugs & Substance Abuse', desc: 'Finding deliverance from chemical dependencies through spiritual and physical healing.', icon: 'medication' },
  { id: 'social-media', title: 'Social Media & Screens', desc: 'Escaping endless dopamine loops, vanity, and reclaiming mental presence.', icon: 'smartphone' },
  { id: 'gaming', title: 'Video Game Escapism', desc: 'Overcoming digital addiction and applying your energy to real-life purpose.', icon: 'sports_esports' },
  { id: 'shopping', title: 'Compulsive Shopping', desc: 'Curing retail therapy impulses with deep spiritual contentment in Christ.', icon: 'shopping_bag' },
  { id: 'gluttony', title: 'Gluttony & Bingeing', desc: 'Learning self-control over bodily appetites and finding emotional rest in God.', icon: 'flatware' },
  { id: 'anger-rage', title: 'Explosive Anger & Rage', desc: 'Breaking destructive anger patterns and letting God calm your inner turmoil.', icon: 'sentiment_extremely_dissatisfied' },
];

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export function Repentance({ onNavigate, onBack, initialTab = 'instant', onNavigation, onOpenBible }: RepentanceProps) {
  const [tab, setTab] = useState<'instant' | 'weekly' | 'addictions'>(initialTab);
  const [activeInstantKey, setActiveInstantKey] = useState<InstantSectionKey>('temptation');
  const [breathing, setBreathing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{ category: 'weekly' | 'addiction'; id: string } | null>(null);

  const currentInstant = INSTANT_HELP_SECTIONS[activeInstantKey];

  if (selectedCard) {
    const card = selectedCard.category === 'weekly'
      ? getWeeklyGuideCard(selectedCard.id)
      : getAddictionCard(selectedCard.id);
    if (card) {
      return <RepentanceCardPage card={card} onBack={() => setSelectedCard(null)} onNavigate={onNavigate} onNavigation={onNavigation} onOpenBible={onOpenBible} />;
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-background pb-[120px] flex flex-col">
      <Header onNavigate={onNavigate} onBack={onBack} onNavigation={onNavigation} />

      <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-container-margin pt-section-gap">
        {/* CATEGORY SELECTOR TABS */}
        <div className="flex p-1 bg-surface-container-low rounded-lg mb-section-gap border border-outline-variant/10">
          <button
            onClick={() => setTab('instant')}
            className={`flex-1 py-2 px-3 rounded-md text-center transition-all font-label-md text-xs sm:text-sm ${
              tab === 'instant' ? 'bg-surface-container text-on-surface font-bold shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Instant Help
          </button>
          <button
            onClick={() => setTab('weekly')}
            className={`flex-1 py-2 px-3 rounded-md text-center transition-all font-label-md text-xs sm:text-sm ${
              tab === 'weekly' ? 'bg-surface-container text-on-surface font-bold shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Weekly Guide
          </button>
          <button
            onClick={() => setTab('addictions')}
            className={`flex-1 py-2 px-3 rounded-md text-center transition-all font-label-md text-xs sm:text-sm ${
              tab === 'addictions' ? 'bg-surface-container text-on-surface font-bold shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Addictions
          </button>
        </div>

        {/* 1. INSTANT HELP TAB */}
        {tab === 'instant' && (
          <section className="flex flex-col items-center justify-center flex-grow space-y-8 animate-fade-in">
            {/* SUB-SECTION CHIPS */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
              {(Object.keys(INSTANT_HELP_SECTIONS) as InstantSectionKey[]).map((key) => {
                const section = INSTANT_HELP_SECTIONS[key];
                const isActive = activeInstantKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveInstantKey(key);
                      setBreathing(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <Icon name={section.icon} className="text-sm" />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </div>

            {/* BREATHE & PRAY INTERACTIVE CIRCLE */}
            <div className="flex flex-col items-center justify-center space-y-4 pt-2">
              <button
                onClick={() => setBreathing(!breathing)}
                className={`w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-error-container text-on-error-container flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_0_30px_rgba(255,218,214,0.6)] transition-transform ${
                  breathing ? 'animate-breathe' : 'hover:scale-105'
                }`}
              >
                <div className="absolute inset-0 bg-error/5 group-hover:bg-error/10 transition-colors" />
                <Icon name={currentInstant.icon} fill weight={400} className="text-4xl sm:text-5xl mb-2 text-primary" />
                <span className="font-headline-lg-mobile text-base font-bold text-on-error-container">
                  {currentInstant.title}
                </span>
              </button>
              <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-bold">
                {breathing ? 'Breathe slowly with the pulse...' : 'Tap circle to pause & pray'}
              </p>
            </div>

            {/* SCRIPTURE & PRAYER CARD */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-lg w-full relative overflow-hidden shadow-sm border border-outline-variant/10 space-y-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              <Icon
                name="format_quote"
                fill
                weight={400}
                className="text-primary/10 text-5xl absolute top-3 right-3 pointer-events-none"
              />
              
              <div>
                <p className="font-scripture-text text-sm sm:text-base text-on-surface text-center leading-relaxed">
                  {currentInstant.verse}
                </p>
                <p className="font-label-md text-xs text-primary font-bold text-center mt-2">
                  <BibleShortcut reference={currentInstant.reference} onOpenBible={onOpenBible} />
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/10">
                <p className="font-label-md text-xs font-bold text-on-surface mb-1">Instant Prayer:</p>
                <p className="font-body-md text-xs text-on-surface-variant italic leading-relaxed">
                  "{currentInstant.prayer}"
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 2. WEEKLY GUIDE TAB (25 STAGE CARDS) */}
        {tab === 'weekly' && (
          <section className="flex flex-col space-y-6 animate-fade-in">
            <div>
              <h2 className="font-headline-lg-mobile text-lg font-bold text-on-surface">
                Steps to Salvation & Spiritual Maturity
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant">
                A 25-stage roadmap for your personal walk with the Lord.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {WEEKLY_GUIDE_STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setSelectedCard({ category: 'weekly', id: weeklyGuideCards.find((card) => card.title === step.title)?.id ?? '' })}
                  type="button"
                  className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10 hover:border-primary/30 transition-all flex flex-col justify-between space-y-3 shadow-sm group cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      {step.week}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <Icon name={step.icon} className="text-base" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-label-md text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed mt-1 line-clamp-2">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between text-[11px] font-bold text-primary">
                    <span>Study Lesson</span>
                    <Icon name="chevron_right" className="text-sm" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3. ADDICTIONS TAB (10+ ADDICTION RECOVERY CARDS) */}
        {tab === 'addictions' && (
          <section className="flex flex-col space-y-6 animate-fade-in">
            <div>
              <h2 className="font-headline-lg-mobile text-lg font-bold text-on-surface">
                Addiction Recovery Paths
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant">
                Biblical strategies and freedom paths for breaking bondage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {ADDICTION_CARDS.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard({ category: 'addiction', id: card.id })}
                  type="button"
                  className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10 hover:border-error/30 transition-all flex gap-3.5 items-start shadow-sm group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-error-container/40 text-error flex items-center justify-center flex-shrink-0 group-hover:bg-error group-hover:text-on-error transition-colors">
                    <Icon name={card.icon} className="text-xl" />
                  </div>

                  <div className="flex-grow space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-label-md text-xs sm:text-sm font-bold text-on-surface group-hover:text-error transition-colors">
                        {card.title}
                      </h3>
                      <Icon name="arrow_forward" className="text-xs text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav active="prayer" onNavigate={onNavigate} />
    </div>
  );
}

function RepentanceCardPage({
  card,
  onBack,
  onNavigate,
  onNavigation,
  onOpenBible,
}: {
  card: RepentanceCard;
  onBack: () => void;
  onNavigate: (tab: TabKey) => void;
  onNavigation?: (item: NavigationItem) => void;
  onOpenBible: (target: BibleTarget) => void;
}) {
  return (
    <div className="min-h-screen bg-background text-on-background pb-[120px] flex flex-col">
      <Header onNavigate={onNavigate} onBack={onBack} onNavigation={onNavigation} />
      <main className="flex-grow w-full max-w-3xl mx-auto px-container-margin pt-8 space-y-5">
        <section className="rounded-2xl bg-primary-container/40 border border-primary/10 p-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Icon name={card.icon} className="text-2xl" />
          </div>
          <p className="font-label-sm text-xs uppercase tracking-wider text-primary">{card.label}</p>
          <h2 className="font-headline-lg-mobile text-2xl font-bold text-on-surface mt-1">{card.title}</h2>
          <p className="font-body-md text-sm leading-relaxed text-on-surface-variant mt-3">{card.lesson}</p>
        </section>

        <section className="rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-5 shadow-sm">
          <p className="font-label-sm text-xs uppercase tracking-wider text-primary mb-2">Scripture anchor</p>
          <BibleShortcut reference={card.scripture} onOpenBible={onOpenBible} />
        </section>

        <section className="space-y-3">
          <h3 className="font-headline-lg-mobile text-lg font-bold text-on-surface">Practice this week</h3>
          {card.practices.map((practice, index) => (
            <div key={practice} className="flex gap-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-4 shadow-sm">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">{index + 1}</span>
              <p className="font-body-md text-sm leading-relaxed text-on-surface-variant">{practice}</p>
            </div>
          ))}
        </section>
      </main>
      <BottomNav active="prayer" onNavigate={onNavigate} />
    </div>
  );
}