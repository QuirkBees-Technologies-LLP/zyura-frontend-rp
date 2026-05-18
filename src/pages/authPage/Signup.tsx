import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
// Left-side illustration uses a public video asset.
// import logo from "../../assets/signUp/logo.png";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useRegisterUserMutation,
  useSignInWithGoogleMutation,
  useLazyGetMeQuery,
  useGetAllProfileTypesCombinedQuery,
  useLazyCheckEmailQuery,
} from "@/store/features/auth/auth.api";
import { toast } from "sonner";
import {
  auth,
  firebaseEnabled,
  googleProvider,
} from "@/config/firebase.config";
import { signInWithPopup } from "firebase/auth";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/store/hook";
import { setUser } from "@/store/features/auth/auth.slice";
import { countryDialCodes } from "@/lib/phone/countryDialCodes";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import CountryDialCodeSelect from "@/components/phone/CountryDialCodeSelect";

// const plans = [
//   {
//     id: 1,
//     name: "Free Plan",
//     price: "Free",
//     recommended: false,
//   },
//   {
//     id: 2,
//     name: "Standard Plan",
//     price: "$19/mo",
//     recommended: true,
//   },
//   {
//     id: 3,
//     name: "Premium Plan",
//     price: "$49/mo",
//     recommended: false,
//   },
//   {
//     id: 4,
//     name: "Elite Plan",
//     price: "Custom",
//     recommended: false,
//   },
// ];

const signupSchema = z
  .object({
    firstName: z.string().nonempty("First name is required"), // ✅ kept
    lastName: z.string().nonempty("Last name is required"), // ✅ kept
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email format"),
    countryCode: z.string().nonempty("Country code is required"),
    mobileNumber: z
      .string()
      .nonempty("Mobile number is required")
      .regex(/^\d+$/, "Mobile number must contain digits only"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .nonempty("Confirm password is required")
      .min(6, "Password must be at least 6 characters"),
    profileTypeId: z.string().nonempty("Profile type is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .superRefine((data, ctx) => {
    const e164 = `${data.countryCode}${data.mobileNumber}`;
    const parsed = parsePhoneNumberFromString(e164);
    if (!parsed || !parsed.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mobileNumber"],
        message: "Invalid mobile number for selected country code",
      });
    }
  });

type SignupFormInputs = z.infer<typeof signupSchema>;

type SelectedPlan = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  period: string;
};

const Signup = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [signInWithGoogle, { isLoading: isSocialLoading }] =
    useSignInWithGoogleMutation();
  const [getMeTrigger] = useLazyGetMeQuery();
  const { data: profileTypesData, isLoading: isProfileTypesLoading } =
    useGetAllProfileTypesCombinedQuery(undefined);
  const [triggerCheckEmail, { isFetching: isCheckingEmail }] =
    useLazyCheckEmailQuery();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckedValue, setEmailCheckedValue] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      countryCode: countryDialCodes[0]?.dialCode ?? "+91",
    } as any,
  });

  const location = useLocation();
  const navigate = useNavigate();

  const locationState =
    (location.state as { selectedPlan?: SelectedPlan } | null)?.selectedPlan ??
    null;

  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(() => {
    if (locationState) return locationState;
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("selectedPlan");
      return stored ? (JSON.parse(stored) as SelectedPlan) : null;
    }
    return null;
  });

  useEffect(() => {
    if (locationState) {
      setSelectedPlan(locationState);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "selectedPlan",
          JSON.stringify(locationState),
        );
      }
    }
  }, [locationState]);

  useEffect(() => {
    if (!selectedPlan) {
      toast.error("Please select a plan from /pricing before signing up");
    }
  }, [selectedPlan]);

  const emailValue = watch("email");

  const debouncedEmail = useMemo(() => emailValue?.trim() || "", [emailValue]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      const v = debouncedEmail;
      if (!v || !/^\S+@\S+\.\S+$/.test(v)) {
        setEmailExists(false);
        setEmailCheckedValue(null);
        return;
      }
      setEmailCheckedValue(v);
      try {
        const res: any = await triggerCheckEmail(v, true).unwrap();
        if (!active) return;
        setEmailExists(Boolean(res?.data?.exists));
      } catch {
        if (!active) return;
        setEmailExists(false);
      }
    };
    const t = setTimeout(run, 450);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [debouncedEmail, triggerCheckEmail]);

  const handleAuthSuccess = async (accessToken: string) => {
    Cookies.set("accessToken", accessToken);
    const meData = await getMeTrigger(undefined, false).unwrap();
    const user = meData?.data;
    const role = user?.account?.role;

    dispatch(
      setUser({
        accessToken,
        user,
      }),
    );

    const roleRoutes: Record<string, string> = {
      ADMIN: "/admin",
      MENTOR: "/mentor",
      STUDENT: "/dashboard",
      PROFESSIONAL: "/dashboard",
    };

    navigate(roleRoutes[role] || "/", { replace: true });
  };

  // Email signup
  const onSubmit = async (data: SignupFormInputs) => {
    try {
      if (emailExists) {
        toast.error("Email is already registered");
        return;
      }
      const phone = `${data.countryCode}${data.mobileNumber}`;
      if (!selectedPlan) {
        toast.error("Please select a plan from /pricing before signing up");
        return;
      }

      const result = await registerUser({
        firstName: data.firstName, // ✅ added
        lastName: data.lastName, // ✅ added
        email: data.email,
        password: data.password,
        phone,
        profileTypeId: data.profileTypeId,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        planAmount: selectedPlan.amount,
        planCurrency: selectedPlan.currency,
        planPeriod: selectedPlan.period,
      }).unwrap();

      if (result.success) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("selectedPlan");
        }
        toast.success("Account created. Please verify your email.");
        navigate("/verify-email-pending", { state: { email: data.email } });
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error("Error: ", err);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      if (!selectedPlan) {
        toast.error("Please select a plan from /pricing before signing up");
        return;
      }
      if (!firebaseEnabled || !auth || !googleProvider) {
        toast.error("Google signup is temporarily unavailable");
        return;
      }
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await signInWithGoogle({
        email: user.email || "",
        name: user.displayName || "",
        photo: user.photoURL || "",
      }).unwrap();

      if (res?.success) {
        await handleAuthSuccess(res.data.accessToken);
        toast.success("Signed up successfully with Google");
      }
    } catch (err: any) {
      console.error("Google signup error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error(err?.data?.message || "Google signup failed");
      }
    }
  };

  return (
    <div className="flex h-screen items-start">
      {/* Left Side */}
      <div className="hidden h-screen md:flex md:w-1/2 relative items-center justify-center">
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
            {/* <img src={logo} alt="Logo" /> */}
          </Link>
        </div>
        <div className="absolute bottom-6 left-6 bg-white/80 p-4 rounded-lg text-sm max-w-sm">
          <p className="italic text-gray-700">
            "This library has saved me countless hours of work and helped me
            deliver stunning designs to my clients faster than ever before."
          </p>
          <p className="mt-2 font-semibold text-gray-900">Sofia Davis</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 h-screen overflow-y-auto pt-30">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-[#09090B]">
            Create an account
          </h2>
          <p className="text-sm font-normal text-[#71717A] leading-5 mb-6 mt-2">
            Enter your details below to create your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {selectedPlan && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Selected plan
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedPlan.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedPlan.currency}
                      {selectedPlan.amount}
                      {selectedPlan.period}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* ✅ First Name + Last Name — added side by side */}
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="First name"
                  {...register("firstName")}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Last name"
                  {...register("lastName")}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              {isCheckingEmail &&
                emailCheckedValue === (emailValue?.trim() || "") && (
                  <p className="text-xs text-[#71717A] mt-1">Checking email…</p>
                )}
              {!errors.email && emailExists && (
                <p className="text-red-500 text-sm mt-1">
                  Email is already registered
                </p>
              )}
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Profile Type */}
            <div>
              <select
                {...register("profileTypeId")}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                disabled={isProfileTypesLoading}
              >
                <option value="">Select your profile type</option>
                {profileTypesData?.data?.map((type: any) => (
                  <option key={type._id} value={type._id}>
                    {type.typeName} {type.category ? `(${type.category})` : ""}
                  </option>
                ))}
              </select>
              {errors.profileTypeId && (
                <p className="text-red-500 text-sm">
                  {errors.profileTypeId.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex gap-2">
              <div className="w-36">
                <CountryDialCodeSelect
                  valueDialCode={watch("countryCode")}
                  onChange={(v) =>
                    setValue("countryCode", v.dialCode, {
                      shouldValidate: true,
                    })
                  }
                />
                {errors.countryCode && (
                  <p className="text-red-500 text-sm">
                    {errors.countryCode.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Mobile number"
                  {...register("mobileNumber")}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                {...register("password")}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-3 right-2 cursor-pointer text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                {...register("confirmPassword")}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-3 right-2 cursor-pointer text-gray-600 hover:text-gray-800"
              >
                {showConfirmPassword ? <Eye /> : <EyeOff />}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
              {plans.map((plan) => (
                <label key={plan.id} className="relative cursor-pointer">
                  <input type="radio" name="plan" className="peer hidden" />

                  <div
                    className="
              border-2 border-gray-200 rounded-2xl p-3
              bg-white transition-all duration-300
              hover:border-gray-500 hover:shadow-md
              peer-checked:border-brand
              peer-checked:ring-2 peer-checked:ring-blue-100
            "
                  >
                    {/* Recommended Badge */}
            {/* {plan.recommended && (
                      <span
                        className="
                  absolute -top-2 left-4
                  bg-brand text-white
                  text-[10px] px-2 py-1 rounded-full
                  font-medium
                "
                      >
                        Most Recommended
                      </span>
                    )}

                    <div className="flex items-center justify-between"> */}
            {/* Plan Info */}
            {/* <div>
                        <h3 className="text-base font-semibold text-gray-800">
                          {plan.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {plan.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>  */}

            {/* Sign up button */}
            <button
              type="submit"
              className="w-full bg-blue-main text-sm font-medium text-[#FAFAFA] p-3 rounded-md hover:bg-blue-600 cursor-pointer disabled:opacity-50"
              disabled={
                isSubmitting ||
                isLoading ||
                isSocialLoading ||
                isCheckingEmail ||
                emailExists ||
                !selectedPlan
              }
            >
              {isSubmitting || isLoading || isSocialLoading
                ? "Loading..."
                : "Sign up with Email"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-xs text-[#71717A] font-normal">
              OR CONTINUE WITH
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleSignup}
            disabled={
              isSubmitting || isLoading || isSocialLoading || !firebaseEnabled
            }
            className="w-full flex items-center justify-center text-sm text-[#3F3F46] font-medium border border-[#D2D6DB] p-[8px] rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-50"
          >
            <FcGoogle className="mr-2 text-xl" />
            {!firebaseEnabled
              ? "Google (temporarily unavailable)"
              : isSocialLoading
                ? "Connecting..."
                : "Google"}
          </button>

          {/* Terms + Sign in */}
          <p className="text-xs text-[#71717A] font-normal mt-6 px-8 text-center">
            By clicking continue, you agree to our{" "}
            <span className="underline cursor-pointer">Terms of Service</span>{" "}
            and <span className="underline cursor-pointer">Privacy Policy</span>
            .
          </p>
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
