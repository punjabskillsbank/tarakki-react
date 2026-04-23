import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../OnboardingFlow';

interface Step1Props {
  onNext: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export function Step1Signup({ onNext, updateData }: Step1Props) {
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (email) {
      updateData({ email });
      onNext();
    }
  };

  return (
    <OnboardingLayout 
      illustration="https://images.unsplash.com/photo-1636956040469-fec02ed01ab5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXNoYm9hcmQlMjBpbGx1c3RyYXRpb24lMjBwdXJwbGUlMjBncmFkaWVudHxlbnwxfHx8fDE3NzYyNzIxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      gradientType="purple"
    >
      <div className="space-y-8">
        {/* Heading with Logo */}
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm bg-white">
            <img src="/tarakki_logo.png" alt="Tarakki Logo" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-3">
            <h1 className="text-[32px] font-semibold text-gray-900">Welcome to Tarakki</h1>
            <p className="text-[16px] text-[#6B7280]">Get started – it's free. No credit card needed.</p>
          </div>
        </div>

        {/* Google Button */}
        <button 
          className="w-full py-3 px-4 border-2 border-[#E5E7EB] rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.87-2.6 3.3-4.51 6.16-4.51z"
            />
          </svg>
          <span className="font-medium">Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#E5E7EB]"></div>
          <span className="text-[14px] text-[#6B7280]">OR</span>
          <div className="flex-1 h-px bg-[#E5E7EB]"></div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
            className="w-full px-4 py-3 border-2 border-[#D1D5DB] rounded-lg focus:border-[#0073EA] focus:outline-none transition-colors duration-200"
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!email}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            email 
              ? 'bg-[#0073EA] text-white hover:bg-[#0062C9] hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>

        {/* Footer */}
        <p className="text-center text-[14px] text-[#6B7280]">
          Already have an account? <span className="text-[#0073EA] cursor-pointer hover:underline">Log in</span>
        </p>
      </div>
    </OnboardingLayout>
  );
}
