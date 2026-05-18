// import { Globe, Lightbulb, Microscope } from "lucide-react";

export const LookingAheadSection = () => {
  return (
    <section className="pt-20 lg:pt-28" id="looking-ahead" data-aos="fade-up">
      <div className="container mx-auto px-5">
        <div className="">
          <div className="pointer-events-none absolute -top-16 -left-14 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-14 h-48 w-48 rounded-full bg-[#9CE5D833] blur-3xl" />

          <h2 className="text-center text-dark font-sora text-2xl font-semibold md:text-3xl lg:text-[48px]">
            Looking <span className="font-pattaya text-[1.02em] font-normal leading-[1.08] inline">Ahead</span>
          </h2>

          <p className="mx-auto mt-5 max-w-[980px] text-center font-sora text-[15px] leading-relaxed text-dark lg:text-[20px]">
            We are building a future where healthcare education is smarter, unified, and globally accessible - combining technology, clinical expertise, and innovation to shape the next generation of healthcare professionals.
          </p>

          
        </div>
      </div>
    </section>
  );
};

