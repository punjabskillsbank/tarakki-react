import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1Signup } from './steps/Step1Signup';
import { Step2ProfileInfo } from './steps/Step2ProfileInfo';
import { EntranceTransition } from './EntranceTransition';

// This will only be used further when more steps are added to onboarding
/*
export interface OnboardingData {
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
}
*/

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [direction, setDirection] = useState(1);

  const nextStep = useCallback(() => {
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
  }, []);

  // updateData removed as we are passing email directly now

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
          {currentStep === 1 && <Step1Signup onNext={nextStep} setEmail={setEmail} />}
          {currentStep === 2 && <Step2ProfileInfo onNext={nextStep} onBack={prevStep} email={email} />}
          {currentStep === 3 && <EntranceTransition onComplete={nextStep} />}
          {currentStep === 4 && null}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
