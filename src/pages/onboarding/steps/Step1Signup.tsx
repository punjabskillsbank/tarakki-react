import { useState, useEffect } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import signupIllustration from "../../../assets/images/onboarding-signup.jpg";
import MemberService from "../../../services/MemberServices";
import { FormInput } from "../../../components/FormInput";
import { PasswordInput } from "../../../components/PasswordInput";
import { PrimaryButton } from "../../../components/PrimaryButton";

interface Step1Props {
  onNext: () => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  externalError?: string | null;
  onClearError?: () => void;
}

export function Step1Signup({
  onNext,
  email,
  setEmail,
  password: initialPassword = "",
  setPassword: setParentPassword,
  externalError,
  onClearError,
}: Step1Props) {
  const [localEmail, setLocalEmail] = useState(email);
  const [password, setPassword] = useState(initialPassword);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmailError(externalError || "");
  }, [externalError]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinue = async () => {
    // Reset all errors before checking
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setGeneralError("");
    onClearError?.();

    if (!isValidEmail(localEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setPasswordError("Please enter a password");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (!hasUppercase || !hasNumber || !hasSpecial) {
      setPasswordError("Password must contain at least one uppercase letter, one number, and one special character");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    setEmail(localEmail);
    setParentPassword?.(password);
    
    setIsLoading(true);
    try {
      await MemberService.getMemberByEmail(localEmail);
      setEmailError("Member with this email already exist");
    } catch (error: unknown) {
      const status = (error as any)?.response?.status;
      if (status === 404) {
        // Member not found, proceed to next step
        onNext();
      } else {
        setGeneralError(
          "Something went wrong while checking your email. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout
      illustration={signupIllustration}
      gradientType="purple">
      <div className="space-y-8">
        {/* Heading with Logo */}
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm bg-white">
            <img
              src="/tarakki_logo.png"
              alt="Tarakki Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3">
            <h1 className="text-[32px] font-semibold text-gray-900">
              Welcome to Tarakki
            </h1>
            <p className="text-[16px] text-[#6B7280]">
              Get started – it's free. No credit card needed.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Email Input */}
          <FormInput
            id="email-address"
            type="email"
            label="Email Address"
            placeholder="name@company.com"
            value={localEmail}
            error={emailError}
            onChange={(e) => {
              setLocalEmail(e.target.value);
              if (emailError) {
                setEmailError("");
                onClearError?.();
              }
            }}
            onKeyPress={(e) => e.key === "Enter" && handleContinue()}
          />

          {/* Password Input */}
          <PasswordInput
            id="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            error={passwordError}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) {
                setPasswordError("");
              }
            }}
            onKeyPress={(e) => e.key === "Enter" && handleContinue()}
          />

          {/* Confirm Password Input */}
          <PasswordInput
            id="confirm-password"
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            error={confirmPasswordError}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmPasswordError) {
                setConfirmPasswordError("");
              }
            }}
            onKeyPress={(e) => e.key === "Enter" && handleContinue()}
          />

          {generalError && <p className="text-red-500 text-xs mt-1">{generalError}</p>}
        </div>

        {/* Continue Button */}
        <PrimaryButton
          onClick={handleContinue}
          disabled={!localEmail || isLoading}
          isLoading={isLoading}
          className="w-full"
        >
          Continue
        </PrimaryButton>

        {/* Footer */}
        <p className="text-center text-[14px] text-[#6B7280]">
          Already have an account?{" "}
          <span className="text-[#0073EA] cursor-pointer hover:underline">
            Log in
          </span>
        </p>
      </div>
    </OnboardingLayout>
  );
}

