import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../types';
import { BarChart3, PieChart, Users } from 'lucide-react';

interface Step12Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const dashboardOptions = [
  { id: 'tasks-overview', label: 'Tasks overview', icon: BarChart3 },
  { id: 'tasks-by-status', label: 'Tasks by status', icon: PieChart },
  { id: 'tasks-by-owner', label: 'Tasks by owner', icon: Users }
];

export function Step12DashboardSetup({ onNext, onBack, data, updateData }: Step12Props) {
  const [selectedDashboards, setSelectedDashboards] = useState<string[]>(
    data.dashboards || ['tasks-overview']
  );

  const toggleDashboard = (id: string) => {
    setSelectedDashboards(prev =>
      prev.includes(id)
        ? prev.filter(d => d !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    updateData({ dashboards: selectedDashboards });
    onNext();
  };

  return (
    <OnboardingLayout 
      illustration="https://images.unsplash.com/photo-1758876202980-0a28b744fb24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGNoYXJ0cyUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NzYyNzIxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      gradientType="yellow"
    >
      <div className="space-y-8">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-[32px] font-semibold text-gray-900">
            📊 Get real-time insights with dashboards
          </h1>
          <p className="text-[16px] text-[#6B7280]">
            Select the dashboards you'd like to see
          </p>
        </div>

        {/* Dashboard Options */}
        <div className="space-y-3">
          {dashboardOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedDashboards.includes(option.id);
            
            return (
              <div
                key={option.id}
                onClick={() => toggleDashboard(option.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-[#0073EA] bg-[#E6F0FF]'
                    : 'border-[#E5E7EB] hover:border-[#0073EA]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#0073EA]' : 'bg-gray-100'}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className={`text-[16px] font-medium ${isSelected ? 'text-[#0073EA]' : 'text-gray-900'}`}>
                    {option.label}
                  </span>
                </div>
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
            disabled={selectedDashboards.length === 0}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              selectedDashboards.length > 0
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
