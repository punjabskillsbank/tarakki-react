// <<<<<<< HEAD
// import { createBrowserRouter } from 'react-router-dom';
// import { AdminDashboard } from '../adminDashboard/AdminDashboard';
// import { OnboardingFlow } from '../pages/onboarding/OnboardingFlow';
// import { OrganizationDecision } from '../pages/organization/OrganizationDecision';
// =======
// import { createBrowserRouter } from "react-router-dom";
// import { OnboardingFlow } from "../pages/onboarding/OnboardingFlow";
// import { OrganizationDecision } from "../pages/organization/organizationDecision/OrganizationDecision";
// import CreateOrganizationForm from "../pages/organization/createOrganisation/CreateOrganizationForm";
// >>>>>>> origin/develop

// export const Router = createBrowserRouter([
//   {
//     path: '/',
//     Component: OnboardingFlow,
//   },
//   {
//     path: '/organization-decision',
//     Component: OrganizationDecision,
//   },
//   {
// <<<<<<< HEAD
//     path: '/dashboard',
//     Component: AdminDashboard,
//   },
//   {
//     path: '/admin-dashboard',
//     Component: AdminDashboard,
// }
//     {path: "/create-organization",
//     Component: CreateOrganizationForm,}
// >>>>>>> origin/develop
//   },
// ]);

import { createBrowserRouter } from "react-router-dom";
import { AdminDashboard } from "../pages/AdminDashboard";
import { OnboardingFlow } from "../pages/onboarding/OnboardingFlow";
import { OrganizationDecision } from "../pages/organization/organizationDecision/OrganizationDecision";
import CreateOrganizationForm from "../pages/organization/createOrganisation/CreateOrganizationForm";

export const Router = createBrowserRouter([
  {
    path: "/",
    Component: OnboardingFlow,
  },
  {
    path: "/organization-decision",
    Component: OrganizationDecision,
  },
  {
    path: "/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/admin-dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/create-organization",
    Component: CreateOrganizationForm,
  },
]);