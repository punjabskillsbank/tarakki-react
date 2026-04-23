import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../types';
import { PillButton } from '../PillButton';

interface Step7Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const focusAreas = ['CRM', 'Task management', 'IT service desk', 'Project management', 'Team collaboration', 'Marketing campaigns'];

export function Step7FocusArea({ onNext, onBack, data, updateData }: Step7Props) {
  const [selected, setSelected] = useState(data.focusArea || 'Task management');

  const handleContinue = () => {
    updateData({ focusArea: selected });
    onNext();
  };

  return (
    <OnboardingLayout 
      illustration="https://images.unsplash.com/photo-1636956040469-fec02ed01ab5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXNoYm9hcmQlMjBpbGx1c3RyYXRpb24lMjBwdXJwbGUlMjBncmFkaWVudHxlbnwxfHx8fDE3NzYyNzIxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      gradientType="yellow"
    >
      <div className="space-y-8">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-[32px] font-semibold text-gray-900">
            🎯 Select what you'd like to focus on first
          </h1>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-3">
          {focusAreas.map((area) => (
            <PillButton
              key={area}
              selected={selected === area}
              onClick={() => setSelected(area)}
            >
              {area}
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
