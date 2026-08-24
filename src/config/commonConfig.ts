const commonConfig = {
  baseURLs: {
    apiRoot: '/api',
  },
   routes: {
    onboarding: "/",
    organizationDecision: "/organization-decision",
    createOrganization: "/create-organization",
    createBoard: "/create-board/:orgId",
    taskBoardRoot: "/task-board",
    taskBoard: "/task-board/:boardId",
    createBoardWithOrgId: (orgId: string | number) => `/create-board/${orgId}`,
  },
  endpoints: {
    boards: "/boards",
    members: "/members",
    organizations: "/organizations",
  },
};

export default commonConfig;
