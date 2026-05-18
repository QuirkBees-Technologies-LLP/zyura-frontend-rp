import { Zap, Target, ShieldPlus, Book, Bot } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

export const WhyZyuraDifferent = () => {
  const pillars = [
     {
      icon: Book,
      title: "A New Standard in Medical Learning",
      description:
        "Most platforms offer either content or technology.",
    },
    {
      icon: Bot,
      title: "Zyura- delivers both",
      description:
        "Expert-Generated Materials → Real, validated medical knowledge. AI-Driven Systems → Adaptive learning and simulation",
    },
    {
      icon: ShieldPlus,
      title: "Real Clinical Expertise",
      description:
        "Content developed and reviewed by professionals across all medical and allied specialties, ensuring accuracy, relevance, and real-world applicability.",
    },
    {
      icon: Zap,
      title: "Intelligent AI Training",
      description:
        "Adaptive AI that personalizes your learning, challenges your thinking, and provides targeted feedback based on your performance.",
    },
    {
      icon: Target,
      title: "Integrated Learning Experience",
      description:
        "A seamless combination of expert knowledge + AI simulation, designed to train both understanding and clinical decision-making.",
    },
  ];

  return (
    <section
      className="bg-brand-gradient px-5 lg:px-5  py-10 flex items-center justify-center"
      data-aos="fade-up"
    >
      <div className="container mx-auto px-5 w-full">
        {/* Section Title */}
        <div className="mx-auto mb-16 px-6 max-w-[755px] lg:max-w-[855px] aos-init aos-animate" data-aos="fade-up">
          <h2 className="mx-auto text-center font-sora text-2xl md:text-3xl lg:text-[48px] font-semibold text-white">
            Why Zyura is Different
          </h2>
        </div>

        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 20 },
            1200: { slidesPerView: 3, spaceBetween: 24 },
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="w-full pb-6"
        >
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <SwiperSlide key={index} className="h-auto">
                <div
                className="flex h-full flex-col items-center text-center group border border-white/20 rounded-lg p-6 transition-transform duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Icon Container */}
                <div className="mb-6 h-28 w-28 flex items-center justify-center bg-white/10 p-4 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 group-hover:from-brand-primary/20 group-hover:to-brand-secondary/20 transition-all duration-300">
                  <Icon
                    size={40}
                    className="text-white group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Title */}
                <h3 className="font-sora text-xl md:text-2xl font-bold text-white mb-3">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-white leading-relaxed text-base">
                  {pillar.description}
                </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};
