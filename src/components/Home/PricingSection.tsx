import { REGION_PRICING } from "@/constants/pricingPlans";
import { getRegion } from "@/utils/getRegion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type PricingPlan = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  amount: number;
  currency: string;
  period: string;
  cta: string;
  accent: string;
  featuresTitle: string;
  features: string[];
  highlight?: boolean;
};

export const PricingSection = () => {
  const [billingType, setBillingType] = useState<"monthly" | "yearly">(
    "yearly",
  );
  const navigate = useNavigate();
  const region = getRegion();

  const pricing =
    REGION_PRICING[region as keyof typeof REGION_PRICING] ||
    REGION_PRICING.GLOBAL;

  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Free Plan",
      subtitle: "Ideal for getting started",
      price: "Free",
      amount: 0,
      currency: pricing.currency,
      period: "forever",
      cta: "Get started",
      accent: "from-[#F9EFEA] to-[#FDF7F4]",
      featuresTitle: "Included features:",
      features: [
        "MCQ of the Day",
        "Limited Flashcards",
        "Limited Clinical Cases",
        "Question of the Day",
        "Mentors on Request",
      ],
    },

    {
      id: "standard",
      name: "Standard Plan",
      subtitle: "Best for everyday study",
      price: `${pricing.currency}${pricing.plans.standard[billingType]}`,
      amount: pricing.plans.standard[billingType],
      currency: pricing.currency,
      period: billingType === "monthly" ? "/month" : "/year",
      cta: "Get started",
      highlight: true,
      accent: "from-[#EEF1FF] to-[#F7F9FF]",
      featuresTitle: "Everything you need, plus:",
      features: [
        "Unlimited MCQ Bank",
        "Unlimited Flashcards",
        "Unlimited Clinical Cases",
        "Weekly Mini Cases",
        "Unlimited Notes PDF",
        "Smart Study Planner",
        "Community Feed",
        "Limited AI Tools",
        "Gamification Dashboard",
        "Mentors on Request",
      ],
    },

    {
      id: "premium",
      name: "Premium Plan",
      subtitle: "Most popular choice",
      price: `${pricing.currency}${pricing.plans.premium[billingType]}`,
      amount: pricing.plans.premium[billingType],
      currency: pricing.currency,
      period: billingType === "monthly" ? "/month" : "/year",
      cta: "Get started",
      accent: "from-[#F3F8FF] to-[#F7FBFF]",
      featuresTitle: "Everything in Standard, plus:",
      features: [
        "Everything in Standard",
        "Academic Exam Mode",
        "Unlimited AI Tools",
        "Smart Study Planner",
        "Group Chat",
        "Drug Cards",
      ],
    },

    {
      id: "elite",
      name: "Elite Plan + AI Combo",
      subtitle: "Best for board exam preparation",
      price: `${pricing.currency}${pricing.plans.elite[billingType]}`,
      amount: pricing.plans.elite[billingType],
      currency: pricing.currency,
      period: billingType === "monthly" ? "/month" : "/year",
      cta: "Contact us",
      accent: "from-[#EDF8F8] to-[#F5FCFC]",
      featuresTitle: "Everything in Premium, plus:",
      features: [
        "Everything in Premium",
        "Priority Mentor Access",
        "Clinical Simulation",
        "Career Roadmap",
        "Early Beta Access",
        "Board Exam Access",
      ],
    },
  ];

  const handlePlanSelect = (plan: PricingPlan) => {
    const selectedPlan = {
      id: plan.id,
      name: plan.name,
      amount: plan.amount,
      currency: plan.currency,
      period: plan.period,
    };

    localStorage.setItem("selectedPlan", JSON.stringify(selectedPlan));
    navigate("/signup", { state: { selectedPlan } });
  };

  return (
    <section
      className="relative overflow-hidden bg-[#f7f8ff] py-20 lg:py-28"
      data-aos="fade-up"
      data-aos-duration="700"
      data-aos-once="true"
      id="pricing"
    >
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,#d8dcf4_1px,transparent_1px),linear-gradient(to_bottom,#d8dcf4_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto container px-5">
        <div
          className="mx-auto mb-16 px-6 max-w-[755px] lg:max-w-[855px]"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="700"
        >
          <h2 className="mx-auto text-center font-sora text-3xl md:text-3xl lg:text-[48px] font-semibold text-dark">
            Pick your -
            <span className="font-pattaya font-normal italic">
              on your needs
            </span>
          </h2>
          <div className="flex justify-center mt-8">
            <div className="bg-white p-1 rounded-xl border flex gap-2">
              <button
                type="button"
                onClick={() => setBillingType("monthly")}
                className={`px-5 py-2 rounded-lg transition ${
                  billingType === "monthly"
                    ? "bg-[#0A5BB8] text-white"
                    : "text-gray-700"
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setBillingType("yearly")}
                className={`px-5 py-2 rounded-lg transition ${
                  billingType === "yearly"
                    ? "bg-[#0A5BB8] text-white"
                    : "text-gray-700"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={`relative flex h-full flex-col rounded-3xl border border-[#dfe3f4] bg-gradient-to-b ${plan.accent} p-6 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]`}
              data-aos="fade-up"
              data-aos-delay={index * 70}
              data-aos-duration="700"
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-[#0f1452] px-4 py-1 font-sora text-xs font-semibold text-white">
                  Most recommended
                </span>
              )}

              <h3 className="mb-4 font-sora text-2xl font-semibold text-[#111739]">
                {plan.name}
              </h3>

              <p className="mb-2 font-sora text-sm text-[#4d5475]">
                {plan.subtitle}
              </p>
              <p className="mb-4 font-sora text-[40px] font-semibold leading-none text-[#0f1333]">
                {plan.price}
                <span className="ml-2 align-middle text-base font-normal text-[#4d5475]">
                  {plan.period}
                </span>
              </p>

              <button
                type="button"
                className={`mb-7 w-full rounded-xl border px-4 py-3 font-sora text-base font-medium transition ${
                  plan.highlight
                    ? " bg-brand-gradient text-white hover:bg-brand-gradient-hover"
                    : "border-[#d6dbef] bg-white text-[#1b2142] hover:bg-[#f0f3ff]"
                }`}
                onClick={() => {
                  if (plan.name === "Elite Plan + AI Combo") {
                    window.open(
                      "https://calendly.com/zyura-team/30min",
                      "_blank",
                    );
                  } else {
                    handlePlanSelect(plan);
                  }
                }}
              >
                {plan.cta}
              </button>

              <div className="mb-5 h-px w-full bg-[#d8dcef]" />

              <p className="mb-4 font-sora text-[22px] font-medium text-[#111739]">
                {plan.featuresTitle}
              </p>

              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3"
                    data-aos="fade-up"
                    data-aos-delay={index * 70 + featureIndex * 40}
                    data-aos-duration="650"
                  >
                    <span className="mt-[2px] inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#e7ecff] text-[#24326d]">
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          d="M4.5 10.2L8.2 13.8L15.5 6.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="font-sora text-base leading-6 text-[#2e3559]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
