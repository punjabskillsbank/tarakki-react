import { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../OnboardingFlow';
import MemberServices from '../../../../services/MemberServices';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export function Step2ProfileInfo({ onNext, onBack, data, updateData }: Step2Props) {
  const [firstName, setFirstName] = useState(data.firstName || '');
  const [lastName, setLastName] = useState(data.lastName || '');

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (firstName && lastName) {
      setLoading(true);
      setApiError(null);
      try {
        // Use MemberServices as requested
        await MemberServices.createMember({
          firstName,
          lastName,
          email: data.email,
          profilePhotoS3Key: "",
          accountStatus: "ACTIVE"
        });
        updateData({ firstName, lastName });
        onNext();
      } catch (error) {
        console.error('Error connecting to API:', error);
        setApiError('Failed to create account. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };



  const isComplete = firstName.trim() !== '' && lastName.trim() !== '';

  return (
    <OnboardingLayout 
      illustration="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx0ZWFtJTIwd29ya2luZ3xlbnwxfHx8fDE3NzYyNzIxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      gradientType="purple"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <button 
            onClick={onBack}
            className="text-[#6B7280] hover:text-gray-900 flex items-center gap-2 text-sm font-medium transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-[32px] font-semibold text-gray-900">Tell us about yourself</h1>
          <p className="text-[16px] text-[#6B7280]">Help us personalize your experience.</p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-gray-700">First Name</label>
            <input
              type="text"
              placeholder="e.g. John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#D1D5DB] rounded-lg focus:border-[#0073EA] focus:outline-none transition-colors duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              placeholder="e.g. Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#D1D5DB] rounded-lg focus:border-[#0073EA] focus:outline-none transition-colors duration-200"
            />
          </div>
        </div>

        {/* Error Message */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
            {apiError}
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!isComplete || loading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isComplete && !loading
              ? 'bg-[#0073EA] text-white hover:bg-[#0062C9] hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : 'Set up my workspace'}
        </button>

        {/* Footer info */}
        <p className="text-center text-[12px] text-[#9CA3AF]">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </OnboardingLayout>
  );
}
