
 
import { Mouse } from "lucide-react";
import innovativeStudyImage from "../../assets/home/Innovative-AI-Study.png";

const studyGroups = [
  {
    tag: "Comprehensive Learning Tools",
    cards: [
      {
        title: "Manual MCQs",
        description:
          "Carefully curated questions for concept clarity and exam preparation.",
      },
      {
        title: "Flashcards",
        description: "Quick revision tools designed for high-retention learning.",
      },
      {
        title: "Downloadable Notes",
        description: "Well-structured, easy-to-understand study materials.",
      },
    ],
  },
  {
    tag: "Clinical Experience & Practice",
    cards: [
      {
        title: "Realistic Clinical (Digital Twin)",
        description:
          "Scenario-based learning that builds decision-making and critical thinking.",
      },
      {
        title: "Multi-Disciplinary Case Approach",
        description:
          "Understand how different healthcare roles work together in patient care.",
      },
    ],
  },
  {
    tag: "AI-Powered Learning",
    cards: [
      {
        title: "AI-Based Questions & Adaptive Learning",
        description:
          "Smart question generation based on performance and learning patterns.",
      },
      {
        title: "Personalized Learning Paths",
        description: "Content that evolves with your progress.",
      },
      {
        title: "Performance Analytics",
        description:
          "Identify strengths, weaknesses, and improve with precision.",
      },
    ],
  },
];

export const AIStudySection = () => {
  return (
    <section className="pt-25 lg:pt-36" data-aos="fade-up" id="about-us">
      <div className="mx-auto container px-5">
        <div className="grid gap-4 grid-rows-1 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl w-full overflow-hidden relative" data-aos="fade-right">
            <img
              src={innovativeStudyImage}
              alt="Students using a laptop for AI-powered study"
              className="h-full min-h-[360px] w-full object-cover lg:min-h-[860px]"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div
            className="rounded-2xl bg-[#d9e3f2] p-5 md:p-6 lg:p-8 w-full"
            data-aos="fade-left"
          >
            <p className="font-sora  text-[14px] lg:text-[20px] text-[#4f5a69]">What Zyura Offers</p>
            <h2 className="mt-2 mx-auto text-left font-sora text-2xl md:text-3xl lg:text-[48px] font-semibold text-dark">
              Structured Learning, Clinical Practice, and{" "}
              <span className="font-pattaya font-normal">AI Intelligence</span>
            </h2>
            <p className="mt-4 max-w-2xl font-sora text-[14px] lg:text-[18px] leading-relaxed text-[#2c3442]">
              Zyura combines structured learning + real-world simulation + AI-driven intelligence in one powerful platform.
            </p>

            <div className="relative mt-6">
              <div className="study-scroll max-h-[620px] space-y-4 overflow-y-auto pr-2 md:pr-3">
                {studyGroups.map((group) => (
                  <div key={group.tag} className="space-y-4 last-of-type:mb-10">
                    <span className="inline-flex rounded-full border border-[#8d939b] bg-white/60 px-3 py-1 font-sora text-[10px] text-[#666d76] lg:text-[11px]">
                      {group.tag}
                    </span>
                    {group.cards.map((card) => (
                      <article key={card.title} className="rounded-xl bg-white p-5 md:p-6">
                        <h3 className="font-sora text-2xl font-bold leading-tight text-[#232831] lg:text-[26px]">
                          {card.title}
                        </h3>
                        <p className="mt-3 font-sora text-[14px] leading-relaxed text-[#2f3643] lg:text-[18px]">
                          {card.description}
                        </p>
                      </article>
                    ))}
                  </div>
                ))}
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#d9e3f2] via-[#d9e3f2]/85 to-transparent" />
              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-sora text-sm font-medium tracking-wide text-[#4e5a6b]">
                <Mouse />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
