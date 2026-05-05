import { createBrowserRouter } from 'react-router-dom';
import { OnboardingFlow } from '../components/pages/onboarding/OnboardingFlow';
import { OrganizationDecision } from '../components/pages/organization/OrganizationDecision';

export const Router = createBrowserRouter([
  {
    path: "/",
    Component: OnboardingFlow,
  },
  {
    path: "/organization-decision",
    Component: OrganizationDecision,
  }
]);