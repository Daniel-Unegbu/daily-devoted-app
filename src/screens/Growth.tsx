import { Icon } from "@/components/Icon";
import { BottomNav, TabKey } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { NavigationItem } from "@/components/Navigation";

const cards = [
  {
    key: "saved",
    label: "Saved Scripture",
    description: "Return to verses that have encouraged you.",
    icon: "bookmark",
  },
  {
    key: "memorize",
    label: "Memorize Verses",
    description: "Build Scripture into your heart, one verse at a time.",
    icon: "school",
  },
  {
    key: "journal",
    label: "Prayer Journal",
    description: "Write honest prayers and notice God's faithfulness.",
    icon: "edit_note",
  },
  {
    key: "weekly",
    label: "Weekly Guide: Steps to Salvation and Spiritual Maturity",
    description: "Follow a guided path for growing in faith and obedience.",
    icon: "map",
  },
] as const;

export function Growth({
  onNavigate,
  onOpen,
  onNavigation,
}: {
  onNavigate: (tab: TabKey) => void;
  onOpen: (page: "saved" | "memorize" | "journal" | "weekly") => void;
  onNavigation?: (item: NavigationItem) => void;
}) {
  return (
    <div className="min-h-screen bg-surface pb-[120px]">
      <Header
        onNavigate={onNavigate}
        title="Growth"
        onNavigation={onNavigation}
      />

      <main className="max-w-3xl mx-auto px-container-margin pt-4">
        <p className="font-body-md text-sm text-on-surface-variant mb-6">
          Make room for Jesus Christ in your life through Scripture, Reflection, and Prayer.
        </p>

        <div className="space-y-4">
          {cards.map((card) => (
            <button
              key={card.key}
              onClick={() => onOpen(card.key)}
              className={`w-full rounded-xl border p-5 ambient-shadow flex items-center gap-4 text-left transition-colors ${
                card.key === "weekly"
                  ? "border-green-200 bg-green-50 hover:bg-green-100"
                  : "border-outline-variant/10 bg-surface-container-lowest hover:bg-surface-container-low"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                card.key === "weekly" ? "bg-green-100 text-green-700" : "bg-primary-container/50 text-primary"
              }`}>
                <Icon name={card.icon} className="text-2xl" />
              </div>
              <div className="flex-grow">
                <h2 className="font-headline-lg-mobile text-base font-bold text-on-surface">
                  {card.label}
                </h2>
                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                  {card.description}
                </p>
              </div>
              <Icon name="chevron_right" className={card.key === "weekly" ? "text-green-700" : "text-outline"} />
            </button>
          ))}
        </div>
      </main>

      <BottomNav active="growth" onNavigate={onNavigate} />
    </div>
  );
}