import { Icon } from "@/components/Icon";
import { BottomNav, TabKey } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { NavigationItem } from "@/components/Navigation";
import { BibleShortcut, BibleTarget } from "@/components/BibleShortcut";

interface ShareFaithProps {
  onNavigate: (tab: TabKey) => void;
  onOpenRepentance: () => void;
  onBack: () => void;
  onNavigation?: (item: NavigationItem) => void;
  onOpenBible: (target: BibleTarget) => void;
}

interface CardItem {
  title: string;
  items?: string[];
  steps?: { label: string; desc: string }[];
  scripture?: string;
  reference?: string;
}

interface GospelCategory {
  id: string;
  title: string;
  icon: string;
  cards: CardItem[];
}

const categories: GospelCategory[] = [
  {
    id: "icebreakers",
    title: "1. Conversation Openers",
    icon: "chat_bubble",
    cards: [
      {
        title: "Casual Questions",
        items: [
          '"How can I pray for you today?"',
          '"How has your week been treating you?"',
          '"What gives you peace when life gets chaotic?"',
        ],
      },
      {
        title: "Deeper Inquiries",
        items: [
          '"Has faith ever played a role in your life?"',
          '"Where do you turn when you need real hope?"',
          '"What do you think happens after this life?"',
        ],
      },
      {
        title: "Kindness & Action",
        items: [
          '"Can I buy you a coffee & hear your story?"',
          '"Is there anything heavy on your heart right now?"',
          '"I felt led to share that God truly sees you."',
        ],
      },
    ],
  },
  {
    id: "testimony",
    title: "2. Personal Testimony",
    icon: "history_edu",
    cards: [
      {
        title: "The 3-Minute Outline",
        steps: [
          { label: "Before", desc: "Your life before knowing Christ" },
          { label: "How", desc: "How you surrendered to Him" },
          { label: "After", desc: "The peace and purpose since" },
        ],
      },
      {
        title: "Sharing Tips",
        items: [
          "Keep it humble, authentic, and clear.",
          "Focus on Jesus, not past mistakes.",
          "Avoid church jargon or complex terms.",
        ],
      },
      {
        title: "Witness Scripture",
        scripture:
          "Then saith he unto his disciples, The harvest truly is plenteous, but the labourers are few.",
        reference: "Matthew 9:37 KJV",
      },
    ],
  },
  {
    id: "gospel",
    title: "3. Core Gospel Truths",
    icon: "menu_book",
    cards: [
      {
        title: "God's Love & Grace",
        scripture:
          "For God so loved the world, that He gave His only begotten Son, that whosoever believeth in Him should not perish, but have everlasting life.",
        reference: "John 3:16 KJV",
      },
      {
        title: "Sin & Redemption",
        scripture:
          "For all have sinned, and come short of the glory of God; Being justified freely by His grace through the redemption that is in Christ Jesus.",
        reference: "Romans 3:23-24 KJV",
      },
      {
        title: "The Response",
        items: [
          "1. Admit the need for a Savior",
          "2. Believe in Jesus' resurrection",
          "3. Confess Him as Lord & follow Him",
        ],
      },
    ],
  },
];

export function ShareFaith({
  onNavigate,
  onOpenRepentance,
  onBack,
  onNavigation,
  onOpenBible,
}: ShareFaithProps) {
  return (
    <div className="min-h-screen bg-background text-on-background pb-[120px] flex flex-col">
      <Header onNavigate={onNavigate} onBack={onBack} onNavigation={onNavigation} />

      <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-container-margin pt-3 space-y-3">
        {/* Compact Hero Banner */}
        <div className="flex items-center justify-between gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10">
          <div>
            <h2 className="font-headline-lg-mobile text-base font-bold text-primary">
              Preach the Gospel
            </h2>
            <p className="font-scripture-text text-xs text-secondary italic">
              "For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth:" — Rom 1:16 KJV
            </p>
          </div>
          <button
            onClick={onOpenRepentance}
            className="bg-primary-container text-on-primary-container font-label-md text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all flex-shrink-0"
          >
            <Icon name="self_improvement" weight={400} className="text-sm" />
            Calm Anxiety
          </button>
        </div>

        {/* 3 Gospel Categories with Horizontal Scrolling Cards */}
        {categories.map((cat) => (
          <section key={cat.id} className="space-y-2">
            {/* Category Header */}
            <div className="flex items-center gap-2 text-primary px-1">
              <Icon name={cat.icon} fill weight={400} className="text-base" />
              <h3 className="font-label-md text-xs uppercase tracking-wider font-bold text-on-surface">
                {cat.title}
              </h3>
            </div>

            {/* Horizontal Swipeable Card Strip */}
            <div className="flex overflow-x-auto hide-scrollbar snap-x gap-3 pb-1">
              {cat.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="w-[240px] sm:w-[260px] flex-shrink-0 snap-start bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/15 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <h4 className="font-headline-lg-mobile text-sm font-semibold text-on-background mb-2 border-b border-surface-variant/20 pb-1">
                      {card.title}
                    </h4>

                    {/* Simple List Items */}
                    {card.items && (
                      <div className="space-y-1.5">
                        {card.items.map((item, i) => (
                          <div
                            key={i}
                            className="bg-surface-container-low p-2 rounded-md"
                          >
                            <p className="font-body-md text-xs text-on-surface leading-tight">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Step-by-Step Testimony Items */}
                    {card.steps && (
                      <ul className="space-y-2">
                        {card.steps.map((step, i) => (
                          <li
                            key={i}
                            className="flex gap-2.5 items-start bg-surface-container-low/60 p-1 rounded-lg border border-outline-variant/10"
                          >
                            <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <div className="space-y-0.5 min-w-0">
                              <p className="font-label-md text-xs font-bold text-on-background tracking-wide">
                                {step.label}
                              </p>
                              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                                {step.desc}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Scripture Card */}
                    {card.scripture && (
                      <div className="bg-surface-container-low p-2.5 rounded-md text-center my-auto">
                        <p className="font-scripture-text text-xs text-primary italic mb-1.5 leading-snug">
                          "{card.scripture}"
                        </p>
                        <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                          {card.reference && <BibleShortcut reference={card.reference} onOpenBible={onOpenBible} />}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Share Action Footer */}
                  <div className="mt-2 pt-1.5 border-t border-surface-variant/20 flex justify-end">
                    <button className="text-primary hover:bg-surface-container-low p-1 rounded-full transition-colors flex items-center gap-1 text-[11px] font-label-sm">
                      <span>Share</span>
                      <Icon name="send" weight={400} className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
