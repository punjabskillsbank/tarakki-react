import { createBrowserRouter } from 'react-router-dom';
import { OnboardingFlow } from '../components/pages/onboarding/OnboardingFlow';

export const Router = createBrowserRouter([
  {
    path: "/",
    Component: OnboardingFlow,
  }
]);