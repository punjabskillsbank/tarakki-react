const commonConfig = {
  baseURLs: {
    apiRoot: "/api",
  },
  routes: {
    onboarding: "/",
    organizationDecision: "/organization-decision",
    createOrganization: "/create-organization",
    createBoard: "/create-board/:orgId",
    taskBoardRoot: "/task-board",
    taskBoard: "/task-board/:boardId",
    createBoardWithOrgId: (orgId: string | number) => `/create-board/${orgId}`,
    organizationMembers: "/organization-members/:orgId",
    organizationMembersWithOrgId: (orgId: string | number) =>
      `/organization-members/${orgId}`,
  },
  endpoints: {
    boards: "/boards",
    boardMembers: "/board-members",
    members: "/members",
    organizations: "/organizations",
    all_organizations: "/admin/organizations/",
    organizationMember: (orgId: string | number) =>
      `/organizations/${orgId}/members`,
  },
};

export default commonConfig;

