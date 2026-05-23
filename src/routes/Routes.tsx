import { createBrowserRouter } from 'react-router-dom';
import { AdminDashboard } from '../adminDashboard/AdminDashboard';
import { OnboardingFlow } from '../pages/onboarding/OnboardingFlow';
import { OrganizationDecision } from '../pages/organization/OrganizationDecision';

export const Router = createBrowserRouter([
  {
    path: '/',
    Component: OnboardingFlow,
  },
  {
    path: '/organization-decision',
    Component: OrganizationDecision,
  },
  {
    path: '/dashboard',
    Component: AdminDashboard,
  },
  {
    path: '/admin-dashboard',
    Component: AdminDashboard,
  },
]);
