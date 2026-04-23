import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../types';
import { Info } from 'lucide-react';

interface Step10Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export function Step10CreateBoard({ onNext, onBack, data, updateData }: Step10Props) {
  const [boardName, setBoardName] = useState(data.boardName || 'My first project');

  const handleContinue = () => {
    updateData({ boardName });
    onNext();
  };

  return (
    <OnboardingLayout 
      illustration="https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0JTIwbWFuYWdlbWVudCUyMGthbmJhbiUyMGJvYXJkfGVufDF8fHx8MTc3NjI3MjEyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      gradientType="yellow"
    >
      <div className="space-y-8">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-[32px] font-semibold text-gray-900">
            📋 Let's start working together
          </h1>
        </div>

        {/* Board Name Input */}
        <div className="space-y-2">
          <label className="text-[16px] font-medium text-gray-900">Board name</label>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="e.g., My first project"
            className="w-full px-4 py-3 border-2 border-[#D1D5DB] rounded-lg focus:border-[#0073EA] focus:outline-none transition-colors duration-200"
          />
        </div>

        {/* Info Box */}
        <div className="p-4 bg-gray-50 rounded-lg flex gap-3">
          <Info className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
          <p className="text-[14px] text-[#6B7280]">
            A board is where you'll organize and track all your work. You can create multiple boards for different projects or teams.
          </p>
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
            disabled={!boardName}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              boardName
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
