import { createBrowserRouter } from "react-router-dom";
import { OnboardingFlow } from "../pages/onboarding/OnboardingFlow";
import { OrganizationDecision } from "../pages/organization/organizationDecision/OrganizationDecision";
import CreateOrganizationForm from "../pages/organization/createOrganisation/CreateOrganizationForm";
import { CreateBoard } from "../pages/board/CreateBoard";

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
    path: "/create-organization",
    Component: CreateOrganizationForm,
  },
  {
   path:"/create-board/:orgId/:orgName" ,
   Component: CreateBoard  
  },
]);
