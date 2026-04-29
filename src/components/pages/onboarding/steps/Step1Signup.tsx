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
  const [error, setError] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinue = () => {
    if (isValidEmail(email)) {
      setError('');
      updateData({ email });
      onNext();
    } else {
      setError('Please enter a valid email address');
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


        {/* Email Input */}
        <div className="space-y-2">
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
              error ? 'border-red-500' : 'border-[#D1D5DB] focus:border-[#0073EA]'
            }`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
