import studyImage from "../../assets/home/doctor-study.jpg";

const points = [
  "Create or join study groups",
  "Share quizzes, notes, flashcards",
  "Compete on leaderboards",
  "Track individual + group performance",
];

export const PersonalGroupStudySection = () => {
  return (
    <section className=" relative overflow-hidden py-25 lg:py-36" data-aos="fade-up">
      <div className="mx-auto container px-5">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="max-w-[760px]" data-aos="fade-up">
            <p className="inline-flex w-fit rounded-full border border-[#353b48]/40 px-3 py-1 text-xs font-medium text-[#49505c] mb-8">
              PERSONAL + GROUP STUDY
            </p>
            <h2 className="mx-auto text-left font-sora text-2xl md:text-3xl lg:text-[48px] font-semibold text-dark">
              Study Solo or With Peers
            </h2>
            <p className="mt-2 font-sora text-[18px] leading-relaxed text-[#556272]">
              Learn your way - alone or together:
            </p>
            <div className="mt-10 space-y-1">
              {points.map((point, index) => (
                <div
                  key={point}
                  className="flex gap-5"
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                >
                  <div className="flex w-[62px] shrink-0 flex-col items-center">
                    <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-primary font-sora text-xl font-medium text-white">
                      {index + 1}
                    </span>
                    {index < points.length - 1 && (
                      <span className="mt-2 h-[36px] w-px bg-[#c9d3e1]" />
                    )}
                  </div>

                  <div className="pt-0 mt-3">
                    <p className="font-sora text-xl font-medium leading-tight text-gray-600">
                      {point}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-[32px] relative" data-aos="fade-left">
            <img
              src={studyImage}
              alt="Students studying together"
              className="h-[440px] w-full object-cover md:h-[560px] lg:h-[760px]"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </div>
      </div>
    </section>
  );
};
