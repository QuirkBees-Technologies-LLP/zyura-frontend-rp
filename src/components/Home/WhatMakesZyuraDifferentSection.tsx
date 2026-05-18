import { Compass, Lightbulb, Sparkles } from "lucide-react";
// import DifferentBg from "../../assets/home/Different-bg.jpg"

const differencePoints = [
  "Learn theory through MCQs, notes, and flashcards",
  "Apply knowledge through real clinical scenarios",
  "Improve continuously with AI-driven insights",
];

const philosophyPoints = [
  { title: "Inclusive", description: "for every healthcare role" },
  { title: "Practical", description: "focused on real-world application" },
  { title: "Intelligent", description: "powered by AI and data" },
  { title: "Continuous", description: "evolving with modern medicine" },
];

export const WhatMakesZyuraDifferentSection = () => {
  return (
    <section className="pt-20 lg:pt-28" id="what-makes-zyura-different" data-aos="fade-up">
      <div className="container mx-auto px-5">
        <div className="grid gap-5 lg:grid-cols-12">
          <article className="relative overflow-hidden rounded-[28px] border border-[#D6EAF0] bg-[url('./assets/home/Different-bg.jpg')] bg-no-repeat bg-cover p-6 text-white md:p-10 lg:col-span-7">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
            <div className="pointer-events-none absolute -right-14 -top-20 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-16 h-44 w-44 rounded-full bg-[#8DE4D333] blur-3xl" />
            <div className="relative z-10 inline-flex rounded-full bg-white/15 p-3">
              <Sparkles size={24} />
            </div>
            <h2 className="relative z-10 mt-4 font-sora text-2xl font-semibold md:text-3xl lg:text-[44px]">
              What Makes Zyura Different
            </h2>
            <p className="relative z-10 mt-4 max-w-[760px] font-sora text-[15px] leading-relaxed text-white/90 lg:text-[18px]">
              We are not just a content platform - we are a complete clinical learning ecosystem.
            </p>

            <ul className="relative z-10 mt-6 space-y-3">
              {differencePoints.map((point) => (
                <li key={point} className="mt-3 font-sora text-[14px] lg:text-[18px] leading-relaxed text-white list-disc list-inside">
                  {point}
                </li>
              ))}
            </ul>
          </article>

          <div className="grid gap-5 lg:col-span-5">
            <article className="rounded-[24px] bg-[#e9f8ef] p-6 md:p-8">
              <div className="inline-flex rounded-full bg-white p-3 text-gray-500">
                <Compass size={22} />
              </div>
              <h3 className="mt-4 font-sora text-2xl font-semibold text-[#1E2D3D]">Our Vision</h3>
              <p className="mt-3 font-sora text-[14px] leading-relaxed text-[#415467] lg:text-[16px]">
                To become the world&apos;s most trusted platform for healthcare education - where every student and professional learns through practice, intelligence, and experience.
              </p>
            </article>

            <article className="rounded-[24px] border border-[#E6E6F3] bg-[#f6f8e9] p-6 md:p-8">
              <div className="inline-flex rounded-full bg-white p-3 text-gray-500">
                <Lightbulb size={22} />
              </div>
              <h3 className="mt-4 font-sora text-2xl font-semibold text-[#1E2D3D]">Our Philosophy</h3>
              <p className="mt-3 font-sora text-[14px] leading-relaxed text-[#415467] lg:text-[16px]">
                We believe healthcare education should be:
              </p>
              <ul className="mt-4 space-y-2">
                {philosophyPoints.map((item) => (
                  <li key={item.title} className="rounded-lg border border-[#DFE3F0] bg-white/80 px-3 py-2 text-[14px] text-[#304254]">
                    <span className="font-semibold text-[#243548]">{item.title}</span> - {item.description}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};
