import { createBrowserRouter } from "react-router-dom";
import { OnboardingFlow } from "../pages/onboarding/OnboardingFlow";
import { OrganizationDecision } from "../pages/organization/organizationDecision/OrganizationDecision";
import CreateOrganizationForm from "../pages/organization/createOrganisation/CreateOrganizationForm";
import { UserProfile } from "../pages/user/UserProfile";
import { CreateBoard } from "../pages/board/CreateBoard";
import TaskBoardPage from "../pages/groups/TaskBoardPage";
import config from "../config/indexConfig";

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
    path: config.routes.taskBoard,
    Component: TaskBoardPage,
  },
]);
