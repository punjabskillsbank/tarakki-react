import { createBrowserRouter } from 'react-router-dom';
import { OnboardingFlow } from '../pages/onboarding/OnboardingFlow';
import { OrganizationDecision } from '../pages/organization/OrganizationDecision';

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