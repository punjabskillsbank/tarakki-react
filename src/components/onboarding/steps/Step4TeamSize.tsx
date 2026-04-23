import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../OnboardingFlow';
import { PillButton } from '../PillButton';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const teamSizes = ['Only me', '2–5', '6–10', '11–15', '16–25', '26+'];
const companySizes = ['1–10', '11–50', '51–200', '201–500', '501–1000', '1000+'];

export function Step4TeamSize({ onNext, onBack, data, updateData }: Step4Props) {
  const [teamSize, setTeamSize] = useState(data.teamSize || '');
  const [companySize, setCompanySize] = useState(data.companySize || '');

  const handleContinue = () => {
    updateData({ teamSize, companySize });
    onNext();
  };

  return (
    <OnboardingLayout 
      illustration="https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0JTIwbWFuYWdlbWVudCUyMGthbmJhbiUyMGJvYXJkfGVufDF8fHx8MTc3NjI3MjEyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      gradientType="purple"
    >
      <div className="space-y-8">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-[32px] font-semibold text-gray-900">
            👥 Tell us about your team
          </h1>
        </div>

        {/* Team Size */}
        <div className="space-y-4">
          <p className="text-[16px] font-medium text-gray-900">How many people are on your team?</p>
          <div className="flex flex-wrap gap-3">
            {teamSizes.map((size) => (
              <PillButton
                key={size}
                selected={teamSize === size}
                onClick={() => setTeamSize(size)}
              >
                {size}
              </PillButton>
            ))}
          </div>
        </div>

        {/* Company Size */}
        <div className="space-y-4">
          <p className="text-[16px] font-medium text-gray-900">How many people work at your company?</p>
          <div className="flex flex-wrap gap-3">
            {companySizes.map((size) => (
              <PillButton
                key={size}
                selected={companySize === size}
                onClick={() => setCompanySize(size)}
              >
                {size}
              </PillButton>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 rounded-lg font-medium border-2 border-[#D1D5DB] hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!teamSize || !companySize}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              teamSize && companySize
                ? 'bg-[#0073EA] text-white hover:bg-[#0062C9] hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
