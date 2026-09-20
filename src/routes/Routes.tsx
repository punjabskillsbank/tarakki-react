import { createBrowserRouter } from "react-router-dom";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { OnboardingFlow } from "../pages/onboarding/OnboardingFlow";
import { OrganizationDecision } from "../pages/organization/organizationDecision/OrganizationDecision";
import CreateOrganizationForm from "../pages/organization/createOrganisation/CreateOrganizationForm";
import { UserProfile } from "../pages/user/UserProfile";
import { CreateBoard } from "../pages/board/CreateBoard";
import TaskBoard from "../pages/taskBoard/TaskBoard";
import config from "../config/indexConfig";
import { OrgMembers } from "../pages/organization/organizationMembers/OrgMembers";

export const Router = createBrowserRouter([
  {
    path: config.routes.onboarding,
    Component: OnboardingFlow,
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
    path: config.routes.taskBoardRoot,
    Component: TaskBoard,
  },
  {
    path: config.routes.taskBoard,
    Component: TaskBoard,
  },
  {
    path: config.routes.organizationMembers,
    Component: OrgMembers,
  },
]);
