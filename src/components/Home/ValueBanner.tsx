import heartIcon from "../../assets/home/heart.png";

export const ValueBanner = () => {
  return (
    <section
      className="bg-brand-gradient px-5 lg:px-5  py-10 flex items-center justify-center"
      data-aos="fade-up"
    >
      <div className="max-w-[1920px] mx-auto px-5" data-aos="fade-up">
        <div className="grid items-center justify-between gap-8 grid-row lg:grid-cols-[1fr_1fr_1fr] text-center lg:text-left">
          <h3 className="max-w-xl font-sora text-3xl md:text-2xl lg:text-4xl font-bold leading-tight text-white ">
            Who we are & Why Choose US?
          </h3>
          <img
            src={heartIcon}
            alt="Zyura heart icon"
            className="mx-auto h-[88px] w-[88px] object-contain md:h-[102px] md:w-[102px]"
          />
          <p data-aos="fade-up" data-aos-delay="120" className="font-sora max-w-xl text-base leading-relaxed text-white/95 md:text-lg">
            We are a digital medical education platform committed to transforming healthcare learning through AI-powered tools and expert-led content.
            We combine AI automation with manual content created by verified specialist doctors to deliver a reliable learning experience you can trust  whether you're preparing for university exams, OSCE, or board certification.
          </p>
        </div>
      </div>
    </section>
  );
};
