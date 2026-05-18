import { Link } from "react-router-dom";
import ZyuraLogo from "../../assets/home/footer-logo.svg";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#d5e0ef]" data-aos="fade-up">
      <div className="mx-auto container px-5 pb-12 pt-12 md:px-10 lg:px-12">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-8" data-aos="fade-up">
            <div className="text-center md:text-left">
              <img src={ZyuraLogo} alt="Zyura logo" className="mx-auto h-20 w-auto object-contain lg:mx-0" />
              <p className="mt-4 max-w-xl text-center text-[14px] leading-relaxed text-[#4a5565] md:text-left">
                Zyura provides smart, AI-powered learning tools designed for
                medical students. We help you build effective study habits,
                simplify complex topics, and achieve long-term academic
                success.
              </p>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-sora text-[18px] font-semibold text-dark md:text-[20px]">
                Contact Info:
              </h3>
              <div className="mt-3 space-y-1 text-[14px] text-[#4a5565]">
                <p>Email: support@zyura-e.com</p>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-sora text-[18px] font-semibold text-dark md:text-[20px]">
                Follow us
              </h3>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61582502243778"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-brand/90 hover:bg-brand flex items-center justify-center text-white transition"
                >
                  <FaFacebookF className="text-lg" />
                </a>
                <a
                  href="https://www.instagram.com/zyrualearning/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-brand/90 hover:bg-brand flex items-center justify-center text-white transition"
                >
                  <FaInstagram className="text-lg" />
                </a>
                <a
                  href="https://www.linkedin.com/feed/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full bg-brand/90 hover:bg-brand flex items-center justify-center text-white transition"
                >
                  <FaLinkedinIn className="text-lg" />
                </a>
                <a
                  href="https://x.com/ZyuraE66010"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="X (Twitter)"
                  className="w-10 h-10 rounded-full bg-brand/90 hover:bg-brand flex items-center justify-center text-white transition"
                >
                  <FaXTwitter className="text-lg" />
                </a>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left" data-aos="fade-up" data-aos-delay="170">
            <h3 className="font-sora text-[18px] font-semibold text-dark md:text-[20px]">
              Newsletter
            </h3>
            <p className="mt-4 text-[16px] text-[#4a5565]">Subscribe to our newsletter</p>

            <form className="mt-4 flex flex-row flex-wrap md:flex-nowrap justify-center gap-3">
              <input
                type="email"
                placeholder="Enter your email here..."
                className="h-14 flex-1 rounded-2xl border border-white bg-white p-4 text-[14px] text-[#3f4855] outline-none placeholder:text-[#8b95a3]"
              />
              <button
                type="submit"
                className="h-14 rounded-2xl bg-brand px-7 font-sora text-[16px] font-light text-white transition hover:bg-[#0a4f9f]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-brand py-4 text-center">
        <div className="mx-auto flex container flex-col lg:flex-row items-center justify-center gap-2 px-6 md:justify-between md:px-10 lg:px-12">
          <p className="font-sora text-[14px] text-white md:text-[14px]">
            © {currentYear} MEDIMIND MANAGING EMARKETPLACES W.L.L | All Rights Reserved
          </p>
          <div className="flex items-center flex-wrap gap-4 justify-center">
            <Link onClick={() => window.scrollTo(0, 0)} to="/cookie-policy" className="font-sora text-[14px] text-white/95 hover:text-white">
              Cookie Policy
            </Link>
            <span className="text-white/70">|</span>
            <Link onClick={() => window.scrollTo(0, 0)} to="/terms-and-conditions" className="font-sora text-[14px] text-white/95 hover:text-white">
              Terms & Conditions
            </Link>
            <span className="text-white/70">|</span>
            <Link onClick={() => window.scrollTo(0, 0)} to="/refund-policy" className="font-sora text-[14px] text-white/95 hover:text-white">
              Refund Policy
            </Link>
            <span className="text-white/70">|</span>
            <Link onClick={() => window.scrollTo(0, 0)} to="/copyright-policy" className="font-sora text-[14px] text-white/95 hover:text-white">
              Copyright Policy
            </Link>
            <span className="text-white/70">|</span>
            <Link onClick={() => window.scrollTo(0, 0)} to="/disclaimer-policy" className="font-sora text-[14px] text-white/95 hover:text-white">
              Disclaimer Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
