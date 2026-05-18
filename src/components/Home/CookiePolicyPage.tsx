const cookiesHelpList = [
  "Recognize your device",
  "Store your preferences",
  "Improve platform functionality",
  "Enhance your overall learning experience",
];

const essentialCookiesList = [
  "User account login and authentication",
  "Secure browsing and payment processing",
  "Access to premium educational materials",
  "Platform security and fraud prevention",
];

const analyticsList = [
  "Pages visited and time spent",
  "Navigation patterns",
  "Error logs and performance metrics",
  "Device type and browser information",
];

const functionalityList = [
  "Language selection",
  "Saved flashcards and notes",
  "Study progress tracking",
  "User dashboard settings",
];

const marketingList = [
  "Display relevant educational promotions",
  "Measure campaign effectiveness",
  "Limit repetitive advertisements",
];

const aiPersonalizationList = [
  "Store topic preferences",
  "Track learning progress",
  "Improve AI-based recommendations",
  "Optimize adaptive learning features",
];

const thirdPartyList = [
  "Payment gateways (e.g., Stripe, PayPal)",
  "Analytics providers",
  "Social login services (e.g., Google, Facebook)",
  "Educational API integrations",
];

const browserSettingsList = [
  "Google Chrome: Settings → Privacy & Security → Cookies and other site data",
  "Mozilla Firefox: Options → Privacy & Security → Cookies and Site Data",
  "Safari: Preferences → Privacy → Manage Website Data",
  "Microsoft Edge: Settings → Cookies and site permissions",
];

const consentList = [
  "Accept all cookies",
  "Customize your preferences",
  "Withdraw consent at any time through cookie settings",
];

const updateReasons = [
  "Changes in legal requirements",
  "Updates to cookie technologies",
  "New AI or educational services added to the Platform",
];

export const CookiePolicyPage = () => {
  return (
    <main className="min-h-screen bg-[#eef2f8] px-4 py-10 md:px-6 md:py-14" id="cookie-policy">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#dbe3f0] bg-white p-6 md:p-10">
        <h1 className="font-sora text-[22px] font-bold text-black">
          Cookie Policy
        </h1>

        <p className="mt-2 whitespace-pre-line font-sora text-[18px] text-[#6b7280]">
          MEDIMIND MANAGING EMARKETPLACES W.L.L (Operating Zyura Education)
          {"\n"}Last Updated: 28/04/2026
        </p>

        <div className="mt-6 space-y-4 font-sora text-[16px] text-[#6b7280]">
          <p>
            This Cookie Policy explains how MEDIMIND MANAGING EMARKETPLACES
            W.L.L, the registered owner and operator of the Zyura Education
            platform (“Zyura”), uses cookies and similar technologies on its
            website, mobile applications, and related services (collectively,
            the “Platform”).
          </p>
          <p>
            By accessing or using Zyura Education, you agree to the use of
            cookies in accordance with this policy. If you do not agree, you may
            manage or disable cookies through your browser settings as described
            below.
          </p>
        </div>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            1. Who We Are
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education is owned and operated by MEDIMIND MANAGING
            EMARKETPLACES W.L.L (“we,” “our,” “us”).
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            All data processing and cookie usage described in this policy is
            carried out under MEDIMIND MANAGING EMARKETPLACES W.L.L as the
            registered legal entity responsible for the Platform.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            2. What Are Cookies?
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Cookies are small text files placed on your device (computer,
            tablet, or smartphone) when you visit a website.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">They help us:</p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {cookiesHelpList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Cookies may be:
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Session Cookies – Temporary cookies deleted when you close your
            browser.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Persistent Cookies – Remain on your device for a defined period or
            until manually deleted.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            3. How We Use Cookies
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L uses cookies on Zyura
            Education for the following purposes:
          </p>

          <h3 className="font-sora text-[18px] text-[#6b7280]">
            A. Essential (Strictly Necessary) Cookies
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            These cookies are required for the core functionality of the
            Platform and cannot be disabled.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            They enable:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {essentialCookiesList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Without these cookies, Zyura Education cannot function properly.
          </p>

          <h3 className="font-sora text-[18px] text-[#6b7280]">
            B. Performance and Analytics Cookies
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            These cookies help us understand how users interact with the
            Platform so we can improve performance and usability.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            They may collect:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {analyticsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Examples include analytics tools such as Google Analytics, Firebase
            Analytics, or similar services.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Data collected is aggregated and anonymized where possible.
          </p>

          <h3 className="font-sora text-[18px] text-[#6b7280]">
            C. Functionality Cookies
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            These cookies remember user preferences to enhance personalization,
            such as:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {functionalityList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            These cookies improve your educational experience but are not
            strictly required for basic operation.
          </p>

          <h3 className="font-sora text-[18px] text-[#6b7280]">
            D. Advertising and Marketing Cookies
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education may use advertising or marketing cookies, either
            directly or through trusted third parties, to:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {marketingList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Medimind E-Marketing does not sell personal data to advertisers.
          </p>

          <h3 className="font-sora text-[18px] text-[#6b7280]">
            E. AI Personalization Cookies
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Because Zyura Education integrates AI-powered learning tools,
            certain cookies may:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {aiPersonalizationList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            This data is used strictly for educational optimization and platform
            improvement.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            4. Third-Party Cookies
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Some cookies may be set by third-party providers integrated into
            Zyura Education, including:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {thirdPartyList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            These third parties operate under their own privacy and cookie
            policies. We encourage users to review those policies directly.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            5. Managing or Disabling Cookies
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            You may control or delete cookies through your browser settings:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {browserSettingsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Please note that disabling certain cookies may limit access to
            features such as login, payments, AI personalization, or saved study
            content.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            6. Consent
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            When you first visit Zyura Education, a cookie banner will request
            your consent for non-essential cookies.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">You may:</p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {consentList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Your consent applies to Zyura Education and its subdomains operated
            by MEDIMIND MANAGING EMARKETPLACES W.L.L.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            7. Updates to This Policy
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            MEDIMIND MANAGING EMARKETPLACES W.L.L may update this Cookie Policy
            to reflect:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {updateReasons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            The revised version will be published on this page with an updated
            “Last Updated” date.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            8. Contact Information
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            If you have questions about this Cookie Policy or how cookies are
            used on Zyura Education, please contact:
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

