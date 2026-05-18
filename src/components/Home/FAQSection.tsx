import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FAQItem = {
  question: string;
  paragraphs?: string[];
  bullets?: string[];
  splitBlocks?: { title: string; bullets: string[] }[];
};

type FAQCategory = {
  title: string;
  items: FAQItem[];
};

const faqCategories: FAQCategory[] = [
  {
    title: "1. Getting Started",
    items: [
      {
        question: "1. What is ZYURA?",
        paragraphs: [
          "ZYURA is an AI-powered medical learning platform designed for medical, nursing, dental, pharmacy, and allied health students and professionals. It combines artificial intelligence with specialist-written content to deliver smarter, faster, and clinically relevant study tools.",
        ],
      },
      {
        question: "2. Who operates ZYURA?",
        paragraphs: [
          "ZYURA Education is operated by MEDIMIND MANAGING EMARKETPLACES W.L.L, the registered legal entity responsible for the platform’s services, content management, and compliance.",
        ],
      },
      {
        question: "3. Who can use ZYURA?",
        paragraphs: ["ZYURA is designed for:"],
        bullets: [
          "Medical students (MBBS, MD, DO)",
          "Nursing students (BSN, MSN)",
          "Dental students (BDS, DDS)",
          "Pharmacy students (B.Pharm, Pharm.D)",
          "Allied health professionals",
          "Educators and clinical mentors",
        ],
      },
      {
        question: "4. Is ZYURA free?",
        paragraphs: [
          "ZYURA offers both free and premium features. Some AI tools and advanced study modules require a paid subscription.",
        ],
      },
    ],
  },
  {
    title: "2. AI Features",
    items: [
      {
        question: "5. How does the AI-generated MCQ system work?",
        paragraphs: [
          "ZYURA’s AI analyzes your performance and dynamically generates MCQs tailored to your strengths and weaknesses. Question difficulty adapts based on your progress.",
        ],
      },
      {
        question: "6. Are AI-generated questions accurate?",
        paragraphs: [
          "AI-generated content is designed for educational purposes. While the system is optimized for accuracy, users should verify important information using trusted academic sources.",
        ],
      },
      {
        question: "7. Can I generate my own quizzes?",
        paragraphs: [
          "Yes. You can create custom quizzes by selecting subjects, topics, or difficulty levels. AI can also generate quizzes from your own notes.",
        ],
      },
      {
        question: "8. What is the AI Study Assistant?",
        paragraphs: ["The AI Study Assistant acts as a personal tutor. It can:"],
        bullets: [
          "Summarize complex topics",
          "Create concept maps",
          "Generate flashcards",
          "Produce custom MCQs",
          "Explain difficult concepts in simplified language",
        ],
      },
    ],
  },
  {
    title: "3. Content & Credibility",
    items: [
      {
        question: "9. Is the content reviewed by professionals?",
        paragraphs: [
          "Yes. ZYURA includes manual content created and reviewed by experienced specialist doctors to ensure clinical accuracy and exam relevance.",
        ],
      },
      {
        question: "10. Are clinical cases real?",
        paragraphs: [
          "Clinical case simulations are designed by experienced clinicians. Some cases are adapted or fictionalized for educational purposes but reflect real-world clinical reasoning.",
        ],
      },
      {
        question: "11. How often is the content updated?",
        paragraphs: [
          "Content is updated regularly to reflect evolving medical knowledge and exam trends.",
        ],
      },
    ],
  },
  {
    title: "4. Study Tools",
    items: [
      {
        question:
          "12. What is the difference between Study Mode and Exam Mode?",
        splitBlocks: [
          {
            title: "Study Mode",
            bullets: [
              "Detailed explanations",
              "Adjustable difficulty",
              "Review mistakes",
              "Real-time feedback",
            ],
          },
          {
            title: "Exam Mode",
            bullets: [
              "Timed testing",
              "No hints during exam",
              "Instant scoring",
              "Performance analytics",
            ],
          },
        ],
        paragraphs: ["You can switch between modes anytime."],
      },
      {
        question: "13. What is the Smart Study Planner?",
        paragraphs: [
          "The Smart Study Planner creates a personalized schedule based on your exam date, study goals, and progress. It adjusts automatically as you improve.",
        ],
      },
      {
        question: "14. Can I study with friends?",
        paragraphs: ["Yes. ZYURA allows you to:"],
        bullets: [
          "Create or join study groups",
          "Share flashcards and quizzes",
          "Compete on leaderboards",
          "Track group performance",
        ],
      },
    ],
  },
  {
    title: "5. Subscriptions & Payments",
    items: [
      {
        question: "15. How do subscriptions work?",
        paragraphs: [
          "Premium features are available through recurring subscriptions. You can cancel anytime through your account dashboard.",
        ],
      },
      {
        question: "16. Can I get a refund?",
        paragraphs: [
          "Refund eligibility depends on the Refund & Cancellation Policy. Generally, partial or unused subscription periods are non-refundable unless technical issues prevent access.",
        ],
      },
      {
        question: "17. How are payments processed?",
        paragraphs: [
          "Payments are handled securely through authorized third-party payment providers.",
        ],
      },
    ],
  },
  {
    title: "6. Privacy & Security",
    items: [
      {
        question: "18. Is my data secure?",
        paragraphs: [
          "Yes. ZYURA prioritizes data protection. User information, progress data, and account details are stored securely in accordance with applicable privacy regulations.",
        ],
      },
      {
        question: "19. Does ZYURA sell my data?",
        paragraphs: ["No. ZYURA does not sell personal data to third parties."],
      },
    ],
  },
  {
    title: "7. Medical Disclaimer",
    items: [
      {
        question: "20. Is ZYURA a replacement for medical training?",
        paragraphs: [
          "No. ZYURA is an educational support platform. It does not provide medical advice, diagnosis, or treatment guidance.",
        ],
      },
      {
        question: "21. Can I rely on ZYURA for clinical decision-making?",
        paragraphs: [
          "No. Always consult licensed professionals and official clinical guidelines before making real-world medical decisions.",
        ],
      },
    ],
  },
  {
    title: "8. Technical Support",
    items: [
      {
        question: "22. I forgot my password. What should I do?",
        paragraphs: [
          "Use the “Forgot Password” option on the login page to reset your credentials.",
        ],
      },
      {
        question: "23. How can I contact support?",
        paragraphs: ["You can contact support at:"],
        bullets: ["support@zyura-e.com"],
      },
    ],
  },
  {
    title: "9. For Mentors & Institutions",
    items: [
      {
        question: "24. Can doctors or educators contribute content?",
        paragraphs: [
          "Yes. Verified professionals can apply to become mentors or content contributors. Use the “Become a Mentor” option on the homepage.",
        ],
      },
      {
        question: "25. Can institutions partner with ZYURA?",
        paragraphs: [
          "Yes. Universities, training centers, and educators can contact us for partnership or licensing opportunities.",
        ],
      },
    ],
  },
];

export const FAQSection = () => {

  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  
  return (
    <section className="pt-25 lg:pt-36 aos-init aos-animate" data-aos="fade-up" id="faq">
      <div className="mx-auto container px-5">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mt-3 font-sora text-4xl font-bold text-[#1e2636] md:text-5xl lg:text-[56px]">
            FAQ's
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-5xl space-y-5">
          {faqCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl mb-6"
            >
              <h3 className="font-sora text-[22px] font-medium text-dark">
                {category.title}
              </h3>

              <div className="mt-4 space-y-3">
                {category.items.map((item, index) => {
                  const id = `${category.title}-${index}`;
                  const isOpen = activeIndex === id;

                  return (
                    <div
                      key={id}
                      className="rounded-xl border border-[#e1e7f0] bg-white"
                    >
                      {/* HEADER */}
                      <button
                        onClick={() =>
                          setActiveIndex(isOpen ? null : id)
                        }
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 font-sora text-[16px] font-medium text-dark"
                      >
                        <span className="text-left">{item.question}</span>

                        <ChevronDown
                          className={`h-5 w-5 text-[#4b5b78] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                            }`}
                        />
                      </button>

                      {/* BODY */}
                      {isOpen && (
                        <div className="space-y-3 px-4 pb-5">
                          {item.paragraphs?.map((paragraph) => (
                            <p
                              key={paragraph}
                              className="font-sora text-[15px] leading-relaxed text-[#3a475e]"
                            >
                              {paragraph}
                            </p>
                          ))}

                          {item.splitBlocks?.map((block) => (
                            <div
                              key={block.title}
                              className="rounded-lg border bg-[#f7faff] p-4"
                            >
                              <p className="font-semibold">{block.title}</p>
                              <ul className="mt-2 space-y-1.5">
                                {block.bullets.map((bullet) => (
                                  <li key={bullet} className="flex gap-2">
                                    <span className="h-2 w-2 mt-2 rounded-full bg-brand" />
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}

                          {item.bullets && (
                            <ul className="space-y-1.5">
                              {item.bullets.map((bullet) => (
                                <li key={bullet} className="flex gap-2">
                                  <span className="h-2 w-2 mt-2 rounded-full bg-brand" />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

