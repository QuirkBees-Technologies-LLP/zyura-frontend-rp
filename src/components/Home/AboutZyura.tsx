import aboutImage from "../../assets/home/about-image.jpg";
import aboutImageSmall from "../../assets/home/about-image-two.jpg";
import CaseStudy from "../../assets/home/Case-Study.png";
import OurPurpose from "../../assets/home/OurPurpose.jpg";

const AboutZyura = () => {
  return (
    <section className="pt-16 lg:pt-36">
      <div className="container mx-auto px-5">
        <div className="aos-init aos-animate mx-auto mb-10 max-w-[755px] px-2 sm:px-4 lg:mb-16 lg:max-w-[855px] lg:px-6">
          <h2
            className="mx-auto mb-6 text-center font-sora text-2xl font-semibold text-dark md:text-3xl lg:mb-10 lg:text-[48px]"
            data-aos="fade-down"
          >
            About Zyura
          </h2>
        </div>

        <div className="mb-10">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
            <div className="relative order-2 w-full md:order-1" data-aos="fade-right">
              <div className="absolute right-2 top-4 h-24 w-fit overflow-hidden rounded-xl bg-white p-1 shadow-xl sm:right-6 sm:h-32 sm:rounded-2xl sm:p-2 lg:right-10 lg:top-1/6 lg:h-40">
                <img
                  className="ml-auto h-full w-full overflow-hidden rounded-2xl object-cover"
                  src={CaseStudy}
                  alt="Case study"
                />
              </div>
              <img
                className="h-full w-full overflow-hidden rounded-2xl object-cover md:w-[80%]"
                src={aboutImage}
                alt="About Zyura"
              />
            </div>

            <div className="order-1 md:order-2" data-aos="fade-left">
              <h6 className="font-sora text-xl font-bold leading-tight text-[#232831] sm:text-2xl lg:text-[26px]">
                One Platform. Every Healthcare Professional.
              </h6>
              <p className="mt-4 max-w-2xl font-sora text-[14px] leading-relaxed text-[#2c3442] lg:text-[18px]">
                Zyura is a next-generation healthcare education platform designed for <b>every healthcare worker</b> from students to experienced professionals across all specialties.
              </p>
              <p className="mt-4 max-w-2xl font-sora text-[14px] leading-relaxed text-[#2c3442] lg:text-[18px]">
                In a field where every decision matters, learning must go beyond theory. Zyura transforms traditional education into an <b>interactive, experience-driven journey</b> that prepares healthcare professionals for real-world clinical practice.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
            <div className="order-1" data-aos="fade-right">
              <h6 className="mt-0 font-sora text-xl font-bold leading-tight text-[#232831] sm:text-2xl md:mt-7 lg:mt-[70px] lg:text-[26px]">
                Our Purpose
              </h6>
              <p className="mt-4 max-w-2xl font-sora text-[14px] leading-relaxed text-[#2c3442] lg:text-[18px]">
                Healthcare is built on knowledge, precision, and continuous learning.
              </p>
              <p className="mt-4 max-w-2xl font-sora text-[14px] leading-relaxed text-[#2c3442] lg:text-[18px]">
                Yet, most platforms separate theory from practice.
              </p>
              <p className="mt-0 max-w-2xl font-sora text-[14px] leading-relaxed text-[#2c3442] lg:text-[18px]">
                <b>Zyura brings everything together - knowledge, application, and decision-making - in one unified ecosystem.</b>
              </p>
              <p className="mt-4 max-w-2xl font-sora text-[14px] leading-relaxed text-[#2c3442] lg:text-[18px]">
                Our mission is to empower students and healthcare professionals with the tools and confidence to make better clinical decisions, every day.
              </p>
            </div>

            <div className="relative order-2 w-full overflow-hidden rounded-2xl" data-aos="fade-left">
              <div className="absolute left-2 top-4 h-24 w-fit overflow-hidden rounded-xl bg-white p-1 shadow-xl sm:left-6 sm:h-32 sm:rounded-2xl sm:p-2 lg:top-1/6 lg:h-40">
                <img
                  className="ml-auto h-full w-full overflow-hidden rounded-2xl object-cover"
                  src={aboutImageSmall}
                  alt="About Zyura preview"
                />
              </div>
              <img
                className="ml-auto h-full w-full overflow-hidden rounded-2xl object-cover md:w-[80%]"
                src={OurPurpose}
                alt="Our purpose"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutZyura
