import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1Signup } from './steps/Step1Signup';
import { Step2ProfileInfo } from './steps/Step2ProfileInfo';
import { Step3Purpose } from './steps/Step3Purpose';
import { Step4Role } from './steps/Step4Role';
import { Step5TeamSize } from './steps/Step5TeamSize';
import { Step6WhatToManage } from './steps/Step6WhatToManage';
import { Step7FocusArea } from './steps/Step7FocusArea';
import { Step8HowDidYouHear } from './steps/Step8HowDidYouHear';
import { Step9InviteTeam } from './steps/Step9InviteTeam';
import { Step10CreateBoard } from './steps/Step10CreateBoard';
import { Step11ColumnSelection } from './steps/Step11ColumnSelection';
import { Step12DashboardSetup } from './steps/Step12DashboardSetup';
import { Step13ViewLayout } from './steps/Step13ViewLayout';
import { Step14ProjectList } from './steps/Step14ProjectList';
import type { OnboardingData } from './types';

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
          {currentStep === 2 && <Step2ProfileInfo onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 3 && <Step3Purpose onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 4 && <Step4Role onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 5 && <Step5TeamSize onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 6 && <Step6WhatToManage onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 7 && <Step7FocusArea onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 8 && <Step8HowDidYouHear onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 9 && <Step9InviteTeam onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 10 && <Step10CreateBoard onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 11 && <Step11ColumnSelection onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 12 && <Step12DashboardSetup onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 13 && <Step13ViewLayout onNext={nextStep} onBack={prevStep} data={data} updateData={updateData} />}
          {currentStep === 14 && <Step14ProjectList onBack={prevStep} data={data} updateData={updateData} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
