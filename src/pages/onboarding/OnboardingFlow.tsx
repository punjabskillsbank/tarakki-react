import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1Signup } from './steps/Step1Signup';
import { Step2ProfileInfo } from './steps/Step2ProfileInfo';
import { EntranceTransition } from './EntranceTransition';
import config from '../../config/indexConfig';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const stepParam = searchParams.get('step');
  const currentStep = stepParam ? parseInt(stepParam, 10) : 1;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [direction, setDirection] = useState(1);
  const [signupError, setSignupError] = useState<string | null>(null);

  const navigate = useNavigate();
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (currentStep !== prevStepRef.current) {
      setDirection(currentStep > prevStepRef.current ? 1 : -1);
      prevStepRef.current = currentStep;
    }
  }, [currentStep]);

  const nextStep = useCallback(() => {
    if (currentStep === 3) {
      navigate(config.routes.organizationDecision);
      return;
    }
    setSearchParams({ step: String(currentStep + 1) });
  }, [currentStep, navigate, setSearchParams]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setSearchParams({ step: String(currentStep - 1) });
    }
  }, [currentStep, setSearchParams]);

  const handleStep2ErrorBack = useCallback((errorMessage: string) => {
    setSignupError(errorMessage);
    prevStep();
  }, [prevStep]);

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
          {currentStep === 1 && (
            <Step1Signup 
              onNext={nextStep} 
              email={email}
              setEmail={setEmail} 
              password={password}
              setPassword={setPassword}
              externalError={signupError}
              onClearError={() => setSignupError(null)}
            />
          )}
          {currentStep === 2 && (
            <Step2ProfileInfo 
              onNext={nextStep} 
              onBack={prevStep} 
              email={email} 
              password={password}
              onErrorBack={handleStep2ErrorBack}
            />
          )}
          {currentStep === 3 && <EntranceTransition onComplete={nextStep} />}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
