import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../types';
import { Check } from 'lucide-react';

interface Step8Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const sources = [
  'Software review site',
  'AI chatbots',
  'Email',
  'YouTube',
  'LinkedIn',
  'Facebook',
  'Google search',
  'Friend or colleague'
];

export function Step8HowDidYouHear({ onNext, onBack, data, updateData }: Step8Props) {
  const [selected, setSelected] = useState<string[]>(data.howDidYouHear || []);

  const toggleSource = (source: string) => {
    setSelected(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const handleContinue = () => {
    updateData({ howDidYouHear: selected });
    onNext();
  };

  return (
    <OnboardingLayout 
      illustration="https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZSUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NzYyNDcwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      gradientType="yellow"
    >
      <div className="space-y-8">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-[32px] font-semibold text-gray-900">
            📣 One last question, how did you hear about us?
          </h1>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          {sources.map((source) => (
            <label 
              key={source}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
            >
              <div 
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  selected.includes(source)
                    ? 'bg-[#0073EA] border-[#0073EA]'
                    : 'border-[#D1D5DB]'
                }`}
                onClick={() => toggleSource(source)}
              >
                {selected.includes(source) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-[16px] text-gray-900">{source}</span>
            </label>
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
            disabled={selected.length === 0}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              selected.length > 0
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
