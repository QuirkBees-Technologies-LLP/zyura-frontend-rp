import { Link, useLocation } from "react-router-dom";
import { useResendVerificationEmailMutation } from "@/store/features/auth/auth.api";
import { toast } from "sonner";

export default function EmailVerificationPending() {
  const location = useLocation();
  const email = (location.state as any)?.email as string | undefined;
  const [resend, { isLoading }] = useResendVerificationEmailMutation();

  const handleResend = async () => {
    if (!email) return;
    try {
      await resend({ email }).unwrap();
      toast.success(`Verification link resent to ${email}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend verification email");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex md:w-1/2 relative items-center justify-center">
        <video
          className="h-full w-full object-cover"
          src="/videos/auth-illustration.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute top-6 left-6">
          <Link to="/">
            <img src="/logo.svg" alt="Logo" className="w-40 h-16 lg:h-20 " />
          </Link>
        </div>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-[450px] border border-[#E2E8F0] p-8 rounded-[8px]">
          <h2 className="text-2xl font-semibold text-[#09090B]">
            Verify your email
          </h2>
          <p className="text-sm font-normal text-[#64748B] leading-5 mb-6 mt-2">
            We’ve sent a verification link to{" "}
            <b>{email || "your email address"}</b>. Once approved, you’ll be able
            to log in.
          </p>

          <div className="text-sm text-[#64748B] space-y-2">
            <p>
              - Check your inbox and spam/junk folder.
            </p>
            <p>
              - After clicking the link, come back and{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                log in
              </Link>
              .
            </p>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleResend}
              disabled={!email || isLoading}
              className="w-full inline-flex items-center justify-center border border-[#D2D6DB] text-sm font-medium text-[#3F3F46] p-3 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Resend verification email"}
            </button>

            <div className="h-3" />
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center bg-blue-main text-sm font-medium text-white p-3 rounded-md hover:bg-blue-600"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

