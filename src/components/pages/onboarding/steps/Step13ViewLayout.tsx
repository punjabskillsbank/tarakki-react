import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../types';
import { Table, Kanban, GanttChart, Calendar } from 'lucide-react';

interface Step13Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const viewOptions = [
  { id: 'table', label: 'Table', icon: Table },
  { id: 'kanban', label: 'Kanban', icon: Kanban },
  { id: 'timeline', label: 'Timeline', icon: GanttChart },
  { id: 'calendar', label: 'Calendar', icon: Calendar }
];

export function Step13ViewLayout({ onNext, onBack, data, updateData }: Step13Props) {
  const [selectedView, setSelectedView] = useState(data.viewLayout || 'table');

  const handleContinue = () => {
    updateData({ viewLayout: selectedView });
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
            🧩 Add a view layout
          </h1>
          <p className="text-[16px] text-[#6B7280]">
            Choose how you want to visualize your work
          </p>
        </div>

        {/* View Options */}
        <div className="grid grid-cols-2 gap-4">
          {viewOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedView === option.id;
            
            return (
              <div
                key={option.id}
                onClick={() => setSelectedView(option.id)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-center gap-3 ${
                  isSelected
                    ? 'border-[#0073EA] bg-[#E6F0FF]'
                    : 'border-[#E5E7EB] hover:border-[#0073EA]'
                }`}
              >
                <div className={`p-3 rounded-lg ${isSelected ? 'bg-[#0073EA]' : 'bg-gray-100'}`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <span className={`text-[16px] font-medium ${isSelected ? 'text-[#0073EA]' : 'text-gray-900'}`}>
                  {option.label}
                </span>
              </div>
            );
          })}
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
            disabled={!selectedView}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              selectedView
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