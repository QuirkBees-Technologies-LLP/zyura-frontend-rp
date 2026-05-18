import { BookOpenCheck, Brain, ClipboardCheck, FileText, Stethoscope } from "lucide-react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const experienceSteps = [
  {
    icon: BookOpenCheck,
    text: "You revise with flashcards.",
  },
  {
    icon: ClipboardCheck,
    text: "You test with MCQs.",
  },
  {
    icon: FileText,
    text: "You study with structured notes.",
  },
  {
    icon: Stethoscope,
    text: "You apply through clinical cases.",
  },
  {
    icon: Brain,
    text: "You improve with AI.",
  },
];

export const ZyuraExperienceSection = () => {
  return (
    <section className="pt-20 lg:pt-28" id="zyura-experience" data-aos="fade-up">
      <div className="">
        <div className="relative py-24 overflow-hidden border border-[#DDEFF0] bg-gradient-to-br from-[#F2FAFA] via-[#F7FCFC] to-[#0a509f36]">
          <div className="pointer-events-none absolute -left-24 -top-16 h-52 w-52 rounded-full bg-[#3BB6A822] blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-14 h-56 w-56 rounded-full bg-[#5E8FE522] blur-3xl" />
          <div className="container px-5 mx-auto">
            <h2 className="text-center font-sora text-2xl font-semibold text-dark md:text-3xl lg:text-[48px]">
              The Zyura <span className="font-pattaya text-[1.02em] font-normal leading-[1.08] inline">Experience</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[760px] text-center font-sora text-[15px] leading-relaxed text-[#435462] lg:text-[18px]">
              At Zyura, learning is not passive.
            </p>

            <div className="mt-10 overflow-hidden">
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                spaceBetween={16}
                slidesPerView={1}
                breakpoints={{
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 5 },
                }}
                className="h-full"
              >
                {experienceSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <SwiperSlide key={step.text} className="h-auto my-10">
                      <article
                        data-aos="fade-up"
                        data-aos-delay={index * 80}
                        className="group relative flex h-full min-h-[170px] flex-col rounded-2xl border border-[#E3EDF0] bg-white p-5 shadow-[0_8px_22px_rgba(18,62,82,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(18,62,82,0.14)]"
                      >
                        <span className="absolute right-4 top-4 text-[12px] font-semibold tracking-wide text-[#7E91A2]">
                          0{index + 1}
                        </span>
                        <div className="inline-flex rounded-full w-fit bg-brand-gradient p-3 text-white">
                          <Icon size={20} />
                        </div>
                        <p className="mt-4 font-sora text-[16px] font-semibold leading-snug text-[#1E2E3B]">
                          {step.text}
                        </p>
                      </article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
