<<<<<<< HEAD
import { createBrowserRouter } from "react-router-dom";
import { OnboardingFlow } from "../pages/onboarding/OnboardingFlow";
import { OrganizationDecision } from "../pages/organization/organizationDecision/OrganizationDecision";
import CreateOrganizationForm from "../pages/organization/createOrganisation/CreateOrganizationForm";
=======
import { createBrowserRouter } from 'react-router-dom';
import { OnboardingFlow } from '../pages/onboarding/OnboardingFlow';
import { OrganizationDecision } from '../pages/organization/OrganizationDecision';
import { CreateBoard } from '../pages/board/CreateBoard';
>>>>>>> ce779fd (TK_36: Create page named create-board without navigation)

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
<<<<<<< HEAD
    path: "/create-organization",
    Component: CreateOrganizationForm,
  },
]);
=======
    path: "/create-board",
    Component: CreateBoard,
  },
]);
>>>>>>> ce779fd (TK_36: Create page named create-board without navigation)
