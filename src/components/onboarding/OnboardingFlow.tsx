import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1Signup } from './steps/Step1Signup';
import { Step2Purpose } from './steps/Step2Purpose';
import { Step3Role } from './steps/Step3Role';
import { Step4TeamSize } from './steps/Step4TeamSize';
import { Step5WhatToManage } from './steps/Step5WhatToManage';
import { Step6FocusArea } from './steps/Step6FocusArea';
import { Step7HowDidYouHear } from './steps/Step7HowDidYouHear';
import { Step8InviteTeam } from './steps/Step8InviteTeam';
import { Step9CreateBoard } from './steps/Step9CreateBoard';
import { Step10ColumnSelection } from './steps/Step10ColumnSelection';
import { Step11DashboardSetup } from './steps/Step11DashboardSetup';
import { Step12ViewLayout } from './steps/Step12ViewLayout';
import { Step13ProjectList } from './steps/Step13ProjectList';

export interface OnboardingData {
  email?: string;
  purpose?: string;
  role?: string;
  teamSize?: string;
  companySize?: string;
  whatToManage?: string;
  focusArea?: string;
  howDidYouHear?: string[];
  teamMembers?: Array<{ email: string; role: string }>;
  boardName?: string;
  columns?: string[];
  dashboards?: string[];
  viewLayout?: string;
  projects?: string[];
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({});
  const [direction, setDirection] = useState(1);

  const nextStep = () => {
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
  };

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const transition = {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  return (
    <div className="h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="h-full"
        >
          {currentStep === 1 && <Step1Signup onNext={nextStep} data={data} updateData={updateData} />}
          {currentStep === 2 && <Step2Purpose onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 3 && <Step3Role onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 4 && <Step4TeamSize onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 5 && <Step5WhatToManage onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 6 && <Step6FocusArea onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 7 && <Step7HowDidYouHear onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 8 && <Step8InviteTeam onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 9 && <Step9CreateBoard onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 10 && <Step10ColumnSelection onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 11 && <Step11DashboardSetup onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 12 && <Step12ViewLayout onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 13 && <Step13ProjectList onBack={prevStep} data={data} updateData={updateData} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
