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
<<<<<<< Updated upstream
]);
=======
  {
    path: "/user-profile",
    Component: UserProfile,
  },
  {
    path: config.routes.createBoard,
    Component: CreateBoard,
  },
  {
    path: "/admin-dashboard",
    Component: AdminDashboard,
  },
]);
>>>>>>> Stashed changes
