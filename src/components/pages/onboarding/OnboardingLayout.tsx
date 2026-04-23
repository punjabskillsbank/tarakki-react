import type { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
  illustration: string;
  gradientType?: 'purple' | 'yellow';
}

export function OnboardingLayout({ children, illustration, gradientType = 'purple' }: OnboardingLayoutProps) {
  const gradientClass = gradientType === 'purple' 
    ? 'bg-gradient-to-br from-[#5F5FEF] to-[#6C63FF]'
    : 'bg-gradient-to-br from-[#FFC700] to-[#FFCC00]';

  return (
    <div className="h-screen w-full flex" style={{ fontFamily: 'Inter, sans-serif', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Left Side - Form/Content */}
      <div className="w-1/2 bg-white flex items-center justify-center p-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className={`w-1/2 ${gradientClass} flex items-center justify-center p-16 relative overflow-hidden`}>
        <img 
          src={illustration} 
          alt="Illustration" 
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}
