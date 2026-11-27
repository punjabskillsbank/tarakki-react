const commonConfig = {
  baseURLs: {
    apiRoot: "/api",
  },
  routes: {
    onboarding: "/",
    login: "/login",
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
    userSupport: "/user-support",
  },
  endpoints: {
    login: "/auth/login",
    boards: "/boards",
    boardMembersForBoard: (boardId: string | number) =>
      `/boards/${boardId}/members`,
    boardMember: (boardId: string | number, orgMemberId: string | number) =>
      `/boards/${boardId}/members/${orgMemberId}`,
    boardTasks: (boardId: string | number) => `/${boardId}/task`,
    boardTask: (boardId: string | number, taskId: string | number) =>
      `/${boardId}/task/${taskId}`,
    members: "/members",
    organizations: "/organizations",
    all_organizations: "/admin/organizations/",
    organizationMember: (orgId: string | number) =>
      `/organizations/${orgId}/members`,
    me: "/auth/me",
    supportTickets: "/support/tickets",
    supportTicketMessages: "/support/tickets/messages",
  },
};

export default commonConfig;
