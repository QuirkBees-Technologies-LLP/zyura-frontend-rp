import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyEmailMutation } from "@/store/features/auth/auth.api";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const [verifyEmail, { isLoading, isSuccess, isError, error }] = useVerifyEmailMutation();

  useEffect(() => {
    if (!token) return;
    verifyEmail({ token });
  }, [token, verifyEmail]);

  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(() => navigate("/login", { replace: true }), 1200);
      return () => clearTimeout(t);
    }
  }, [isSuccess, navigate]);

  const errMsg = (error as any)?.data?.message || "Verification failed";

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6 bg-white">
        <h2 className="text-xl font-semibold text-[#09090B]">Email verification</h2>

        {!token && <p className="text-sm text-red-600 mt-3">Missing token in verification link.</p>}
        {isLoading && <p className="text-sm text-[#71717A] mt-3">Verifying…</p>}
        {isSuccess && <p className="text-sm text-green-700 mt-3">Verified! Redirecting to login…</p>}
        {isError && <p className="text-sm text-red-600 mt-3">{errMsg}</p>}
      </div>
    </div>
  );
}

