// import { Element } from "react-scroll";
// import AIToolSection from "@/components/Home/AIToolSection";
import HeroSection from "@/components/Home/HeroSection";
// import MentorSection from "@/components/Home/MentorSection";
// import StudyPlanSection from "@/components/Home/StudyPlanSection";
// import studyPlanImage from "@/assets/home/study_plan_image.png";
// import Tools from "@/components/Home/Tools";
//import { ValueBanner } from "@/components/Home/ValueBanner";
//import { ValueBanner } from "@/components/Home/ValueBanner";
import { FeatureCards } from "@/components/Home/FeatureCards";
import { AIFeaturesGrid } from "@/components/Home/AIFeaturesGrid";
import { StudyExamModeSection } from "@/components/Home/StudyExamModeSection";
import { ContentCredibilitySection } from "@/components/Home/ContentCredibilitySection";
import { PersonalGroupStudySection } from "@/components/Home/PersonalGroupStudySection";
import { SmartStudyPlannerSection } from "@/components/Home/SmartStudyPlannerSection";
import { BenefitsStripSection } from "@/components/Home/BenefitsStripSection";
import { PricingSection } from "@/components/Home/PricingSection";
import { AIStudySection } from "@/components/Home/AIStudySection";
import { WhoCanUseSection } from "@/components/Home/WhoCanUseSection";
import { MentorsSection } from "@/components/Home/MentorsSection";
import { FAQSection } from "@/components/Home/FAQSection";
import { CTASection } from "@/components/Home/CTASection";
import Header from "@/components/Home/header";
import { Footer } from "@/components/Home/Footer";
import { DisclaimerPolicyPage } from "@/components/Home/DisclaimerPolicyPage";
import { PolicyHeader } from "@/components/Home/PolicyHeader";
import { CopyrightPolicyPage } from "@/components/Home/CopyrightPolicyPage";
import { CookiePolicyPage } from "@/components/Home/CookiePolicyPage";
import { RefundPolicyPage } from "@/components/Home/RefundPolicyPage";
import { TermsConditionsPage } from "@/components/Home/TermsConditionsPage";
import AOS from "aos";
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react'
import { ChevronUp } from "lucide-react";
import { WhyZyuraDifferent } from "@/components/Home/WhyZyuraDifferent";
import { BuiltForEveryProfessional } from "@/components/Home/BuiltForEveryProfessional";
import { LearnByDoingSection } from "@/components/Home/LearnByDoingSection";
import { TestimonialSection } from "@/components/Home/TestimonialSection";
import AboutZyura from "@/components/Home/AboutZyura";
// import { WhatZyuraOffersSection } from "@/components/Home/WhatZyuraOffersSection";
import { WhatMakesZyuraDifferentSection } from "@/components/Home/WhatMakesZyuraDifferentSection";
import { ZyuraExperienceSection } from "@/components/Home/ZyuraExperienceSection";
import { LookingAheadSection } from "@/components/Home/LookingAheadSection";
import { ContactUsSection } from "@/components/Home/ContactUsSection";

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const isTermsPage = pathname === "/terms-and-conditions-zyura-e";
  const isRefundPage = pathname === "/refund-policy-zyura-edu";
  const isCookiePage = pathname === "/cookie-policy-zyura-e";
  const isCopyrightPage = pathname === "/copyright-policy-zyura-e";
  const isDisclaimerPage = pathname === "/disclaimer-policy-zyura-e";

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

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 250);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  if (isTermsPage) {
    return (
      <div className='relative'>
        <PolicyHeader />
        <TermsConditionsPage />
        <Footer />
      </div>
    )
  }

  if (isRefundPage) {
    return (
      <div className='relative'>
        <PolicyHeader />
        <RefundPolicyPage />
        <Footer />
      </div>
    )
  }

  if (isCookiePage) {
    return (
      <div className='relative'>
        <PolicyHeader />
        <CookiePolicyPage />
        <Footer />
      </div>
    )
  }

  if (isCopyrightPage) {
    return (
      <div className='relative'>
        <PolicyHeader />
        <CopyrightPolicyPage />
        <Footer />
      </div>
    )
  }

  if (isDisclaimerPage) {
    return (
      <div className='relative'>
        <PolicyHeader />
        <DisclaimerPolicyPage />
        <Footer />
      </div>
    )
  }

  return (
    <div className="overflow-hidden relative">
      <Header />
      <HeroSection />
      <WhyZyuraDifferent />
      <div id="ai-tools">
        <FeatureCards />
        <LearnByDoingSection />
        <AIFeaturesGrid />
      </div>
      <div id="study-plan">
        <StudyExamModeSection />
        <ContentCredibilitySection />
        <PersonalGroupStudySection />
        <SmartStudyPlannerSection />
        <BenefitsStripSection />
      </div>

      <div id="about-us">
        <AboutZyura />
        <BuiltForEveryProfessional />
        <AIStudySection />
        <ZyuraExperienceSection />
        <WhatMakesZyuraDifferentSection />
        <LookingAheadSection />
        <WhoCanUseSection />
      </div>
      <div id="mentors">
        <MentorsSection />
      </div>
      <FAQSection />

      <ContactUsSection />
      <TestimonialSection />
      <CTASection />
      <Footer />

      {
        showScrollTop && (
          <button
            type="button"
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-white shadow-lg transition hover:scale-105"
          >
            <ChevronUp className="h-6 w-6" />
          </button>
        )
      }
    </div >
  );
};

export default Home;
