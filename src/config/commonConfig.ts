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
    createBoardWithOrgId: (orgId: string | number) => `/create-board/${orgId}`,
    organizationMembers: "/organization-members/:orgId",
    organizationMembersWithOrgId: (orgId: string | number) =>
      `/organization-members/${orgId}`,
  },
  endpoints: {
    boards: "/boards",
    members: "/members",
    organizations: "/organizations",
    all_organizations: "/admin/organizations/",
    organizationMember: (orgId: string | number) =>
      `/organizations/${orgId}/members`,
    login: "/auth/login",
    me: "/auth/me",
  },
};

export default commonConfig;

