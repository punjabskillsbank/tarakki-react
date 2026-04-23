import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../OnboardingFlow';
import { Plus, X } from 'lucide-react';

interface Step8Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

interface TeamMember {
  email: string;
  role: string;
}

export function Step8InviteTeam({ onNext, onBack, data, updateData }: Step8Props) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    data.teamMembers || [{ email: '', role: 'Admin' }]
  );

  const addMember = () => {
    setTeamMembers([...teamMembers, { email: '', role: 'Admin' }]);
  };

  const removeMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: 'email' | 'role', value: string) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleInvite = () => {
    updateData({ teamMembers: teamMembers.filter(m => m.email) });
    onNext();
  };

  const handleSkip = () => {
    updateData({ teamMembers: [] });
    onNext();
  };

  return (
    <OnboardingLayout 
      illustration="https://images.unsplash.com/photo-1630672790237-38eeb57cb60b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMG9mZmljZSUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzYyNzIxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      gradientType="yellow"
    >
      <div className="space-y-8">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-[32px] font-semibold text-gray-900">
            👥 Who else is on your team?
          </h1>
        </div>

        {/* Team Members */}
        <div className="space-y-3">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="email"
                placeholder="teammate@company.com"
                value={member.email}
                onChange={(e) => updateMember(index, 'email', e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-[#D1D5DB] rounded-lg focus:border-[#0073EA] focus:outline-none transition-colors duration-200"
              />
              <select
                value={member.role}
                onChange={(e) => updateMember(index, 'role', e.target.value)}
                className="px-4 py-3 border-2 border-[#D1D5DB] rounded-lg focus:border-[#0073EA] focus:outline-none transition-colors duration-200"
              >
                <option>Admin</option>
                <option>Member</option>
                <option>Viewer</option>
              </select>
              {teamMembers.length > 1 && (
                <button
                  onClick={() => removeMember(index)}
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
          onClick={addMember}
          className="flex items-center gap-2 text-[#0073EA] font-medium hover:underline transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add another
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
            onClick={handleSkip}
            className="flex-1 py-3 px-4 rounded-lg font-medium border-2 border-[#D1D5DB] hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Remind me later
          </button>
          <button
            onClick={handleInvite}
            className="flex-1 py-3 px-4 rounded-lg font-medium bg-[#0073EA] text-white hover:bg-[#0062C9] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Invite your team
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
