// src/routes/AuthRoutes.tsx
import ForgotPassword from "@/pages/authPage/ForgotPassword";
import Login from "@/pages/authPage/Login";
import MultiStepRegisterForm from "@/pages/authPage/MultiStepRegisterForm";
import ResetPassword from "@/pages/authPage/ResetPassword";
import SetPassword from "@/pages/authPage/SetPassword";
import Signup from "@/pages/authPage/Signup";
import EmailVerificationPending from "@/pages/authPage/EmailVerificationPending";
import VerifyEmail from "@/pages/authPage/VerifyEmail";
import { CookiePolicyPage } from "@/components/Home/CookiePolicyPage";
import { TermsConditionsPage } from "@/components/Home/TermsConditionsPage";
import { RefundPolicyPage } from "@/components/Home/RefundPolicyPage";
import { CopyrightPolicyPage } from "@/components/Home/CopyrightPolicyPage";
import { DisclaimerPolicyPage } from "@/components/Home/DisclaimerPolicyPage";
// import VerificationOTP from "@/pages/authPage/VerificationOTP";

const authRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verify-email-pending",
    element: <EmailVerificationPending />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  // {
  //   path: "/verification-otp",
  //   element: <VerificationOTP />,
  // },
  {
    path: "/set-password",
    element: <SetPassword />,
  },
  {
    path: "/multi-step-register",
    element: <MultiStepRegisterForm />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/cookie-policy",
    element: <CookiePolicyPage />,
  },
  {
    path: "/terms-and-conditions",
    element: <TermsConditionsPage />,
  },
  {
    path: "/refund-policy",
    element: <RefundPolicyPage />,
  },
  {
    path: "/copyright-policy",
    element: <CopyrightPolicyPage />,
  },
  {
    path: "/disclaimer-policy",
    element: <DisclaimerPolicyPage />,
  },
];

export default authRoutes;
