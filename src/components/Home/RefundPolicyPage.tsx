const subscriptionFeatures = [
  "AI-powered study tools and smart planners",
  "Downloadable notes and premium academic resources",
  "Advanced personalization features",
  "Group, institutional, or specialized learning modules",
];

const paidCancellationWays = [
  "Accessing their account dashboard, or",
  "Contacting: support@zyura-e.com",
];

const cancellationEffects = [
  "Stops automatic renewal for the next billing cycle.",
  "Does not generate a refund for the current active billing period.",
  "Allows continued access to premium features until the subscription term expires.",
];

const eligibleRefundCircumstances = [
  "Duplicate billing for the same subscription period.",
  "Unauthorized transaction, reported within 3 days of the charge.",
  "Verified technical failure preventing access to paid content, where:",
];

const technicalFailureSubpoints = [
  "The issue is reported promptly, and",
  "Our technical team cannot resolve it within 7 business days.",
];

const nonRefundableSituations = [
  "Change of mind after purchase.",
  "Failure to use the subscription.",
  "Dissatisfaction with AI-generated results (outputs depend on user input and interaction).",
  "Partial usage of subscription period.",
  "Failure to cancel before automatic renewal.",
  "Account suspension due to violation of Terms & Conditions.",
  "Promotional, discounted, or special campaign purchases unless otherwise stated.",
];

const refundRequestIncludes = [
  "Full legal name",
  "Registered email address",
  "Transaction ID or invoice number",
  "Clear explanation of the issue",
];

const platformModificationRights = [
  "Modify, improve, update, or discontinue specific features, modules, or AI tools.",
  "Adjust content structure as part of ongoing platform development.",
];

const chargebackConsequences = [
  "Immediate account suspension",
  "Termination of access",
  "Legal recovery of associated processing and administrative fees",
];

const policyUpdatesReflect = [
  "Legal updates",
  "Payment provider changes",
  "Business model adjustments",
];

export const RefundPolicyPage = () => {
  return (
    <main className="min-h-screen bg-[#eef2f8] px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#dbe3f0] bg-white p-6 md:p-10">
        <h1 className="font-sora text-[22px] font-bold text-black">
          Refund & Cancellation Policy
        </h1>

        <p className="mt-2 whitespace-pre-line font-sora text-[18px] text-[#6b7280]">
          MEDIMIND MANAGING EMARKETPLACES W.L.L (Operating Zyura Education)
          {"\n"}Last Updated: 28/04/2026
        </p>

        <div className="mt-6 space-y-4 font-sora text-[16px] text-[#6b7280]">
          <p>
            This Refund & Cancellation Policy explains the terms under which
            refunds, cancellations, and subscription changes are handled for the
            Zyura Education platform, owned and operated by MEDIMIND MANAGING
            EMARKETPLACES W.L.L (“we,” “our,” “us”).
          </p>
          <p>
            By purchasing, subscribing to, or using paid services on Zyura
            Education, you agree to this policy.
          </p>
        </div>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            1. Subscription & Payment Policy
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education operates primarily on a subscription-based model
            providing access to premium features, including but not limited to:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {subscriptionFeatures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            All payments are processed securely via authorized third-party
            payment gateways (e.g., AFS – Arab Financial Services or other
            approved processors).
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education does not store full payment card details.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Users are responsible for ensuring that their billing information is
            accurate and up to date.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            2. Cancellation Policy
          </h2>
          <h3 className="font-sora text-[18px] text-[#6b7280]">
            A. Free Accounts
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Users with free accounts may deactivate or delete their accounts at
            any time through their profile settings.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            No charges apply to free account cancellation.
          </p>

          <h3 className="mt-3 font-sora text-[18px] text-[#6b7280]">
            B. Paid Subscriptions
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Subscribers may cancel their subscription at any time by:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {paidCancellationWays.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">Cancellation:</p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {cancellationEffects.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Medimind E-Marketing does not provide partial, prorated, or
            mid-cycle refunds unless explicitly stated otherwise.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            3. Refund Policy
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Because Zyura Education provides digital, AI-based, and instantly
            accessible educational services, refunds are limited and subject to
            strict eligibility conditions.
          </p>

          <h3 className="font-sora text-[18px] text-[#6b7280]">
            A. Eligible Refund Circumstances
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Refunds may be approved only in the following cases:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {eligibleRefundCircumstances.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className="list-disc space-y-2 pl-12 font-sora text-[16px] text-[#6b7280]">
            {technicalFailureSubpoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            All refund approvals are at the sole discretion of Medimind
            E-Marketing after review.
          </p>

          <h3 className="font-sora text-[18px] text-[#6b7280]">
            B. Non-Refundable Situations
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Refunds will not be granted in the following cases:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {nonRefundableSituations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="font-sora text-[18px] text-[#6b7280]">
            C. Refund Request Procedure
          </h3>
          <p className="font-sora text-[16px] text-[#6b7280]">
            To request a refund, you must email:
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            📧 support@zyura-e.com
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">Include:</p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {refundRequestIncludes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Refund requests must be submitted within 7 days of the transaction
            date unless exceptional circumstances apply.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Our billing team will review the request within 7–10 business days.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            If approved, refunds will be processed to the original payment
            method. Processing times may vary (typically 10–15 business days
            depending on the payment provider or bank).
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            4. Trials & Promotional Access
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Free trials, promotional access, or discounted subscriptions:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            <li>
              Must be cancelled before the trial or promotional period ends to
              avoid automatic billing.
            </li>
            <li>
              Are generally non-refundable once converted into paid
              subscriptions.
            </li>
            <li>
              Special campaign terms may override standard refund terms if
              explicitly stated.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            5. Platform Modifications
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education reserves the right to:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {platformModificationRights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Such updates or improvements do not constitute grounds for refunds
            unless paid access is permanently removed without reasonable
            replacement.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            6. Chargebacks & Payment Disputes
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Users are required to contact Zyura Education support before
            initiating a chargeback with their bank or payment provider.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Unjustified chargebacks or fraudulent disputes may result in:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {chargebackConsequences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            7. Policy Updates
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Zyura Education may revise this Refund & Cancellation Policy
            periodically to reflect:
          </p>
          <ul className="list-disc space-y-2 pl-6 font-sora text-[16px] text-[#6b7280]">
            {policyUpdatesReflect.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="font-sora text-[16px] text-[#6b7280]">
            The latest version will always be published on the Zyura Education
            website.
          </p>
          <p className="font-sora text-[16px] text-[#6b7280]">
            Continued use of the Platform after updates constitutes acceptance
            of the revised terms.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="font-sora text-[22px] font-bold text-black">
            8. Contact Information
          </h2>
          <p className="font-sora text-[16px] text-[#6b7280]">
            For billing, cancellation, or refund inquiries:
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

