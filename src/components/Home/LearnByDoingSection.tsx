import { ChartArea, FileText,  Trophy } from "lucide-react";
import { TbMicrophone2 } from "react-icons/tb";

const learningMethods = [
  {
    icon: FileText,
    title: "Solve clinical cases",
    // description: "Work through realistic clinical scenarios",
    bg: "#F6F8E9",
    iconColor: "#4CAF50",
  },
  {
    icon: TbMicrophone2,
    title: "Practice viva examinations",
    // description: "Master oral examination techniques",
    bg: "#E9F8EF",
    iconColor: "#00897B",
  },
  {
    icon: Trophy,
    title: "Train under exam pressure",
    // description: "Challenge yourself with competitive learning",
    bg: "#E0EAF9",
    iconColor: "#1976D2",
  },
  {
    icon: ChartArea,
    title: "Track your progress and improvement",
    // description: "Visualize your progress and celebrate milestones",
    bg: "#FFF8E1",
    iconColor: "#1976D2",
  },
];

export const LearnByDoingSection = () => {
  return (
    <section className="pt-25 lg:pt-36" data-aos="fade-up">
      <div className="mx-auto container px-5">
        {/* Section Title */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="font-sora text-3xl md:text-4xl lg:text-[48px] font-semibold text-dark mb-4">
            Learn by <span className="font-pattaya text-[1.02em] font-normal leading-[1.08] inline">Doing</span>
          </h2>
          <p className="mx-auto max-w-2xl font-sora text-[16px] lg:text-[18px] text-[#29434c]">
            Master medical knowledge through active learning and real-world practice
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {learningMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <article
                key={method.title}
                className="flex justify-between min-h-[280px] flex-col rounded-2xl p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                style={{ backgroundColor: method.bg }}
              >
                {/* Icon Container */}
                <div
                  className="inline-flex w-fit rounded-full p-4 mb-6"
                  style={{ backgroundColor: method.iconColor + "20" }}
                >
                  <Icon size={40} style={{ color: method.iconColor }} />
                </div>

                {/* Title */}
                <h3 className="mt-6 font-sora text-xl lg:text-2xl leading-tight text-[#141923]">
                  {method.title}
                </h3>

                {/* Description */}
                {/* <p className="text-[15px] lg:text-[16px] leading-relaxed text-[#4d6070]">
                  {method.description}
                </p> */}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
