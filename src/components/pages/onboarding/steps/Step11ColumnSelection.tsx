import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../types';
import { Check } from 'lucide-react';

interface Step11Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const availableColumns = [
  'Owner',
  'Status',
  'Due date',
  'Priority',
  'Notes',
  'Files',
  'Timeline',
  'Budget'
];

export function Step11ColumnSelection({ onNext, onBack, data, updateData }: Step11Props) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    data.columns || ['Owner', 'Status', 'Due date']
  );

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const handleContinue = () => {
    updateData({ columns: selectedColumns });
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
            🧱 Let's select the relevant columns for your board
          </h1>
        </div>

        {/* Column Options */}
        <div className="space-y-3">
          {availableColumns.map((column) => (
            <label
              key={column}
              onClick={() => toggleColumn(column)}
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-[#E5E7EB] hover:border-[#0073EA] cursor-pointer transition-all duration-200"
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  selectedColumns.includes(column)
                    ? 'bg-[#0073EA] border-[#0073EA]'
                    : 'border-[#D1D5DB]'
                }`}
              >
                {selectedColumns.includes(column) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-[16px] font-medium text-gray-900">{column}</span>
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
            disabled={selectedColumns.length === 0}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              selectedColumns.length > 0
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
