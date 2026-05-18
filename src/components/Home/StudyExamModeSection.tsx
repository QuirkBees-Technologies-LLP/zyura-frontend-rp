import { AppWindowMac, BookCheck, ChartArea, Info, Lightbulb, MessageCircleHeart, Star, Timer } from "lucide-react";
import doctorStudy from "../../assets/home/doctor-study.jpg"
import doctorExam from "../../assets/home/doctor-exam.jpg"

export const StudyExamModeSection = () => {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-36" data-aos="fade-up" id="study-plan">
      <div className="mx-auto container px-4 sm:px-5">
        <div
          className="mx-auto mb-10 max-w-[780px] px-2 md:mb-16 lg:max-w-[855px]"
          data-aos="fade-up"
        >
          <h2 className="mx-auto text-center font-sora text-3xl md:text-3xl lg:text-[48px] font-semibold text-dark">
            Study mode vs  
            <span className="font-pattaya text-[1.02em] font-normal leading-[1.08] inline"> Exam mode </span>
          </h2>
          <p className="mt-3 text-center font-sora text-[15px] leading-relaxed text-blackLight sm:text-[16px] lg:mt-4 lg:text-[18px]">
            Switch anytime between Study and Exam mode - build both knowledge
            and confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:gap-14">
          <article
            className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8"
            data-aos="fade-up"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={doctorStudy}
                alt="Doctor studying"
                className="h-[260px] w-full rounded-2xl object-cover sm:h-[340px] lg:h-full"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="text-blackLight">
              <h3 className="font-sora text-xl font-semibold lg:text-3xl leading-tight">
                Study Mode
              </h3>
              <p className="mt-1 mb-3 text-gray-500 text-[14px] leading-relaxed sm:text-[15px] lg:text-[18px]">
                Built for learning and revision:
              </p>

              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                  className="group rounded-2xl p-4 font-sora text-[14px] leading-relaxed text-[#2f3643] transition-transform duration-300 hover:-translate-y-0.5 sm:text-[15px]"
                  data-aos="fade-up"
                  data-aos-delay="60"
                  style={{ backgroundColor: "#F6F8E9" }}
                >
                  <div className="h-14 w-14 flex items-center justify-center mb-3 rounded-full bg-brand-gradient text-white transition-transform duration-300 group-hover:rotate-[3deg]">
                    <AppWindowMac />
                  </div>
                  Explanations + reference notes
                </div>
                <div
                  className="group rounded-2xl p-4 font-sora text-[14px] leading-relaxed text-[#2f3643] transition-transform duration-300 hover:-translate-y-0.5 sm:text-[15px]"
                  data-aos="fade-up"
                  data-aos-delay="120"
                  style={{ backgroundColor: "#E9F8EF" }}
                >
                  <div className="h-14 w-14 flex items-center justify-center mb-3 rounded-full bg-brand-gradient text-white transition-transform duration-300 group-hover:rotate-[3deg]">
                    <BookCheck />
                  </div>
                  Adjustable difficulty
                </div>
                <div
                  className="group rounded-2xl p-4 font-sora text-[14px] leading-relaxed text-[#2f3643] transition-transform duration-300 hover:-translate-y-0.5 sm:text-[15px]"
                  data-aos="fade-up"
                  data-aos-delay="180"
                  style={{ backgroundColor: "#E0EAF9" }}
                >
                  <div className="h-14 w-14 flex items-center justify-center mb-3 rounded-full bg-brand-gradient text-white transition-transform duration-300 group-hover:rotate-[3deg]">
                    <Star />
                  </div>
                  Review mistakes and improve
                </div>
                <div
                  className="group rounded-2xl p-4 font-sora text-[14px] leading-relaxed text-[#2f3643] transition-transform duration-300 hover:-translate-y-0.5 sm:text-[15px]"
                  data-aos="fade-up"
                  data-aos-delay="240"
                  style={{ backgroundColor: "#F8E9F3" }}
                >
                  <div className="h-14 w-14 flex items-center justify-center mb-3 rounded-full bg-brand-gradient text-white transition-transform duration-300 group-hover:rotate-[3deg]">
                    <MessageCircleHeart />
                  </div>
                  Real-time feedback
                </div>
              </div>
            </div>
          </article>

          <article
            className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8"
            data-aos="fade-up"
          >
            <div className="order-2 text-blackLight md:order-1">
              <h3 className="font-sora text-xl font-semibold lg:text-3xl leading-tight">
                Exam Mode
              </h3>
              <p className="mt-1 mb-3 text-gray-500 text-[14px] leading-relaxed sm:text-[15px] lg:text-[18px]">
                Built to simulate real exam pressure:
              </p>

              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                  className="group rounded-2xl p-4 font-sora text-[14px] leading-relaxed text-[#2f3643] transition-transform duration-300 hover:-translate-y-0.5 sm:text-[15px]"
                  data-aos="fade-up"
                  data-aos-delay="60"
                  style={{ backgroundColor: "#F6F8E9" }}
                >
                  <div className="h-14 w-14 flex items-center justify-center mb-3 rounded-full bg-brand-gradient text-white transition-transform duration-300 group-hover:rotate-[3deg]">
                    <Timer />
                  </div>
                  Timed tests + instant scoring
                </div>
                <div
                  className="group rounded-2xl p-4 font-sora text-[14px] leading-relaxed text-[#2f3643] transition-transform duration-300 hover:-translate-y-0.5 sm:text-[15px]"
                  data-aos="fade-up"
                  data-aos-delay="120"
                  style={{ backgroundColor: "#E9F8EF" }}
                >
                  <div className="h-14 w-14 flex items-center justify-center mb-3 rounded-full bg-brand-gradient text-white transition-transform duration-300 group-hover:rotate-[3deg]">
                    <Info />
                  </div>
                  No hints until the end
                </div>
                <div
                  className="group rounded-2xl p-4 font-sora text-[14px] leading-relaxed text-[#2f3643] transition-transform duration-300 hover:-translate-y-0.5 sm:text-[15px]"
                  data-aos="fade-up"
                  data-aos-delay="180"
                  style={{ backgroundColor: "#E0EAF9" }}
                >
                  <div className="h-14 w-14 flex items-center justify-center mb-3 rounded-full bg-brand-gradient text-white transition-transform duration-300 group-hover:rotate-[3deg]">
                    <ChartArea />
                  </div>
                  Analytics by subject/topic
                </div>
                <div
                  className="group rounded-2xl p-4 font-sora text-[14px] leading-relaxed text-[#2f3643] transition-transform duration-300 hover:-translate-y-0.5 sm:text-[15px]"
                  data-aos="fade-up"
                  data-aos-delay="240"
                  style={{ backgroundColor: "#F8E9F3" }}
                >
                  <div className="h-14 w-14 flex items-center justify-center mb-3 rounded-full bg-brand-gradient text-white transition-transform duration-300 group-hover:rotate-[3deg]">
                    <Lightbulb />
                  </div>
                  Ideal for board prep
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 rounded-2xl relative overflow-hidden">
              <img
                src={doctorExam}
                alt="Doctor studying"
                className="h-[260px] w-full rounded-2xl object-cover sm:h-[340px] lg:h-full"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
