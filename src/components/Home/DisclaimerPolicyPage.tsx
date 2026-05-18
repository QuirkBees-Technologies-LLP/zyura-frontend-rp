const educationalContentList = [
  "Multiple-choice questions (MCQs)",
  "Flashcards",
  "Clinical cases and simulations",
  "Downloadable notes and study materials",
  "AI-generated summaries, quizzes, and study plans",
];

const doesNotProvideList = [
  "Medical advice",
  "Clinical diagnosis",
  "Treatment recommendations",
  "Professional healthcare consultation",
];

const noRelationshipList = [
  "A doctor–patient relationship",
  "A healthcare provider–client relationship",
  "Any fiduciary or advisory relationship",
];

const accuracyLimitationsList = [
  "Medical knowledge evolves continuously.",
  "Educational materials may become outdated.",
  "AI-generated outputs may contain inaccuracies or omissions.",
  "Some case scenarios may be fictional or simplified for teaching purposes.",
];

const aiAcknowledgmentsList = [
  "AI systems operate using algorithms and probabilistic models.",
  "Outputs depend on user input and system limitations.",
  "AI-generated responses may contain errors or lack contextual nuance.",
];

const liabilityList = [
  "Use or misuse of educational content",
  "Misinterpretation of materials",
  "Academic performance outcomes",
  "Clinical decisions influenced by Platform content",
  "Service interruptions or technical errors",
];

const thirdPartyNotResponsibleList = [
  "The content or accuracy of third-party websites",
  "External privacy practices",
  "Services provided by third-party vendors",
];

const noGuaranteeList = [
  "Specific exam scores",
  "Certification success",
  "Academic ranking",
  "Employment or professional advancement",
];

const asIsWarrantyList = [
  "Fitness for a particular purpose",
  "Non-infringement",
  "Accuracy",
  "Reliability",
  "Availability without interruption",
];

const consentAcknowledgmentList = [
  "You understand this Disclaimer.",
  "You accept that the Platform is an educational tool only.",
  "You assume full responsibility for how you interpret and apply any information obtained from the Platform.",
];

export const DisclaimerPolicyPage = () => {
  return (
    <main className="min-h-screen bg-[#eef2f8] px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#dbe3f0] bg-white p-6 md:p-10">
        <h1 className="font-sora text-[22px] font-bold text-black">
          Disclaimer / Medical Disclaimer
        </h1>

        <p className="mt-2 whitespace-pre-line font-sora text-[18px] text-[#6b7280]">
          MEDIMIND MANAGING EMARKETPLACES W.L.L (Operating Zyura Education)
          {"\n"}Last Updated: 28/04/2026
        </p>

        <div className="mt-6 space-y-4 font-sora text-[16px] text-[#6b7280]">
          <p>
            This Disclaimer outlines important limitations regarding the use of
            the Zyura Education platform, which is owned and operated by
            MEDIMIND MANAGING EMARKETPLACES W.L.L (“we,” “our,” “us”).
          </p>
          <p>
            By accessing or using Zyura Education’s website, mobile
            applications, AI tools, or related services (collectively, the
            “Platform”), you acknowledge and agree to the terms set out below.
          </p>
        </div>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            1. Educational Purpose Only
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            All content available on Zyura Education — including but not limited
            to:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {educationalContentList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            is provided strictly for educational and informational purposes.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education does not provide:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {doesNotProvideList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            The Platform is designed to support academic learning and exam
            preparation. It is not intended to guide patient care or real-world
            medical decision-making.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            If you have medical concerns, always consult a licensed healthcare
            professional. Do not disregard or delay seeking professional advice
            based on content accessed through Zyura Education.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            2. No Doctor–Patient or Professional Relationship
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Your use of Zyura Education does not create:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {noRelationshipList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            All AI responses, educational simulations, or explanations are
            automated educational tools and do not constitute professional
            consultation.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            3. Accuracy and Completeness of Information
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education makes reasonable efforts to maintain high
            educational standards. However:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {accuracyLimitationsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            We do not guarantee the accuracy, completeness, or reliability of
            any content on the Platform.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Users are responsible for independently verifying information through
            authoritative medical textbooks, peer-reviewed literature,
            institutional guidelines, or licensed professionals before applying
            it in academic or clinical contexts.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            4. AI-Generated Content Disclaimer
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education integrates AI-driven tools designed to personalize
            learning and generate educational content.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Users acknowledge that:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {aiAcknowledgmentsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            AI-generated materials must not be interpreted as medical advice,
            professional guidance, or definitive clinical instruction.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L disclaims liability for any
            consequences resulting from reliance on AI-generated outputs.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            5. Limitation of Liability
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            To the maximum extent permitted by applicable law:
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L, its affiliates, officers,
            employees, contractors, and partners shall not be liable for any
            direct, indirect, incidental, consequential, or special damages
            arising from:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {liabilityList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Use of Zyura Education is at your sole risk.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            6. Third-Party Links and Integrations
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            The Platform may contain links to external websites, tools, payment
            processors, or educational resources.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L is not responsible for:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {thirdPartyNotResponsibleList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Accessing third-party links is done at the user’s discretion and
            subject to the third party’s terms and policies.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            7. No Guarantee of Academic or Professional Results
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education provides tools intended to enhance study efficiency
            and knowledge retention. However, we do not guarantee:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {noGuaranteeList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Educational outcomes depend on individual effort, institutional
            standards, and external factors beyond our control.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            8. “As Is” Provision
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            All services and content on Zyura Education are provided on an “as
            is” and “as available” basis, without warranties of any kind,
            whether express or implied.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L expressly disclaims any
            warranties including, but not limited to:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {asIsWarrantyList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            9. Consent and Acknowledgment
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            By using Zyura Education, you confirm that:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {consentAcknowledgmentList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            10. Contact Information
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            For questions regarding this Disclaimer:
          </p>
          <p className="whitespace-pre-line font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L{"\n"}Email: <a className="text-primary" href="mailto:info@zyura-e.com">info@zyura-e.com</a>
            {"\n"}Website: <a className="text-primary" href="https://www.zyura-e.com" target="_blank" rel="noopener noreferrer">www.zyura-e.com</a>
          </p>
        </section>
      </div>
    </main>
  );
};

