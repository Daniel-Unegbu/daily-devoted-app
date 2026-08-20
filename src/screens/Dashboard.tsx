import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { supabase, DailyChecklist, BibleReading } from "@/lib/supabase";
import { Icon } from "@/components/Icon";
import { NavigationItem } from "@/components/Navigation";
import { BottomNav, TabKey } from "@/components/BottomNav";
import { Header } from "@/components/Header";

interface DashboardProps {
  onNavigate: (tab: TabKey) => void;
  onNavigation?: (item: NavigationItem) => void;
  onOpenSection: (
    section: "morning" | "bible" | "gospel" | "night" | "repentance",
  ) => void;
}

const todayStr = () => new Date().toISOString().split("T")[0];

export function Dashboard({
  onNavigate,
  onOpenSection,
  onNavigation,
}: DashboardProps) {
  const { user, profile } = useAuth();
  const [checklist, setChecklist] = useState<DailyChecklist | null>(null);
  const [reading, setReading] = useState<BibleReading | null>(null);
  const [loading, setLoading] = useState(true);

  const today = todayStr();
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const loadChecklist = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("daily_checklists")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();
    if (data) {
      setChecklist(data as DailyChecklist);
    } else {
      const { data: newRow } = await supabase
        .from("daily_checklists")
        .insert({ user_id: user.id, date: today })
        .select()
        .maybeSingle();
      if (newRow) setChecklist(newRow as DailyChecklist);
    }
    setLoading(false);
  }, [user, today]);

  useEffect(() => {
    loadChecklist();
    const { data: sub } = supabase
      .from("bible_readings")
      .select("*")
      .eq("day_of_week", dayName)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setReading(data as BibleReading);
      });
    return () => {
      void sub;
    };
  }, [loadChecklist, dayName]);

  const toggleItem = async (field: keyof DailyChecklist) => {
    if (!checklist || !user) return;
    const newValue = !checklist[field];
    const updated = { ...checklist, [field]: newValue };
    setChecklist(updated);
    await supabase
      .from("daily_checklists")
      .update({ [field]: newValue })
      .eq("id", checklist.id);

    if (field === "morning_prayer") onOpenSection("morning");
    if (field === "bible_reading") onOpenSection("bible");
    if (field === "gospel_share") onOpenSection("gospel");
    if (field === "night_prayer") onOpenSection("night");
  };

  const completedCount = checklist
    ? [
        checklist.morning_prayer,
        checklist.bible_reading,
        checklist.gospel_share,
        checklist.night_prayer,
      ].filter(Boolean).length
    : 0;
  const progress = (completedCount / 4) * 100;

  const checklistItems = [
    {
      key: "morning_prayer" as const,
      label: "Morning Prayer",
      icon: "wb_sunny",
      desc: "Start your day with God",
    },
    {
      key: "bible_reading" as const,
      label: "Bible Reading",
      icon: "book_2",
      desc: reading?.reference ?? "Daily Scripture",
    },
    {
      key: "gospel_share" as const,
      label: "Share the Gospel",
      icon: "campaign",
      desc: "Spread the Good News",
    },
    {
      key: "night_prayer" as const,
      label: "Night Prayer",
      icon: "bedtime",
      desc: "End your day in peace",
    },
  ];

  // Dynamic radius/circumference for the smaller 72px ring
  const ringRadius = 30;
  const smallCircumference = 2 * Math.PI * ringRadius;
  const firstName = profile?.full_name?.split(" ")[0] ?? "";

  return (
    <div className="min-h-screen bg-surface pb-[120px]">
      <Header onNavigate={onNavigate} onNavigation={onNavigation} />

      <main className="max-w-3xl mx-auto px-container-margin pt-4 space-y-4">
        {/* Greeting */}
        <section className="animate-fade-in">
          <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-0.5">
            {dayName}
          </p>
          <h2 className="font-headline-lg text-2xl font-bold text-on-surface">
            Welcome back{firstName ? `, ${firstName}` : ""}.
          </h2>
        </section>

        {/* Salvation Reminder Card (Shows only if salvation_accepted is false or missing) */}
        {!profile?.salvation_accepted && (
          <section className="bg-primary-container/30 border border-primary/20 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <Icon name="favorite" fill weight={400} className="text-lg" />
              </div>
              <div>
                <p className="font-label-md text-xs font-bold text-primary uppercase tracking-wide">
                  Start Your Journey
                </p>
                <p className="font-body-md text-xs text-on-surface-variant leading-tight">
                  Have you accepted Jesus Christ as your personal Savior?
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenSection("gospel")}
              className="flex-shrink-0 px-3 py-1.5 bg-primary text-on-primary font-label-md text-xs rounded-lg hover:opacity-90 transition-opacity"
            >
              Accept Jesus
            </button>
          </section>
        )}

        {/* Compact Progress Ring Card */}
        <section className="bg-surface-container-lowest rounded-xl p-3.5 sm:p-4 ambient-shadow border border-outline-variant/10 flex items-center gap-4">
          {/* Smaller 72px SVG Ring */}
          <div className="relative w-[72px] h-[72px] flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
              <circle
                cx="36"
                cy="36"
                r={ringRadius}
                fill="none"
                stroke="#e1e2e5"
                strokeWidth="6"
              />
              <circle
                cx="36"
                cy="36"
                r={ringRadius}
                fill="none"
                stroke="#2e6385"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={smallCircumference}
                strokeDashoffset={
                  smallCircumference - (progress / 100) * smallCircumference
                }
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span className="font-headline-lg text-base font-bold text-primary">
                {completedCount}
              </span>
              <span className="font-label-sm text-[10px] text-on-surface-variant mt-0.5">
                of 4
              </span>
            </div>
          </div>

          {/* Compact Text Info */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h3 className="font-headline-lg-mobile text-base font-bold text-on-surface truncate">
                Today's Devotion
              </h3>
            </div>

            <p className="font-body-md text-on-surface-variant text-xs truncate">
              {completedCount === 0
                ? "Begin your daily walk with God."
                : completedCount === 4
                  ? "All complete. Well done!"
                  : `${4 - completedCount} more to complete today.`}
            </p>
          </div>
        </section>
        {/* Daily Checklist */}
        <section>
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-4">
            Daily Checklist
          </h3>
          <div className="space-y-3">
            {checklistItems.map((item) => {
              const done = checklist ? checklist[item.key] : false;
              return (
                <button
                  key={item.key}
                  onClick={() => toggleItem(item.key)}
                  disabled={loading}
                  className={`w-full bg-surface-container-lowest rounded-xl p-4 ambient-shadow flex items-center gap-4 text-left transition-all hover:-translate-y-0.5 active:scale-[0.99] border ${
                    done
                      ? "border-secondary-fixed/40 card-border-accent"
                      : "border-outline-variant/10"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      done
                        ? "bg-secondary-fixed text-on-secondary-fixed"
                        : "bg-surface-container text-primary"
                    }`}
                  >
                    <Icon
                      name={done ? "check" : item.icon}
                      fill={done}
                      weight={done ? 400 : 300}
                      className="text-2xl"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-body-lg text-body-lg font-medium text-on-surface">
                      {item.label}
                    </h4>
                    <p className="font-body-md text-sm text-on-surface-variant">
                      {item.desc}
                    </p>
                  </div>
                  <Icon name="chevron_right" className="text-outline text-xl" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Quick Action Cards */}
        <section className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onOpenSection("repentance")}
            className="bg-error-container/50 rounded-xl p-5 ambient-shadow flex flex-col items-start text-left border border-error/10 hover:-translate-y-0.5 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center mb-3">
              <Icon
                name="front_hand"
                fill
                weight={400}
                className="text-error text-xl"
              />
            </div>
            <h4 className="font-label-md text-label-md text-on-surface">
              Need Help?
            </h4>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Instant support & repentance
            </p>
          </button>
          <button
            onClick={() => onOpenSection("gospel")}
            className="bg-primary-container/40 rounded-xl p-5 ambient-shadow flex flex-col items-start text-left border border-primary/10 hover:-translate-y-0.5 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Icon
                name="campaign"
                fill
                weight={400}
                className="text-primary text-xl"
              />
            </div>
            <h4 className="font-label-md text-label-md text-on-surface">
              Preach the Gospel
            </h4>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Share your faith today
            </p>
          </button>
          <button
            onClick={() => onNavigation?.("lastdays")}
            className="col-span-2 bg-secondary-container/40 rounded-xl p-4 ambient-shadow flex items-center gap-4 text-left border border-secondary/10 hover:-translate-y-0.5 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Icon name="event" fill weight={400} className="text-secondary text-xl" />
            </div>
            <div className="flex-grow">
              <h4 className="font-label-md text-label-md text-on-surface">The Last Days</h4>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">Stand firm with wisdom, hope, and biblical readiness.</p>
            </div>
            <Icon name="chevron_right" className="text-outline" />
          </button>
        </section>
      </main>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
