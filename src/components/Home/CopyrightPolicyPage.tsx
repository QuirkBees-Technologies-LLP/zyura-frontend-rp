const ownershipContentList = [
  "MCQs, flashcards, and clinical cases",
  "Study notes, videos, graphics, illustrations, and diagrams",
  "AI-generated content and smart study plans",
  "Website design, layout, databases, source code, and software",
  "Logos, branding, and trademarks",
];

const userGeneratedList = [
  "Retain ownership of your original material.",
  "Grant MEDIMIND MANAGING EMARKETPLACES W.L.L a non-exclusive, worldwide, royalty-free license to use, host, display, reproduce, adapt, and modify such content for educational, operational, and platform-improvement purposes.",
  "Represent and warrant that your content does not infringe upon any third-party intellectual property rights.",
];

const aiGeneratedList = [
  "MCQs and flashcards",
  "Educational summaries",
  "Study plans and quizzes",
  "Clinical simulations and learning aids",
];

const aiRightsList = [
  "Quality assurance",
  "Research and development",
  "Platform optimization",
  "Educational database improvement",
];

const infringementNoticeList = [
  "Your full legal name and contact details",
  "A description of the copyrighted work",
  "The exact URL or location of the alleged infringement",
  "A good-faith statement that the use is unauthorized",
  "A declaration that the information provided is accurate",
];

const repeatInfringementList = [
  "Suspend or permanently terminate accounts of repeat offenders",
  "Restrict access to content creation tools",
  "Pursue legal remedies where necessary",
];

const thirdPartyMaterialsList = [
  "Fair use principles",
  "Creative Commons licenses",
  "Open educational resources",
  "Proper commercial licenses",
];

const licensingRequestsList = [
  "Institutional or university licensing",
  "CME or commercial educational partnerships",
  "Research citations or content reproduction",
  "Strategic collaboration",
];

const policyUpdatesList = [
  "Changes in applicable laws",
  "Updates in AI technologies",
  "Platform or business structure modifications",
];

export const CopyrightPolicyPage = () => {
  return (
    <main className="min-h-screen bg-[#eef2f8] px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#dbe3f0] bg-white p-6 md:p-10">
        <h1 className="font-sora text-[22px] font-bold text-black">
          Intellectual Property & Copyright Policy
        </h1>

        <p className="mt-2 whitespace-pre-line font-sora text-[18px] text-[#6b7280]">
          MEDIMIND MANAGING EMARKETPLACES W.L.L (Operating Zyura Education)
          {"\n"}Last Updated: 28/04/2026
        </p>

        <div className="mt-6 space-y-4 font-sora text-[16px] text-[#6b7280]">
          <p>
            This Intellectual Property & Copyright Policy explains how MEDIMIND
            MANAGING EMARKETPLACES W.L.L, the registered owner and operator of
            the Zyura Education platform (“Zyura”), manages ownership, licensing,
            and protection of intellectual property on the Platform.
          </p>
          <p>
            By accessing or using Zyura Education, you agree to comply with this
            policy.
          </p>
        </div>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            1. Ownership of Platform Content
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Unless otherwise stated, all materials available on Zyura Education
            — including but not limited to:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {ownershipContentList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            are the exclusive intellectual property of MEDIMIND MANAGING
            EMARKETPLACES W.L.L, operating under the brand name Zyura Education,
            and are protected by applicable copyright, trademark, and
            intellectual property laws.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Users are granted a limited, non-exclusive, non-transferable license
            to access and use the content strictly for personal, non-commercial
            educational purposes.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Any unauthorized reproduction, redistribution, modification, public
            display, or commercial exploitation of Zyura Education content is
            strictly prohibited.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            2. User-Generated Content
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education may allow users to upload, submit, or generate
            content, including notes, questions, comments, or AI prompts.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            By submitting content, you:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {userGeneratedList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L is not liable for
            user-submitted content that violates intellectual property laws.
            Users are solely responsible for ensuring their submissions are
            lawful.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            3. AI-Generated Content
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education integrates AI-powered tools to generate or
            customize:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {aiGeneratedList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="font-sora text-[18px] text-[#6b7280]">
            A. Ownership and Usage Rights
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            AI-generated outputs are created using automated systems. Depending
            on jurisdiction, such outputs may not qualify for copyright
            protection.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L retains the right to use
            AI-generated content produced within the Platform for:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {aiRightsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Users receive a personal, non-commercial license to use
            AI-generated materials strictly for study and learning purposes.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Resale, redistribution, republication, or commercial exploitation of
            AI-generated materials is prohibited without written authorization.
          </p>

          <h3 className="font-sora text-[18px] text-[#6b7280]">
            B. Accuracy Disclaimer
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            AI-generated content may contain inaccuracies or incomplete
            information.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education does not guarantee the correctness, completeness, or
            reliability of AI outputs. Users are responsible for independently
            verifying educational or clinical information before relying on it
            in professional settings.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            4. Trademarks and Branding
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            “Zyura,” “Zyura Education,” associated logos, brand elements, and
            design assets are trademarks or trade dress owned by MEDIMIND
            MANAGING EMARKETPLACES W.L.L
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Unauthorized use of these trademarks for advertising, endorsements,
            domain registration, or commercial purposes is strictly prohibited
            without prior written consent.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            5. Copyright Infringement Reporting (DMCA or Equivalent Notice)
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            If you believe that copyrighted material has been infringed on Zyura
            Education, you may submit a formal notice including:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {infringementNoticeList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Notices should be sent to:
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            📧 copyright@zyura-e.com
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Upon receiving a valid claim, MEDIMIND MANAGING EMARKETPLACES W.L.L
            will investigate and may remove or restrict access to the allegedly
            infringing content where appropriate.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            6. Repeat Infringement Policy
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L maintains a strict policy
            against repeat copyright infringement.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            We reserve the right to:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {repeatInfringementList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            7. Third-Party Materials
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education may incorporate materials used under:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {thirdPartyMaterialsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Where applicable, appropriate credit is provided. If you believe any
            material has been used improperly, please contact us promptly.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            8. Licensing and Institutional Use
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            For requests related to:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {licensingRequestsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            All licensing agreements must be confirmed in writing by Zyura
            Education.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            9. Policy Updates
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education reserves the right to revise this Intellectual
            Property & Copyright Policy to reflect:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {policyUpdatesList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Updated versions will be published on the Zyura Education website
            with a revised “Last Updated” date.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Continued use of the Platform constitutes acceptance of the revised
            policy.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            10. Contact Information
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            For all intellectual property, copyright, or licensing inquiries:
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

