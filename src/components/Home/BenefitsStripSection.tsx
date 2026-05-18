import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  BadgeCheck,
  Stethoscope,
  ChartLine,
  UsersRound,
  RefreshCcw,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

type BenefitCard = {
  icon: LucideIcon;
  title: string;
  description: string;
  bg: string;
};

const benefitCards: BenefitCard[] = [
  {
    icon: BrainCircuit,
    title: "AI Quiz Builder",
    description: "Create AI quizzes from any topic.",
    bg: "#F6F8E9",
  },
  {
    icon: BadgeCheck,
    title: "Verified Content",
    description: "Learn from verified specialist content.",
    bg: "#E9F8EF",
  },
  {
    icon: Stethoscope,
    title: "Clinical Practice",
    description: "Practice realistic clinical cases.",
    bg: "#E0EAF9",
  },
  {
    icon: ChartLine,
    title: "Performance Analytics",
    description: "Track performance with analytics.",
    bg: "#F8E9F3",
  },
  {
    icon: UsersRound,
    title: "Solo + Group Learning",
    description: "Study solo or in groups.",
    bg: "#F6F8E9",
  },
  {
    icon: RefreshCcw,
    title: "Flexible Modes",
    description: "Switch Study/Exam modes instantly.",
    bg: "#E9F8EF",
  },
];

export const BenefitsStripSection = () => {
  return (
    <section className=" relative overflow-hidden py-25 lg:py-36" data-aos="fade-up">
      <div className="mx-auto container px-5">
        <h2
          className="mx-auto text-center font-sora text-3xl md:text-3xl lg:text-[48px] font-semibold text-dark"
          data-aos="fade-up"
        >
          Learn. Practice. Decide. Excel.
        </h2>
        <p
          className="mx-auto mt-4 max-w-3xl text-center font-sora text-[18px] text-[#29434c]"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          With ZYURA you can
        </p>

        <div
          className="mt-10 overflow-hidden rounded-[32px] border border-[#b8cdd4]"
          data-aos="fade-up"
          data-aos-delay="120"
        >
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1280: { slidesPerView: 4 },
            }}
            className="h-full"
          >
            {benefitCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <SwiperSlide key={card.title} className="h-auto">
                  <article
                    className="flex justify-between h-full min-h-[360px] flex-col border-r border-[#b8cdd4] px-7 py-10"
                    data-aos="fade-up"
                    data-aos-delay={index * 90}
                    style={{ backgroundColor: card.bg }}
                  >
                    <Icon className="h-12 w-12 text-primary" strokeWidth={1.7} />
                    <div>
                      <h3 className="font-sora text-xl lg:text-2xl leading-tight text-[#1d2430]">
                        {card.title}
                      </h3>
                      <p className="mt-3 font-sora text-[16px] leading-relaxed text-[#445d66]">
                        {card.description}
                      </p>
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
