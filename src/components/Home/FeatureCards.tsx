
import allInOneImage from "../../assets/home/All-in-One.png";
import access247Image from "../../assets/home/24x7-Access.png";
// import SmartLearningTools from "../../assets/home/Smart-Learning-Tools.jpg";
// import AdaptiveStudyExperience from "../../assets/home/Adaptive-Study-Experience.jpg";

const cards = [
  
  {
    tag: "Case-Based Learning",
    title: "Clinical Case Simulator",
    image: allInOneImage,
    description:
      "Work through real-world cases built from expert materials, guiding you from symptoms to diagnosis and management.",
    bg: "#E9F8EF",
  },
 
  {
    tag: "AI Tracking",
    title: "Smart Study Engine",
    description: "AI analyzes your strengths and weaknesses to create a personalized study path aligned with expert-curated content. AI engine – Generates Mcqs, Generator, Flashcard, Notes",
    image: access247Image,
    bg: "#F8E9F3",
  },
];

export const FeatureCards = () => {
  return (
    <section className="pt-25 lg:pt-36" data-aos="fade-up">
      <div
        className="mx-auto mb-16 px-6 max-w-[755px] lg:max-w-[855px] "
        data-aos="fade-up"
      >
        <h2 className="mx-auto text-center font-sora text-3xl md:text-3xl lg:text-[48px] font-semibold text-dark">
          Next-Generation <span className="font-pattaya text-[1.02em] font-normal leading-[1.08] inline">
            AI Training Tools
          </span>
        </h2>
      </div>
      <div className="mx-auto container px-5">
        <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className="flex min-h-auto lg:min-h-[460px] flex-col rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
              data-aos="fade-up"
              data-aos-delay={index * 90}
              style={{ backgroundColor: card.bg }}
            >
              <span className="inline-flex w-fit rounded-full border border-[#353b48]/40 px-3 py-1 text-xs font-medium text-[#49505c]">
                {card.tag}
              </span>

              {card.image ? (
                <div className="relative mt-4 rounded-2xl overflow-hidden h-[320px]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="mt-4 h-[320px]" />
              )}

              <h3 className="mt-6 font-sora text-xl lg:text-2xl leading-tight text-[#141923]">
                {card.title}
              </h3>
              <p className="mt-4 text-[14px] lg:text-[14px] leading-relaxed text-[#252b36]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
