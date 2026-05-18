const eligibilityList = [
  "You are at least 16 years of age, or you have valid parental/legal guardian consent.",
  "You are using the Platform for lawful, educational, and non-commercial purposes.",
  "You will comply with all applicable local, national, and international laws and regulations.",
];

const servicesList = [
  "Manually prepared MCQs, flashcards, and clinical cases",
  "Downloadable academic notes",
  "AI-generated questions, summaries, and study plans",
  "Smart Study Planner and adaptive learning tools",
  "Specialized educational content for medical, dental, nursing, pharmacy, and allied health fields",
];

const registrationList = [
  "Provide accurate and complete information.",
  "Maintain the confidentiality of your login credentials.",
  "Accept responsibility for all activities conducted under your account.",
];

const ipList = [
  "Educational materials",
  "AI-generated content",
  "Platform design and software",
  "Logos and trademarks",
];

const ipRestrictions = [
  "Copy, reproduce, distribute, republish, or resell Platform content.",
  "Use content for commercial training programs without written authorization.",
  "Extract, scrape, or systematically collect data from the Platform.",
];

const aiAcknowledgement = [
  "AI-generated outputs may contain inaccuracies.",
  "Results depend on user input and algorithmic limitations.",
  "AI content is provided for educational assistance only.",
];

const userGeneratedList = [
  "Retain ownership of your original material.",
  "Grant MEDIMIND MANAGING EMARKETPLACES W.L.L a non-exclusive, worldwide, royalty-free license to use such content for operational and educational purposes.",
  "Confirm that your content does not infringe third-party rights.",
];

const subscriptionList = [
  "Provide accurate billing information.",
  "Authorize recurring charges unless canceled before renewal.",
  "Accept that partial or unused subscription periods are non-refundable unless required by law.",
];

const prohibitedList = [
  "Use the Platform for academic dishonesty or exam cheating.",
  "Share, distribute, or resell copyrighted materials.",
  "Reverse engineer or attempt to access proprietary code.",
  "Upload malicious software or harmful content.",
  "Interfere with platform security or operations.",
];

const liabilityList = [
  "Use or inability to use the Platform.",
  "Errors in AI-generated or educational content.",
  "Academic or professional outcomes.",
  "Technical interruptions or data loss.",
];

const indemnificationList = [
  "Your violation of these Terms.",
  "Misuse of the Platform.",
  "Infringement of third-party rights.",
];

const terminationList = [
  "Breach these Terms.",
  "Engage in fraudulent, abusive, or unlawful conduct.",
];

export const TermsConditionsPage = () => {
  return (
    <main className="min-h-screen bg-[#eef2f8] px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#dbe3f0] bg-white p-6 md:p-10">
        <h1 className="font-sora text-[22px] font-bold text-black">
          Terms and Conditions
        </h1>

        <p className="mt-2 whitespace-pre-line font-sora text-[18px] text-[#6b7280]">
          MEDIMIND MANAGING EMARKETPLACES W.L.L <b> (Operating Zyura Education)</b>
          {"\n"}Last Updated: 28/04/2026
        </p>

        <div className="mt-6 space-y-4 font-sora text-[16px] text-[#6b7280]">
          <p>
            These Terms and Conditions (“Terms”) govern your access to and use
            of the <b>Zyura Education platform</b>, including its website, mobile
            applications, AI tools, and related services (collectively, the
            “Platform”).
          </p>
          <p>
            Zyura Education is owned and operated by MEDIMIND MANAGING
            EMARKETPLACES W.L.L (“we,” “our,” “us”).
          </p>
          <p>
            By accessing or using the Platform, you agree to be legally bound by
            these Terms. If you do not agree, you must discontinue use
            immediately.
          </p>
        </div>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            1. Eligibility
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            By using Zyura Education, you confirm that:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {eligibilityList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            We reserve the right to restrict access if eligibility requirements
            are not met.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            2. Services Provided
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education offers educational tools and resources including:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {servicesList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            All services are intended solely for educational support and exam
            preparation. They are not a substitute for professional training,
            certification, licensure, or clinical supervision.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L reserves the right to modify,
            update, suspend, or discontinue any part of the Platform at its
            discretion.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            3. Account Registration
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            To access certain features, you may be required to create an
            account.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">You agree to:</p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {registrationList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            We may suspend or terminate accounts that violate these Terms or
            engage in fraudulent or abusive conduct.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            4. Intellectual Property Rights
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            All content available on Zyura Education — including but not limited
            to:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {ipList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            is the property of MEDIMIND MANAGING EMARKETPLACES W.L.L or its
            licensors and is protected by intellectual property laws.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            You are granted a limited, non-exclusive, non-transferable license
            to use content strictly for personal, non-commercial educational
            purposes.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">You may not:</p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {ipRestrictions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            5. AI-Generated and User-Generated Content
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education includes AI-powered features that generate
            educational materials.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            You acknowledge that:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {aiAcknowledgement.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            If you upload or generate user content, you:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {userGeneratedList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L is not responsible for
            inaccuracies in AI-generated or user-submitted content.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            6. Medical and Professional Disclaimer
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            All content provided on Zyura Education is for educational purposes
            only.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            The Platform does not provide medical advice, diagnosis, or
            treatment recommendations.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Use of the Platform does not create a doctor–patient,
            professional–client, or advisory relationship.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Users must independently verify information before applying it in
            academic, research, or clinical settings.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            7. Subscription, Billing & Payments
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Certain features require a paid subscription.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            By subscribing, you agree to:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {subscriptionList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            All payments are processed through authorized third-party payment
            providers.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Detailed refund conditions are outlined in the Refund &
            Cancellation Policy.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            8. Privacy and Data Protection
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Your use of Zyura Education is also governed by our Privacy Policy
            and Cookie Policy.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L processes personal data in
            accordance with applicable data protection laws and internal
            compliance standards.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            9. Prohibited Conduct
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            You agree not to:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {prohibitedList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Violation may result in immediate account suspension or termination.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            10. Limitation of Liability
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            To the fullest extent permitted by law:
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L and its affiliates shall not
            be liable for any direct, indirect, incidental, consequential, or
            special damages arising from:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {liabilityList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Use of the Platform is at your own risk.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            11. Indemnification
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            You agree to indemnify and hold harmless MEDIMIND MANAGING
            EMARKETPLACES W.L.L, its directors, officers, employees, and
            partners from any claims, damages, liabilities, or expenses arising
            from:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {indemnificationList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            12. Termination
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            We reserve the right to suspend or terminate your access without
            notice if you:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {terminationList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Upon termination, your right to use the Platform ceases immediately.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            13. Modifications to Terms
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L may update these Terms at any
            time.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Revised versions will be posted on the Platform with an updated
            “Last Updated” date.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Continued use of Zyura Education after updates constitutes
            acceptance of the revised Terms.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            14. Governing Law
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            These Terms shall be governed by and interpreted in accordance with
            the applicable laws governing Medimind E-Marketing’s registered
            jurisdiction, without regard to conflict of law principles.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            15. Contact Information
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            For questions regarding these Terms:
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

