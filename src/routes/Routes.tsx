import { createBrowserRouter } from "react-router-dom";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { OnboardingFlow } from "../pages/onboarding/OnboardingFlow";
import { LoginPage } from "../pages/auth/LoginPage";
import { OrganizationDecision } from "../pages/organization/organizationDecision/OrganizationDecision";
import CreateOrganizationForm from "../pages/organization/createOrganisation/CreateOrganizationForm";
import { UserProfile } from "../pages/user/UserProfile";
import { CreateBoard } from "../pages/board/CreateBoard";
import config from "../config/indexConfig";
import { OrgMembers } from "../pages/organization/organizationMembers/OrgMembers";

export const Router = createBrowserRouter([
  {
    path: config.routes.onboarding,
    Component: OnboardingFlow,
  },
  {
    path: config.routes.login,
    Component: LoginPage,
  },
  {
    path: config.routes.organizationDecision,
    Component: OrganizationDecision,
  },
  {
    path: "/admin-dashboard",
    Component: AdminDashboard,
  },
  {
    path: config.routes.createOrganization,
    Component: CreateOrganizationForm,
  },
  {
    path: "/user-profile",
    Component: UserProfile,
  },
  {
    path: config.routes.createBoard,
    Component: CreateBoard,
  },
  {
    path: config.routes.organizationMembers,
    Component: OrgMembers,
  },
]);
