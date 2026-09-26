const commonConfig = {
  baseURLs: {
    apiRoot: "/api",
  },
  routes: {
    onboarding: "/",
    organizationDecision: "/organization-decision",
    createOrganization: "/create-organization",
    createBoard: "/create-board/:orgId",
    addBoardMembers: "/add-board-members/:boardId",
    taskBoardRoot: "/task-board",
    taskBoard: "/task-board/:boardId",
    createBoardWithOrgId: (orgId: string | number) => `/create-board/${orgId}`,
    addBoardMembersWithBoardId: (boardId: string | number) =>
      `/add-board-members/${boardId}`,
    organizationMembers: "/organization-members/:orgId",
    organizationMembersWithOrgId: (orgId: string | number) =>
      `/organization-members/${orgId}`,
  },
  endpoints: {
    boards: "/boards",
    boardMembers: "/board-members",
    boardMember: (boardId: string | number, orgMemberId: string | number) =>
      `/boards/${boardId}/members/${orgMemberId}`,
    members: "/members",
    organizations: "/organizations",
    all_organizations: "/admin/organizations/",
    organizationMember: (orgId: string | number) =>
      `/organizations/${orgId}/members`,
  },
};

export default commonConfig;

