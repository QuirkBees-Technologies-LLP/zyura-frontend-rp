
import ctaBgImage from "../../assets/home/cta-bg.png";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="pt-25 lg:pt-36" data-aos="fade-up">
      <div className="relative overflow-hidden">
        <img
          src={ctaBgImage}
          alt="Doctor with digital tablet"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="mx-auto container px-5">
          <div className="relative flex min-h-[300px] md:min-h-[340px] flex-col lg:flex-row justify-center gap-8 px-8 py-10 md:items-center md:justify-between md:px-12 text-center lg:text-left">
            <div className="max-w-2xl" data-aos="fade-right">
              <h2 className="font-sora text-[38px] font-asemibold leading-tight text-white md:text-[54px]">
                Start Training Like a Future
                <span className="font-pattaya font-normal"> Clinician Today</span>
              </h2>
              <p className="font-sora text-[18px] leading-relaxed text-white">Join a platform built to bridge the gap between <b>learning and real clinical performance</b>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/signup"
                className=" rounded-xl border border-white/85 px-4 lg:px-8 py-3 lg:py-3.5 text-[14px] lg:text-base font-light text-white transition hover:bg-white/10"
                data-aos="fade-left"
                data-aos-delay="120"
              >
                Get Started Free
              </Link>
              <button
                type="button"
                className="flex lg:px-8 py-3 lg:py-4 text-[14px] items-center justify-center gap-2 rounded-lg bg-brand px-5 font-sora font-light text-sm text-white transition bg-brand-gradient hover:bg-brand-gradient-hover"
                data-aos="fade-left"
                data-aos-delay="120"
              >
                Explore Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
