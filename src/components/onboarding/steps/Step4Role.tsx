import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../types';
import { PillButton } from '../PillButton';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const roles = [
  'Business owner',
  'Team leader',
  'Team member',
  'Freelancer',
  'Director',
  'C-Level',
  'VP'
];

export function Step4Role({ onNext, onBack, data, updateData }: Step4Props) {
  const [selected, setSelected] = useState(data.role || '');

  const handleContinue = () => {
    updateData({ role: selected });
    onNext();
  };

  return (
    <OnboardingLayout 
      illustration="https://images.unsplash.com/photo-1630672790237-38eeb57cb60b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMG9mZmljZSUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzYyNzIxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      gradientType="purple"
    >
      <div className="space-y-8">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-[32px] font-semibold text-gray-900">
            👤 What best describes your current role?
          </h1>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-3">
          {roles.map((role) => (
            <PillButton
              key={role}
              selected={selected === role}
              onClick={() => setSelected(role)}
            >
              {role}
            </PillButton>
          ))}
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
            disabled={!selected}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              selected
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
