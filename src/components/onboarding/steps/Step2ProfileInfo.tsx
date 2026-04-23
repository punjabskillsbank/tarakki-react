import { useState, useRef } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import type { OnboardingData } from '../types';
import MemberServices from '../../../services/MemberServices';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export function Step2ProfileInfo({ onNext, onBack, data, updateData }: Step2Props) {
  const [firstName, setFirstName] = useState(data.firstName || '');
  const [lastName, setLastName] = useState(data.lastName || '');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(data.profilePhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (firstName && lastName) {
      setLoading(true);
      try {
        // Use MemberServices as requested
        await MemberServices.createMember({
          firstName,
          lastName,
          email: data.email,
          profilePhotoS3Key: "",
          accountStatus: "ACTIVE"
        });
      } catch (error) {
        console.error('Error connecting to API:', error);
      } finally {
        setLoading(false);
        updateData({ firstName, lastName, profilePhoto: profilePhoto || undefined });
        onNext();
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
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

        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#0073EA] transition-all group overflow-hidden"
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto text-gray-400 group-hover:text-[#0073EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
               <span className="text-white opacity-0 group-hover:opacity-100 text-[10px] font-bold">CHANGE</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
          <span className="text-[14px] font-medium text-[#6B7280]">Profile Photo (Optional)</span>
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
