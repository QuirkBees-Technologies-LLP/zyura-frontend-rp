import LightRays from "../ui/LightRays";

const trustPoints = ["Clinical accuracy", "Concept clarity", "Exam relevance"];

export const ContentCredibilitySection = () => {
  return (
    <section className="pt-25 lg:pt-36 aos-init aos-animate" data-aos="fade-up">
      <div className="relative overflow-hidden border border-[#3d4f7a]/70">
        <div className="absolute inset-0 bg-[#0a1230]" />
        <div className="absolute inset-0 opacity-70">
          <LightRays
            raysOrigin="top-center"
            raysColor="#7cc8ff"
            raysSpeed={1.2}
            lightSpread={0.75}
            rayLength={1.2}
            pulsating
            fadeDistance={1.0}
            saturation={1}
            followMouse
            mouseInfluence={0.08}
            noiseAmount={0.08}
            distortion={0.04}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#08102a]/35 via-[#0a132f]/55 to-[#08112a]/80" />
        <div className="relative px-6 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20 h-auto lg:h-[50vh] flex items-center flex-col justify-center">
          <div className="mx-auto max-w-5xl text-center" data-aos="fade-up">
            <h2 className="mx-auto text-center font-sora text-2xl md:text-3xl lg:text-[48px] font-semibold text-white">
              Expert-Curated Manual Content
            </h2>
            <p className="mx-auto mt-5 max-w-4xl font-sora text-[18px] font-light leading-relaxed text-[#d5e4ff]">
              Every subject is supported by manual notes, cases, and MCQs
              written by experienced specialist doctors - ensuring:
            </p>
          </div>
          <div className="mx-auto mt-9 grid max-w-5xl gap-4 md:grid-cols-3">
            {trustPoints.map((point, index) => (
              <article
                key={point}
                className="rounded-xl border border-[#89aee8]/45 bg-white/10 px-5 py-5 text-center backdrop-blur-sm"
                data-aos="fade-up"
                data-aos-delay={index * 90}
              >
                <p className="font-sora  text-[18px] font-normal text-white">
                  {point}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
