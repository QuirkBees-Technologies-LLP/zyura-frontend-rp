import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  Mail,
  Phone,
  Search,
  Send,
} from "lucide-react";

const roleOptions = [
  "Medical Student",
  "Resident Doctor",
  "Practicing Clinician",
  "Educator",
  "Institution Admin",
  "Other",
];

export const ContactUsSection = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "AI Study Planning",
    "Clinical Case Training",
  ]);

  const [message, setMessage] = useState("");

  const remainingChars = useMemo(() => 300 - message.length, [message.length]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:1800/api/contact/send-inquiry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            phone,
            role,
            message,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert("Inquiry submitted successfully!");

        setFullName("");
        setEmail("");
        setPhone("");
        setRole("");
        setMessage("");
      } else {
        alert("Failed to submit inquiry");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <section id="contact-us" className="pt-25 lg:pt-36">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.45fr] lg:gap-14">
        <div>
          <span className="inline-flex rounded-full bg-brand/10 px-4 py-1.5 font-sora text-sm font-medium text-brand">
            Contact Us
          </span>
          <h2 className="mt-6 font-sora text-4xl font-semibold leading-tight text-[#101827] md:text-5xl">
            Let&apos;s Get In
            <br />
            Touch.
          </h2>
          <p className="mt-6 max-w-md font-sora text-base leading-8 text-[#4b5563] md:text-xl md:leading-9">
            Need help choosing the right Zyura plan, exploring team access, or
            understanding features? Our team is here to support your learning
            goals.
          </p>
          <p className="mt-10 font-sora text-lg leading-8 text-[#374151]">
            Or just reach out manually to
            <br />
            <a
              href="mailto:support@zyura-e.com"
              className="font-medium text-brand hover:underline"
            >
              support@zyura-e.com
            </a>
            .
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#ebeaf5] bg-white p-5 shadow-[0_10px_40px_rgba(16,24,39,0.05)] md:p-7"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="font-sora text-sm font-semibold text-[#101827]">
                Full Name
              </span>
              <div className="flex h-12 items-center rounded-2xl border border-[#d1d5db] bg-white px-3">
                <Search className="mr-2 h-4 w-4 text-[#64748b]" />
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  placeholder="Enter your full name..."
                  className="h-full w-full border-none bg-transparent font-sora text-sm text-[#111827] placeholder:text-[#94a3b8] focus:outline-none"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="font-sora text-sm font-semibold text-[#101827]">
                Email Address
              </span>
              <div className="flex h-12 items-center rounded-2xl border border-[#d1d5db] bg-white px-3">
                <Mail className="mr-2 h-4 w-4 text-[#64748b]" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email address..."
                  className="h-full w-full border-none bg-transparent font-sora text-sm text-[#111827] placeholder:text-[#94a3b8] focus:outline-none"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="font-sora text-sm font-semibold text-[#101827]">
                Phone Number
              </span>
              <div className="flex h-12 items-center rounded-2xl border border-[#d1d5db] bg-white px-3">
                <Phone className="mr-2 h-4 w-4 text-[#64748b]" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="Enter your phone number..."
                  className="h-full w-full border-none bg-transparent font-sora text-sm text-[#111827] placeholder:text-[#94a3b8] focus:outline-none"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="font-sora text-sm font-semibold text-[#101827]">
                Role
              </span>
              <div className="relative flex h-12 items-center rounded-2xl border border-[#d1d5db] bg-white px-3">
                <BriefcaseBusiness className="mr-2 h-4 w-4 text-[#64748b]" />
                <select className="h-full w-full appearance-none border-none bg-transparent p-2 font-sora text-sm text-[#111827] focus:outline-none">
                  <option value="">Select your role...</option>
                  {roleOptions.map((role) => (
                    <option className="hover:bg-brand" key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#94a3b8]" />
              </div>
            </label>
          </div>

          <div className="mt-6">
            <label className="space-y-2">
              <span className="font-sora text-sm font-semibold text-[#101827]">
                Message
              </span>
              <div className="rounded-2xl border border-[#d1d5db] bg-white p-3">
                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value.slice(0, 300))
                  }
                  rows={5}
                  placeholder="Tell us what you need support with..."
                  className="w-full resize-none border-none bg-transparent font-sora text-sm text-[#111827] placeholder:text-[#94a3b8] focus:outline-none"
                />
                <p className="mt-2 text-xs text-[#9ca3af]">
                  {remainingChars}/300
                </p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 cursor-pointer flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-gradient hover:bg-brand-gradient-hover font-sora text-base font-medium text-white transition hover:opacity-95"
          >
            Submit Form
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
};
