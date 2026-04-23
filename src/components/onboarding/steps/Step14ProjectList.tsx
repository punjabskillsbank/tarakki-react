import { useState } from 'react';
import { useNavigate } from 'react-router';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../types';
import { Plus, X } from 'lucide-react';
import { EntranceTransition } from '../EntranceTransition';

interface Step14Props {
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export function Step14ProjectList({ onBack, data, updateData }: Step14Props) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<string[]>(
    data.projects || ['Task 1', 'Task 2', 'Task 3']
  );

  const addProject = () => {
    setProjects([...projects, `Task ${projects.length + 1}`]);
  };

  const removeProject = (index: number) => {
    if (projects.length > 1) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  const updateProject = (index: number, value: string) => {
    const updated = [...projects];
    updated[index] = value;
    setProjects(updated);
  };

  const [isStarting, setIsStarting] = useState(false);

  const handleGetStarted = () => {
    updateData({ projects });
    setIsStarting(true);
  };

  const completeTransition = () => {
    navigate('/dashboard');
  };

  if (isStarting) {
    return <EntranceTransition onComplete={completeTransition} />;
  }

  return (
    <OnboardingLayout 
      illustration="https://images.unsplash.com/photo-1763926444206-50468b00986c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBhYnN0cmFjdCUyMGdlb21ldHJpYyUyMHBhdHRlcm58ZW58MXx8fHwxNzc2MjcyMTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      gradientType="yellow"
    >
      <div className="space-y-8">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-[32px] font-semibold text-gray-900">
            📄 List your projects
          </h1>
          <p className="text-[16px] text-[#6B7280]">
            Add some initial tasks to get started
          </p>
        </div>

        {/* Project Inputs */}
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={project}
                onChange={(e) => updateProject(index, e.target.value)}
                placeholder={`Task ${index + 1}`}
                className="flex-1 px-4 py-3 border-2 border-[#D1D5DB] rounded-lg focus:border-[#0073EA] focus:outline-none transition-colors duration-200"
              />
              {projects.length > 1 && (
                <button
                  onClick={() => removeProject(index)}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Another Button */}
        <button
          onClick={addProject}
          className="flex items-center gap-2 text-[#0073EA] font-medium hover:underline transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add another task
        </button>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 rounded-lg font-medium border-2 border-[#D1D5DB] hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Back
          </button>
          <button
            onClick={handleGetStarted}
            className="flex-1 py-3 px-4 rounded-lg font-medium bg-[#0073EA] text-white hover:bg-[#0062C9] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get started
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
