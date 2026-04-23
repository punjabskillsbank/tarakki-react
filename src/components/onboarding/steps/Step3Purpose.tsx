import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../types';
import { PillButton } from '../PillButton';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const purposes = ['Work', 'Personal', 'School', 'Nonprofits'];

export function Step3Purpose({ onNext, data, updateData }: Step3Props) {
  const [selected, setSelected] = useState(data.purpose || 'Work');

  const handleContinue = () => {
    updateData({ purpose: selected });
    onNext();
  };

  return (
    <OnboardingLayout 
      illustration="https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZSUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NzYyNDcwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      gradientType="purple"
    >
      <div className="space-y-8">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-[32px] font-semibold text-gray-900">
            Hi {data.firstName}, what brings you here today?
          </h1>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-3">
          {purposes.map((purpose) => (
            <PillButton
              key={purpose}
              selected={selected === purpose}
              onClick={() => setSelected(purpose)}
            >
              {purpose}
            </PillButton>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            selected
              ? 'bg-[#0073EA] text-white hover:bg-[#0062C9] hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </OnboardingLayout>
  );
}
