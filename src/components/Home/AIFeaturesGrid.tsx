
import quizImage from "../../assets/home/AI-Generated-Quiz.png";
import flashCardsImage from "../../assets/home/AI-Create-Flash-Cards.png";
import allInOneImage from "../../assets/home/All-in-One.png";
import notesImage from "../../assets/home/Download-Notes.png";
import access247Image from "../../assets/home/24x7-Access.png";
import medicalAiImage from "../../assets/home/Medical-AI.png";

type GridCard =
  | { type: "image"; image: string; alt: string }
  | {
    type: "text";
    title: string;
    description: string;
    points?: string[];
    bg: string;
  };

const gridCards: GridCard[] = [
  { type: "image", image: quizImage, alt: "AI generated quiz" },
  {
    type: "text",
    title: "AI-Generated MCQs",
    description:
      "Master every subject with adaptive, performance-based MCQs:",
    points: [
      "Adaptive difficulty",
      "Detailed explanations + analytics",
      "Topic-based custom quizzes",
    ],
    bg: "#DDE2EE",
  },
  { type: "image", image: allInOneImage, alt: "Students learning together" },
  {
    type: "text",
    title: "Interactive Flashcards",
    description:
      "Revise faster with AI-powered flashcards and smart retention:",
    points: [
      "Create flashcards from your own notes",
      "Spaced repetition for long-term memory",
      "Specialist-made decks available",
    ],
    bg: "#E6F1F5",
  },

  {
    type: "text",
    title: "Clinical Case Simulations",
    description:
      "Train clinical reasoning with real-world scenarios:",
    points: [
      "Step-by-step diagnostic thinking",
      "Management decision pathways",
      "Perfect for OSCE + clinical rounds",
    ],
    bg: "#E8E4F2",
  },
  { type: "image", image: notesImage, alt: "Doctor using tablet" },
  {
    type: "text",
    title: "Downloadable Notes",
    description:
      "High-yield content curated by specialists:",
    points: [
      "Exam-focused summaries",
      "Regular updates",
      "Organized for quick download",
    ],
    bg: "#EADDE7",
  },
  { type: "image", image: access247Image, alt: "Doctor using laptop" },

  { type: "image", image: flashCardsImage, alt: "Medical study workspace" },
  {
    type: "text",
    title: "AI Study Assistant",
    description:
      "Your personal AI tutor — always available:",
    points: [
      "Summaries, concept maps, quick reviews",
      "Simplified explanations for complex topics",
      "Create custom MCQs/flashcards instantly",
    ],
    bg: "#ECEEDF",
  },

  { type: "image", image: medicalAiImage, alt: "Medical AI tools" },
  {
    type: "text",
    title: "Performance Analytics Dashboard",
    description:
      "Your personal AI tutor — always available:",
    points: [
      "Summaries, concept maps, quick reviews",
      "Simplified explanations for complex topics",
      "Create custom MCQs/flashcards instantly",
    ],
    bg: "#ECEEDF",
  },
];

export const AIFeaturesGrid = () => {
  return (
    <section className="pt-25 lg:pt-36" data-aos="fade-up">
      <div
        className="mx-auto mb-16 px-6 max-w-[755px] lg:max-w-[855px "
        data-aos="fade-up"
      >
        <h2 className="mx-auto text-center font-sora text-3xl md:text-3xl lg:text-[48px] font-semibold text-dark">
          We transform the way you study with AI <span className="font-pattaya text-[1.02em] font-normal leading-[1.08] inline"> all in one platform. </span>
        </h2>
      </div>

      <div className="mx-auto container px-5">
        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {gridCards.map((card, index) => {
            if (card.type === "image") {
              return (
                <article
                  key={`image-${index}`}
                  className="overflow-hidden rounded-xl hidden md:block group"
                  data-aos="fade-up"
                  data-aos-delay={index * 70}
                >
                  <div className="relative h-[250px] md:h-[280px] overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                  </div>
                </article>
              );
            }

            return (
              <article
                key={`text-${card.title}`}
                className="flex justify-between min-h-[250px] flex-col rounded-xl p-5 md:min-h-[280px]"
                data-aos="fade-up"
                data-aos-delay={index * 70}
                style={{ backgroundColor: card.bg }}
              >
                <h3 className="font-sora text-xl lg:text-2xl leading-tight text-[#1d2430]">
                  {card.title}
                </h3>
                <div>
                  <p className="mt-5 text-[14px] lg:text-[14px] leading-relaxed text-[#2b3441]">
                    {card.description}
                  </p>
                  {card.points && (
                    <ul className="mt-3 list-disc pl-5 text-[14px] lg:text-[14px] leading-relaxed text-[#2b3441]">
                      {card.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
