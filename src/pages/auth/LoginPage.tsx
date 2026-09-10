import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { OnboardingLayout } from "../onboarding/OnboardingLayout";
import signupIllustration from "../../assets/images/onboarding-signup.jpg";
import { FormInput } from "../../components/FormInput";
import { PasswordInput } from "../../components/PasswordInput";
import { PrimaryButton } from "../../components/PrimaryButton";
import AuthService from "../../services/AuthService";
import { setToken, setMemberIdentity } from "../../utils/authStorage";
import config from "../../config/indexConfig";

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setGlobalError(null);
    try {
      const result = await AuthService.login(data);
      setToken(result.token);
      setMemberIdentity({
        memberId: result.member.memberId,
        firstName: result.member.firstName,
        lastName: result.member.lastName,
      });
      toast.success("Logged in successfully!");
      navigate(config.routes.organizationDecision);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please try again.";
      setGlobalError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout illustration={signupIllustration} gradientType="purple">
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm bg-white">
            <img
              src="/tarakki_logo.png"
              alt="Tarakki Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3">
            <h1 className="text-[32px] font-semibold text-gray-900">Welcome back</h1>
            <p className="text-[16px] text-[#6B7280]">Log in to your Tarakki account</p>
          </div>
        </div>

        {globalError && (
          <div
            className="rounded-lg border p-3 flex items-start gap-3"
            style={{ backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" }}
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#B91C1C]" />
            <p className="text-sm text-[#B91C1C]">{globalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            id="email"
            type="email"
            label="Email Address"
            placeholder="name@company.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Please enter your email address",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />

          <PasswordInput
            id="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", {
              required: "Please enter your password",
            })}
          />

          <PrimaryButton
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </PrimaryButton>
        </form>

        <p className="text-center text-[14px] text-[#6B7280]">
          Don't have an account?{" "}
          <Link to={config.routes.onboarding} className="text-[#0073EA] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </OnboardingLayout>
  );
}
