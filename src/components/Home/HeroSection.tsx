import { Autoplay, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import heroBanner from "../../assets/home/hero-banner.png";
import AIPowered from "../../assets/home/AI-Powered.png";
import ExpertValidatedAcrossAllSpecialties from "../../assets/home/Expert-Validated-Across-All-Specialties.png";
import SplitText from "../ui/SplitText";
import { Link } from "react-router-dom";

const heroSlides = [
  {
    image: heroBanner,
    title: "Train Like a Clinician. Think Like an Expert. Perform Under Pressure.",
    description:
      "An AI-powered medical learning platform designed for students, doctors, nurses, and allied health professionals to master clinical thinking, ace exams, and build real-world confidence.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=2000&q=80",
    title: "Where Medical Expertise Meets AI Intelligence",
    description:
      "Zyura combines *expert-created clinical content* with *advanced AI training tools* to help students and healthcare professionals master clinical thinking, excel in exams, and perform confidently in real-world practice.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000&q=80",
    title: "Collaborate, Practice, and Grow Together",
    description:
      "Join focused study groups, connect with mentors, and build confidence with a community that keeps you moving forward.",
  },
];

// const roles = [
//   {
//     id: 1,
//     icon: heroIcon1,
//     title: "Student",
//     alt: "student icon",
//   },
//   {
//     id: 2,
//     icon: heroIcon2,
//     title: "Professional",
//     alt: "professional icon",
//   },
//   {
//     id: 3,
//     icon: heroIcon3,
//     title: "Mentor",
//     alt: "mentor icon",
//   },
// ];

export default function HeroSection() {
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, A11y]}
        loop
        navigation={false}
        speed={900}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        // autoplay={false}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.image}>
            <div className="relative h-full w-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />

              <div className="absolute inset-0 flex items-center w-full">
                <div className="mx-auto mt-36 w-full max-w-5xl px-6 text-center lg:mt-28 lg:px-10">
                  <h1 className="">

                  </h1>
                  <SplitText
                    text={slide.title}
                    className="mx-auto max-w-4xl font-sora text-3xl lg:text-6xl font-bold leading-[1.08] text-white md:text-5xl"
                    delay={50}
                    duration={0.7}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}

                    textAlign="center"
                    onLetterAnimationComplete={handleAnimationComplete}
                  />

                  <p className="mx-auto mt-1 lg:mt-6 max-w-3xl md:text-xl text-md font-light leading-relaxed text-white/90">
                    {slide.description}
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <div className="w-24 h-24">
                      <img className="w-full h-full" src={AIPowered} alt="" />
                    </div>
                    <div className="w-24 h-24">
                      <img className="w-full h-full" src={ExpertValidatedAcrossAllSpecialties} alt="" />
                    </div>
                  </div>



                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4">

                    <Link
                      to="/login"
                      className="rounded-xl bg-brand px-4 lg:px-8 py-3 lg:py-3.5 text-[14px] lg:text-base font-light text-white transition hover:bg-[#0a4f9f]"
                    >
                      Start Training
                    </Link>

                    <Link
                      to="/login"
                      className="rounded-xl border border-white/85 px-4 lg:px-8 py-3 lg:py-3.5 text-[14px] lg:text-base font-light text-white transition hover:bg-white/10"
                    >
                      Explore AI Tools
                    </Link>

                  </div>

                  <p className="mx-auto mt-4 max-w-3xl text-[14px] font-light leading-relaxed text-white/80 md:text-base">
                    Built using real materials from doctors, nurses, pharmacists, dentists, and allied health professionals—enhanced by intelligent AI.
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
    // <div className="bg-[#FAFAFA]">
    //   <CommonWrapper>
    //     <div className="lg:grid grid-cols-2 gap-10 items-center">
    //       {/* Left Content */}
    //       <div className="py-10 md:py-16">
    //         <h1 className="text-3xl md:text-5xl font-bold text-[#1E293B] mb-4">
    //           Welcome to Your Medical <br /> Student Hub
    //         </h1>
    //         <p className="text-base md:text-lg text-[#334155]">
    //           Learn smarter, connect faster, succeed together.
    //         </p>

    //         {/* Role Cards */}
    //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6 md:my-8 lg:my-10 max-w-2xl">
    //           {roles.map(({ id, icon, title, alt }) => (
    //             <div
    //               key={id}
    //               className="rounded-lg border bg-blue-50 border-[#0EA5E94D]/30 p-4 md:p-5"
    //             >
    //               <img src={icon} alt={alt} />
    //               <h3 className="text-sm md:text-lg font-semibold text-blue-800 mt-2 text-nowrap">
    //                 {title}
    //               </h3>
    //             </div>
    //           ))}
    //         </div>

    //         {/* CTA Buttons */}
    //         <div className="flex gap-5 items-center">
    //           <PrimaryButton
    //             onClick={() => {
    //               navigate("/dashboard/smart-study");
    //             }}
    //             className="bg-teal-600"
    //           >
    //             Join Study Group
    //           </PrimaryButton>
    //           <PrimaryButton
    //             onClick={() => {
    //               navigate("/dashboard/quiz-page");
    //             }}
    //           >
    //             Take a Quiz
    //           </PrimaryButton>
    //         </div>
    //       </div>

    //       {/* Right Banner */}
    //       <div className="hidden lg:block pt-10">
    //         <img src={bannerImage} alt="Hero banner" />
    //       </div>
    //     </div>
    //   </CommonWrapper>
    // </div>
  );
}
