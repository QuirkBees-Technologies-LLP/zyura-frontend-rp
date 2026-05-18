import Header from "@/components/Home/header";
import { Footer } from "@/components/Home/Footer";
import { PricingSection } from "@/components/Home/PricingSection";
import { FAQSection } from "@/components/Home/FAQSection";
import { TestimonialSection } from "@/components/Home/TestimonialSection";
import { CTASection } from "@/components/Home/CTASection";
import { ContactUsSection } from "@/components/Home/ContactUsSection";
import prizingBanner1 from "@/assets/home/prizing-banner-1.jpg";
import prizingBanner2 from "@/assets/home/prizing-banner-2.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { selectUser } from "@/store/features/auth/auth.slice";
import { ChevronUp } from "lucide-react";
import AOS from "aos";
import 'aos/dist/aos.css';


const pricingHeroSlides = [
  {
    image: prizingBanner1,
    title: "Flexible Pricing For Every Medical Learner",
    description:
      "Choose the plan that matches your journey, from daily prep to advanced board-level clinical training.",
  },
  {
    image: prizingBanner2,
    title: "Train Smarter With Plans Built For Real Progress",
    description:
      "Get access to clinical cases, AI tools, study planners, and mentorship based on your learning intensity.",
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const isPaidUser = Boolean(user?.account?.isSubscribed || user?.account?.isSubscriptionActive);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (isPaidUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [isPaidUser, navigate]);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 40,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 250);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden bg-white">
      <Header />

      <section className="relative h-screen min-h-[620px] w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, A11y]}
          loop
          navigation={false}
          speed={900}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {pricingHeroSlides.map((slide, index) => (
            <SwiperSlide key={`${slide.title}-${index}`}>
              <div className="relative h-full w-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto mt-28 w-full max-w-5xl px-6 text-center lg:px-10">
                    <h1 className="mx-auto max-w-4xl font-sora text-3xl font-bold leading-[1.08] text-white md:text-5xl lg:text-6xl"
                      data-aos="fade-up">
                      {slide.title}
                    </h1>
                    <p className="mx-auto mt-4 max-w-3xl text-base font-light leading-relaxed text-white/90 md:text-xl"
                      data-aos="fade-up">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <PricingSection />
      <div id="faq">
        <FAQSection />
      </div>
      <ContactUsSection />
      <TestimonialSection />
      <CTASection />
      <Footer />


      {showScrollTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-white shadow-lg transition hover:scale-105"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Pricing;
