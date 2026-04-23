import { createBrowserRouter } from 'react-router-dom';
import { OnboardingFlow } from '../components/onboarding/OnboardingFlow';

export const Router = createBrowserRouter([
  {
    path: "/",
    Component: OnboardingFlow,
  }
]);