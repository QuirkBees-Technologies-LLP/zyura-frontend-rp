import {
  CalendarClock,
  ClipboardList,
  BellRing,
  Target,
  type LucideIcon,
} from "lucide-react";

type PlannerCard = {
  icon: LucideIcon;
  title: string;
};

const plannerCards: PlannerCard[] = [
  {
    icon: ClipboardList,
    title:
      "Custom plans for medical, nursing, dental, and pharmacy tracks",
  },
  {
    icon: Target,
    title: "Progress tracking with adaptive goals",
  },
  {
    icon: CalendarClock,
    title: "Exam countdown timers",
  },
  {
    icon: BellRing,
    title: "Reminders + dashboards",
  },
];

export const SmartStudyPlannerSection = () => {
  return (
    <section
      className="mx-auto   relative overflow-hidden py-25 lg:py-36 bg-[#e9f8ef] px-6  md:px-10 md:py-14 lg:px-14"
      data-aos="fade-up"
    >
      <div className="container mx-auto px-5">
        <div
          className="relative  mb-16 text-center border-b border-gray-300 pb-10"
          data-aos="fade-up"
        >
          <span className="absolute left-0 top-0 text-5xl text-primary md:text-6xl">
            *
          </span>
          <span className="absolute right-0 top-0 text-4xl text-primary md:text-5xl">
            ✦
          </span>

          <div className="mx-auto max-w-4xl px-8 text-center">
            <h2 className="mx-auto text-center font-sora text-3xl md:text-3xl lg:text-[48px] font-semibold text-dark">
              Smart Study Planner
            </h2>
            <p className="mx-auto mt-4 font-sora text-[18px] leading-relaxed text-blackLight">
              Plan smarter with an intelligent scheduler:
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plannerCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="flex min-h-[300px] flex-col items-center justify-between rounded-[26px] bg-white/60 px-6 py-8 text-left"
                data-aos="fade-up"
                data-aos-delay={index * 90}
              >
                <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full border border-gray-300 bg-brand-gradient">
                  <Icon className="h-9 w-9 text-white" strokeWidth={1.8} />
                </div>

                <h3 className="font-sora text-center text-xl lg:text-xl min-h-16 leading-tight text-[#1d2430]">
                  {card.title}
                </h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
